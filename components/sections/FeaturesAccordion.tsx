"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type AccordionItem = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
};

const ITEMS: AccordionItem[] = [
  {
    id: "mitarbeiter",
    title: "Mitarbeiterverwaltung",
    subtitle: "Anlegen, Abwesenheiten, Qualifikationen.",
    imageSrc: "/Sicherungspersonal%20gleis.png",
  },
  {
    id: "technik",
    title: "Fahrzeug & Technik",
    subtitle: "Zentral erfassen, warten, Einsätzen zuordnen.",
    imageSrc: "/Fahrzeugplanung.png",
  },
  {
    id: "projekte",
    title: "Projektplanung & Dispo",
    subtitle: "Ressourcen präzise zuweisen & steuern.",
    imageSrc: "/Einsatzvorbereitung%20&%20Logistik.png",
  },
  {
    id: "kalender",
    title: "Kalender & Schichten",
    subtitle: "Alle Termine live in der App.",
    imageSrc: "/Standortbezogene%20Disposition.png",
  },
  {
    id: "rechnungen",
    title: "Rechnungsstellung",
    subtitle: "Schnell, korrekt, optional automatisiert.",
    imageSrc: "/Rechnungen.png",
  },
  {
    id: "dokumente",
    title: "Dokumentenmanagement",
    subtitle: "Zentral, teilbar, revisionssicher.",
    imageSrc: "/Lösungen.png",
  },
  {
    id: "zeit",
    title: "Zeiterfassung & Zettel",
    subtitle: "Digital, mobil, prüffähig.",
    imageSrc: "/Zeiterfassung.png",
  },
  {
    id: "reports",
    title: "Reports & Forecasts",
    subtitle: "Echtzeitdaten für klare Entscheidungen.",
    imageSrc: "/globe.svg",
  },
];

export default function FeaturesAccordion() {
  const [openId, setOpenId] = useState<string | null>(ITEMS[0]?.id ?? null);

  const columns: AccordionItem[][] = [
    ITEMS.filter((_, idx) => idx % 2 === 0),
    ITEMS.filter((_, idx) => idx % 2 === 1),
  ];

  const hrefById: Record<string, string> = {
    mitarbeiter: "/produkt/mitarbeiterverwaltung",
    technik: "/produkt/fahrzeug-technik",
    projekte: "/produkt/projektplanung-disposition",
    kalender: "/produkt/kalender-einsatzuebersicht",
    rechnungen: "/produkt/rechnungsstellung",
    dokumente: "/produkt/dokumentenmanagement",
    zeit: "/produkt/zeiterfassung-stundenzettel",
    reports: "/produkt/reports-auswertungen",
  };

  return (
    <div className="mx-auto max-w-6xl md:grid md:grid-cols-2 md:gap-5">
      {columns.map((col, colIdx) => (
        <ul key={colIdx} className="space-y-3 md:space-y-4">
          {col.map((it, itemIdx) => {
          const isOpen = openId === it.id;
            // subtle gradient accent for the dot
            const gradients = [
              "bg-gradient-to-br from-sky-400/40 via-blue-500/40 to-violet-600/40",
              "bg-gradient-to-br from-rose-400/40 via-fuchsia-500/40 to-violet-600/40",
              "bg-gradient-to-br from-amber-400/40 via-orange-500/40 to-pink-500/40",
              "bg-gradient-to-br from-emerald-400/40 via-teal-500/40 to-cyan-500/40",
            ];
            const activeGradient = gradients[(colIdx + itemIdx) % gradients.length];
            return (
              <li key={it.id} className="rounded-[36px] ring-1 ring-white/10 bg-white/5 backdrop-blur overflow-hidden">
              <button
                type="button"
                className="w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`panel-${it.id}`}
                onClick={() => setOpenId((p) => (p === it.id ? null : it.id))}
              >
                <h3 className="text-white text-lg md:text-2xl font-semibold tracking-tight">{it.title}</h3>
                <div
                  className={`relative h-12 w-12 md:h-14 md:w-14 rounded-full grid place-items-center ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 ${
                    isOpen ? `${activeGradient} shadow-[0_0_28px_rgba(99,102,241,0.35)] scale-105` : "bg-white/10 scale-100"
                  }`}
                  aria-hidden
                >
                  <Plus className="h-6 w-6 text-white" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`panel-${it.id}`}
                    key={it.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-3 md:px-4 pb-5 mt-2">
                      <div className="rounded-3xl ring-1 ring-white/10 bg-white/5 backdrop-blur p-5 md:p-7 text-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5"
                          >
                            <Image src={it.imageSrc} alt={it.title} fill className="object-cover" />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="min-w-0 break-words"
                          >
                            <h4 className="sr-only">{it.title}</h4>
                            <p className="text-white/85 mt-1 md:mt-2 text-base md:text-lg max-w-prose">{it.subtitle}</p>
                            <div className="mt-4">
                              <Link href={hrefById[it.id] ?? "/produkt#features"} aria-label={`${it.title} – Mehr erfahren`}>
                                <Button className="bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
                                  Mehr erfahren
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}


