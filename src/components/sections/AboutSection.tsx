import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profilePic from '@/assets/profile-pic.jpeg';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px", amount: 0.2 });

  return (
    <section id="about" className="section-padding relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Bio */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
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
              I'm a 3rd year Computer Science Engineering student at the Indian Institute of 
              Information Technology, Surat (IIIT Surat), passionate about Artificial Intelligence 
              and Machine Learning.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              I specialize in Deep Learning, Computer Vision, and solving complex problems using 
              Data Structures & Algorithms. My projects focus on building intelligent systems that 
              can recognize patterns, classify images, and make predictions from real-world data. 
              I'm constantly learning and exploring new frontiers in AI research.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" asChild>
                <a href="#contact">Let's Connect</a>
              </Button>
              <Button variant="glass" className="gap-2" asChild>
                <a href="/Rakshith_Sripadhi_Resume.docx" download>
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right - Profile Picture */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-2xl scale-110" />
              
              {/* Image container */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="relative glass-strong p-2 rounded-2xl overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img 
                  src={profilePic} 
                  alt="Rakshith Sripadhi" 
                  className="w-80 h-96 object-cover rounded-xl"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-24 h-24 border border-primary/20 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 border border-secondary/20 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
