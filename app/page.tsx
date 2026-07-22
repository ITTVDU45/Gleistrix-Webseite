import Hero from "@/components/landing/Hero";
import SecurityIntegrations from "@/components/landing/SecurityIntegrations";
import CaseStudiesSection from "@/components/landing/CaseStudiesSection";
import TrustBand from "@/components/landing/TrustBand";
import ProblemSection from "@/components/landing/ProblemSection";
import ModulesSection from "@/components/landing/ModulesSection";
import AgentsSection from "@/components/landing/AgentsSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import AudienceSection from "@/components/landing/AudienceSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import BlogSection from "@/components/landing/BlogSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <SecurityIntegrations />
      <CaseStudiesSection />
      <TrustBand />
      <ProblemSection />
      <ModulesSection />
      <AgentsSection />
      <WorkflowSection />
      <AudienceSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
    </main>
  );
}
