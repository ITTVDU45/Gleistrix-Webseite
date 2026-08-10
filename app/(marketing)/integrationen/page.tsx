import CatalogGrid from "@/components/catalog/CatalogGrid";
import PageHero from "@/components/landing/PageHero";
import SectionHeading from "@/components/landing/SectionHeading";
import CTASection from "@/components/sections/CTASection";
import { INTEGRATION_CATALOG } from "@/data/integration-pages";
import { pageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Integrationen: GAEB, DATEV, Microsoft 365 & mehr",
  description:
    "Verbinde Gleistrix mit GAEB, DATEV, Microsoft 365, lexoffice, sevdesk, Kalender-, Zahlungs- und Recruiting-Systemen für durchgängige Bahnprozesse.",
  path: "/integrationen",
});

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
          <div className="mt-12 md:mt-16"><CatalogGrid catalog={INTEGRATION_CATALOG} /></div>
        </div>
      </section>

      <CTASection
        title="Dein System fehlt in der Liste?"
        description="Über Schnittstellen und Exporte lassen sich weitere Anbindungen ergänzen – sag uns, womit du arbeitest."
      />
    </main>
  );
}
