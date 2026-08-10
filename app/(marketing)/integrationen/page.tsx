import type { Metadata } from "next";

import CatalogGrid from "@/components/catalog/CatalogGrid";
import PageHero from "@/components/landing/PageHero";
import SectionHeading from "@/components/landing/SectionHeading";
import CTASection from "@/components/sections/CTASection";
import { INTEGRATION_CATALOG } from "@/data/integration-pages";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Integrationen",
  description:
    "Gleistrix arbeitet mit den Systemen, die bei dir schon laufen – von GAEB und DATEV über Microsoft 365 bis zu Recruiting-Portalen.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Integrationen"
        title={
          <>
            Verbunden mit dem, was <span className="text-gradient-accent">schon läuft</span>
          </>
        }
        description="Gleistrix ersetzt nicht die ganze Werkzeugkiste. Buchhaltung, Kalender, Ausschreibung und Recruiting bleiben – die Daten laufen nur nicht mehr getrennt."
        breadcrumbs={[{ label: "Startseite", href: "/" }, { label: "Integrationen" }]}
        ctas={[
          { label: "Demo anfragen", href: "/demo-buchen" },
          { label: "Alle Anbindungen", href: "#anbindungen", variant: "outline" },
        ]}
      />

      <section id="anbindungen" className="scroll-mt-24 bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Im Überblick"
            title="Anbindungen nach Bereich"
            description="Jede Integration hat eine eigene Seite mit dem, was sie konkret übernimmt – und was dadurch im Alltag wegfällt."
          />
          <div className="mt-12 md:mt-16">
            <CatalogGrid catalog={INTEGRATION_CATALOG} />
          </div>
        </div>
      </section>

      <CTASection
        title="Dein System fehlt in der Liste?"
        description="Über Schnittstellen und Exporte lassen sich weitere Anbindungen ergänzen – sag uns, womit du arbeitest."
      />
    </main>
  );
}
