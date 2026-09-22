import { FileSearch, Inbox, LineChart, ScanText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MediaFrame from "@/components/media/MediaFrame";
import AgentAnalysis from "./AgentAnalysis";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Agent = {
  icon: LucideIcon;
  name: string;
  description: string;
};

/*
 * Nur KI-Funktionen, die im Produkt tatsächlich laufen (Stand 2026-09-22):
 * LV-Auswertung und Fragen an das LV (lib/gaeb/agent), Übernahme von
 * DB-Leistungsanfragen (lib/services/leistungsanfrage), Beleg-Erfassung und
 * Finanzbericht (lib/finance/ai). Dokumentations-, Mängel-, Ausschreibungs-
 * und Abrechnungsagent standen hier früher – im Produkt sind sie Mock-Daten
 * ohne Backend und werden erst wieder genannt, wenn es sie gibt.
 */
const FEATURED_AGENT: Agent = {
  icon: FileSearch,
  name: "LV-Agent",
  description:
    "Wertet GAEB-Leistungsverzeichnisse aus: Zusammenfassung, Hinweise auf fehlende Mengen, Pauschal- und Nachtpositionen sowie Vorschläge für Personal, Fahrzeuge und Material. Fragen zum LV beantwortet er direkt.",
};

const AGENTS: Agent[] = [
  {
    icon: Inbox,
    name: "Leistungsanfragen übernehmen",
    description: "Liest Anfragen aus dem DB-Lieferantenportal – als Link oder PDF – und füllt die Projektanlage mit Auftrags- und SAP-Nummer, Baustelle und Zeitraum vor.",
  },
  {
    icon: ScanText,
    name: "Belege erfassen",
    description: "Erkennt in Rechnungen und Belegen als PDF oder Foto Betrag, Mehrwertsteuer, Rechnungsnummer und Fälligkeit und legt daraus eine Buchung an.",
  },
  {
    icon: LineChart,
    name: "Finanzbericht",
    description: "Fasst die Kennzahlen der Finanzübersicht zu einem Bericht zusammen: Lage, Auffälligkeiten und Hinweise – für die Geschäftsführung.",
  },
];

export default function AgentsSection() {
  return (
    <section
      id="ki-agenten"
      aria-labelledby="agents-heading"
      className="relative scroll-mt-24 overflow-hidden bg-white py-20 md:py-28"
    >
      {/* Dezenter Farbverlauf hinter dem Bento-Grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(9,35,202,0.08),transparent)]" />
      </div>

      <div className="page-container relative">
        <SectionHeading
          eyebrow="KI-Agenten"
          title={
            <span id="agents-heading">
              KI-Agenten, die <span className="text-gradient-accent">operative Arbeit vorbereiten</span>
            </span>
          }
          description="Keine Spielerei: KI liest Leistungsverzeichnisse, Leistungsanfragen und Belege – dein Team prüft, entscheidet und gibt frei."
        />

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {/* Hervorgehobene Agenten-Karte */}
          <Reveal className="md:row-span-2">
            <article className="shadow-soft relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 p-7 text-white">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <FEATURED_AGENT.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold">{FEATURED_AGENT.name}</h3>
              <p className="mt-3 leading-relaxed text-brand-100">{FEATURED_AGENT.description}</p>

              {/* Beispielausgabe: baut sich beim Hereinscrollen auf */}
              <div className="mt-auto pt-8">
                <AgentAnalysis />
              </div>
            </article>
          </Reveal>

          {AGENTS.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <Reveal key={agent.name} delay={0.06 * (index + 1)} className="h-full">
                <article className="group h-full rounded-3xl border border-slate-900/8 bg-white p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{agent.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{agent.description}</p>
                </article>
              </Reveal>
            );
          })}

          {/* Hinweis-Karte: füllt neben der dritten Karte die zweite Reihe. */}
          <Reveal delay={0.24} className="h-full">
            <div className="flex h-full items-center rounded-3xl border border-dashed border-brand-300 bg-brand-50/40 p-6">
              <p className="text-sm leading-relaxed text-brand-800">
                <span className="font-semibold">Optional:</span> Die KI-Funktionen setzen einen
                eingerichteten KI-Zugang voraus. Gleistrix funktioniert auch komplett ohne – und jedes
                Ergebnis wird vor der Übernahme geprüft.
              </p>
            </div>
          </Reveal>

          {/* Bildkachel als eigene Zeile: Mit drei statt vier Karten bliebe
              sie sonst neben einer Lücke stehen. */}
          <MediaFrame
            src="/media/start/ki-agenten.webp"
            video="/media/start/ki-agenten.mp4"
            alt="Der Gleistrix-Fuchs lässt Ausschreibungsunterlagen am Bildschirm auswerten"
            ratio="fill"
            caption="Vorarbeit, die sonst am Schreibtisch liegen bleibt"
            delay={0.3}
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="h-full md:col-span-2 lg:col-span-3"
          />
        </div>
      </div>
    </section>
  );
}
