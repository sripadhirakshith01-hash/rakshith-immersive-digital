import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowLeft, Download, Database, Cpu, Layers, Zap, CheckCircle, BookOpen, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { NeuralNetworkScene } from '@/components/3d/NeuralNetworkScene';
import { CNNVisualization } from '@/components/sections/CNNVisualization';
import { TrainingGraphs } from '@/components/sections/TrainingGraphs';
import { LiveNNVisualization } from '@/components/sections/LiveNNVisualization';
const buildSteps = [
  {
    icon: Database,
    title: 'Dataset',
    description: 'Food-101 dataset with 101,000 images across 101 food categories. 750 training + 250 test images per class.',
    details: 'Images rescaled to max 512px. Training data intentionally includes noise for robustness.',
  },
  {
    icon: Cpu,
    title: 'Model Architecture',
    description: 'EfficientNetV2B0 with transfer learning from ImageNet. Optimal balance of accuracy and efficiency.',
    details: 'Compound scaling for depth, width, and resolution. Lightweight yet powerful.',
  },
  {
    icon: Layers,
    title: 'Preprocessing & Augmentation',
    description: 'Data augmentation including rotation, flipping, zoom, and color adjustments.',
    details: 'Normalization, resizing to 224x224, and batch processing for efficient training.',
  },
  {
    icon: Zap,
    title: 'Training Pipeline',
    description: 'AdamW optimizer with learning rate scheduling. Early stopping and dropout for regularization.',
    details: 'Batch normalization for stable training. Fine-tuning after feature extraction phase.',
  },
  {
    icon: CheckCircle,
    title: 'Challenges & Solutions',
    description: 'Addressed overfitting with augmentation, dropout, and early stopping techniques.',
    details: 'Achieved 64% training accuracy and 76% validation accuracy with strong generalization.',
  },
];

export default function Food101Project() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <>
      <Helmet>
        <title>101 Food Image Recognition | Deep Learning Project | Rakshith Sripadhi</title>
        <meta name="description" content="End-to-end deep learning system using EfficientNetV2B0 to classify 101 food categories. Explore the CNN architecture, training process, and research paper." />
        <meta name="keywords" content="food recognition, deep learning, CNN, EfficientNetV2, image classification, computer vision, AI, machine learning, TensorFlow, Food-101 dataset" />
        <link rel="canonical" href="/projects/food-recognition" />
      </Helmet>

      <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Floating Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-6 left-6 z-50"
        >
          <Button variant="glass" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* 3D Neural Network Background */}
          <div className="absolute inset-0 z-0">
            <NeuralNetworkScene />
          </div>
          
          {/* Gradient Overlays */}
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background z-10"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_70%)] z-10" />

          {/* Hero Content */}
          <div className="container mx-auto px-6 relative z-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
              >
                Deep Learning Research Project
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                101 Food Image Recognition
                <span className="block gradient-text mt-2">Project Breakdown & Research</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                An end-to-end deep learning system trained to classify 101 food categories 
                with high accuracy using EfficientNetV2B0 and transfer learning.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap justify-center gap-4 pt-4"
              >
                <Button variant="hero" size="lg" asChild>
                  <a href="#research-paper">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Research
                  </a>
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <a href="#how-it-works">
                    Explore Architecture
                  </a>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <a href="https://github.com/sripadhirakshith01-hash/Deep_Learning_with_Tensorflow/tree/main/Projects/101_Food_Classification" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How the Model Was Built */}
        <section id="how-it-works" className="section-padding relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 space-y-4"
            >
              <span className="text-primary text-sm font-medium uppercase tracking-wider">Methodology</span>
              <h2 className="text-3xl md:text-5xl font-bold">
                How the Model Was <span className="gradient-text">Built</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A comprehensive breakdown of the development process from dataset preparation to deployment.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buildSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8, 
                    rotateX: 5, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group glass-strong rounded-2xl p-6 hover-glow cursor-default"
                  style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                      <p className="text-muted-foreground/70 text-xs">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Graphs Section */}
        <TrainingGraphs />

        {/* Live Neural Network Visualization */}
        <LiveNNVisualization />

        {/* CNN Visualization Section */}
        <CNNVisualization />

        {/* Research Paper Download Section */}
        <section id="research-paper" className="section-padding relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-block p-4 rounded-2xl bg-primary/10 border border-primary/20"
                >
                  <BookOpen className="w-12 h-12 text-primary" />
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold">
                  Read the Full <span className="gradient-text">Research Paper</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Dive deep into the methodology, experiments, and findings of this food classification research using EfficientNetV2B0 and transfer learning.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero" size="xl" className="gap-3" asChild>
                  <a href="/Food101_Research_Paper.docx" download>
                    <Download className="w-5 h-5" />
                    Download Research Paper
                  </a>
                </Button>
              </motion.div>

              <p className="text-sm text-muted-foreground/60">
                Document includes: Abstract, Methodology, Results, and References
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/50">
          <div className="container mx-auto px-6 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Rakshith Sripadhi. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
