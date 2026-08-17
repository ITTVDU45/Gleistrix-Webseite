import IndustriesGrid from "@/components/industries-grid";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import CTASection from "@/components/sections/CTASection";
import PageHero from "@/components/landing/PageHero";
import SectionHeading from "@/components/landing/SectionHeading";
import MediaFrame from "@/components/media/MediaFrame";
import { pageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Software für Bahnbau, Sicherungsunternehmen & Bahndienstleister",
  description:
    "Gleistrix unterstützt Gleisbauunternehmen, Sicherungsunternehmen, Gleisbausicherung und weitere Bahndienstleister bei Planung, Nachweisen und Abrechnung.",
  path: "/branchen",
});

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
      >
        <MediaFrame
          src="/placeholders/uebersicht-branchen.svg"
          alt="Bahnbetrieb aus verschiedenen Gewerken"
          ratio="banner"
          priority
          caption="Vom Sicherungsunternehmen bis zum auftragsbasierten Dienstleister"
          sizes="(min-width: 768px) 1100px, 100vw"
        />
      </PageHero>

      <section aria-labelledby="industries-heading" className="bg-[#f8fafc] py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Im Überblick"
            title={<span id="industries-heading">Für jede Ausprägung des Bahnbetriebs</span>}
            description="Gleistrix bildet die Besonderheiten jeder Branche ab – von der Qualifikationsplanung bis zur normkonformen Abrechnung."
          />
          <div className="mt-12 md:mt-16"><IndustriesGrid /></div>
        </div>
      </section>

      <section id="loesungen" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="page-container">
          <SectionHeading
            eyebrow="Eine Lösung für alle Prozesse"
            title="Alle Werkzeuge, ein System"
            description="Vom Personal über die Disposition bis zur Abrechnung – jede Funktion greift nahtlos in die nächste."
          />
          <div className="mt-12 md:mt-16"><FeaturesAccordion /></div>
        </div>
      </section>

      <section aria-labelledby="branchen-einordnung" className="bg-white py-14 md:py-20">
        <div className="page-container">
          <h2 id="branchen-einordnung" className="max-w-3xl text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Warum sich die Branchen unterscheiden
          </h2>
          <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-2 md:gap-10">
            <div className="max-w-prose space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">
              <p>
                Alle fünf Gruppen arbeiten mit derselben Plattform, aber sie belasten unterschiedliche Teile davon. Bei
                Sicherungsunternehmen entscheidet die Qualifikation über die Besetzung: Wessen Nachweis am Einsatztag
                nicht mehr gilt, darf nicht auf der Strecke stehen. Bei Gleisbauunternehmen entscheidet das Zeitfenster –
                Personal, Zweiwegefahrzeuge und Material müssen gemeinsam in eine Sperrpause passen.
              </p>
              <p>
                Bei Subunternehmern der Bahn liegt der Aufwand am Ende der Kette, in der Form, in der Nachweise und
                Rückmeldungen beim Auftraggeber ankommen müssen. Bei auftragsbasierten Dienstleistern liegt er in der
                Kette selbst: Angebot, Auftrag, Einsatz, Stunden, Rechnung, ohne dass eine Angabe zweimal erfasst wird.
              </p>
              <p>
                Die Gleisbausicherung mit Bauüberwachung verbindet beides, weil dort Sicherungsplanung und
                Nachweisführung zusammenfallen. Aus dieser Konstellation ist Gleistrix ursprünglich entstanden.
              </p>
            </div>
            <div className="max-w-prose space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">
              <h3 className="text-lg font-bold text-slate-900">Wie du die passende Seite findest</h3>
              <p>
                Am schnellsten über die Frage, welcher Teil des Ablaufs bei dir am meisten Zeit kostet. Ist es die
                Besetzung nach Qualifikationen, führt der Weg über die Sicherungsunternehmen. Ist es die Koordination von
                Technik und Sperrpausen, über die Gleisbauunternehmen. Ist es die Nachweisführung gegenüber dem
                Auftraggeber, über die Subunternehmen der DB.
              </p>
              <p>
                Die Seiten überschneiden sich bewusst nicht: Jede beschreibt einen eigenen Schwerpunkt und verweist auf
                die Nachbarseite, wenn ein Thema dort besser passt. Wer stattdessen von der Funktion her sucht, findet
                jedes Modul einzeln beschrieben.
              </p>
              <p>
                Betriebe, die in keine der fünf Gruppen fallen, sind damit nicht ausgeschlossen. Die Plattform ist auf
                projektbasierte Arbeit mit wechselnden Einsätzen und nachweispflichtigen Qualifikationen ausgelegt, und
                das trifft auf mehr Gewerke zu als auf diese Auswahl. In einer Demo lässt sich an den eigenen Abläufen
                klären, welche Module tragen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
