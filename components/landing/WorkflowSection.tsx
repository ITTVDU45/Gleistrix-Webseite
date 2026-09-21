import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarRange, ClipboardList, FileCheck2, Receipt, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MediaFrame from "@/components/media/MediaFrame";
import SectionHeading from "./SectionHeading";
import WorkflowTimeline from "./WorkflowTimeline";

// Jeder Schritt verlinkt das Modul, das ihn trägt – die Startseite ist der
// Einstieg, die Modulseiten beantworten die Detailfrage.
type WorkflowStep = { icon: LucideIcon; title: string; description: string; href: string; linkLabel: string };
const STEPS: WorkflowStep[] = [
  { icon: ClipboardList, title: "Projekt erstellen und organisieren", description: "Auftrag, Baustelle und Leistungen anlegen – auf Wunsch vorbefüllt aus der DB-Leistungsanfrage oder einer GAEB-Datei.", href: "/produkt/projektplanung-disposition", linkLabel: "Projektplanung & Disposition" },
  { icon: CalendarRange, title: "Mitarbeiter, Fahrzeuge und Ressourcen planen", description: "Personal und Fahrzeuge auf der Plantafel disponieren – Doppelbelegungen und Abwesenheiten meldet das System.", href: "/produkt/kalender-einsatzuebersicht", linkLabel: "Digitale Plantafel" },
  { icon: Send, title: "Einsätze bereitstellen", description: "Der aktuelle Plan steht für alle Berechtigten bereit, Nachunternehmer sehen ihre Einsätze im eigenen Portal.", href: "/produkt/mitarbeiterverwaltung", linkLabel: "Mitarbeiterverwaltung" },
  { icon: FileCheck2, title: "Arbeitszeiten und Leistungen dokumentieren", description: "Stunden mit Funktion und Fahrtzeit erfassen, Lieferscheine und Nachweise am Projekt ablegen.", href: "/produkt/zeiterfassung-stundenzettel", linkLabel: "Zeiterfassung & Stundennachweise" },
  { icon: Receipt, title: "Nachweise prüfen und Projekte abrechnen", description: "Stunden freigeben, die Abrechnung als PDF ausgeben und Buchungsdaten an DATEV übergeben.", href: "/produkt/rechnungsstellung", linkLabel: "Projektabrechnung" },
  { icon: BarChart3, title: "Wirtschaftlichkeit auswerten", description: "Kosten, Ergebnis und Marge je Projekt – laufend statt erst nach der Schlussrechnung.", href: "/produkt/reports-auswertungen", linkLabel: "Reports & Projektcontrolling" },
];
const CARD_CLASSES = "relative flex h-full flex-col rounded-3xl border border-slate-900/8 bg-white/80 p-5 sm:p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft";
const ICON_TILE_CLASSES = "flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft-sm";
const NODE_CLASSES = "wf-node h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[active=true]:scale-125 data-[active=true]:border-brand-600 data-[active=true]:bg-brand-600 data-[active=true]:shadow-[0_0_0_6px_rgba(24,35,253,0.12)]";

export default function WorkflowSection() {
  return <section aria-labelledby="workflow-heading" className="bg-[#f3f6fb] py-16 md:py-28"><div className="page-container"><SectionHeading eyebrow="So arbeitet Gleistrix" title={<span id="workflow-heading">Vom Auftrag bis zur Auswertung – ein durchgängiger Prozess</span>} description="Jeder Schritt baut auf dem vorherigen auf. Keine Medienbrüche, kein Abtippen, keine Doppelpflege." /><MediaFrame src="/media/start/workflow.webp" alt="Ein leuchtendes Gleis verbindet Büroarbeitsplatz, Strecke und Baustelle" ratio="banner" caption="Ein Vorgang, sechs Schritte – dieselben Daten" sizes="(min-width: 768px) 1200px, 100vw" className="mt-10 md:mt-14" /></div><WorkflowTimeline stepCount={STEPS.length}>{STEPS.map((step, index) => { const Icon = step.icon; return <li key={step.title} data-step aria-current={index === 0 ? "step" : undefined} style={{ "--i": index } as CSSProperties} className="wf-col relative h-full max-md:w-[calc(100vw-2rem)] max-md:shrink-0 max-md:snap-center"><span aria-hidden data-node data-active={index === 0} className={NODE_CLASSES} /><div data-scale className="h-full"><article className={CARD_CLASSES}><div className="flex items-center gap-3"><span data-icon className={ICON_TILE_CLASSES}><Icon className="h-5 w-5" /></span><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Schritt {index + 1}</span></div><h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.description}</p><Link href={step.href} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20">{step.linkLabel}<ArrowRight aria-hidden className="h-4 w-4" /></Link></article></div></li>; })}</WorkflowTimeline></section>;
}
