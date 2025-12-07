import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Floating neural node
function NeuralNode({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]; 
  color: string;
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = originalY + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15 * scale, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Glowing connection line between nodes
function Connection({ start, end, color }: { 
  start: [number, number, number]; 
  end: [number, number, number];
  color: string;
}) {
  const lineRef = useRef<THREE.Line | null>(null);

  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
  }, [color]);

  useFrame((state) => {
    if (lineRef.current) {
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />
  );
}

// Data flow particle
function DataParticle({ path, color, speed = 1 }: {
  path: [number, number, number][];
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && path.length >= 2) {
      const t = ((state.clock.elapsedTime * speed) % 2) / 2;
      const start = new THREE.Vector3(...path[0]);
      const end = new THREE.Vector3(...path[1]);
      meshRef.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1}
      />
    </mesh>
  );
}

// Neural network layer
function NeuralLayer({ x, nodes, color }: { x: number; nodes: number; color: string }) {
  const spacing = 1.2;
  const startY = -((nodes - 1) * spacing) / 2;

  return (
    <>
      {Array.from({ length: nodes }).map((_, i) => (
        <NeuralNode
          key={i}
          position={[x, startY + i * spacing, 0]}
          color={color}
          scale={0.8 + Math.random() * 0.4}
          speed={0.5 + Math.random() * 0.5}
        />
      ))}
    </>
  );
}

// Floating background particles
function BackgroundParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return positions;
  }, [count]);

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
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main neural network visualization
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const layers = [
    { x: -4, nodes: 4, color: '#3b82f6' },
    { x: -2, nodes: 6, color: '#8b5cf6' },
    { x: 0, nodes: 8, color: '#a855f7' },
    { x: 2, nodes: 6, color: '#d946ef' },
    { x: 4, nodes: 4, color: '#ec4899' },
  ];

  // Generate connections between layers
  const connections: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
  
  for (let l = 0; l < layers.length - 1; l++) {
    const currentLayer = layers[l];
    const nextLayer = layers[l + 1];
    const currentSpacing = 1.2;
    const nextSpacing = 1.2;
    const currentStartY = -((currentLayer.nodes - 1) * currentSpacing) / 2;
    const nextStartY = -((nextLayer.nodes - 1) * nextSpacing) / 2;

    for (let i = 0; i < currentLayer.nodes; i++) {
      for (let j = 0; j < nextLayer.nodes; j++) {
        if (Math.random() > 0.5) {
          connections.push({
            start: [currentLayer.x, currentStartY + i * currentSpacing, 0],
            end: [nextLayer.x, nextStartY + j * nextSpacing, 0],
            color: currentLayer.color,
          });
        }
      }
    }
  }

  return (
    <group ref={groupRef}>
      {layers.map((layer, index) => (
        <NeuralLayer key={index} {...layer} />
      ))}
      {connections.map((conn, index) => (
        <Connection key={index} {...conn} />
      ))}
      {connections.slice(0, 10).map((conn, index) => (
        <DataParticle
          key={index}
          path={[conn.start, conn.end]}
          color="#ffffff"
          speed={0.3 + Math.random() * 0.5}
        />
      ))}
    </group>
  );
}

export function NeuralNetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['transparent']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#d946ef" />

      {/* Neural Network */}
      <NeuralNetwork />
      
      {/* Background Particles */}
      <BackgroundParticles count={150} />
    </Canvas>
  );
}
