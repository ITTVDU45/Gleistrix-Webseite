"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/data/heroSlides";
import FoxShowcase from "./FoxShowcase";

const ROTATE_INTERVAL_MS = 5000;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Breitestes Wort reserviert den Platz, damit die Headline nicht springt */
const LONGEST_WORD = HERO_SLIDES.reduce(
  (longest, slide) => (slide.word.length > longest.length ? slide.word : longest),
  ""
);

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  // Automatischer Wechsel; manuelle Auswahl setzt den Timer zurück.
  // Versteckte Tabs rotieren nicht weiter (Akku + kein Sprung beim Zurückkehren).
  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setActive((current) => (current + 1) % HERO_SLIDES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion, active]);

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE_OUT },
        };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white pb-16 pt-32 md:pb-20 md:pt-40"
    >
      {/* Weicher Hintergrund-Verlauf */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent)]" />
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)]" />
        <div className="absolute -right-32 top-64 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.10),transparent)]" />
      </div>

      <div className="page-container relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Linke Seite: rotierende Headline + CTA */}
          <div className="text-center lg:text-left">
            <motion.div {...fadeUp(0)}>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-soft-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                ERP-Plattform für den Bahnbetrieb
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl"
              {...fadeUp(0.08)}
            >
              <span className="block leading-[1.12]">Du sparst dir</span>
              {/* Rotierendes Wort – dekorativ, Screenreader lesen den sr-only-Satz */}
              <span aria-hidden className="relative mt-3 inline-block leading-none">
                <span className="invisible inline-block whitespace-nowrap rounded-2xl px-5 py-2">
                  {LONGEST_WORD}
                </span>
                {HERO_SLIDES.map((s, i) => (
                  <motion.span
                    key={s.id}
                    initial={false}
                    animate={
                      i === active
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: shouldReduceMotion ? 0 : 18 }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.45,
                      ease: EASE_OUT,
                    }}
                    className="absolute left-0 top-0 inline-block whitespace-nowrap rounded-2xl bg-indigo-100/80 px-5 py-2 text-indigo-700 max-lg:left-1/2 max-lg:-translate-x-1/2"
                  >
                    {s.word}
                  </motion.span>
                ))}
              </span>
              <span className="sr-only">
                Zettelchaos, Doppelarbeit, Papierkram und Planungschaos – Gleistrix
                ist die ERP-Plattform für alle Gewerke im Bahnbau.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0"
              {...fadeUp(0.16)}
            >
              Gleistrix macht aus jedem Auftrag einen fertig vorbereiteten Einsatz –
              mit Personal, Technik, Dokumentation und Abrechnung in einer Plattform.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              {...fadeUp(0.24)}
            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-indigo-600 px-7 text-base text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                <Link href="/demo-buchen">Demo anfragen</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-slate-200 bg-white/70 px-7 text-base text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
              >
                <Link href="#module">Module entdecken</Link>
              </Button>
            </motion.div>

            {/* Gewerke-Auswahl: steuert Headline-Wort und Maskottchen */}
            <motion.div
              className="mt-9 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
              {...fadeUp(0.32)}
            >
              <span className="mr-1 text-xs font-medium text-slate-400">
                Gemacht für
              </span>
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all " +
                    (i === active
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-soft-sm"
                      : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300 hover:text-slate-700")
                  }
                >
                  {s.audienceShort}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Rechte Seite: animiertes Maskottchen */}
          <motion.div {...fadeUp(0.2)}>
            <FoxShowcase active={active} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
