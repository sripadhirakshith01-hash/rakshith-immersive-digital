import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCube = ({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
};

const FloatingSphere = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.9} 
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const NeuralRing = ({ radius, y, speed }: { radius: number; y: number; speed: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 12;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: `hsl(${200 + i * 10}, 70%, 60%)`
      };
    });
  }, [radius]);

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {nodes.map((node, i) => (
        <mesh key={i} position={[node.x, 0, node.z]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 8, 64]} />
        <meshStandardMaterial 
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const CentralOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      const glowScale = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial 
          color="#3b82f6"
          transparent
          opacity={0.15}
        />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial 
          color="#60a5fa"
          metalness={0.9}
          roughness={0.1}
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
      <spotLight position={[0, 10, 0]} intensity={1} angle={0.3} penumbra={1} color="#3b82f6" />
      
      <CentralOrb />
      
      <NeuralRing radius={3} y={0} speed={0.3} />
      <NeuralRing radius={4.5} y={0.5} speed={-0.2} />
      <NeuralRing radius={6} y={-0.5} speed={0.15} />
      
      <FloatingCube position={[-4, 2, -2]} color="#a855f7" scale={0.6} speed={1.2} />
      <FloatingCube position={[4, -2, -3]} color="#3b82f6" scale={0.5} speed={0.8} />
      <FloatingCube position={[-3, -3, 2]} color="#06b6d4" scale={0.4} speed={1.5} />
      <FloatingCube position={[5, 1, 1]} color="#8b5cf6" scale={0.7} speed={0.6} />
      
      <FloatingSphere position={[3, 3, -1]} color="#f472b6" scale={0.8} />
      <FloatingSphere position={[-5, 1, 0]} color="#34d399" scale={0.6} />
      <FloatingSphere position={[2, -3, 2]} color="#fbbf24" scale={0.5} />
      
      <ParticleField />
    </>
  );
};

interface CoverPageProps {
  onEnter: () => void;
}

const CoverPage = ({ onEnter }: CoverPageProps) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-background cursor-pointer overflow-hidden"
      onClick={onEnter}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(135deg, hsl(222, 47%, 6%) 0%, hsl(240, 50%, 3%) 50%, hsl(280, 50%, 5%) 100%)' }}
      >
        <Scene />
      </Canvas>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                RAKSHITH
              </span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl -z-10" />
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-[0.3em] uppercase">
            AI & Machine Learning Developer
          </p>
          
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground/60">
            <span className="px-3 py-1 rounded-full border border-border/30 bg-background/20 backdrop-blur-sm">
              Deep Learning
            </span>
            <span className="px-3 py-1 rounded-full border border-border/30 bg-background/20 backdrop-blur-sm">
              Computer Vision
            </span>
            <span className="px-3 py-1 rounded-full border border-border/30 bg-background/20 backdrop-blur-sm">
              NLP
            </span>
          </div>
        </div>
        
        {/* Click to Enter */}
        <div className="absolute bottom-20 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-8 h-12 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
          <p className="text-sm text-muted-foreground/50 tracking-widest uppercase">
            Click anywhere to enter
          </p>
        </div>
      </div>
      
      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-primary/30" />
    </div>
  );
};

export default CoverPage;
