"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Reveal from "./Reveal";

type Tile = {
  src: string;
  name: string;
  role: string;
  xPct: number;
  yPct: number;
  size: number;
};

/**
 * Referenz-Wand: 2×2 gestapelt links, 5 Einzelbilder im Bogen, 2×2 gestapelt rechts (= 13).
 * Die Porträts sind Platzhalter und werden später gegen echte Kundenfotos getauscht.
 */
const TILES: Tile[] = [
  // Links: zwei Spalten mit je zwei gestapelten Bildern
  { src: "/testimonials/p1.jpg", name: "Julia Berger", role: "Leitung Disposition", xPct: 9.4, yPct: 35, size: 82 },
  { src: "/testimonials/p2.jpg", name: "Nina Kaya", role: "SIPO-Koordination", xPct: 9.4, yPct: 66, size: 82 },
  { src: "/testimonials/p3.jpg", name: "Daniel Roth", role: "Bauleiter", xPct: 19.6, yPct: 24, size: 86 },
  { src: "/testimonials/p4.jpg", name: "Felix Braun", role: "Technik", xPct: 19.6, yPct: 55, size: 86 },
  // Mitte: fünf Einzelbilder im Bogen
  { src: "/testimonials/p5.jpg", name: "Peter Hahn", role: "Disponent", xPct: 30, yPct: 39, size: 92 },
  { src: "/testimonials/p6.jpg", name: "Ömer Yilmaz", role: "Monteur", xPct: 40, yPct: 26, size: 88 },
  { src: "/testimonials/p7.jpg", name: "Marc Widmann", role: "Geschäftsführer", xPct: 50, yPct: 33, size: 98 },
  { src: "/testimonials/p8.jpg", name: "Sarah Vogel", role: "Backoffice", xPct: 60, yPct: 26, size: 92 },
  { src: "/testimonials/p9.jpg", name: "Katrin Loos", role: "Kaufm. Leitung", xPct: 70, yPct: 39, size: 88 },
  // Rechts: zwei Spalten mit je zwei gestapelten Bildern
  { src: "/testimonials/p10.jpg", name: "Thomas Klein", role: "Projektleiter", xPct: 80.4, yPct: 24, size: 92 },
  { src: "/testimonials/p11.jpg", name: "Jonas Vidal", role: "Fuhrpark", xPct: 80.4, yPct: 55, size: 82 },
  { src: "/testimonials/p12.jpg", name: "Laura Fuchs", role: "QM & Doku", xPct: 90.6, yPct: 35, size: 86 },
  { src: "/testimonials/p13.jpg", name: "Erik Sommer", role: "Einkauf", xPct: 90.6, yPct: 66, size: 82 },
];

const TILE_ASPECT = 1.16; // leicht hochkant wie in der Referenz

export default function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();

  const arcContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };

  const tileVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const floatClasses = ["animate-float", "animate-float-delayed", "animate-drift"];

  return (
    <section aria-labelledby="testimonials-heading" className="overflow-hidden bg-[#f8fafc] py-20 md:py-28">
      <div className="page-container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-white px-4 py-14 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.22)] sm:px-8 md:px-12 md:py-16">
          {/* Referenz-Wand */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={arcContainer}
            aria-hidden
            className="relative mx-auto h-[260px] max-w-5xl sm:h-[320px] md:h-[380px]"
          >
            {TILES.map((tile, index) => {
              const width = `clamp(${(tile.size * 0.55).toFixed(0)}px, ${((tile.size / 1280) * 100).toFixed(2)}vw, ${tile.size}px)`;
              const height = `clamp(${(tile.size * 0.55 * TILE_ASPECT).toFixed(0)}px, ${((tile.size * TILE_ASPECT / 1280) * 100).toFixed(2)}vw, ${(tile.size * TILE_ASPECT).toFixed(0)}px)`;
              return (
                <motion.div
                  key={tile.src}
                  variants={tileVariants}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${tile.xPct}%`, top: `${tile.yPct}%` }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-slate-100 shadow-soft-sm ring-1 ring-slate-900/5 transition-transform duration-300 hover:z-10 hover:scale-105 ${
                      shouldReduceMotion ? "" : floatClasses[index % floatClasses.length]
                    }`}
                    style={{ width, height, animationDelay: `${(index % 5) * 0.7}s` }}
                    title={`${tile.name} – ${tile.role}`}
                  >
                    <Image
                      src={tile.src}
                      alt={`${tile.name}, ${tile.role}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* weicher Übergang zum Text */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </motion.div>

          {/* Textblock */}
          <div className="mx-auto -mt-2 max-w-2xl text-center md:-mt-6">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-xs font-semibold tracking-wide text-slate-600">
                Referenzen
              </span>
              <h2
                id="testimonials-heading"
                className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
              >
                Vertraut von Profis
                <br />
                <span className="text-slate-400">aus der ganzen Bahnbranche</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
                Erfahre, warum Bahndienstleister auf Gleistrix setzen, um Projekte, Einsätze,
                Dokumente und Abrechnung sicher zu steuern.
              </p>
              <div className="mt-8">
                <Link
                  href="/branchen"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-7 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]"
                >
                  Erfolgsgeschichten lesen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
