import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import VorteileSection from "@/components/sections/VorteileSection";
import ZielgruppenSection from "@/components/sections/ZielgruppenSection";
import SecuritySection from "@/components/sections/SecuritySection";
// import ComingSoonSection from "@/components/sections/ComingSoonSection";
import EinsatzmoeglichkeitenSection from "@/components/sections/EinsatzmoeglichkeitenSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import FunktionenSection from "@/components/sections/FunktionenSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <div id="hero">
        <HeroSection />
      </div>
      {/* Dashboard wird nun innerhalb der HeroSection gerendert */}
      <div id="loesungen">
        <FeaturesSection />
      </div>
      <div id="vorteile">
        <VorteileSection />
      </div>
      <div id="cta">
        <CTASection />
      </div>
      <div id="einsatzmoeglichkeiten">
        <EinsatzmoeglichkeitenSection />
      </div>
      <div id="zielgruppe">
        <ZielgruppenSection />
      </div>
      <FunktionenSection />
      {/* <ComingSoonSection /> */}
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
