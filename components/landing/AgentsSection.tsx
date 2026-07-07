import { Bot, FileSearch, FileText, Mail, Receipt, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Agent = {
  icon: LucideIcon;
  name: string;
  description: string;
};

const FEATURED_AGENT: Agent = {
  icon: FileSearch,
  name: "LV-Agent",
  description:
    "Liest Leistungsverzeichnisse, erkennt relevante Positionen und bereitet Angebotsdaten strukturiert für die Kalkulation vor – aus Stunden werden Minuten.",
};

const AGENTS: Agent[] = [
  {
    icon: FileText,
    name: "Dokumentationsagent",
    description: "Erstellt Projektberichte aus Fotos, Notizen und Tagesdaten – prüffähig formatiert.",
  },
  {
    icon: ShieldAlert,
    name: "Mängel-Agent",
    description: "Erkennt und strukturiert Mängel im Lager oder Projekt und stößt die Nachverfolgung an.",
  },
  {
    icon: Mail,
    name: "Ausschreibungsagent",
    description: "Verarbeitet E-Mails vom Bieterportal und extrahiert relevante Auftragsdaten automatisch.",
  },
  {
    icon: Receipt,
    name: "Abrechnungsagent",
    description: "Prüft abrechnungsrelevante Leistungen und Dokumente, bevor die Rechnung rausgeht.",
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
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.08),transparent)]" />
      </div>

      <div className="page-container relative">
        <SectionHeading
          eyebrow="KI-Agenten"
          title={
            <span id="agents-heading">
              KI-Agenten, die <span className="text-gradient-accent">operative Arbeit vorbereiten</span>
            </span>
          }
          description="Keine Spielerei: Die Agenten übernehmen die zeitfressende Vorarbeit – dein Team entscheidet und gibt frei."
        />

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {/* Hervorgehobene Agenten-Karte */}
          <Reveal className="md:row-span-2">
            <article className="shadow-soft relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <FEATURED_AGENT.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-bold">{FEATURED_AGENT.name}</h3>
              <p className="mt-3 leading-relaxed text-indigo-100">{FEATURED_AGENT.description}</p>

              {/* Beispielausgabe */}
              <div className="mt-auto pt-8">
                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Bot className="h-3.5 w-3.5" />
                    Analyse · Ausschreibung 2026-114
                  </div>
                  <div className="mt-3 space-y-1.5 text-[11px] text-indigo-100">
                    <p>✓ 84 Positionen erkannt</p>
                    <p>✓ 12 sicherungsrelevante Leistungen markiert</p>
                    <p>✓ Angebotsdaten zur Kalkulation übergeben</p>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>

          {AGENTS.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <Reveal key={agent.name} delay={0.06 * (index + 1)} className="h-full">
                <article className="group h-full rounded-3xl border border-slate-900/8 bg-white p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{agent.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{agent.description}</p>
                </article>
              </Reveal>
            );
          })}

          {/* Hinweis-Karte: Agenten sind optional */}
          <Reveal delay={0.3} className="h-full">
            <div className="flex h-full items-center rounded-3xl border border-dashed border-indigo-300 bg-indigo-50/40 p-6">
              <p className="text-sm leading-relaxed text-indigo-800">
                <span className="font-semibold">Optional zuschaltbar:</span> Alle KI-Agenten lassen
                sich pro Unternehmen aktivieren – Gleistrix funktioniert auch komplett ohne.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
