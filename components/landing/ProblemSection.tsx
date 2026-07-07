import { CalendarX2, FileWarning, Receipt, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type PainPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const PAIN_POINTS: PainPoint[] = [
  {
    icon: Table2,
    title: "Verstreute Excel-Listen",
    description:
      "Projektstände, Personallisten und Materialdaten liegen in unzähligen Dateiversionen – niemand weiß, welche aktuell ist.",
  },
  {
    icon: CalendarX2,
    title: "Unklare Einsatzplanung",
    description:
      "Wer ist wann auf welcher Baustelle? Doppelbelegungen und Planungslücken fallen erst auf, wenn es zu spät ist.",
  },
  {
    icon: FileWarning,
    title: "Dokumente in E-Mails",
    description:
      "Nachweise, Pläne und Protokolle stecken in Postfächern und Anhängen – bei Prüfungen beginnt die Suche.",
  },
  {
    icon: Receipt,
    title: "Manuelle Abrechnung",
    description:
      "Stundenzettel abtippen, Leistungen zusammensuchen, Belege prüfen – die Abrechnung kostet Tage statt Stunden.",
  },
];

export default function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className="bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="Die Ausgangslage"
          title={
            <span id="problem-heading">
              Weniger Insellösungen.{" "}
              <span className="text-gradient-accent">Mehr Kontrolle im Bahnbetrieb.</span>
            </span>
          }
          description="Bahnprojekte scheitern selten an der Arbeit auf der Strecke – sondern an der Koordination dahinter."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {PAIN_POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <Reveal key={point.title} delay={index * 0.07} className="h-full">
                <article className="group h-full rounded-3xl border border-slate-900/8 bg-[#f8fafc] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-soft-sm transition-colors duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{point.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Nutzenbrücke */}
        <Reveal delay={0.1} className="mt-12 md:mt-16">
          <div className="glass mx-auto max-w-3xl rounded-3xl px-6 py-8 text-center shadow-soft-sm md:px-12">
            <p className="text-lg font-medium leading-relaxed text-slate-700 md:text-xl">
              Gleistrix führt Projekte, Einsätze, Dokumente, Lager und Abrechnung in{" "}
              <span className="font-semibold text-indigo-600">einer Plattform</span> zusammen –
              damit dein Team plant statt sucht.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
