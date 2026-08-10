"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useConsent } from "@/components/consent/consent-provider";

/**
 * Einwilligungsbanner beim ersten Besuch.
 *
 * "Alle ablehnen" und "Alle akzeptieren" sind bewusst gleich groß, gleich
 * geformt und gleich kontrastreich. Eine hervorgehobene Zustimmung neben einer
 * blassen Ablehnung wäre ein Dark Pattern und macht die Einwilligung
 * angreifbar (Art. 4 Nr. 11 DSGVO, Orientierungshilfe der Datenschutzkonferenz).
 */
export function CookieBanner() {
  const { isBannerVisible, acceptAll, rejectAll, openSettings } = useConsent();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isBannerVisible ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[140] flex justify-center p-3 md:p-5">
          <motion.div
            role="dialog"
            aria-labelledby="cookie-banner-heading"
            aria-describedby="cookie-banner-description"
            initial={reduceMotion ? { opacity: 0 } : { y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 120, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft"
          >
            <div
              aria-hidden
              className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500"
            />

            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-10 md:p-8">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-indigo-600">
                  Datenschutz
                </p>
                <h2
                  id="cookie-banner-heading"
                  className="mt-2 text-lg font-semibold leading-tight text-slate-900 md:text-xl"
                >
                  Wir fragen, bevor wir etwas speichern
                </h2>
                <p
                  id="cookie-banner-description"
                  className="mt-2 text-sm leading-relaxed text-slate-500"
                >
                  Technisch notwendige Speicherungen halten die Website am
                  Laufen. Den Chat-Assistenten und die Terminbuchung laden wir
                  nur, wenn Sie zustimmen – freiwillig und jederzeit widerrufbar.
                  Mehr dazu in der{" "}
                  <Link
                    href="/datenschutz"
                    className="text-slate-700 underline underline-offset-2 transition-colors hover:text-indigo-600"
                  >
                    Datenschutzerklärung
                  </Link>{" "}
                  und im{" "}
                  <Link
                    href="/impressum"
                    className="text-slate-700 underline underline-offset-2 transition-colors hover:text-indigo-600"
                  >
                    Impressum
                  </Link>
                  .
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:w-auto md:flex-col lg:flex-row">
                {/* Gleiche Größe, gleiche Form, gleicher Kontrast: keine der
                    beiden Entscheidungen wird optisch nahegelegt. */}
                <button
                  type="button"
                  onClick={rejectAll}
                  className="h-11 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40 focus-visible:ring-offset-2 sm:flex-1 md:min-w-[168px]"
                >
                  Alle ablehnen
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="h-11 rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 sm:flex-1 md:min-w-[168px]"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={openSettings}
                  className="h-11 rounded-full border border-slate-900/10 px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 sm:flex-1 md:min-w-[168px]"
                >
                  Einstellungen
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
