import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const skills = [
  { name: 'Python', level: 95 },
  { name: 'TensorFlow/PyTorch', level: 90 },
  { name: 'React/Next.js', level: 92 },
  { name: 'TypeScript', level: 88 },
  { name: 'Node.js', level: 85 },
  { name: 'Three.js/WebGL', level: 80 },
];

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{name}</span>
        <span className="text-primary">{level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Bio */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-primary text-sm font-medium uppercase tracking-wider">About Me</span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Crafting the Future of
                <span className="gradient-text"> Digital Experiences</span>
              </h2>
            </div>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              I'm a passionate developer with expertise in AI/ML and full-stack development. 
              I specialize in building intelligent systems that combine cutting-edge machine learning 
              with stunning visual interfaces.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              With over 5 years of experience, I've worked with startups and enterprises alike, 
              delivering scalable solutions that push the boundaries of what's possible on the web. 
              My work blends technical excellence with creative design, resulting in experiences 
              that are both powerful and beautiful.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" asChild>
                <a href="#contact">Let's Connect</a>
              </Button>
              <Button variant="glass" className="gap-2">
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </div>
          </motion.div>

          {/* Right - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-strong p-8 rounded-2xl space-y-6"
          >
            <h3 className="text-xl font-semibold">Core Skills</h3>
            <div className="space-y-5">
              {skills.map((skill, index) => (
                <SkillBar key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
