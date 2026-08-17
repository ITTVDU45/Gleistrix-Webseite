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
import { HOME_FAQS } from "@/data/faqs";
import { faqPageJsonLd, pageMetadata } from "@/lib/seo-metadata";

// Marke gehört in den Startseitentitel: Root-Layout und Startseite sind
// dasselbe Segment, deshalb greift das "%s | Gleistrix"-Template hier nicht.
// Seit /erp-bahnbau hierher weiterleitet, trägt die Startseite das Hauptthema
// allein und nennt es deshalb beim gesuchten Begriff: "ERP Software".
export const metadata = pageMetadata({
  title: "Gleistrix – ERP Software für Bahnbau und Bahndienstleister",
  description:
    "Gleistrix verbindet Projektplanung, Disposition, Personal, Fahrzeuge, Zeiterfassung, Dokumente und Abrechnung in einer ERP-Plattform für Bahndienstleister.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      {/* Alle sechs Fragen. FAQSection liefert sie vollständig aus: das
          Karussell zeigt drei Karten mit einer Antwort, darunter steht die
          komplette Liste als sr-only. Damit hat jede ausgezeichnete Frage eine
          Entsprechung im ausgelieferten HTML – ohne das wäre die Auszeichnung
          Markup ohne sichtbaren Inhalt und gälte bei Google als Spam. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(HOME_FAQS)) }}
      />
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
