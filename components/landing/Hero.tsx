"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/data/heroSlides";
import FoxShowcase from "./FoxShowcase";

const ROTATE_INTERVAL_MS = 5000;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const LONGEST_WORD = HERO_SLIDES.reduce((longest, slide) => (slide.word.length > longest.length ? slide.word : longest), "");

function nextRotationIndex(current: number): number {
  const total = HERO_SLIDES.length;
  for (let step = 1; step <= total; step++) {
    const candidate = (current + step) % total;
    if (HERO_SLIDES[candidate].inRotation) return candidate;
  }
  return current;
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setActive((current) => nextRotationIndex(current));
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion, active]);

  // Bewusst keine Einblend-Animation über dem Falz mehr.
  //
  // Die frühere `fadeUp`-Staffelung setzte initial `opacity: 0`. Das steht so
  // auch im Server-HTML – und Chrome zählt unsichtbare Elemente nicht für den
  // Largest Contentful Paint. Der Hero konnte deshalb erst erscheinen, wenn das
  // Bundle geladen, React hydriert und framer-motion die Animation gestartet
  // hatte: gemessen 1364 ms Renderverzögerung bei 45 ms Serverantwort.
  //
  // Die rotierenden Wörter behalten ihre Animation: sie laufen mit
  // `initial={false}`, werden also bereits im Server-HTML sichtbar angelegt und
  // verzögern nichts. Wer `prefers-reduced-motion` gesetzt hat, sah den Hero
  // ohnehin schon ohne Einblendung – die Gestaltung trägt diesen Zustand also
  // bereits.

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-white pb-14 pt-28 sm:pb-16 sm:pt-32 md:pb-20 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[440px] w-[700px] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent)] sm:h-[560px] sm:w-[900px]" />
        <div className="absolute -left-48 top-32 h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)] sm:-left-40 sm:h-[420px] sm:w-[420px]" />
      </div>

      <div className="page-container relative">
        <div className="grid min-w-0 items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0 text-center lg:text-left">
            <div>
              <span className="glass inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold leading-5 text-slate-600 shadow-soft-sm sm:px-4 sm:text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                ERP-Plattform für den Bahnbetrieb
              </span>
            </div>

            <h1 id="hero-heading" className="mt-5 min-w-0 text-[2.05rem] font-bold leading-[1.08] tracking-tight text-slate-900 min-[375px]:text-[2.3rem] sm:mt-6 sm:text-5xl xl:text-6xl">
              <span className="block">Du sparst dir</span>
              <span aria-hidden className="relative mx-auto mt-3 block w-full max-w-full leading-none lg:mx-0">
                <span className="invisible inline-flex max-w-full rounded-2xl px-3 py-2 text-[0.82em] sm:px-5 sm:text-[1em]">{LONGEST_WORD}</span>
                {HERO_SLIDES.map((s, i) => (
                  <motion.span
                    key={s.id}
                    initial={false}
                    animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT }}
                    className="absolute inset-x-0 top-0 mx-auto w-fit max-w-full rounded-2xl bg-indigo-100/80 px-3 py-2 text-[0.82em] leading-[1.05] text-indigo-700 sm:px-5 sm:text-[1em] lg:mx-0"
                  >
                    <span className="block max-w-full break-words">{s.word}</span>
                  </motion.span>
                ))}
              </span>
              {/* Beginnt mit dem Thema, nicht mit der Problemaufzählung: Dieser
                  Satz ist der crawlbare Teil der H1, weil das rotierende Wort
                  aria-hidden ist. Vorher stand das wichtigste Wort der Seite an
                  letzter Stelle ihrer wichtigsten Überschrift. */}
              <span className="sr-only">ERP Software für Bahnbau: Gleistrix ist die Plattform für alle Gewerke im Bahnbetrieb und ersetzt Zettelchaos, Doppelarbeit, Papierkram und Planungschaos.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-slate-500 sm:mt-6 sm:text-lg sm:leading-relaxed lg:mx-0">
              Gleistrix macht aus jedem Auftrag einen fertig vorbereiteten Einsatz – mit Personal, Technik, Dokumentation und Abrechnung in einer Plattform.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center lg:justify-start">
              <Button asChild size="lg" className="h-12 w-full rounded-xl bg-indigo-600 px-6 text-sm text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-indigo-500 sm:w-auto sm:px-7 sm:text-base">
                <Link href="/demo-buchen">Demo anfragen</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-xl border-slate-200 bg-white/70 px-6 text-sm text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 sm:w-auto sm:px-7 sm:text-base">
                <Link href="#module">Module entdecken</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9 lg:justify-start">
              <span className="w-full text-center text-xs font-medium text-slate-500 sm:mr-1 sm:w-auto sm:text-left">Gemacht für</span>
              {HERO_SLIDES.map((s, i) => (
                <button key={s.id} type="button" onClick={() => setActive(i)} aria-pressed={i === active} className={"min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all " + (i === active ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-soft-sm" : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300 hover:text-slate-700")}>{s.audienceShort}</button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <FoxShowcase active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
