"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HOME_FAQS, HOME_FAQ_VISIBLE_COUNT, type FAQ } from "@/data/faqs";
import Reveal from "./Reveal";

// Die Fragen liegen in data/faqs.ts, weil app/page.tsx daraus die
// FAQPage-Auszeichnung erzeugt und beide Stellen denselben Wortlaut brauchen.
const FAQS: readonly FAQ[] = HOME_FAQS;

// Geteilt mit app/page.tsx, das nur die ausgelieferten Fragen auszeichnet.
const VISIBLE_COUNT = HOME_FAQ_VISIBLE_COUNT;
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
                    <div className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-7 shadow-soft ring-1 ring-white/10 md:min-h-[380px] md:p-9">
                      {/* Motiv liegt hinter der Antwort, nicht daneben: Die
                          Karten wechseln animiert die Breite, ein zusätzliches
                          Layout-Element würde bei jedem Wechsel springen. */}
                      <Image
                        src="/placeholders/szene-bauueberwachung.svg"
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        unoptimized
                        className="pointer-events-none object-cover opacity-20 mix-blend-luminosity"
                      />
                      <div className="relative flex items-center justify-between">
                        <span className="text-sm font-bold tabular-nums text-white/60">
                          {String(faqIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
                          Antwort
                        </span>
                      </div>
                      <div className="relative">
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
                      <span className="text-sm font-bold tabular-nums text-slate-500 transition-colors group-hover:text-slate-600">
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

        {/* Alle Fragen und Antworten vollständig im DOM.
            Das Karussell zeigt drei Karten und darin nur eine Antwort – die
            übrigen entstehen erst beim Weiterklicken. Für die
            FAQPage-Auszeichnung in app/page.tsx muss aber jede ausgezeichnete
            Frage samt Antwort auch ausgeliefert werden; Markup ohne sichtbare
            Entsprechung gilt bei Google als Spam. Nebeneffekt: Wer einen
            Screenreader nutzt, erreicht damit alle Antworten, ohne sich durch
            das Karussell klicken zu müssen. */}
        <div className="sr-only">
          <h3>Alle Fragen und Antworten im Überblick</h3>
          <dl>
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
