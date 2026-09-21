"use client";
import Image from "next/image";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";
import { cn } from "@/lib/utils";
import { CAROUSEL_CARD_ATTR, CarouselControls, useSnapCarousel } from "./carousel";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const AUTOPLAY_INTERVAL_MS = 7500;

const SCHEDULE_ROWS = [
  [
    { start: 0, span: 42 },
    { start: 52, span: 30 },
  ],
  [{ start: 14, span: 58 }],
  [
    { start: 6, span: 26 },
    { start: 40, span: 46 },
  ],
  [{ start: 30, span: 52 }],
] as const;

function ScheduleVisual({ isDark }: { isDark: boolean }) {
  return (
    <div aria-hidden className="mt-6 space-y-2.5 sm:mt-8">
      {SCHEDULE_ROWS.map((bars, rowIndex) => (
        <div key={rowIndex} className="relative h-2.5">
          <div className={cn("absolute inset-0 rounded-full", isDark ? "bg-white/6" : "bg-white/8")} />
          {bars.map((bar) => (
            <div
              key={bar.start}
              className={cn("absolute h-2.5 rounded-full", rowIndex % 2 === 0 ? "bg-brand-400" : "bg-brand-600/80")}
              style={{ left: `${bar.start}%`, width: `${bar.span}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CaseStudyCard({ study, isDark }: { study: CaseStudy; isDark: boolean }) {
  const [primary, ...secondary] = study.metrics;

  return (
    <article
      {...{ [CAROUSEL_CARD_ATTR]: true }}
      className={cn(
        "grid h-full min-w-0 gap-5 rounded-2xl border p-5 sm:gap-6 sm:rounded-3xl sm:p-6 md:grid-cols-2 md:gap-8 md:p-8",
        isDark ? "border-slate-800 bg-slate-900 text-white" : "border-slate-900/8 bg-white text-slate-900 shadow-soft-sm",
      )}
    >
      <div className="flex min-w-0 flex-col">
        <span className={cn("inline-flex w-fit max-w-full rounded-full px-3 py-1 text-[11px] font-semibold sm:px-3.5 sm:text-xs", isDark ? "bg-white/10 text-brand-300" : "border border-brand-200/70 bg-brand-50/80 text-brand-700")}>
          {study.tag}
        </span>
        <h3 className="mt-4 text-[1.65rem] font-bold leading-[1.12] tracking-tight sm:mt-5 sm:text-2xl md:text-3xl">{study.title}</h3>
        <p className={cn("mt-3 text-[15px] leading-7 sm:mt-4 sm:text-base sm:leading-relaxed", isDark ? "text-slate-300" : "text-slate-500")}>{study.summary}</p>
        <dl className={cn("mt-6 grid grid-cols-2 gap-4 border-t pt-5 sm:mt-auto", isDark ? "border-white/10" : "border-slate-900/8")}>
          {secondary.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <dt className="sr-only">{metric.label}</dt>
              <dd className={cn("text-lg font-bold sm:text-xl", isDark ? "text-brand-300" : "text-brand-600")}>{metric.value}</dd>
              <dd className={cn("mt-0.5 text-[11px] leading-snug sm:text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{metric.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={cn("group relative flex min-h-[220px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl p-5 sm:min-h-64 sm:p-6 md:min-h-0 md:p-8", isDark ? "bg-slate-950 ring-1 ring-white/10" : "bg-slate-900")}>
        {/* Foto liegt unter den Kennzahlen, nicht daneben: Die Karte hat nur
            zwei Spalten – ein drittes Element würde sie sprengen. Der Verlauf
            darüber hält den Text auch auf hellen Motiven lesbar. */}
        <Image
          src={study.image.src}
          alt={study.image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          unoptimized={study.image.src.endsWith(".svg")}
          className="object-cover opacity-45 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
        <p className="relative text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50 sm:text-xs sm:tracking-[0.16em]">{study.branche}</p>
        <div className="relative mt-5 sm:mt-6">
          <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">{primary.value}</p>
          <p className="mt-2 text-sm text-white/70 sm:text-base">{primary.label}</p>
        </div>
        <div className="relative"><ScheduleVisual isDark={isDark} /></div>
      </div>
    </article>
  );
}

export default function CaseStudiesSection() {
  const { trackRef, scrollCarousel } = useSnapCarousel(AUTOPLAY_INTERVAL_MS);

  return (
    <section aria-labelledby="cases-heading" className="overflow-hidden bg-[#f8fafc] py-16 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="Anwendungsbeispiele"
          title={<span id="cases-heading">So sieht der Alltag mit <span className="rounded-xl bg-brand-100/80 px-2 text-brand-700 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">Gleistrix</span> aus</span>}
          // Die Kennzahlen sind Beispielwerte (siehe data/caseStudies.ts). Die
          // frühere Überschrift "Echte Zahlen aus echten Bahnprojekten"
          // behauptete das Gegenteil – das wäre irreführende Werbung.
          description="Typische Szenarien aus Sicherung, Gleisbau, Schweißtechnik und Ingenieurbüros. Die Kennzahlen sind Beispielwerte zur Veranschaulichung, keine Messungen einzelner Kunden."
        />

        <Reveal className="relative mt-9 sm:mt-12 md:mt-16">
          <div
            ref={trackRef}
            className="scrollbar-none flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 sm:gap-5 sm:pb-5"
            aria-label="Anwendungsbeispiele aus der Bahnbranche"
          >
            {CASE_STUDIES.map((study, index) => (
              <div key={study.id} className="w-full shrink-0 snap-center" style={{ flex: "0 0 100%" }}>
                <CaseStudyCard study={study} isDark={index % 2 === 1} />
              </div>
            ))}
          </div>

          <CarouselControls
            onScroll={scrollCarousel}
            prevLabel="Vorheriges Praxisbeispiel anzeigen"
            nextLabel="Nächstes Praxisbeispiel anzeigen"
            className="mt-5 sm:mt-7"
          />
        </Reveal>
      </div>
    </section>
  );
}
