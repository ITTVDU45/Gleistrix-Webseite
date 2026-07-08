import { BarChart3, CalendarRange, ClipboardList, FileCheck2, Receipt, TrainTrack } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import ScreensGallery from "./ScreensGallery";
import SectionHeading from "./SectionHeading";

type WorkflowStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: WorkflowStep[] = [
  {
    icon: ClipboardList,
    title: "Auftrag erfassen",
    description: "Ausschreibung oder Auftrag anlegen – auf Wunsch mit KI-Vorarbeit.",
  },
  {
    icon: CalendarRange,
    title: "Ressourcen planen",
    description: "Trupps, Fahrzeuge und Material auf der Plantafel disponieren.",
  },
  {
    icon: TrainTrack,
    title: "Projekt durchführen",
    description: "Einsätze laufen, Zeiten und Leistungen werden mobil erfasst.",
  },
  {
    icon: FileCheck2,
    title: "Dokumentieren",
    description: "Berichte und Nachweise entstehen direkt aus den Projektdaten.",
  },
  {
    icon: Receipt,
    title: "Abrechnen",
    description: "Geprüfte Leistungen fließen in den Rechnungsentwurf.",
  },
  {
    icon: BarChart3,
    title: "Auswerten",
    description: "Kennzahlen zu Projekten, Auslastung und Deckungsbeitrag.",
  },
];

export default function WorkflowSection() {
  return (
    <section aria-labelledby="workflow-heading" className="bg-[#f3f6fb] py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="So arbeitet Gleistrix"
          title={<span id="workflow-heading">Vom Auftrag bis zur Auswertung – ein durchgängiger Prozess</span>}
          description="Jeder Schritt baut auf dem vorherigen auf. Keine Medienbrüche, kein Abtippen, keine Doppelpflege."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.06} className="h-full">
                <li className="glass relative h-full rounded-3xl p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Schritt {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.description}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>

        {/* Einblicke: Gleistrix in Action */}
        <div className="mt-20 md:mt-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
              Einblicke
            </span>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Gleistrix in Action
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              Ein Blick auf Oberflächen und Workflows aus dem echten Betrieb.
            </p>
          </Reveal>
          <div className="mt-12 md:mt-14">
            <ScreensGallery />
          </div>
        </div>
      </div>
    </section>
  );
}
