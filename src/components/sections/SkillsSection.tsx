import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Brain, 
  Code, 
  Database, 
  Palette, 
  Server, 
  Smartphone,
  Cpu,
  Globe,
  Layers,
  Zap
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Deep Learning',
    icon: Brain,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    skills: [
      { name: 'TensorFlow', icon: Cpu },
      { name: 'Keras', icon: Cpu },
      { name: 'PyTorch', icon: Brain },
      { name: 'CNN/RNN', icon: Layers },
      { name: 'Transfer Learning', icon: Brain },
      { name: 'Neural Networks', icon: Zap },
    ],
  },
  {
    title: 'Computer Vision',
    icon: Palette,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    skills: [
      { name: 'OpenCV', icon: Palette },
      { name: 'Image Classification', icon: Layers },
      { name: 'Object Detection', icon: Palette },
      { name: 'YOLO', icon: Zap },
      { name: 'Image Segmentation', icon: Layers },
      { name: 'Data Augmentation', icon: Database },
    ],
  },
  {
    title: 'Programming & DSA',
    icon: Code,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    skills: [
      { name: 'Python', icon: Code },
      { name: 'C++', icon: Code },
      { name: 'Data Structures', icon: Database },
      { name: 'Algorithms', icon: Zap },
      { name: 'Problem Solving', icon: Brain },
      { name: 'Competitive Coding', icon: Code },
    ],
  },
  {
    title: 'Tools & Libraries',
    icon: Server,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    skills: [
      { name: 'NumPy', icon: Database },
      { name: 'Pandas', icon: Database },
      { name: 'Matplotlib', icon: Palette },
      { name: 'Scikit-learn', icon: Brain },
      { name: 'Git', icon: Code },
      { name: 'Jupyter', icon: Layers },
    ],
  },
];

function SkillCategory({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = category.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-strong rounded-2xl p-6 hover-lift"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${category.bgColor}`}>
          <Icon className={`w-6 h-6 ${category.color}`} />
        </div>
        <h3 className="text-lg font-semibold">{category.title}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {category.skills.map((skill, skillIndex) => {
          const SkillIcon = skill.icon;
          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 + skillIndex * 0.05 }}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <SkillIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Focused expertise in AI, Machine Learning, and algorithmic problem-solving.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <SkillCategory key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
