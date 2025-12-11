import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Mail, MapPin, Github, Linkedin } from 'lucide-react';
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

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow animation-delay-200" />
      
      <div className="container mx-auto relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-6">
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
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
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
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
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
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-foreground placeholder:text-muted-foreground"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
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
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="glass-strong rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-semibold">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:Sripadhi.Rakshith01@gmail.com" className="text-foreground hover:text-primary transition-colors">
                      Sripadhi.Rakshith01@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground">Hyderabad, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-8 space-y-6">
              <h3 className="text-xl font-semibold">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      aria-label={link.label}
                      className="p-3 bg-muted/50 rounded-lg hover:bg-primary/10 hover:text-primary transition-all group"
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-8 text-center space-y-4">
              <p className="text-muted-foreground">
                Prefer a call? Let's schedule a meeting.
              </p>
              <Button variant="hero-outline" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Book a Call
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
