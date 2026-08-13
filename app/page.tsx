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
import { pageMetadata } from "@/lib/seo-metadata";

// Marke gehört in den Startseitentitel: Root-Layout und Startseite sind
// dasselbe Segment, deshalb greift das "%s | Gleistrix"-Template hier nicht.
// Die Formulierung unterscheidet sich bewusst von /erp-bahnbau, damit nicht
// zwei URLs mit identischem Titel um dieselbe Anfrage konkurrieren.
export const metadata = pageMetadata({
  title: "Gleistrix – ERP-Plattform für Bahnbau und Bahndienstleister",
  description:
    "Gleistrix verbindet Projektplanung, Disposition, Personal, Fahrzeuge, Zeiterfassung, Dokumente und Abrechnung in einer ERP-Plattform für Bahndienstleister.",
  path: "/",
});

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
