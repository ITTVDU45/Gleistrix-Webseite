import { Briefcase, HardHat, ShieldCheck, TrainFront, Users, Warehouse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Audience = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const AUDIENCES: Audience[] = [
  {
    icon: ShieldCheck,
    title: "SIPO-Unternehmen",
    description: "Sicherungsposten, Qualifikationen und Einsätze rechtssicher koordinieren.",
  },
  {
    icon: TrainFront,
    title: "Bahndienstleister",
    description: "Projekte, Trupps und Maschinen über Baustellen hinweg steuern.",
  },
  {
    icon: HardHat,
    title: "Projektleiter",
    description: "Fortschritt, Ressourcen und Dokumente ohne Telefonkette im Blick.",
  },
  {
    icon: Users,
    title: "Backoffice",
    description: "Stammdaten, Nachweise und Abrechnung ohne Zettelwirtschaft.",
  },
  {
    icon: Warehouse,
    title: "Lagerverwaltung",
    description: "Material und Sicherungstechnik mit Beständen und Prüffristen.",
  },
  {
    icon: Briefcase,
    title: "Geschäftsführung",
    description: "Auslastung, Kennzahlen und Deckungsbeiträge auf einen Blick.",
  },
];

export default function AudienceSection() {
  return (
    <section id="vorteile" aria-labelledby="audience-heading" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="Für wen"
          title={<span id="audience-heading">Gemacht für alle, die den Bahnbetrieb am Laufen halten</span>}
          description="Vom Sicherungsposten bis zur Geschäftsführung: Jede Rolle arbeitet mit denselben aktuellen Daten."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {AUDIENCES.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Reveal key={audience.title} delay={index * 0.05} className="h-full">
                <article className="group h-full rounded-3xl border border-slate-900/8 bg-[#f8fafc] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{audience.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
