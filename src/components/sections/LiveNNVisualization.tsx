import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample food image (pizza)
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=224&h=224&fit=crop';

// Simulated layer activations
const layerData = [
  { name: 'Input', size: 224, channels: 3, description: 'Raw RGB image 224×224×3' },
  { name: 'Conv1', size: 112, channels: 32, description: 'Edge detection & basic patterns' },
  { name: 'Conv2', size: 56, channels: 64, description: 'Texture & shape features' },
  { name: 'Conv3', size: 28, channels: 128, description: 'Object parts & components' },
  { name: 'Conv4', size: 14, channels: 256, description: 'High-level semantic features' },
  { name: 'Pooling', size: 7, channels: 512, description: 'Spatial compression' },
  { name: 'Dense', size: 1, channels: 1280, description: 'Feature vector' },
  { name: 'Output', size: 1, channels: 101, description: 'Class probabilities' },
];

const predictions = [
  { label: 'Pizza', confidence: 94.7 },
  { label: 'Bruschetta', confidence: 2.1 },
  { label: 'Garlic Bread', confidence: 1.4 },
  { label: 'Lasagna', confidence: 0.9 },
  { label: 'Cheese Plate', confidence: 0.5 },
];

function ActivationGrid({ layer, isActive, progress }: { layer: typeof layerData[0]; isActive: boolean; progress: number }) {
  const gridSize = Math.min(layer.channels, 16);
  const cells = Array.from({ length: gridSize }, (_, i) => i);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        scale: isActive ? 1 : 0.9,
      }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="text-xs font-medium text-primary">{layer.name}</div>
      <div 
        className="grid gap-0.5 p-2 rounded-lg bg-background/50 border border-border/50"
        style={{ 
          gridTemplateColumns: `repeat(${Math.sqrt(gridSize)}, 1fr)`,
        }}
      >
        {cells.map((i) => (
          <motion.div
            key={i}
            initial={{ backgroundColor: 'hsl(var(--muted))' }}
            animate={{ 
              backgroundColor: isActive 
                ? `hsl(${180 + (i * 10) % 60}, 70%, ${40 + (progress * 30)}%)`
                : 'hsl(var(--muted))',
            }}
            transition={{ delay: i * 0.02, duration: 0.2 }}
            className="w-3 h-3 rounded-sm"
          />
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground text-center max-w-20">
        {layer.size}×{layer.size}×{layer.channels}
      </div>
    </motion.div>
  );
}

function DataFlow({ isActive, fromIndex }: { isActive: boolean; fromIndex: number }) {
  return (
    <div className="flex items-center justify-center w-8">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: isActive ? 1 : 0, 
          opacity: isActive ? 1 : 0.2,
        }}
        transition={{ duration: 0.3, delay: fromIndex * 0.15 }}
        className="h-0.5 w-full bg-gradient-to-r from-primary to-secondary origin-left"
      />
      {isActive && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: fromIndex * 0.15 }}
          className="absolute w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
        />
      )}
    </div>
  );
}

export function LiveNNVisualization() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(-1);
  const [showPredictions, setShowPredictions] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runVisualization = () => {
    setIsRunning(true);
    setCurrentLayer(0);
    setShowPredictions(false);

    let layer = 0;
    intervalRef.current = setInterval(() => {
      layer++;
      if (layer >= layerData.length) {
        clearInterval(intervalRef.current!);
        setShowPredictions(true);
        setIsRunning(false);
      } else {
        setCurrentLayer(layer);
      }
    }, 600);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setCurrentLayer(-1);
    setShowPredictions(false);
  };

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
            Watch how the CNN processes a sample food image through each layer to make a prediction.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-12">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={runVisualization}
            disabled={isRunning}
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

        {/* Visualization Container */}
        <div className="glass-strong rounded-3xl p-8 overflow-x-auto">
          <div className="flex items-center justify-start gap-2 min-w-max pb-4">
            {/* Input Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-xs font-medium text-primary">Sample Input</div>
              <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                currentLayer >= 0 ? 'border-primary shadow-lg shadow-primary/30' : 'border-border'
              }`}>
                <img 
                  src={SAMPLE_IMAGE} 
                  alt="Sample pizza image" 
                  className="w-24 h-24 object-cover"
                />
                {currentLayer >= 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                  >
                    <Zap className="w-8 h-8 text-primary animate-pulse" />
                  </motion.div>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">Pizza 🍕</div>
            </motion.div>

            {/* Layer Activations */}
            {layerData.map((layer, index) => (
              <div key={layer.name} className="flex items-center">
                <DataFlow isActive={currentLayer >= index} fromIndex={index} />
                <ActivationGrid 
                  layer={layer} 
                  isActive={currentLayer >= index}
                  progress={currentLayer >= index ? 1 : 0}
                />
              </div>
            ))}
          </div>

          {/* Current Layer Description */}
          {currentLayer >= 0 && currentLayer < layerData.length && (
            <motion.div
              key={currentLayer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-primary font-medium">{layerData[currentLayer].name}:</span>
                <span className="text-muted-foreground ml-2">{layerData[currentLayer].description}</span>
              </div>
            </motion.div>
          )}

          {/* Predictions */}
          {showPredictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <h3 className="text-lg font-semibold text-center">
                <span className="gradient-text">Prediction Results</span>
              </h3>
              <div className="max-w-md mx-auto space-y-3">
                {predictions.map((pred, index) => (
                  <motion.div
                    key={pred.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className={`text-sm font-medium w-24 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {pred.label}
                    </span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.confidence}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          index === 0 
                            ? 'bg-gradient-to-r from-primary to-secondary' 
                            : 'bg-muted-foreground/30'
                        }`}
                      />
                    </div>
                    <span className={`text-sm font-medium w-16 text-right ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {pred.confidence}%
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-muted-foreground mt-4"
              >
                ✅ The model correctly classified this image as <span className="text-primary font-medium">Pizza</span> with 94.7% confidence!
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}