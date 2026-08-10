"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";

import ModuleVisual from "./ModuleVisual";
import type { LandingModule } from "@/types/landing";

/**
 * Modul-Karussell der Startseite.
 *
 * Bewusst ohne Karussell-Bibliothek: die Spur ist ein Scroll-Container mit
 * CSS-Scroll-Snap. Damit funktionieren Wischen, Trackpad und Tastatur ohne
 * eigenen Code, und ohne JavaScript stehen trotzdem alle Folien zur Verfügung.
 * JavaScript steuert nur Pfeile, Punkte und die Position im Zähler.
 */
export default function ModulesCarousel({ modules }: { modules: LandingModule[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Aktive Folie aus der Scrollposition rechnen: eine Division je Scroll-
  // Ereignis ist billiger als ein Beobachter je Folie und liefert auch dann
  // einen eindeutigen Wert, wenn zwei Folien gleichzeitig zu sehen sind.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const step = track.scrollWidth / modules.length;
      setActive(Math.min(modules.length - 1, Math.round(track.scrollLeft / step)));
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    return () => track.removeEventListener("scroll", update);
  }, [modules.length]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.querySelectorAll<HTMLElement>("[data-slide]")[index];
    if (!track || !slide) return;

    // scrollIntoView würde zusätzlich die Seite vertikal verschieben.
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, []);

  const isFirst = active === 0;
  const isLast = active === modules.length - 1;

  return (
    <div
      className="mt-12 md:mt-16"
      role="group"
      aria-roledescription="Karussell"
      aria-label="Module von Gleistrix"
    >
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Modulfolien – mit den Pfeiltasten wechseln"
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          // Ohne preventDefault scrollt der Browser die Spur zusätzlich um
          // seine eigene Schrittweite – die Folie käme zweimal in Bewegung.
          event.preventDefault();
          if (event.key === "ArrowRight" && !isLast) goTo(active + 1);
          if (event.key === "ArrowLeft" && !isFirst) goTo(active - 1);
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8fafc] [&::-webkit-scrollbar]:hidden"
      >
        {modules.map((module, index) => (
          <article
            key={module.id}
            data-slide
            role="group"
            aria-roledescription="Folie"
            aria-label={`${index + 1} von ${modules.length}: ${module.title}`}
            className="shadow-soft-sm grid w-full shrink-0 snap-center items-center gap-8 rounded-3xl border border-slate-900/8 bg-white p-6 sm:p-8 md:grid-cols-2 md:gap-12 md:p-10"
          >
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {module.title}
              </h3>
              {module.description ? (
                <p className="mt-3 leading-relaxed text-slate-500">{module.description}</p>
              ) : null}

              {module.bullets.length > 0 ? (
                <ul className="mt-5 space-y-2.5">
                  {module.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {module.href ? (
                <Link
                  href={module.href}
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
                >
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : null}
            </div>

            <div className="min-w-0">
              {module.imageSrc ? (
                <div className="shadow-soft relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-900/8 bg-white">
                  <Image
                    src={module.imageSrc}
                    alt={module.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ModuleVisual variant={module.visual} />
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm tabular-nums text-slate-400">
          <span className="font-semibold text-slate-900">
            {String(active + 1).padStart(2, "0")}
          </span>
          {" / "}
          {String(modules.length).padStart(2, "0")}
        </p>

        <ul className="flex flex-1 items-center justify-center gap-2">
          {modules.map((module, index) => (
            <li key={module.id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Zu Folie ${index + 1}: ${module.title}`}
                aria-current={index === active ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active ? "w-8 bg-indigo-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={isFirst}
            aria-label="Vorheriges Modul"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-900/10 disabled:hover:text-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={isLast}
            aria-label="Nächstes Modul"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-900/10 disabled:hover:text-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
