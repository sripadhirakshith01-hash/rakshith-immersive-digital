import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Octahedron, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Mouse position tracker
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mouse;
}

// Pulsing Core with glow
function PulsingCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(pulse);
      glowRef.current.scale.setScalar(pulse * 1.5);
      
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });
  
  return (
    <group position={[0, 0, -5]}>
      <Sphere ref={meshRef} args={[0.8, 64, 64]}>
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          distort={0.4}
          speed={3}
          roughness={0}
          metalness={1}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
}

// Orbiting Ring with trails
function OrbitingRing({ radius = 3, speed = 1, color = "#a855f7" }) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current && sphereRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      
      sphereRef.current.position.x = Math.cos(state.clock.elapsedTime * speed) * radius;
      sphereRef.current.position.z = Math.sin(state.clock.elapsedTime * speed) * radius;
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * speed * 2) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <Trail
        width={0.3}
        length={8}
        color={color}
        attenuation={(t) => t * t}
      >
        <Sphere ref={sphereRef} args={[0.15, 16, 16]} position={[radius, 0, 0]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </Sphere>
      </Trail>
    </group>
  );
}

// DNA Helix strand
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const spheres = useMemo(() => {
    const items = [];
    for (let i = 0; i < 30; i++) {
      const angle = i * 0.4;
      items.push({
        position1: [Math.cos(angle) * 1.5, i * 0.3 - 4.5, Math.sin(angle) * 1.5] as [number, number, number],
        position2: [Math.cos(angle + Math.PI) * 1.5, i * 0.3 - 4.5, Math.sin(angle + Math.PI) * 1.5] as [number, number, number],
        color: i % 2 === 0 ? "#00d4ff" : "#a855f7"
      });
    }
    return items;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={[-6, 0, -8]}>
      {spheres.map((item, i) => (
        <group key={i}>
          <Sphere args={[0.08, 8, 8]} position={item.position1}>
            <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.08, 8, 8]} position={item.position2}>
            <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={0.5} />
          </Sphere>
          {/* Connector */}
          <mesh position={[0, i * 0.3 - 4.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Mouse reactive floating shape
function ReactiveShape({ basePosition }: { basePosition: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = basePosition[0] + mouse.x * 0.5;
      meshRef.current.position.y = basePosition[1] + mouse.y * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 + mouse.y * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + mouse.x * 0.5;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Icosahedron ref={meshRef} args={[0.6, 1]} position={basePosition}>
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </Icosahedron>
    </Float>
  );
}

function FloatingShape({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]; 
  color: string; 
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function GlowingSphere({ position, color, size = 0.5 }: { 
  position: [number, number, number]; 
  color: string;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

function FloatingTorus({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
      <Torus ref={meshRef} args={[0.8, 0.3, 16, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </Torus>
    </Float>
  );
}

function FloatingOctahedron({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1}>
      <Octahedron ref={meshRef} args={[0.7]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.9}
        />
      </Octahedron>
    </Float>
  );
}

// Enhanced particle field with varying sizes and colors
function ParticleField() {
  const count = 300;
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      // Random color between cyan and purple
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        col[i * 3] = 0;
        col[i * 3 + 1] = 0.83;
        col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = 0.66;
        col[i * 3 + 1] = 0.33;
        col[i * 3 + 2] = 0.97;
      }
      
      siz[i] = Math.random() * 0.05 + 0.02;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03 + mouse.x * 0.1;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1 + mouse.y * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

// Energy wave rings
function EnergyRings() {
  const rings = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (rings.current) {
      rings.current.rotation.x = state.clock.elapsedTime * 0.1;
      rings.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <group ref={rings} position={[0, 0, -5]}>
      {[2, 2.5, 3, 3.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.2]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3 - i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.4}
          penumbra={1}
          intensity={0.8}
          color="#00d4ff"
        />

        {/* Central pulsing core */}
        <PulsingCore />
        
        {/* Energy rings around core */}
        <EnergyRings />
        
        {/* Orbiting elements with trails */}
        <OrbitingRing radius={4} speed={0.8} color="#a855f7" />
        <OrbitingRing radius={5} speed={-0.5} color="#00d4ff" />
        <OrbitingRing radius={3.5} speed={1.2} color="#f59e0b" />
        
        {/* DNA Helix on the side */}
        <DNAHelix />

        {/* Mouse-reactive shape */}
        <ReactiveShape basePosition={[4, 1, -3]} />

        {/* Floating shapes */}
        <FloatingShape position={[-3, 1.5, -2]} color="#00d4ff" scale={0.6} speed={1.2} />
        <FloatingShape position={[3.5, -1.5, -3]} color="#a855f7" scale={0.5} speed={0.8} />
        <GlowingSphere position={[-2, -1.5, -1]} color="#f59e0b" size={0.3} />
        <GlowingSphere position={[2.5, 2.5, -2]} color="#00d4ff" size={0.25} />
        <FloatingTorus position={[5, 0.5, -4]} color="#a855f7" />
        <FloatingOctahedron position={[-5, -0.5, -3]} color="#00d4ff" />
        
        {/* Enhanced particle field */}
        <ParticleField />
      </Canvas>
    </div>
  );
}