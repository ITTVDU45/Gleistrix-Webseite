import Hero from "@/components/landing/Hero";
import TrustBand from "@/components/landing/TrustBand";
import ProblemSection from "@/components/landing/ProblemSection";
import ModulesSection from "@/components/landing/ModulesSection";
import AgentsSection from "@/components/landing/AgentsSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import AudienceSection from "@/components/landing/AudienceSection";
import CTABanner from "@/components/landing/CTABanner";
import FAQSection from "@/components/landing/FAQSection";
import BlogSection from "@/components/landing/BlogSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBand />
      <ProblemSection />
      <ModulesSection />
      <AgentsSection />
      <WorkflowSection />
      <AudienceSection />
      <CTABanner />
      <FAQSection />
      <BlogSection />
    </main>
  );
}
