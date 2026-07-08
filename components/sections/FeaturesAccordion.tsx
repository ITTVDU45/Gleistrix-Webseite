"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

type AccordionItem = {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
};

const ITEMS: AccordionItem[] = [
  {
    id: "mitarbeiter",
    title: "Mitarbeiterverwaltung",
    subtitle: "Anlegen, Abwesenheiten, Qualifikationen – zentral und mit Fristenwarnung.",
    imageSrc: "/Sicherungspersonal%20gleis.png",
    href: "/produkt/mitarbeiterverwaltung",
  },
  {
    id: "technik",
    title: "Fahrzeug & Technik",
    subtitle: "Zentral erfassen, warten und Einsätzen zuordnen – inklusive Prüffristen.",
    imageSrc: "/Fahrzeugplanung.png",
    href: "/produkt/fahrzeug-technik",
  },
  {
    id: "projekte",
    title: "Projektplanung & Dispo",
    subtitle: "Ressourcen präzise zuweisen und steuern – ohne Doppelbelegungen.",
    imageSrc: "/Einsatzvorbereitung%20&%20Logistik.png",
    href: "/produkt/projektplanung-disposition",
  },
  {
    id: "kalender",
    title: "Kalender & Schichten",
    subtitle: "Alle Termine live in der App – jederzeit aktuell.",
    imageSrc: "/Standortbezogene%20Disposition.png",
    href: "/produkt/kalender-einsatzuebersicht",
  },
  {
    id: "rechnungen",
    title: "Rechnungsstellung",
    subtitle: "Schnell, korrekt, optional automatisiert – bis zur X-Rechnung.",
    imageSrc: "/Rechnungen.png",
    href: "/produkt/rechnungsstellung",
  },
  {
    id: "dokumente",
    title: "Dokumentenmanagement",
    subtitle: "Zentral, teilbar und revisionssicher archiviert.",
    imageSrc: "/Lösungen.png",
    href: "/produkt/dokumentenmanagement",
  },
  {
    id: "zeit",
    title: "Zeiterfassung & Zettel",
    subtitle: "Digital, mobil und prüffähig – direkt mit Projekten verknüpft.",
    imageSrc: "/Zeiterfassung.png",
    href: "/produkt/zeiterfassung-stundenzettel",
  },
  {
    id: "reports",
    title: "Reports & Forecasts",
    subtitle: "Echtzeitdaten für klare Entscheidungen und transparente Abläufe.",
    imageSrc: "/reports.png",
    href: "/produkt/reports-auswertungen",
  },
];

export default function FeaturesAccordion() {
  const [openId, setOpenId] = useState<string | null>(ITEMS[0]?.id ?? null);
  const shouldReduceMotion = useReducedMotion();

  const columns: AccordionItem[][] = [
    ITEMS.filter((_, index) => index % 2 === 0),
    ITEMS.filter((_, index) => index % 2 === 1),
  ];

  return (
    <div className="mx-auto max-w-6xl md:grid md:grid-cols-2 md:gap-5">
      {columns.map((column, columnIndex) => (
        <ul key={columnIndex} className="space-y-3 md:space-y-4">
          {column.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition-shadow hover:shadow-soft"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  aria-expanded={isOpen}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                >
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                    {item.title}
                  </h3>
                  <span
                    aria-hidden
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      isOpen ? "rotate-45 bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    <Plus className="h-5 w-5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`panel-${item.id}`}
                      key={item.id}
                      initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                      animate={shouldReduceMotion ? undefined : { height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-3 pb-4 md:px-4">
                        <div className="rounded-2xl border border-slate-900/6 bg-[#f8fafc] p-4 md:p-5">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-slate-900/8">
                            <Image
                              src={item.imageSrc}
                              alt={item.title}
                              fill
                              sizes="(min-width: 768px) 40vw, 90vw"
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-slate-500">{item.subtitle}</p>
                          <Link
                            href={item.href}
                            aria-label={`${item.title} – Mehr erfahren`}
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
                          >
                            Mehr erfahren
                            <ArrowRight className="h-4 w-4" />
                          </Link>
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
