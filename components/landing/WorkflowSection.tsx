import type { CSSProperties } from "react";
import { BarChart3, CalendarRange, ClipboardList, FileCheck2, Receipt, TrainTrack } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import ScreensGallery from "./ScreensGallery";
import SectionHeading from "./SectionHeading";
import WorkflowTimeline from "./WorkflowTimeline";

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

/**
 * Karte ohne `.glass`: backdrop-filter auf sechs Karten in einem pro Frame
 * verschobenen Elternelement ist der teuerste Effekt der Sektion, und auf dem
 * flachen Sektionsband ist der optische Gewinn null.
 */
const CARD_CLASSES =
  "relative flex h-full flex-col rounded-3xl border border-slate-900/8 bg-white/80 p-6 " +
  "shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft";

const ICON_TILE_CLASSES =
  "flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm";

const NODE_CLASSES =
  "wf-node h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white " +
  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "data-[active=true]:scale-125 data-[active=true]:border-indigo-600 " +
  "data-[active=true]:bg-indigo-600 data-[active=true]:shadow-[0_0_0_6px_rgba(79,70,229,0.12)]";

export default function WorkflowSection() {
  return (
    // Kein overflow-hidden auf dieser Sektion: das würde das position:sticky
    // der Timeline-Bühne sofort abschneiden.
    <section aria-labelledby="workflow-heading" className="bg-[#f3f6fb] py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="So arbeitet Gleistrix"
          title={
            <span id="workflow-heading">
              Vom Auftrag bis zur Auswertung – ein durchgängiger Prozess
            </span>
          }
          description="Jeder Schritt baut auf dem vorherigen auf. Keine Medienbrüche, kein Abtippen, keine Doppelpflege."
        />
      </div>

      {/* Bewusst ausserhalb von page-container: die Bühne läuft über die volle
          Breite, sonst stimmt die 100vw-Geometrie in globals.css nicht. */}
      <WorkflowTimeline stepCount={STEPS.length}>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              data-step
              aria-current={index === 0 ? "step" : undefined}
              style={{ "--i": index } as CSSProperties}
              className="wf-col relative h-full"
            >
              <span aria-hidden data-node data-active={index === 0} className={NODE_CLASSES} />

              {/* Drei Ebenen, drei Besitzer desselben Stilfelds: das <li> trägt
                  den Einzug aus CSS, dieses <div> die Skalierung aus GSAP, das
                  <article> das Anheben beim Überfahren. Lägen zwei davon auf
                  demselben Element, würde GSAP den fremden Transform beim
                  Anlegen seines Setters einlesen und dauerhaft mitschreiben. */}
              <div data-scale className="h-full">
                <article className={CARD_CLASSES}>
                  <div className="flex items-center gap-3">
                    <span data-icon className={ICON_TILE_CLASSES}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Schritt {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </article>
              </div>
            </li>
          );
        })}
      </WorkflowTimeline>

      {/* Einblicke: Gleistrix in Action */}
      <div className="page-container">
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
