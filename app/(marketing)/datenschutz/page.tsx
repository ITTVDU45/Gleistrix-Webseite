import type { Metadata } from "next";
import PageHero from "@/components/landing/PageHero";
import Reveal from "@/components/landing/Reveal";
import { DATENSCHUTZ_HTML, DATENSCHUTZ_STAND } from "@/data/datenschutz";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten bei Gleistrix – Zwecke, Rechtsgrundlagen, Empfänger und Betroffenenrechte.",
};

export default function Page() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
        description={`Welche Daten wir zu welchen Zwecken verarbeiten – Stand: ${DATENSCHUTZ_STAND}.`}
        breadcrumbs={[{ label: "Start", href: "/" }, { label: "Datenschutz" }]}
      />

      <section className="bg-[#f8fafc] py-16 md:py-20">
        <div className="page-container">
          <Reveal>
            {/* Statischer, redaktionell gepflegter Rechtstext aus data/datenschutz.ts –
                keine Nutzereingaben, siehe Hinweis in der Datenquelle. */}
            <article
              className="prose-blog mx-auto max-w-3xl rounded-3xl border border-slate-900/8 bg-white p-7 shadow-soft-sm md:p-10"
              dangerouslySetInnerHTML={{ __html: DATENSCHUTZ_HTML }}
            />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
