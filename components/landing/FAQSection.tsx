"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

type FAQ = {
  question: string;
  answer: string;
};

const FAQS: FAQ[] = [
  {
    question: "Für wen ist Gleistrix geeignet?",
    answer:
      "Gleistrix richtet sich an Bahndienstleister jeder Größe: Sicherungsunternehmen (SIPO), Gleisbauunternehmen, Subunternehmer und Dienstleister rund um Bahninfrastruktur. Vom Zwei-Mann-Betrieb bis zum Unternehmen mit mehreren Standorten.",
  },
  {
    question: "Welche Module sind enthalten?",
    answer:
      "Projektmanagement, Plantafel & Einsatzplanung, Mitarbeiter- und Fahrzeugverwaltung, Dokumentenmanagement, Lagerverwaltung sowie Abrechnung mit vorbereitender Buchhaltung. KI-Agenten lassen sich optional zuschalten.",
  },
  {
    question: "Können bestehende Prozesse abgebildet werden?",
    answer:
      "Ja. Gleistrix wird auf deine Abläufe eingerichtet – von der Schichtplanung über Freigabeprozesse bis zu Abrechnungszyklen. In der Demo schauen wir uns deine konkreten Prozesse gemeinsam an.",
  },
  {
    question: "Gibt es Rollen und Berechtigungen?",
    answer:
      "Ja. Jede Rolle – Disposition, Projektleitung, Monteur, Backoffice, Geschäftsführung – sieht genau die Daten und Funktionen, die sie braucht. Berechtigungen sind pro Modul und Projekt steuerbar.",
  },
  {
    question: "Können Dokumente und Abrechnungen verwaltet werden?",
    answer:
      "Ja. Dokumente liegen revisionssicher in der Projektakte, mit Versionen und Freigaben. Erfasste Leistungen und Stunden fließen direkt in Rechnungsentwürfe – inklusive sauberer Übergabe an die Buchhaltung.",
  },
  {
    question: "Sind KI-Agenten optional?",
    answer:
      "Ja, vollständig. Alle KI-Agenten – vom LV-Agenten bis zum Abrechnungsagenten – lassen sich pro Unternehmen aktivieren oder deaktivieren. Gleistrix funktioniert auch komplett ohne KI-Funktionen.",
  },
];

const VISIBLE_COUNT = 3;
// Kräftige Ease-out-Kurve für Ein-/Austritte (Emil Kowalski).
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export default function FAQSection() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = FAQS.length;

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + count) % count);
  };

  const jumpTo = (index: number) => {
    setDirection(index >= active ? 1 : -1);
    setActive(index);
  };

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, k) => (active + k) % count);

  const cardVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * 40,
      scale: shouldReduceMotion ? 1 : 0.96,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * -40,
      scale: shouldReduceMotion ? 1 : 0.96,
    }),
  };

  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.5, bounce: 0.15 };

  return (
    <section aria-labelledby="faq-heading" className="bg-white py-20 md:py-28">
      <div className="page-container">
        {/* Kopf: Titel links, Text + Navigation rechts */}
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
              FAQ
            </span>
            <h2
              id="faq-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
            >
              Häufige <span className="text-gradient-accent">Fragen</span>
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="md:flex md:flex-col md:items-end">
            <p className="max-w-md text-base leading-relaxed text-slate-500 md:text-right">
              Antworten auf die häufigsten Fragen zu Einführung, Modulen, Rollen und dem
              Betrieb von Gleistrix.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Vorherige Frage"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Nächste Frage"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white transition-all duration-200 hover:bg-slate-800 active:scale-95"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </Reveal>
        </div>

        {/* Karten */}
        <ul className="mt-12 flex flex-col gap-4 md:mt-16 md:flex-row md:items-stretch">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            {visible.map((faqIndex, position) => {
              const faq = FAQS[faqIndex];
              const isExpanded = position === 0;

              return (
                <motion.li
                  key={faq.question}
                  layout
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    layout: layoutTransition,
                    duration: shouldReduceMotion ? 0 : 0.4,
                    ease: EASE_OUT,
                  }}
                  style={{ flexGrow: isExpanded ? 2.4 : 1, flexBasis: 0 }}
                  className="min-w-0"
                >
                  {isExpanded ? (
                    <div className="flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-7 shadow-soft ring-1 ring-white/10 md:min-h-[380px] md:p-9">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold tabular-nums text-white/60">
                          {String(faqIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
                          Antwort
                        </span>
                      </div>
                      <div>
                        <motion.h3
                          layout="position"
                          className="text-xl font-semibold leading-snug text-white md:text-2xl"
                        >
                          {faq.question}
                        </motion.h3>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={faq.question}
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.12 }}
                            className="mt-4 text-sm leading-relaxed text-indigo-100/90 md:text-base"
                          >
                            {faq.answer}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => jumpTo(faqIndex)}
                      className="group flex h-full min-h-[160px] w-full flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-7 text-left transition-colors duration-200 hover:border-slate-300 hover:bg-slate-100 md:min-h-[380px] md:p-8"
                    >
                      <span className="text-sm font-bold tabular-nums text-slate-300 transition-colors group-hover:text-slate-400">
                        {String(faqIndex + 1).padStart(2, "0")}
                      </span>
                      <motion.h3
                        layout="position"
                        className="text-lg font-semibold leading-snug text-slate-500 transition-colors group-hover:text-slate-700 md:text-xl"
                      >
                        {faq.question}
                      </motion.h3>
                    </button>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
