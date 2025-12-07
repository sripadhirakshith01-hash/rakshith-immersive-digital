import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Layers, Grid3X3, Minimize2, Brain, Target } from 'lucide-react';

const cnnLayers = [
  {
    name: 'Input Layer',
    icon: Grid3X3,
    color: 'from-blue-500 to-blue-600',
    description: 'Receives the raw image input (224×224×3 RGB). Each pixel value is normalized between 0-1.',
    dimensions: '224 × 224 × 3',
  },
  {
    name: 'Convolutional Layers',
    icon: Layers,
    color: 'from-purple-500 to-purple-600',
    description: 'Applies learnable filters to detect features like edges, textures, and patterns at various scales.',
    dimensions: 'Multiple feature maps',
  },
  {
    name: 'Pooling Layers',
    icon: Minimize2,
    color: 'from-pink-500 to-pink-600',
    description: 'Reduces spatial dimensions while retaining important features. Uses max pooling for downsampling.',
    dimensions: 'Reduced dimensions',
  },
  {
    name: 'Dense Layers',
    icon: Brain,
    color: 'from-orange-500 to-orange-600',
    description: 'Fully connected layers that learn high-level representations. Includes dropout for regularization.',
    dimensions: '1280 → 512 → 256',
  },
  {
    name: 'Output Layer',
    icon: Target,
    color: 'from-green-500 to-green-600',
    description: 'Softmax activation produces probability distribution across 101 food categories for classification.',
    dimensions: '101 classes',
  },
];

function LayerCard({ layer, index }: { layer: typeof cnnLayers[0]; index: number }) {
  const Icon = layer.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      {/* Connection Line */}
      {index < cnnLayers.length - 1 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
      )}
      
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="glass-strong rounded-2xl p-6 h-full hover-glow"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon with gradient background */}
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className={`p-4 rounded-2xl bg-gradient-to-br ${layer.color} shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Layer Name */}
          <h3 className="text-lg font-semibold">{layer.name}</h3>
          
          {/* Dimensions Badge */}
          <span className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground font-mono">
            {layer.dimensions}
          </span>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {layer.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 3D-style layer visualization
function Layer3D({ index, total }: { index: number; total: number }) {
  const depth = (index / total) * 100;
  const width = 100 - depth * 0.5;
  const height = 60 - depth * 0.3;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateZ(${depth}px)`,
      }}
    >
      <div 
        className={`w-full h-full rounded-lg bg-gradient-to-br ${cnnLayers[index]?.color || 'from-primary to-primary'} opacity-80 shadow-xl`}
        style={{
          boxShadow: `0 ${10 + index * 2}px ${20 + index * 5}px rgba(168, 85, 247, ${0.2 + index * 0.05})`,
        }}
      />
    </motion.div>
  );
}

export function CNNVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="cnn-visualization" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Architecture</span>
          <h2 className="text-3xl md:text-5xl font-bold">
            CNN <span className="gradient-text">Visualization</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the EfficientNetV2B0 architecture layer by layer. 
            Each component plays a crucial role in feature extraction and classification.
          </p>
        </motion.div>

        {/* 3D Layer Stack Visualization */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-2 mb-16 py-8"
          style={{ perspective: '1000px' }}
        >
          <div className="flex items-end gap-3" style={{ transformStyle: 'preserve-3d' }}>
            {cnnLayers.map((_, index) => (
              <Layer3D key={index} index={index} total={cnnLayers.length} />
            ))}
          </div>
          
          {/* Flow Arrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="ml-6 text-primary"
          >
            <div className="flex items-center gap-2">
              <div className="w-16 h-px bg-gradient-to-r from-primary to-transparent" />
              <span className="text-sm font-medium">Output</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Layer Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {cnnLayers.map((layer, index) => (
            <LayerCard key={layer.name} layer={layer} index={index} />
          ))}
        </div>

        {/* Data Flow Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 glass rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            How Data Flows Through the Network
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The input image (224×224 pixels) passes through a series of convolutional layers that 
            extract increasingly complex features—from simple edges to complete food patterns. 
            EfficientNetV2B0 uses compound scaling to balance depth, width, and resolution for 
            optimal performance. The final dense layers combine these features to produce a 
            probability distribution across 101 food categories.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
