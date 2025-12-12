import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Store mouse position globally for 3D scene
const mousePosition = { x: 0, y: 0 };

const InteractiveOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useFrame((state) => {
    if (meshRef.current) {
      // React to mouse movement
      targetRotation.current.x = mousePosition.y * 0.5;
      targetRotation.current.y = mousePosition.x * 0.5;
      
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05;
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      const glowScale = 1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      glowRef.current.rotation.y = meshRef.current?.rotation.y || 0;
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial 
          color="#8b5cf6"
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>
      {/* Main orb */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial 
          color="#60a5fa"
          metalness={0.95}
          roughness={0.05}
          emissive="#3b82f6"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#a855f7"
          metalness={1}
          roughness={0}
          emissive="#a855f7"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
};

const OrbitingRing = ({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const nodeCount = 16;
  
  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation plus mouse influence
      groupRef.current.rotation.y = state.clock.elapsedTime * speed + mousePosition.x * 0.3;
      groupRef.current.rotation.x = tilt + mousePosition.y * 0.2;
    }
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        const pulse = Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.3 + 1;
        node.scale.setScalar(pulse);
      });
    }
  });

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      };
    });
  }, [radius]);

  return (
    <group ref={groupRef}>
      <group ref={nodesRef}>
        {nodes.map((node, i) => (
          <mesh key={i} position={[node.x, 0, node.z]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
      {/* Ring line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.015, 8, 64]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

const FloatingCrystal = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = useRef(position);
  
  useFrame((state) => {
    if (meshRef.current) {
      // React to mouse - crystals move away from cursor
      const mouseInfluenceX = mousePosition.x * 0.5 * (position[0] > 0 ? 1 : -1);
      const mouseInfluenceY = mousePosition.y * 0.5 * (position[1] > 0 ? 1 : -1);
      
      meshRef.current.position.x = initialPos.current[0] + mouseInfluenceX;
      meshRef.current.position.y = initialPos.current[1] + mouseInfluenceY + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.95}
          roughness={0.05}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
    </Float>
  );
};

const ParticleWave = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2000;
  
  const { positions, basePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 4;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
    }
    
    return { positions, basePositions };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const positionAttribute = pointsRef.current.geometry.attributes.position;
      const positions = positionAttribute.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const baseX = basePositions[i * 3];
        const baseY = basePositions[i * 3 + 1];
        const baseZ = basePositions[i * 3 + 2];
        
        // Wave effect based on time and mouse
        const wave = Math.sin(state.clock.elapsedTime + baseX * 0.5 + baseY * 0.5) * 0.3;
        const mouseWave = (mousePosition.x * baseX + mousePosition.y * baseY) * 0.1;
        
        positions[i * 3] = baseX + wave * 0.5 + mouseWave;
        positions[i * 3 + 1] = baseY + wave * 0.5 + mouseWave;
        positions[i * 3 + 2] = baseZ + wave * 0.5;
      }
      
      positionAttribute.needsUpdate = true;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 + mousePosition.x * 0.1;
      pointsRef.current.rotation.x = mousePosition.y * 0.1;
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
        size={0.04}
        color="#60a5fa"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const EnergyBeams = () => {
  const groupRef = useRef<THREE.Group>(null);
  const beamCount = 6;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 + mousePosition.x * 0.3;
      groupRef.current.rotation.z = mousePosition.y * 0.2;
    }
  });

  const beams = useMemo(() => {
    return Array.from({ length: beamCount }, (_, i) => ({
      rotation: (i / beamCount) * Math.PI * 2,
      color: i % 2 === 0 ? '#3b82f6' : '#a855f7',
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {beams.map((beam, i) => (
        <mesh key={i} rotation={[0, beam.rotation, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[0.02, 12]} />
          <meshBasicMaterial
            color={beam.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Camera subtle movement based on mouse
    camera.position.x += (mousePosition.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mousePosition.y * 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#06b6d4" />
      <spotLight position={[0, 15, 0]} intensity={2} angle={0.4} penumbra={1} color="#8b5cf6" />
      
      <InteractiveOrb />
      <EnergyBeams />
      
      <OrbitingRing radius={2.5} speed={0.4} tilt={0.3} color="#60a5fa" />
      <OrbitingRing radius={3.5} speed={-0.25} tilt={-0.5} color="#a855f7" />
      <OrbitingRing radius={4.5} speed={0.15} tilt={0.8} color="#06b6d4" />
      
      <FloatingCrystal position={[-4, 2.5, -2]} color="#f472b6" scale={0.8} />
      <FloatingCrystal position={[4.5, -2, -3]} color="#3b82f6" scale={0.7} />
      <FloatingCrystal position={[-3.5, -2.5, 2]} color="#10b981" scale={0.6} />
      <FloatingCrystal position={[5, 2, 1]} color="#8b5cf6" scale={0.9} />
      <FloatingCrystal position={[-5, 0, 0]} color="#f59e0b" scale={0.5} />
      <FloatingCrystal position={[3, 3.5, -1]} color="#06b6d4" scale={0.6} />
      
      <ParticleWave />
    </>
  );
};

interface CoverPageProps {
  onEnter: () => void;
}

const CoverPage = ({ onEnter }: CoverPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosition.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mousePosition.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background cursor-pointer overflow-hidden"
      onClick={onEnter}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(135deg, hsl(222, 47%, 4%) 0%, hsl(260, 50%, 5%) 50%, hsl(220, 60%, 8%) 100%)' }}
      >
        <Scene />
      </Canvas>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                Portfolio
              </span>
            </h1>
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-3xl -z-10 animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground/80 font-light tracking-[0.4em] uppercase">
            AI & Machine Learning
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {['Deep Learning', 'Computer Vision', 'NLP', 'AI'].map((skill) => (
              <span 
                key={skill}
                className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md text-primary/80 hover:bg-primary/10 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Click to Enter */}
        <div className="absolute bottom-16 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-10 h-16 rounded-full border-2 border-primary/40 flex items-start justify-center p-3">
              <div className="w-2 h-4 rounded-full bg-primary/60 animate-bounce" />
            </div>
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground/60 tracking-[0.3em] uppercase font-light">
            Click anywhere to enter
          </p>
        </div>
      </div>
      
      {/* Animated Corner Frames */}
      <div className="absolute top-6 left-6 w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
      <div className="absolute top-6 right-6 w-24 h-24">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-purple-500/60 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-purple-500/60 to-transparent" />
      </div>
      <div className="absolute bottom-6 left-6 w-24 h-24">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-cyan-500/60 to-transparent" />
      </div>
      <div className="absolute bottom-6 right-6 w-24 h-24">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-primary/60 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-primary/60 to-transparent" />
      </div>
    </div>
  );
};

export default CoverPage;
