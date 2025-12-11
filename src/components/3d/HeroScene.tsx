import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

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

function ParticleField() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00d4ff"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#00d4ff"
        />

        <FloatingShape position={[-3, 1.5, -2]} color="#00d4ff" scale={0.8} speed={1.2} />
        <FloatingShape position={[3.5, -1, -3]} color="#a855f7" scale={0.6} speed={0.8} />
        <GlowingSphere position={[-2, -1.5, -1]} color="#f59e0b" size={0.4} />
        <GlowingSphere position={[2.5, 2, -2]} color="#00d4ff" size={0.3} />
        <FloatingTorus position={[4, 0.5, -4]} color="#a855f7" />
        <FloatingOctahedron position={[-4, -0.5, -3]} color="#00d4ff" />
        
        <ParticleField />
      </Canvas>
    </div>
  );
}
