import { CalendarRange, FolderKanban, Receipt, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={index * 0.06}
                className="flex items-start gap-4 lg:border-l lg:border-slate-900/8 lg:pl-6 lg:first:border-0 lg:first:pl-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <dt className="text-sm font-semibold text-slate-900">{item.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </dd>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
