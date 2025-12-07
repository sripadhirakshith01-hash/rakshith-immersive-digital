import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import foodRecognitionImg from '@/assets/project-food-recognition.jpg';
import fashionPredictorImg from '@/assets/project-fashion-predictor.jpg';
import maskDetectionImg from '@/assets/project-mask-detection.jpg';

const projects = [
  {
    id: 1,
    title: '101Food Image Recognition',
    description: 'Deep learning model trained on the Food-101 dataset to classify 101 different food categories with high accuracy. Features real-time image classification and nutritional insights.',
    tech: ['Python', 'TensorFlow', 'CNN', 'Keras', 'OpenCV'],
    image: foodRecognitionImg,
    github: '#',
    demo: '/projects/food-recognition',
    isInternalDemo: true,
    color: 'from-primary/20 to-secondary/20',
  },
  {
    id: 2,
    title: 'Fashion Style Predictor',
    description: 'AI-powered fashion classification system that analyzes clothing images and predicts style categories like casual, formal, streetwear, and vintage with outfit recommendations.',
    tech: ['Python', 'PyTorch', 'ResNet', 'FastAPI', 'React'],
    image: fashionPredictorImg,
    github: '#',
    demo: '#',
    isInternalDemo: false,
    color: 'from-secondary/20 to-accent/20',
  },
  {
    id: 3,
    title: 'Face Mask Detection',
    description: 'Real-time computer vision system for detecting face masks in video streams. Deployed for COVID-19 safety compliance monitoring with high precision and recall.',
    tech: ['Python', 'OpenCV', 'YOLO', 'TensorFlow', 'Flask'],
    image: maskDetectionImg,
    github: '#',
    demo: '#',
    isInternalDemo: false,
    color: 'from-accent/20 to-primary/20',
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass-strong rounded-2xl overflow-hidden hover-lift hover-glow">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.color} z-10`} />
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center gap-4"
          >
            {project.isInternalDemo ? (
              <Button variant="hero" size="sm" asChild>
                <Link to={project.demo}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Link>
              </Button>
            ) : (
              <Button variant="hero" size="sm" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            <Button variant="glass" size="sm" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI and machine learning projects showcasing my expertise in computer vision, 
            deep learning, and intelligent systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
