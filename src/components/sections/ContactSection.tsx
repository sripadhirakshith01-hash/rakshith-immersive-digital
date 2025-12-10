import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Mail, MapPin, Github, Linkedin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/sripadhirakshith01-hash', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/rakshithsripadhi', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:Sripadhi.Rakshith01@gmail.com', label: 'Email' },
  ];

  const phoneNumber = '+919963013010';

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background transition-all duration-1000" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow transition-all duration-700" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow animation-delay-200 transition-all duration-700" />
      
      <div className="container mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Contact</span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it. Drop me a message and let's create something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-6 transition-all duration-500 hover:shadow-[0_0_60px_hsl(var(--primary)/0.2)]">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none text-foreground placeholder:text-muted-foreground hover:border-primary/50"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="glass-strong rounded-2xl p-8 space-y-6 transition-all duration-500 hover:shadow-[0_0_60px_hsl(var(--primary)/0.2)]">
              <h3 className="text-xl font-semibold">Get in Touch</h3>
              
              <div className="space-y-4">
                <a 
                  href="mailto:Sripadhi.Rakshith01@gmail.com" 
                  className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1"
                >
                  <div className="p-3 bg-primary/10 rounded-lg transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                      Sripadhi.Rakshith01@gmail.com
                    </span>
                  </div>
                </a>

                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1"
                >
                  <div className="p-3 bg-accent/10 rounded-lg transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <span className="text-foreground group-hover:text-accent transition-colors duration-300">
                      +91 9963013010
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-4 group transition-all duration-300">
                  <div className="p-3 bg-secondary/10 rounded-lg transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground">Hyderabad, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-8 space-y-6 transition-all duration-500 hover:shadow-[0_0_60px_hsl(var(--primary)/0.2)]">
              <h3 className="text-xl font-semibold">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="p-3 bg-muted/50 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            <motion.div 
              className="glass-strong rounded-2xl p-8 text-center space-y-4 transition-all duration-500 hover:shadow-[0_0_60px_hsl(var(--accent)/0.3)]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-2">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <p className="text-muted-foreground">
                Prefer a call? Let's schedule a meeting.
              </p>
              <Button 
                variant="hero" 
                size="lg"
                className="transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]" 
                asChild
              >
                <a href={`https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent('Hi Rakshith! I would like to discuss a project with you.')}`} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-4 h-4 mr-2" />
                  Book a Call
                </a>
              </Button>
              <p className="text-xs text-muted-foreground/70">
                Opens WhatsApp • Available Mon-Sat
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
