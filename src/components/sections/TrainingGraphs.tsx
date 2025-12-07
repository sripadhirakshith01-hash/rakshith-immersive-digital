import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface GraphCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imagePlaceholder?: string;
  imageSrc?: string;
}

function GraphCard({ title, description, icon, imagePlaceholder, imageSrc }: GraphCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotateX(-mouseY / 20);
    setRotateY(mouseX / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="glass-strong rounded-2xl overflow-hidden hover-glow transition-transform duration-200"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        {/* Graph Image Placeholder */}
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted/30 border border-border/50">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60">
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">{imagePlaceholder || 'Upload graph image'}</p>
              <p className="text-xs mt-1">PNG, JPG supported</p>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}

export function TrainingGraphs() {
  return (
    <section id="training-graphs" className="section-padding relative">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Performance Metrics</span>
          <h2 className="text-3xl md:text-5xl font-bold">
            Training <span className="gradient-text">Results</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visualizing the model's learning progress across training epochs with loss and accuracy metrics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <GraphCard
            title="Training vs Validation Loss"
            description="Convergence of loss function over epochs"
            icon={<TrendingDown className="w-5 h-5 text-primary" />}
            imagePlaceholder="Loss curve graph"
          />
          <GraphCard
            title="Training vs Validation Accuracy"
            description="Model accuracy improvement during training"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            imagePlaceholder="Accuracy curve graph"
          />
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: 'Training Accuracy', value: '64%' },
            { label: 'Validation Accuracy', value: '76%' },
            { label: 'Food Categories', value: '101' },
            { label: 'Total Images', value: '101K' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass rounded-xl p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
