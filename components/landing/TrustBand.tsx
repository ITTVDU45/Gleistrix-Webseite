import { CalendarRange, FolderKanban, Receipt, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MediaFrame from "@/components/media/MediaFrame";
import Reveal from "./Reveal";

type TrustItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: FolderKanban,
    title: "Alle Projekte zentral",
    description: "Ein System für Planung, Durchführung und Abnahme",
  },
  {
    icon: CalendarRange,
    title: "Digitale Plantafel",
    description: "Trupps, Fahrzeuge und Maschinen im Blick",
  },
  {
    icon: Sparkles,
    title: "KI-gestützte Dokumentation",
    description: "Berichte aus Fotos, Notizen und Tagesdaten",
  },
  {
    icon: Receipt,
    title: "Schnellere Abrechnung",
    description: "Geprüfte Leistungen, weniger manuelle Arbeit",
  },
];

export default function TrustBand() {
  return (
    <section aria-label="Kernvorteile" className="border-y border-slate-900/6 bg-[#f3f6fb]">
      <div className="page-container py-12 md:py-14">
        {/* Der Streifen läuft bewusst vor der Liste und nicht hinter ihr: Als
            Hintergrund würde er den Kontrast der dd-Texte auf #f3f6fb wieder
            unter den Grenzwert drücken, und ein Bild innerhalb der dl-Gruppe
            lässt axe die Definitionsliste verwerfen. */}
        <MediaFrame
          src="/placeholders/szene-gleisbaustelle.svg"
          alt="Gleisbaustelle im laufenden Betrieb"
          ratio="strip"
          sizes="(min-width: 768px) 1100px, 100vw"
          className="mb-10 md:mb-12"
        />

        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={index * 0.06}
                className="lg:border-l lg:border-slate-900/8 lg:pl-6 lg:first:border-0 lg:first:pl-0"
              >
                {/* Eine Gruppe unterhalb der dl darf ausschließlich dt und dd
                    enthalten – ein Icon-span daneben lässt axe die Liste
                    verwerfen. Deshalb trägt das dt das Icon selbst, und das dd
                    rückt um dessen Breite plus Abstand ein. */}
                <dt className="flex items-center gap-4 text-sm font-semibold text-slate-900">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.title}
                </dt>
                {/* slate-600: der Abschnitt liegt auf #f3f6fb, dort bleibt
                    slate-500 mit 4,39:1 unter dem Grenzwert. */}
                <dd className="mt-1 text-sm leading-relaxed text-slate-600 lg:pl-[3.75rem]">
                  {item.description}
                </dd>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
