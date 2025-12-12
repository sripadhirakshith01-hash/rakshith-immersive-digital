import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const mousePosition = { x: 0, y: 0 };

// DNA Helix Structure
const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = 40;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15 + mousePosition.x * 0.5;
      groupRef.current.rotation.x = mousePosition.y * 0.3;
    }
  });

  const helixData = useMemo(() => {
    const data = [];
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 4;
      const y = (i / particleCount) * 8 - 4;
      data.push({
        pos1: [Math.cos(t) * 2, y, Math.sin(t) * 2] as [number, number, number],
        pos2: [Math.cos(t + Math.PI) * 2, y, Math.sin(t + Math.PI) * 2] as [number, number, number],
        color1: `hsl(${200 + i * 3}, 80%, 60%)`,
        color2: `hsl(${280 + i * 3}, 80%, 60%)`,
      });
    }
    return data;
  }, []);

  return (
    <group ref={groupRef}>
      {helixData.map((item, i) => (
        <group key={i}>
          {/* Strand 1 */}
          <mesh position={item.pos1}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={item.color1}
              emissive={item.color1}
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Strand 2 */}
          <mesh position={item.pos2}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={item.color2}
              emissive={item.color2}
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Connector */}
          {i % 3 === 0 && (
            <mesh position={[0, item.pos1[1], 0]}>
              <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
              <meshStandardMaterial
                color="#60a5fa"
                emissive="#60a5fa"
                emissiveIntensity={0.3}
                transparent
                opacity={0.5}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// Floating Holographic Cubes
const HoloCube = ({ position, size, speed }: { position: [number, number, number]; size: number; speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const initialPos = useRef(position);
  
  useFrame((state) => {
    if (meshRef.current && edgesRef.current) {
      const time = state.clock.elapsedTime;
      
      meshRef.current.rotation.x = time * speed * 0.5 + mousePosition.y * 0.5;
      meshRef.current.rotation.y = time * speed + mousePosition.x * 0.5;
      edgesRef.current.rotation.copy(meshRef.current.rotation);
      
      const floatY = Math.sin(time * speed + position[0]) * 0.5;
      meshRef.current.position.y = initialPos.current[1] + floatY;
      edgesRef.current.position.y = initialPos.current[1] + floatY;
      
      // React to mouse
      meshRef.current.position.x = initialPos.current[0] + mousePosition.x * 0.3;
      edgesRef.current.position.x = initialPos.current[0] + mousePosition.x * 0.3;
    }
  });

  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group>
      <mesh ref={meshRef} position={position} geometry={geometry}>
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <lineSegments ref={edgesRef} position={position} geometry={edges}>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
};

// Morphing Sphere with Vertex Displacement
const MorphingSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const geometry = meshRef.current.geometry as THREE.SphereGeometry;
      const positions = geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        const length = Math.sqrt(x * x + y * y + z * z);
        const normalX = x / length;
        const normalY = y / length;
        const normalZ = z / length;
        
        const noise = Math.sin(normalX * 4 + time) * Math.sin(normalY * 4 + time * 0.8) * Math.sin(normalZ * 4 + time * 1.2);
        const mouseInfluence = (mousePosition.x * normalX + mousePosition.y * normalY) * 0.3;
        const displacement = 1.5 + noise * 0.3 + mouseInfluence;
        
        positions.setXYZ(i, normalX * displacement, normalY * displacement, normalZ * displacement);
      }
      
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      
      meshRef.current.rotation.y = time * 0.1 + mousePosition.x * 0.3;
      meshRef.current.rotation.x = mousePosition.y * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#6366f1"
        emissiveIntensity={0.4}
        metalness={0.7}
        roughness={0.3}
        wireframe
      />
    </mesh>
  );
};

// Orbiting Data Streams
const DataStream = ({ radius, speed, color, count }: { radius: number; speed: number; color: string; count: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 0.5;
      pos[i * 3] = Math.cos(angle) * (radius + spread);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * (radius + spread);
    }
    return pos;
  }, [radius, count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed + mousePosition.x * 0.4;
      groupRef.current.rotation.x = mousePosition.y * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={color}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// Neural Grid Background
const NeuralGrid = () => {
  const gridRef = useRef<THREE.Group>(null);
  const gridSize = 20;
  const spacing = 2;
  
  const lines = useMemo(() => {
    const lineData = [];
    for (let i = 0; i <= gridSize; i++) {
      const pos = (i - gridSize / 2) * spacing;
      // Horizontal
      lineData.push({
        start: [-gridSize, 0, pos],
        end: [gridSize, 0, pos],
      });
      // Vertical
      lineData.push({
        start: [pos, 0, -gridSize],
        end: [pos, 0, gridSize],
      });
    }
    return lineData;
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = -8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      gridRef.current.rotation.x = -Math.PI / 3 + mousePosition.y * 0.1;
    }
  });

  return (
    <group ref={gridRef} position={[0, -8, 0]}>
      {lines.map((line, i) => {
        const points = [
          new THREE.Vector3(...(line.start as [number, number, number])),
          new THREE.Vector3(...(line.end as [number, number, number])),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#1e40af', transparent: true, opacity: 0.2 }))} />
        );
      })}
    </group>
  );
};

// Floating Particles
const AmbientParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02 + mousePosition.x * 0.1;
      particlesRef.current.rotation.x = mousePosition.y * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#a5b4fc"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x += (mousePosition.x * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (mousePosition.y * 1 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#60a5fa" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#a855f7" />
      <pointLight position={[0, -10, 5]} intensity={0.5} color="#06b6d4" />
      
      <MorphingSphere />
      
      <group position={[5, 0, -2]}>
        <DNAHelix />
      </group>
      
      <HoloCube position={[-5, 2, -1]} size={1.5} speed={0.8} />
      <HoloCube position={[-4, -2, 2]} size={1} speed={1.2} />
      <HoloCube position={[4, -3, 1]} size={0.8} speed={1} />
      
      <DataStream radius={3.5} speed={0.3} color="#60a5fa" count={100} />
      <DataStream radius={4.5} speed={-0.2} color="#a855f7" count={80} />
      <DataStream radius={5.5} speed={0.15} color="#06b6d4" count={60} />
      
      <NeuralGrid />
      <AmbientParticles />
    </>
  );
};

interface CoverPageProps {
  onEnter: () => void;
}

const CoverPage = ({ onEnter }: CoverPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  
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

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-background cursor-pointer overflow-hidden transition-all duration-1000 ease-out ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      onClick={handleClick}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(180deg, hsl(230, 50%, 5%) 0%, hsl(250, 40%, 8%) 50%, hsl(220, 50%, 4%) 100%)' }}
      >
        <Scene />
      </Canvas>
      
      {/* Overlay Content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ${
        isExiting ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
      }`}>
        <div className="text-center space-y-8">
          <div className="relative">
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-none">
              <span className="bg-gradient-to-b from-white via-blue-200 to-blue-500/50 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
            <div className="absolute -inset-10 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent blur-3xl -z-10" />
          </div>
          
          <div className="space-y-4">
            <p className="text-lg md:text-xl text-blue-200/60 font-light tracking-[0.5em] uppercase">
              AI & Machine Learning Developer
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
              {['Deep Learning', 'Computer Vision', 'NLP', 'AI'].map((skill, i) => (
                <span 
                  key={skill}
                  className="px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300/70"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Click to Enter */}
        <div className="absolute bottom-20 flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full border border-blue-500/30 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute w-12 h-12 rounded-full border border-purple-500/40 animate-ping" style={{ animationDuration: '2.5s' }} />
            <div className="w-3 h-3 rounded-full bg-blue-400" />
          </div>
          <p className="text-xs text-blue-300/40 tracking-[0.4em] uppercase mt-4">
            Click to Enter
          </p>
        </div>
      </div>
      
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }} 
      />
      
      {/* Corner Accents */}
      <svg className="absolute top-8 left-8 w-16 h-16 text-blue-500/30" viewBox="0 0 100 100">
        <path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute top-8 right-8 w-16 h-16 text-purple-500/30" viewBox="0 0 100 100">
        <path d="M70 0 L100 0 L100 30" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-8 left-8 w-16 h-16 text-cyan-500/30" viewBox="0 0 100 100">
        <path d="M0 70 L0 100 L30 100" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-8 right-8 w-16 h-16 text-blue-500/30" viewBox="0 0 100 100">
        <path d="M70 100 L100 100 L100 70" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default CoverPage;
