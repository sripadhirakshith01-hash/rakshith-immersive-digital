import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FloatingBackground } from '@/components/3d/FloatingBackground';
import { MercuryLandingCover } from '@/components/MercuryLandingCover';

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Mercury landing cover - clicks to reveal site */}
      <MercuryLandingCover />
      
      {/* Persistent 3D background */}
      <FloatingBackground />
      
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
