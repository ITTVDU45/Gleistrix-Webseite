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
        <div className="absolute -top-40 left-1/2 h-[440px] w-[700px] max-w-[160vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(51,98,255,0.14),transparent)] sm:h-[560px] sm:w-[900px]" />
        <div className="absolute -left-48 top-32 h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(9,35,202,0.10),transparent)] sm:-left-40 sm:h-[420px] sm:w-[420px]" />
      </div>

      <div className="page-container relative">
        <div className="grid min-w-0 items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0 text-center lg:text-left">
            <div>
              <span className="glass inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold leading-5 text-slate-600 shadow-soft-sm sm:px-4 sm:text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                Für Sicherungs-, Gleisbau- und Bahnunternehmen
              </span>
            </div>

            {/* Die H1 steht fest und vollständig sichtbar im Server-HTML.
                Vorher lagen die rotierenden Wörter in der H1 – aria-hidden
                blendet sie für Screenreader aus, nicht für Google. Im
                ausgelieferten HTML hieß die Überschrift deshalb "Du sparst dir
                Planungschaos Zettelchaos Doppelarbeit …". Die Rotation lebt
                jetzt in der Zeile darunter und bleibt, was sie ist: Gestaltung. */}
            <h1 id="hero-heading" className="mt-5 min-w-0 text-balance text-[2rem] font-bold leading-[1.08] tracking-tight text-slate-900 min-[375px]:text-[2.2rem] sm:mt-6 sm:text-5xl xl:text-[3.5rem]">
              ERP-Software für Bahnbau und Bahndienstleister
            </h1>

            <p className="mt-4 min-w-0 text-xl font-semibold leading-tight tracking-tight text-slate-700 sm:mt-5 sm:text-2xl xl:text-3xl">
              <span className="sr-only">Du sparst dir Zettelchaos, Doppelarbeit, Papierkram und Planungschaos.</span>
              <span aria-hidden className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
                <span>Du sparst dir</span>
                <span className="relative inline-block max-w-full leading-none">
                  <span className="invisible inline-flex max-w-full rounded-xl px-3 py-1.5">{LONGEST_WORD}</span>
                  {HERO_SLIDES.map((s, i) => (
                    <motion.span
                      key={s.id}
                      initial={false}
                      animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: EASE_OUT }}
                      className="absolute left-0 top-0 w-fit max-w-full rounded-xl bg-brand-100/80 px-3 py-1.5 leading-none text-brand-700"
                    >
                      <span className="block max-w-full break-words">{s.word}</span>
                    </motion.span>
                  ))}
                </span>
              </span>
            </p>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-slate-500 sm:mt-6 sm:text-lg sm:leading-relaxed lg:mx-0">
              Gleistrix verbindet Projektmanagement, Einsatzplanung, Mitarbeiter, Fahrzeuge, Dokumentation und Abrechnung in einer zentralen Software für Bahndienstleister.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center lg:justify-start">
              <Button asChild size="lg" className="h-12 w-full rounded-xl bg-brand-600 px-6 text-sm text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-500 sm:w-auto sm:px-7 sm:text-base">
                <Link href="/demo-buchen">Demo anfragen</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-xl border-slate-200 bg-white/70 px-6 text-sm text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 sm:w-auto sm:px-7 sm:text-base">
                <Link href="#module">Module entdecken</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9 lg:justify-start">
              <span className="w-full text-center text-xs font-medium text-slate-500 sm:mr-1 sm:w-auto sm:text-left">Gemacht für</span>
              {HERO_SLIDES.map((s, i) => (
                <button key={s.id} type="button" onClick={() => setActive(i)} aria-pressed={i === active} className={"min-h-9 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all " + (i === active ? "border-brand-200 bg-brand-50 text-brand-700 shadow-soft-sm" : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300 hover:text-slate-700")}>{s.audienceShort}</button>
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
