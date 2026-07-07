"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarRange, FileCheck2, PackageSearch, Receipt, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

type FloatingCard = {
  icon: LucideIcon;
  title: string;
  meta: string;
  className: string;
  floatClass: string;
};

const FLOATING_CARDS: FloatingCard[] = [
  {
    icon: CalendarRange,
    title: "Plantafel",
    meta: "12 Einsätze heute",
    className: "-left-6 top-16 hidden xl:flex",
    floatClass: "animate-float",
  },
  {
    icon: Sparkles,
    title: "KI-LV-Agent",
    meta: "Angebot vorbereitet",
    className: "-right-8 top-32 hidden xl:flex",
    floatClass: "animate-float-delayed",
  },
  {
    icon: FileCheck2,
    title: "Dokumentation",
    meta: "Bericht erstellt",
    className: "-left-10 bottom-40 hidden xl:flex",
    floatClass: "animate-float-delayed",
  },
  {
    icon: PackageSearch,
    title: "Lagerbestand",
    meta: "Material reserviert",
    className: "-right-6 bottom-24 hidden xl:flex",
    floatClass: "animate-float",
  },
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-white pb-16 pt-32 md:pb-24 md:pt-44"
    >
      {/* Weicher Hintergrund-Verlauf */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent)]" />
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)]" />
        <div className="absolute -right-32 top-64 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.10),transparent)]" />
      </div>

      <div className="page-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp(0)}>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-soft-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              ERP-Plattform für den Bahnbetrieb
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.08]"
            {...fadeUp(0.08)}
          >
            Die moderne ERP-Plattform{" "}
            <span className="text-gradient-accent">für Bahndienstleister</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
            {...fadeUp(0.16)}
          >
            Gleistrix bündelt Projektmanagement, Einsatzplanung, Dokumente, Lager,
            Abrechnung und KI-Agenten in einer zentralen SaaS-Lösung.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
        </div>

        {/* Produkt-Mockup mit schwebenden Karten */}
        <motion.div className="relative mx-auto mt-14 max-w-5xl md:mt-20" {...fadeUp(0.36)}>
          {FLOATING_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                aria-hidden
                className={`glass absolute z-10 items-center gap-3 rounded-2xl px-4 py-3 shadow-soft ${card.className} ${card.floatClass}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-slate-800">{card.title}</span>
                  <span className="block text-[11px] text-slate-400">{card.meta}</span>
                </span>
              </div>
            );
          })}

          {/* Statuskarte unten mittig – auch auf kleineren Screens sichtbar */}
          <div
            aria-hidden
            className="glass absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-soft"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Abrechnung bereit
              <span className="ml-2 font-normal text-slate-400">8 Projekte geprüft</span>
            </span>
          </div>

          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
