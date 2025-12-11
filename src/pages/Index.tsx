import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FloatingBackground } from '@/components/3d/FloatingBackground';
import { LiquidMercuryOverlay } from '@/components/3d/LiquidMercuryOverlay';
import { IntroScreen } from '@/components/IntroScreen';

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Intro screen with fade animation */}
      <IntroScreen />
      
      {/* Persistent 3D background */}
      <FloatingBackground />
      
      {/* Liquid mercury distortion overlay */}
      <LiquidMercuryOverlay />
      
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
