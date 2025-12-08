import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Data extracted from your training graphs
const accuracyData = [
  { epoch: 0, training_accuracy: 0.45, val_accuracy: 0.68 },
  { epoch: 1, training_accuracy: 0.50, val_accuracy: 0.70 },
  { epoch: 2, training_accuracy: 0.52, val_accuracy: 0.72 },
  { epoch: 3, training_accuracy: 0.54, val_accuracy: 0.73 },
  { epoch: 4, training_accuracy: 0.56, val_accuracy: 0.74 },
  { epoch: 5, training_accuracy: 0.57, val_accuracy: 0.75 },
  { epoch: 6, training_accuracy: 0.58, val_accuracy: 0.75 },
  { epoch: 7, training_accuracy: 0.59, val_accuracy: 0.76 },
  { epoch: 8, training_accuracy: 0.60, val_accuracy: 0.76 },
  { epoch: 9, training_accuracy: 0.61, val_accuracy: 0.76 },
  { epoch: 10, training_accuracy: 0.62, val_accuracy: 0.77 },
  { epoch: 11, training_accuracy: 0.63, val_accuracy: 0.77 },
  { epoch: 12, training_accuracy: 0.64, val_accuracy: 0.77 },
  { epoch: 13, training_accuracy: 0.64, val_accuracy: 0.78 },
  { epoch: 14, training_accuracy: 0.65, val_accuracy: 0.78 },
];

const lossData = [
  { epoch: 0, training_loss: 2.20, val_loss: 1.25 },
  { epoch: 1, training_loss: 1.85, val_loss: 1.12 },
  { epoch: 2, training_loss: 1.75, val_loss: 1.05 },
  { epoch: 3, training_loss: 1.68, val_loss: 1.00 },
  { epoch: 4, training_loss: 1.62, val_loss: 0.96 },
  { epoch: 5, training_loss: 1.58, val_loss: 0.94 },
  { epoch: 6, training_loss: 1.54, val_loss: 0.92 },
  { epoch: 7, training_loss: 1.50, val_loss: 0.90 },
  { epoch: 8, training_loss: 1.48, val_loss: 0.88 },
  { epoch: 9, training_loss: 1.45, val_loss: 0.87 },
  { epoch: 10, training_loss: 1.43, val_loss: 0.86 },
  { epoch: 11, training_loss: 1.40, val_loss: 0.85 },
  { epoch: 12, training_loss: 1.38, val_loss: 0.85 },
  { epoch: 13, training_loss: 1.36, val_loss: 0.84 },
  { epoch: 14, training_loss: 1.35, val_loss: 0.83 },
];

interface ChartCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ChartCard({ title, description, icon, children }: ChartCardProps) {
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
    
    setRotateX(-mouseY / 30);
    setRotateY(mouseX / 30);
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
        
        {/* Chart Container */}
        <div className="relative h-64 md:h-72 rounded-xl overflow-hidden bg-background/50 border border-border/50 p-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg p-3 border border-primary/20 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">Epoch {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name === 'training_accuracy' && 'Training: '}
            {entry.name === 'val_accuracy' && 'Validation: '}
            {entry.name === 'training_loss' && 'Training: '}
            {entry.name === 'val_loss' && 'Validation: '}
            <span className="font-semibold">
              {entry.name.includes('accuracy') 
                ? `${(entry.value * 100).toFixed(1)}%` 
                : entry.value.toFixed(3)
              }
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
            Visualizing the model's learning progress across 15 training epochs with loss and accuracy metrics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Loss Chart */}
          <ChartCard
            title="Training vs Validation Loss"
            description="Convergence of loss function over epochs"
            icon={<TrendingDown className="w-5 h-5 text-primary" />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="epoch" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Epochs', position: 'bottom', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  domain={[0.5, 2.5]}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => (
                    <span style={{ color: 'hsl(var(--foreground))' }}>
                      {value === 'training_loss' ? 'Training Loss' : 'Validation Loss'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="training_loss"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 6, fill: 'hsl(217, 91%, 60%)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="val_loss"
                  stroke="hsl(25, 95%, 53%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(25, 95%, 53%)', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 6, fill: 'hsl(25, 95%, 53%)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Accuracy Chart */}
          <ChartCard
            title="Training vs Validation Accuracy"
            description="Model accuracy improvement during training"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="epoch" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Epochs', position: 'bottom', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  domain={[0.4, 0.85]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => (
                    <span style={{ color: 'hsl(var(--foreground))' }}>
                      {value === 'training_accuracy' ? 'Training Accuracy' : 'Validation Accuracy'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="training_accuracy"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 6, fill: 'hsl(217, 91%, 60%)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="val_accuracy"
                  stroke="hsl(25, 95%, 53%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(25, 95%, 53%)', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 6, fill: 'hsl(25, 95%, 53%)', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
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
            { label: 'Final Training Accuracy', value: '65%' },
            { label: 'Final Validation Accuracy', value: '78%' },
            { label: 'Food Categories', value: '101' },
            { label: 'Training Epochs', value: '15' },
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