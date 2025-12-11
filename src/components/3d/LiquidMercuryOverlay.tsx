import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uRippleStrength;
  uniform sampler2D uTexture;
  
  varying vec2 vUv;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    
    // Mouse influence with smooth falloff
    vec2 mousePos = uMouse;
    float dist = length((uv - mousePos) * aspect);
    float mouseInfluence = smoothstep(0.5, 0.0, dist) * uRippleStrength;
    
    // Create liquid distortion
    float time = uTime * 0.3;
    vec2 distortedUV = uv;
    
    // Base liquid movement
    float noise1 = fbm(uv * 3.0 + time * 0.5);
    float noise2 = fbm(uv * 5.0 - time * 0.3);
    float noise3 = fbm(uv * 8.0 + vec2(time * 0.2, -time * 0.4));
    
    // Ripple from mouse
    float ripple = sin(dist * 20.0 - uTime * 3.0) * exp(-dist * 3.0) * mouseInfluence;
    
    // Combine distortions
    vec2 distortion = vec2(
      noise1 * 0.02 + noise2 * 0.015 + ripple * 0.05,
      noise2 * 0.02 + noise3 * 0.015 + ripple * 0.05
    );
    
    // Add mouse-reactive waves
    distortion += (uv - mousePos) * mouseInfluence * 0.1;
    
    distortedUV += distortion;
    
    // Mercury-like color with reflections
    vec3 baseColor = vec3(0.08, 0.08, 0.12);
    
    // Metallic highlights
    float highlight1 = pow(max(0.0, snoise(distortedUV * 10.0 + time)), 3.0);
    float highlight2 = pow(max(0.0, snoise(distortedUV * 15.0 - time * 0.5)), 4.0);
    float highlight3 = pow(max(0.0, fbm(distortedUV * 20.0 + time * 0.2)), 2.0);
    
    // Fresnel-like edge glow
    float edge = pow(1.0 - abs(dot(normalize(vec3(distortion, 1.0)), vec3(0.0, 0.0, 1.0))), 2.0);
    
    // Mercury reflections
    vec3 mercuryColor = vec3(0.7, 0.75, 0.8); // Silver
    vec3 highlightColor = vec3(0.9, 0.95, 1.0); // Bright silver
    vec3 accentColor = vec3(0.4, 0.6, 0.9); // Blue tint
    
    vec3 color = baseColor;
    color = mix(color, mercuryColor, highlight1 * 0.5 + edge * 0.3);
    color = mix(color, highlightColor, highlight2 * 0.7);
    color = mix(color, accentColor, highlight3 * 0.2 + mouseInfluence * 0.3);
    
    // Add glossy sheen
    float sheen = pow(max(0.0, snoise(distortedUV * 30.0 + time * 2.0)), 8.0);
    color += highlightColor * sheen * 0.5;
    
    // Transparency for the liquid overlay
    float alpha = 0.15 + highlight1 * 0.2 + highlight2 * 0.3 + edge * 0.2 + mouseInfluence * 0.2;
    alpha = clamp(alpha, 0.1, 0.6);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

function LiquidMercuryMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouse = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uRippleStrength: { value: 1.0 },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth mouse follow
      mousePos.current.x += (targetMouse.current.x - mousePos.current.x) * 0.05;
      mousePos.current.y += (targetMouse.current.y - mousePos.current.y) * 0.05;
      material.uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function LiquidMercuryOverlay() {
  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'transparent' }}
      >
        <LiquidMercuryMesh />
      </Canvas>
    </div>
  );
}
