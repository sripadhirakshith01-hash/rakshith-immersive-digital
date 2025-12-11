import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  uniform sampler2D uTexture;
  
  varying vec2 vUv;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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
    
    vec2 mousePos = uMouse;
    float dist = length((uv - mousePos) * aspect);
    float mouseInfluence = smoothstep(0.6, 0.0, dist);
    
    float time = uTime * 0.2;
    
    float noise1 = fbm(uv * 2.5 + time * 0.3);
    float noise2 = fbm(uv * 4.0 - time * 0.2);
    float noise3 = fbm(uv * 6.0 + vec2(time * 0.15, -time * 0.25));
    
    float ripple = sin(dist * 15.0 - uTime * 2.5) * exp(-dist * 2.5) * mouseInfluence;
    
    vec2 distortion = vec2(
      noise1 * 0.03 + noise2 * 0.02 + ripple * 0.08,
      noise2 * 0.03 + noise3 * 0.02 + ripple * 0.08
    );
    
    distortion += (uv - mousePos) * mouseInfluence * 0.15;
    
    vec2 distortedUV = uv + distortion;
    
    // Mercury base colors
    vec3 darkMercury = vec3(0.15, 0.15, 0.18);
    vec3 midMercury = vec3(0.4, 0.42, 0.45);
    vec3 lightMercury = vec3(0.7, 0.72, 0.75);
    vec3 highlightMercury = vec3(0.9, 0.92, 0.95);
    
    // Create layered mercury effect
    float highlight1 = pow(max(0.0, snoise(distortedUV * 8.0 + time * 0.5)), 2.0);
    float highlight2 = pow(max(0.0, snoise(distortedUV * 12.0 - time * 0.3)), 3.0);
    float highlight3 = pow(max(0.0, fbm(distortedUV * 15.0 + time * 0.1)), 2.5);
    
    // Fresnel-like edge detection
    float edge = pow(length(distortion) * 10.0, 1.5);
    edge = clamp(edge, 0.0, 1.0);
    
    // Gradient from dark to light
    float gradientY = uv.y * 0.3 + 0.35;
    
    vec3 color = mix(darkMercury, midMercury, gradientY + noise1 * 0.3);
    color = mix(color, lightMercury, highlight1 * 0.6 + edge * 0.4);
    color = mix(color, highlightMercury, highlight2 * 0.8);
    color = mix(color, highlightMercury, highlight3 * 0.5 + mouseInfluence * 0.4);
    
    // Specular highlights
    float specular = pow(max(0.0, snoise(distortedUV * 25.0 + time * 1.5)), 6.0);
    color += highlightMercury * specular * 0.6;
    
    // Subtle color tint
    color = mix(color, vec3(0.5, 0.55, 0.65), 0.1);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function MercuryMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouse = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
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

      mousePos.current.x += (targetMouse.current.x - mousePos.current.x) * 0.08;
      mousePos.current.y += (targetMouse.current.y - mousePos.current.y) * 0.08;
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
      />
    </mesh>
  );
}

export function MercuryLandingCover() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = () => {
    if (!isExiting) {
      setIsExiting(true);
      setTimeout(() => setIsVisible(false), 1500);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          onClick={handleClick}
          className="fixed inset-0 z-50 cursor-pointer"
        >
          {/* Mercury WebGL Background */}
          <div className="absolute inset-0">
            <Canvas
              gl={{ 
                antialias: true, 
                alpha: false,
                powerPreference: 'high-performance'
              }}
              camera={{ position: [0, 0, 1] }}
            >
              <MercuryMesh />
            </Canvas>
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: isExiting ? 0 : 1, 
                scale: isExiting ? 1.1 : 1,
                filter: isExiting ? 'blur(20px)' : 'blur(0px)'
              }}
              transition={{ duration: 0.8, delay: isExiting ? 0 : 0.3 }}
              className="text-center mix-blend-difference"
            >
              <h1 className="text-[15vw] md:text-[12vw] font-black uppercase leading-[0.85] tracking-tighter text-white">
                Creative
              </h1>
              <h1 className="text-[15vw] md:text-[12vw] font-black uppercase leading-[0.85] tracking-tighter text-white">
                Portfolio
              </h1>
            </motion.div>
          </div>

          {/* Click hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
          >
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/70 text-sm uppercase tracking-[0.3em] mix-blend-difference"
            >
              Click anywhere to enter
            </motion.p>
          </motion.div>

          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/20 mix-blend-difference" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/20 mix-blend-difference" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/20 mix-blend-difference" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/20 mix-blend-difference" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
