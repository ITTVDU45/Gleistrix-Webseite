import Link from "next/link";

import CatalogGrid from "@/components/catalog/CatalogGrid";
import PageHero from "@/components/landing/PageHero";
import SectionHeading from "@/components/landing/SectionHeading";
import MediaFrame from "@/components/media/MediaFrame";
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
      >
        <MediaFrame
          src="/placeholders/uebersicht-integrationen.svg"
          alt="Buchhaltung, Kalender und Ausschreibung im Zusammenspiel mit Gleistrix"
          ratio="banner"
          priority
          caption="Bestehende Systeme bleiben – die Daten laufen nur nicht mehr getrennt"
          sizes="(min-width: 768px) 1100px, 100vw"
        />
      </PageHero>

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

      <section aria-labelledby="integrationen-erklaerung" className="bg-white py-14 md:py-20">
        <div className="page-container">
          <h2 id="integrationen-erklaerung" className="max-w-3xl text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Was eine Integration hier bedeutet
          </h2>
          <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-10">
            <div className="max-w-prose space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">
              <p>
                Die Anbindungen auf dieser Seite sind unterschiedlicher Natur, und das ist wichtig für die Erwartung.
                Bei GAEB geht es um ein Dateiformat: Leistungsverzeichnisse werden eingelesen, kalkuliert und im
                geforderten Austauschformat zurückgegeben. Bei DATEV, lexoffice und sevdesk geht es um die Übergabe
                geprüfter Daten an die Buchhaltung, ohne sie ein zweites Mal zu erfassen. Bei Microsoft 365 geht es
                darum, dass das Team seine gewohnten Werkzeuge behält.
              </p>
              <p>
                Und bei der Deutschen Bahn geht es um keine technische Kopplung an ein Fremdsystem, sondern darum, dass
                Nachweise, Rückmeldungen und Rechnungen in der Form entstehen, die im Bahnumfeld erwartet wird. Diese
                Unterscheidung nehmen wir ernst, weil eine versprochene Schnittstelle, die es nicht gibt, im Projekt
                teurer ist als eine fehlende.
              </p>
              <p>
                Der gemeinsame Zweck ist in allen Fällen derselbe: Eine Information soll einmal erfasst werden und
                danach dort verfügbar sein, wo der nächste Arbeitsschritt sie braucht.
              </p>
            </div>
            <div className="max-w-prose space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">
              <h3 className="text-lg font-bold text-slate-900">Bestehende Systeme bleiben</h3>
              <p>
                Eine Plattform, die den Austausch aller vorhandenen Werkzeuge verlangt, wird nicht eingeführt. Deshalb
                ersetzt Gleistrix weder die Steuerberatung noch das Buchhaltungsprogramm noch den Kalender des Teams.
                Es verändert, in welcher Form diese Systeme ihre Daten bekommen: geprüft und zugeordnet statt als
                Sammlung, die dort erst sortiert werden muss.
              </p>
              <p>
                Praktisch heißt das: Der Projektbezug eines Belegs entsteht bei der Erfassung und übersteht den Wechsel
                zwischen den Systemen. Stunden gehen inklusive Zuschlägen in die Lohnabrechnung, weil sie in der
                Zeiterfassung bereits geprüft wurden. Für öffentliche Auftraggeber lässt sich daraus die X-Rechnung
                ausgeben.
              </p>
              <p>
                Wo eine Anbindung zu einem konkreten Ablauf gehört, verweisen die Detailseiten darauf – etwa von der{" "}
                <Link className="font-semibold text-indigo-700" href="/produkt/rechnungsstellung">Rechnungsstellung</Link>{" "}
                auf die Buchhaltungsanbindungen oder von{" "}
                <Link className="font-semibold text-indigo-700" href="/branchen/subunternehmen-db">Subunternehmen der DB</Link>{" "}
                auf die Anforderungen der Auftraggeberseite. Fehlt ein System, lassen sich über Exporte und
                Schnittstellen weitere Anbindungen ergänzen.
              </p>
            </div>
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
