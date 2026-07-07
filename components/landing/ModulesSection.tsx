import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ModuleVisual, { type ModuleVisualVariant } from "./ModuleVisual";

type Module = {
  title: string;
  description: string;
  bullets: [string, string, string];
  visual: ModuleVisualVariant;
  href?: string;
};

const MODULES: Module[] = [
  {
    title: "Projektmanagement",
    description:
      "Alle Bahnprojekte an einem Ort – vom Auftragseingang bis zur Abnahme. Status, Verantwortliche und Fortschritt sind jederzeit nachvollziehbar.",
    bullets: [
      "Projektakten mit Status und Meilensteinen",
      "Aufgaben und Verantwortlichkeiten im Blick",
      "Fortschritt in Echtzeit statt Wochenbericht",
    ],
    visual: "projekte",
    href: "/produkt/projektplanung-disposition",
  },
  {
    title: "Plantafel & Einsatzplanung",
    description:
      "Die digitale Plantafel zeigt Trupps, Maschinen und Schichten in einer Ansicht. Konflikte und Lücken werden sichtbar, bevor sie zum Problem werden.",
    bullets: [
      "Drag-and-drop-Planung über Wochen und Monate",
      "Doppelbelegungen werden automatisch erkannt",
      "Nacht- und Wochenendschichten sauber abgebildet",
    ],
    visual: "plantafel",
    href: "/produkt/kalender-einsatzuebersicht",
  },
  {
    title: "Mitarbeiter & Fahrzeuge",
    description:
      "Qualifikationen, Verfügbarkeiten und Fristen zentral verwaltet – vom Sicherungsposten bis zum Zweiwegefahrzeug.",
    bullets: [
      "Qualifikationen und Tauglichkeiten mit Fristenwarnung",
      "Fahrzeuge, Wartung und HU-Termine im Blick",
      "Rollen und Berechtigungen pro Team",
    ],
    visual: "team",
    href: "/produkt/mitarbeiterverwaltung",
  },
  {
    title: "Dokumentenmanagement",
    description:
      "Pläne, Nachweise und Protokolle liegen revisionssicher in der Projektakte – statt verstreut in Postfächern und Ordnern.",
    bullets: [
      "Revisionssichere Ablage pro Projekt",
      "Freigaben und Versionen nachvollziehbar",
      "Bei Prüfungen in Sekunden auskunftsfähig",
    ],
    visual: "dokumente",
    href: "/produkt/dokumentenmanagement",
  },
  {
    title: "Lagerverwaltung",
    description:
      "Material, Geräte und Sicherungstechnik mit Beständen und Reservierungen – damit auf der Baustelle nichts fehlt.",
    bullets: [
      "Bestände und Mindestmengen in Echtzeit",
      "Material direkt dem Projekt zuordnen",
      "Geräte- und Prüfhistorie dokumentiert",
    ],
    visual: "lager",
  },
  {
    title: "Abrechnung & vorbereitende Buchhaltung",
    description:
      "Erfasste Leistungen, Stunden und Belege fließen direkt in die Abrechnung – geprüft, vollständig und übergabefertig für die Buchhaltung.",
    bullets: [
      "Leistungsnachweise automatisch zusammengeführt",
      "Rechnungsentwürfe pro Projekt und Zeitraum",
      "Saubere Übergabe an Steuerberater und DATEV-Prozesse",
    ],
    visual: "abrechnung",
    href: "/produkt/rechnungsstellung",
  },
  {
    title: "KI-Agenten",
    description:
      "Digitale Assistenten übernehmen vorbereitende Arbeit: Leistungsverzeichnisse lesen, Berichte erstellen, Ausschreibungen auswerten.",
    bullets: [
      "LV-Analyse und Angebotsvorbereitung",
      "Automatische Projekt- und Tagesberichte",
      "Ausschreibungs- und Abrechnungsprüfung",
    ],
    visual: "ki",
    href: "#ki-agenten",
  },
];

export default function ModulesSection() {
  return (
    <section id="module" aria-labelledby="module-heading" className="scroll-mt-24 bg-[#f8fafc] py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="Module"
          title={<span id="module-heading">Eine Plattform. Alle Werkzeuge für den Bahnbetrieb.</span>}
          description="Jedes Modul löst ein konkretes Problem im Alltag von Bahndienstleistern – zusammen ergeben sie ein durchgängiges System."
        />

        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {MODULES.map((module, index) => {
            const isReversed = index % 2 === 1;
            return (
              <Reveal key={module.title}>
                <article className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                  <div className={`min-w-0 ${isReversed ? "md:order-2" : ""}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                      {module.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-slate-500">{module.description}</p>
                    <ul className="mt-5 space-y-2.5">
                      {module.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <Check className="h-3 w-3" />
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {module.href && (
                      <Link
                        href={module.href}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
                      >
                        Mehr erfahren
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                  <div className={`min-w-0 ${isReversed ? "md:order-1" : ""}`}>
                    <ModuleVisual variant={module.visual} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
