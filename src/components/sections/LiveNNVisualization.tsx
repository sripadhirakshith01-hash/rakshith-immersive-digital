import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=224&h=224&fit=crop';

// Network layer configuration
const layers = [
  { neurons: 8, label: 'Input Layer' },
  { neurons: 12, label: 'Conv Layer 1' },
  { neurons: 16, label: 'Conv Layer 2' },
  { neurons: 12, label: 'Conv Layer 3' },
  { neurons: 8, label: 'Dense Layer' },
  { neurons: 1, label: 'Output' },
];

// Pixel colors for the visualization
const pixelColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6',
];

interface Particle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  delay: number;
}

function Neuron({ 
  x, y, isActive, isOutput, delay, prediction 
}: { 
  x: number; 
  y: number; 
  isActive: boolean; 
  isOutput?: boolean;
  delay: number;
  prediction?: string;
}) {
  return (
    <motion.g>
      {/* Glow effect */}
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={isOutput ? 35 : 12}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 0.6, 0.3],
            scale: [0.5, 1.5, 1.2],
          }}
          transition={{ duration: 0.5, delay }}
          fill={isOutput ? 'url(#outputGlow)' : 'url(#neuronGlow)'}
        />
      )}
      
      {/* Neuron body */}
      <motion.circle
        cx={x}
        cy={y}
        r={isOutput ? 25 : 8}
        initial={{ fill: 'hsl(var(--muted))' }}
        animate={{ 
          fill: isActive 
            ? isOutput ? 'hsl(142, 76%, 46%)' : 'hsl(var(--primary))' 
            : 'hsl(var(--muted))',
          scale: isActive ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3, delay }}
        stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
        strokeWidth={isOutput ? 3 : 1.5}
      />

      {/* Output label */}
      {isOutput && isActive && prediction && (
        <motion.text
          x={x}
          y={y + 50}
          textAnchor="middle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="fill-primary font-bold text-sm"
        >
          {prediction}
        </motion.text>
      )}
    </motion.g>
  );
}

function Connection({ 
  x1, y1, x2, y2, isActive, delay 
}: { 
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number; 
  isActive: boolean;
  delay: number;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      initial={{ stroke: 'hsl(var(--border))', strokeOpacity: 0.2 }}
      animate={{ 
        stroke: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
        strokeOpacity: isActive ? 0.6 : 0.15,
      }}
      transition={{ duration: 0.2, delay }}
      strokeWidth={isActive ? 1.5 : 0.5}
    />
  );
}

function PixelCube({ 
  color, 
  startX, 
  startY, 
  targetX, 
  targetY, 
  delay,
  isFlowing,
}: { 
  color: string; 
  startX: number; 
  startY: number; 
  targetX: number;
  targetY: number;
  delay: number;
  isFlowing: boolean;
}) {
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        left: startX,
        top: startY,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isFlowing ? {
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 0.5, 0],
        x: [0, (targetX - startX) * 0.3, (targetX - startX) * 0.7, targetX - startX],
        y: [0, (targetY - startY) * 0.3, (targetY - startY) * 0.7, targetY - startY],
      } : { opacity: 0, scale: 0 }}
      transition={{ 
        duration: 2,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function FlowingParticle({ particle, isActive }: { particle: Particle; isActive: boolean }) {
  return (
    <motion.circle
      r={3}
      fill={particle.color}
      filter="url(#particleGlow)"
      initial={{ 
        cx: particle.startX, 
        cy: particle.startY,
        opacity: 0,
      }}
      animate={isActive ? {
        cx: [particle.startX, particle.endX],
        cy: [particle.startY, particle.endY],
        opacity: [0, 1, 1, 0],
      } : {
        opacity: 0,
      }}
      transition={{ 
        duration: 0.8,
        delay: particle.delay,
        ease: "easeOut",
      }}
    />
  );
}

export function LiveNNVisualization() {
  const [stage, setStage] = useState<'idle' | 'pixelizing' | 'flowing' | 'processing' | 'complete'>('idle');
  const [activeLayer, setActiveLayer] = useState(-1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const svgWidth = 800;
  const svgHeight = 400;
  const layerSpacing = svgWidth / (layers.length + 1);

  // Calculate neuron positions
  const getNeuronPositions = (layerIndex: number) => {
    const layer = layers[layerIndex];
    const x = layerSpacing * (layerIndex + 1);
    const positions = [];
    const spacing = Math.min(35, (svgHeight - 80) / layer.neurons);
    const startY = (svgHeight - (layer.neurons - 1) * spacing) / 2;
    
    for (let i = 0; i < layer.neurons; i++) {
      positions.push({ x, y: startY + i * spacing });
    }
    return positions;
  };

  // Generate particles for data flow
  const generateParticles = () => {
    const newParticles: Particle[] = [];
    let particleId = 0;

    for (let l = 0; l < layers.length - 1; l++) {
      const currentPositions = getNeuronPositions(l);
      const nextPositions = getNeuronPositions(l + 1);
      
      currentPositions.forEach((start, si) => {
        const targetIndex = Math.floor(Math.random() * nextPositions.length);
        const end = nextPositions[targetIndex];
        
        newParticles.push({
          id: particleId++,
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
          color: pixelColors[Math.floor(Math.random() * pixelColors.length)],
          delay: l * 0.5 + si * 0.05,
        });
      });
    }
    
    return newParticles;
  };

  const runVisualization = () => {
    // Clear previous timeouts
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];

    setStage('pixelizing');
    setActiveLayer(-1);

    // Stage 1: Pixelizing image (0-1.5s)
    timeoutsRef.current.push(setTimeout(() => {
      setStage('flowing');
      setParticles(generateParticles());
    }, 1500));

    // Stage 2: Flowing through network (1.5s - 5s)
    timeoutsRef.current.push(setTimeout(() => {
      setStage('processing');
    }, 2000));

    // Activate layers progressively
    layers.forEach((_, index) => {
      timeoutsRef.current.push(setTimeout(() => {
        setActiveLayer(index);
      }, 2000 + index * 600));
    });

    // Stage 3: Complete
    timeoutsRef.current.push(setTimeout(() => {
      setStage('complete');
    }, 2000 + layers.length * 600 + 500));
  };

  const reset = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    setStage('idle');
    setActiveLayer(-1);
    setParticles([]);
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Pixel grid for the image
  const pixelGrid = Array.from({ length: 64 }, (_, i) => ({
    row: Math.floor(i / 8),
    col: i % 8,
    color: pixelColors[i % pixelColors.length],
  }));

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Live Demo</span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Neural Network <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch a food image split into RGB pixels, flow through interconnected neurons, and emerge as a prediction.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={runVisualization}
            disabled={stage !== 'idle' && stage !== 'complete'}
            className="gap-2"
          >
            <Play className="w-5 h-5" />
            Run Inference
          </Button>
          <Button 
            variant="glass" 
            size="lg" 
            onClick={reset}
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>

        {/* Main Visualization */}
        <div ref={containerRef} className="glass-strong rounded-3xl p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            {/* Input Image with Pixelization Effect */}
            <div className="relative flex-shrink-0">
              <div className="relative w-40 h-40">
                {/* Original Image */}
                <motion.div
                  className="absolute inset-0 rounded-xl overflow-hidden border-2 border-border"
                  animate={{
                    opacity: stage === 'idle' ? 1 : stage === 'pixelizing' ? 0 : 0,
                    scale: stage === 'idle' ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={SAMPLE_IMAGE} 
                    alt="Sample pizza" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Pixelized Grid */}
                <AnimatePresence>
                  {(stage === 'pixelizing' || stage === 'flowing') && (
                    <motion.div 
                      className="absolute inset-0 grid grid-cols-8 gap-0.5 p-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {pixelGrid.map((pixel, i) => (
                        <motion.div
                          key={i}
                          className="rounded-sm"
                          style={{ backgroundColor: pixel.color }}
                          initial={{ opacity: 0, scale: 0, rotateX: 0, rotateY: 0 }}
                          animate={{ 
                            opacity: stage === 'flowing' ? [1, 0] : 1,
                            scale: stage === 'flowing' ? [1, 0] : 1,
                            rotateX: stage === 'pixelizing' ? [90, 0] : 0,
                            rotateY: stage === 'pixelizing' ? [90, 0] : 0,
                            x: stage === 'flowing' ? [0, 100 + Math.random() * 50] : 0,
                            y: stage === 'flowing' ? [0, (Math.random() - 0.5) * 100] : 0,
                          }}
                          transition={{ 
                            duration: stage === 'flowing' ? 1 : 0.3,
                            delay: stage === 'pixelizing' 
                              ? (pixel.row + pixel.col) * 0.03 
                              : i * 0.02,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Processing indicator */}
                {stage === 'pixelizing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-8 left-0 right-0 text-center text-xs text-primary"
                  >
                    Extracting pixels...
                  </motion.div>
                )}
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">Input: Pizza 🍕</div>
            </div>

            {/* Neural Network SVG */}
            <div className="flex-1 overflow-x-auto">
              <svg 
                width={svgWidth} 
                height={svgHeight} 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="mx-auto"
              >
                <defs>
                  <radialGradient id="neuronGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="outputGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(142, 76%, 46%)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(142, 76%, 46%)" stopOpacity="0" />
                  </radialGradient>
                  <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connections */}
                {layers.map((_, layerIndex) => {
                  if (layerIndex === layers.length - 1) return null;
                  const currentPositions = getNeuronPositions(layerIndex);
                  const nextPositions = getNeuronPositions(layerIndex + 1);
                  
                  return currentPositions.map((start, si) => 
                    nextPositions.map((end, ei) => (
                      <Connection
                        key={`${layerIndex}-${si}-${ei}`}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        isActive={activeLayer >= layerIndex}
                        delay={layerIndex * 0.1 + (si + ei) * 0.01}
                      />
                    ))
                  );
                })}

                {/* Flowing particles */}
                {(stage === 'flowing' || stage === 'processing') && particles.map(particle => (
                  <FlowingParticle 
                    key={particle.id} 
                    particle={particle}
                    isActive={activeLayer >= Math.floor(particle.delay / 0.5)}
                  />
                ))}

                {/* Neurons */}
                {layers.map((layer, layerIndex) => {
                  const positions = getNeuronPositions(layerIndex);
                  const isOutput = layerIndex === layers.length - 1;
                  
                  return (
                    <g key={layerIndex}>
                      {/* Layer label */}
                      <text
                        x={positions[0].x}
                        y={20}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px]"
                      >
                        {layer.label}
                      </text>
                      
                      {positions.map((pos, i) => (
                        <Neuron
                          key={i}
                          x={pos.x}
                          y={pos.y}
                          isActive={activeLayer >= layerIndex}
                          isOutput={isOutput}
                          delay={layerIndex * 0.1 + i * 0.02}
                          prediction={isOutput && stage === 'complete' ? '🍕 Pizza' : undefined}
                        />
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Output Section */}
            <div className="flex-shrink-0 w-40">
              <AnimatePresence>
                {stage === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 20px hsl(142, 76%, 46%)',
                          '0 0 40px hsl(142, 76%, 46%)',
                          '0 0 20px hsl(142, 76%, 46%)',
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                    >
                      <span className="text-4xl">🍕</span>
                    </motion.div>
                    <div>
                      <div className="text-lg font-bold text-primary">Pizza</div>
                      <div className="text-sm text-muted-foreground">94.7% confidence</div>
                    </div>
                    
                    {/* Confidence bars */}
                    <div className="space-y-2 text-left">
                      {[
                        { label: 'Pizza', conf: 94.7 },
                        { label: 'Bruschetta', conf: 2.1 },
                        { label: 'Lasagna', conf: 1.4 },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="space-y-1"
                        >
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="text-primary">{item.conf}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.conf}%` }}
                              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                              className={`h-full rounded-full ${
                                i === 0 ? 'bg-gradient-to-r from-primary to-green-500' : 'bg-muted-foreground/30'
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {stage !== 'complete' && (
                <div className="text-center text-muted-foreground text-sm">
                  {stage === 'idle' && 'Click "Run Inference" to start'}
                  {stage === 'pixelizing' && 'Extracting features...'}
                  {stage === 'flowing' && 'Data flowing...'}
                  {stage === 'processing' && 'Processing layers...'}
                </div>
              )}
            </div>
          </div>

          {/* Stage indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {['Extract', 'Flow', 'Process', 'Predict'].map((label, i) => (
              <motion.div
                key={label}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  (i === 0 && stage === 'pixelizing') ||
                  (i === 1 && stage === 'flowing') ||
                  (i === 2 && stage === 'processing') ||
                  (i === 3 && stage === 'complete')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                animate={{
                  scale: (
                    (i === 0 && stage === 'pixelizing') ||
                    (i === 1 && stage === 'flowing') ||
                    (i === 2 && stage === 'processing') ||
                    (i === 3 && stage === 'complete')
                  ) ? [1, 1.1, 1] : 1
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}