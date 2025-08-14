"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock4, PlugZap, Tractor, TrafficCone, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

type Tab = {
  key: string;
  label: string;
  heading: string;
  subheading: string;
  bullets: { icon: JSX.Element; text: string }[];
  image: string;
};

const TABS: Tab[] = [
  {
    key: "sich",
    label: "Sicherungsunternehmen",
    heading: "Effizient geplant. Sicher umgesetzt.",
    subheading:
      "Die Komplettlösung für Planung, Disposition und Zeiterfassung in Sicherungsunternehmen.",
    bullets: [
      {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        text:
          "In Sicherungsunternehmen ist eine präzise Einsatzplanung entscheidend – jede Verzögerung oder Fehlabstimmung kann zu unnötigen Kosten, Personalengpässen oder Sicherheitsrisiken führen. Gleistrix vereint alle wichtigen Prozesse in einer Plattform, damit Ihre Trupp- und Schichtplanung reibungslos läuft.",
      },
      {
        icon: <Clock4 className="h-4 w-4 text-sky-600" />,
        text:
          "Optimierte Einsatz- und Schichtplanung: Planen Sie Trupps nach Qualifikationen, Rollen und Fahrzeugverfügbarkeit. Berücksichtigen Sie Einsatzorte, Anfahrtszeiten und gesetzliche Ruhezeiten, um optimale Einsatzpläne zu erstellen.",
      },
      {
        icon: <Clock4 className="h-4 w-4 text-sky-600" />,
        text:
          "Digitale Rückmeldungen in Echtzeit: Truppführer und Mitarbeitende erfassen ihre Zeiten direkt vor Ort – inklusive Arbeitsbeginn, Pausen und Einsatzende. Änderungen oder Ausfälle werden sofort im System sichtbar, sodass Sie schnell reagieren können.",
      },
      {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        text:
          "Mit Gleistrix sparen Sie Zeit bei der Organisation, verhindern Über- oder Unterbesetzungen und behalten Fahrzeuge, Material und Personal stets im Blick – transparent, aktuell und sicher.",
      },
    ],
    image: "/Sicherungsunternehmen.png",
  },
  {
    key: "gleis",
    label: "Gleisbauunternehmen",
    heading: "Maschinen, Trupps und Zeiten im Takt.",
    subheading:
      "Mit Gleistrix behalten Gleisbauunternehmen jederzeit den Überblick über Personal, Maschinen und Baufortschritte – strukturiert, transparent und in Echtzeit.",
    bullets: [
      {
        icon: <TrafficCone className="h-4 w-4 text-orange-600" />,
        text:
          "Präzise Disposition von Zweiwegebaggern, Gleisbaumaschinen, Trupps und Geräten für jeden Bauabschnitt. Dank zentraler Ressourcenplanung sehen Sie sofort Verfügbarkeiten und vermeiden Engpässe frühzeitig.",
      },
      {
        icon: <Clock4 className="h-4 w-4 text-sky-600" />,
        text:
          "Schicht- und Einsatzübersicht zeigt auf einen Blick, wer wann wo im Einsatz ist – inklusive Qualifikationen, Rollenverteilung und aktueller Rückmeldungen von der Baustelle.",
      },
      {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        text:
          "Echtzeit-Datenübertragung ermöglicht es Bauleitern und Disponenten, sofort auf Änderungen zu reagieren, Ressourcen umzuplanen und den Baufortschritt nahtlos zu dokumentieren.",
      },
      {
        icon: <TrafficCone className="h-4 w-4 text-orange-600" />,
        text: "Häufige Probleme, die Gleistrix löst: Fehlende Übersicht über verfügbare Maschinen und Trupps.",
      },
      {
        icon: <TrafficCone className="h-4 w-4 text-orange-600" />,
        text: "Kurzfristige Umplanungen aufgrund von Ausfällen oder Störungen – schnell und koordiniert bewältigen.",
      },
      {
        icon: <TrafficCone className="h-4 w-4 text-orange-600" />,
        text: "Kommunikationslücken zwischen Baustelle und Disposition schließen durch digitale Rückmeldungen.",
      },
      {
        icon: <TrafficCone className="h-4 w-4 text-orange-600" />,
        text: "Zeitverlust durch manuelle Abstimmungen und Excel-Listen reduzieren durch automatisierte Workflows.",
      },
      {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        text:
          "Gleistrix sorgt dafür, dass Maschinen, Trupps und Zeiten immer im Takt bleiben – für eine reibungslose, termingerechte Umsetzung Ihrer Gleisbauprojekte.",
      },
    ],
    image: "/Gleisbauunternehmen.png",
  },
  // Neuer Tab: Auftragsbasierte Dienstleister
  {
    key: "auftrag",
    label: "Auftragsbasierte Dienstleister",
    heading: "Von der Anfrage bis zur Abrechnung – alles in einem Fluss.",
    subheading:
      "Gleistrix kann auch in anderen Branchen mit auftragsbasierten Dienstleistungen eingesetzt werden: Anfrage → Angebot → Auftrag & Schichtplanung → Mitarbeitereinteilung → Zeiterfassung → unterschriebener Stundenzettel → Abrechnung.",
    bullets: [
      { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, text: "Flexible Auftragsverwaltung" },
      { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, text: "Integrierte Angebotserstellung" },
      { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, text: "Einsatzplanung und ‑steuerung" },
      { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, text: "Automatisierte Lohnabrechnung" },
      { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, text: "Effiziente Rechnungsstellung" },
    ],
    image: "/globe.svg",
  },
  // removed: ECM / Werkstätten
  {
    key: "db",
    label: "Subunternehmen der DB",
    heading: "DB‑Aufträge normgerecht und digital abbilden.",
    subheading: "Digitale Struktur & automatisierte Prozesse für Nachweispflichten.",
    bullets: [
      { icon: <FileCheck2 className="h-4 w-4 text-purple-600" />, text: "Digitale Dokumentation & Schnittstellen für Auftraggebermeldungen" },
      { icon: <Clock4 className="h-4 w-4 text-sky-600" />, text: "Echtzeit‑Zeiterfassung & DSGVO‑konforme Nachweise" },
    ],
    image: "/next.svg",
  },
];

export default function ZielgruppenSection() {
  const [active, setActive] = useState<string>(TABS[0].key);
  const current = TABS.find((t) => t.key === active)!;

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-gray-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="page-container relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white">Zielgruppen</h2>
          <p className="text-white/80">Für wen ist Gleistrix gemacht?</p>
        </div>

        {/* Tabs header as animated gradient grid */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 overflow-x-hidden">
          {TABS.map((t) => (
            <motion.button
              key={t.key}
              onClick={() => setActive(t.key)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative overflow-hidden rounded-xl p-3 text-sm ring-1 ring-white/10 transition-shadow text-left shadow-sm bg-white/5"
              aria-selected={active === t.key}
            >
              {/* gradient highlight for active tab */}
              {active === t.key && (
                <motion.span
                  layoutId="tabGradient"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400 to-violet-600"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {/* soft gradient on hover for inactive */}
              {active !== t.key && (
                <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/10 to-violet-600/10 opacity-0 group-hover:opacity-100" />
              )}
               <span className={"relative z-10 font-medium " + (active === t.key ? "text-white" : "text-white/80")}>{t.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Active content */}
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 grid gap-6 md:grid-cols-2 items-start"
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-sm">
            <Image src={current.image} alt={current.label} fill className="object-contain p-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-white">{current.heading}</h3>
            <p className="text-white/80 mb-4">{current.subheading}</p>
            <ul className="space-y-3">
              {current.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  {b.icon}
                  <span className="text-white/90">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        <div className="mt-8 text-center">
          <a href="/branchen">
            <Button className="bg-gradient-to-tr from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
              Mehr zu den Branchen
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}


