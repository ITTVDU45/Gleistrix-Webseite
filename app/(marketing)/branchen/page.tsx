import type { Metadata } from "next";
import IndustriesGrid from "@/components/industries-grid";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import CTASection from "@/components/sections/CTASection";
import PageHero from "@/components/landing/PageHero";
import SectionHeading from "@/components/landing/SectionHeading";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Branchen",
  description:
    "Gleistrix passt sich Ihrer Realität an – von Gleisbausicherung über Sicherungsunternehmen bis zu auftragsbasierten Dienstleistern.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Branchen"
        title={
          <>
            Branchen, die auf <span className="text-gradient-accent">Gleistrix</span> vertrauen
          </>
        }
        description="Von Gleisbausicherung bis zu auftragsbasierten Services – Gleistrix passt sich deiner Realität an, nicht umgekehrt."
        breadcrumbs={[{ label: "Startseite", href: "/" }, { label: "Branchen" }]}
        ctas={[
          { label: "Demo anfragen", href: "/demo-buchen" },
          { label: "Lösungen ansehen", href: "#loesungen", variant: "outline" },
        ]}
      />

      {/* Branchen im Überblick */}
      <section aria-labelledby="industries-heading" className="bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Im Überblick"
            title={<span id="industries-heading">Für jede Ausprägung des Bahnbetriebs</span>}
            description="Gleistrix bildet die Besonderheiten jeder Branche ab – von der Qualifikationsplanung bis zur normkonformen Abrechnung."
          />
          <div className="mt-12 md:mt-16">
            <IndustriesGrid />
          </div>
        </div>
      </section>

      {/* Funktionen (Accordion) */}
      <section id="loesungen" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Eine Lösung für alle Prozesse"
            title="Alle Werkzeuge, ein System"
            description="Vom Personal über die Disposition bis zur Abrechnung – jede Funktion greift nahtlos in die nächste."
          />
          <div className="mt-12 md:mt-16">
            <FeaturesAccordion />
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
