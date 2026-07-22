"use client";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";
import { cn } from "@/lib/utils";
import { CAROUSEL_CARD_ATTR, CarouselControls, useSnapCarousel } from "./carousel";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const AUTOPLAY_INTERVAL_MS = 7500;

/**
 * Mini-Plantafel als Kennzahl-Visual: vier Zeilen mit versetzten Balken.
 * Die Werte sind fest verdrahtet statt zufällig, damit Server- und Client-Render
 * identisch sind (sonst Hydration-Mismatch).
 */
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
    <div aria-hidden className="mt-8 space-y-2.5">
      {SCHEDULE_ROWS.map((bars, rowIndex) => (
        <div key={rowIndex} className="relative h-2.5">
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              isDark ? "bg-white/6" : "bg-white/8"
            )}
          />
          {bars.map((bar) => (
            <div
              key={bar.start}
              className={cn(
                "absolute h-2.5 rounded-full",
                rowIndex % 2 === 0 ? "bg-indigo-400" : "bg-violet-400/80"
              )}
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
        "grid h-full gap-6 rounded-3xl border p-6 md:grid-cols-2 md:gap-8 md:p-8",
        isDark
          ? "border-slate-800 bg-slate-900 text-white"
          : "border-slate-900/8 bg-white text-slate-900 shadow-soft-sm"
      )}
    >
      <div className="flex flex-col">
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-3.5 py-1 text-xs font-semibold",
            isDark
              ? "bg-white/10 text-indigo-300"
              : "border border-indigo-200/70 bg-indigo-50/80 text-indigo-700"
          )}
        >
          {study.tag}
        </span>

        <h3 className="mt-5 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          {study.title}
        </h3>

        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            isDark ? "text-slate-300" : "text-slate-500"
          )}
        >
          {study.summary}
        </p>

        <dl
          className={cn(
            "mt-auto grid grid-cols-2 gap-4 border-t pt-5",
            isDark ? "border-white/10" : "border-slate-900/8"
          )}
        >
          {secondary.map((metric) => (
            <div key={metric.label}>
              <dt className="sr-only">{metric.label}</dt>
              <dd
                className={cn(
                  "text-xl font-bold",
                  isDark ? "text-indigo-300" : "text-indigo-600"
                )}
              >
                {metric.value}
              </dd>
              <dd
                className={cn(
                  "text-xs leading-tight",
                  isDark ? "text-slate-400" : "text-slate-400"
                )}
              >
                {metric.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Kennzahl-Panel */}
      <div
        className={cn(
          "relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl p-6 md:min-h-0 md:p-8",
          isDark ? "bg-slate-950 ring-1 ring-white/10" : "bg-slate-900"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl"
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
          {study.branche}
        </p>
        <div className="relative mt-6">
          <p className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            {primary.value}
          </p>
          <p className="mt-2 text-base text-white/70">{primary.label}</p>
        </div>
        <div className="relative">
          <ScheduleVisual isDark={isDark} />
        </div>
      </div>
    </article>
  );
}

export default function CaseStudiesSection() {
  const { trackRef, scrollCarousel } = useSnapCarousel(AUTOPLAY_INTERVAL_MS);

  return (
    <section
      aria-labelledby="cases-heading"
      className="overflow-hidden bg-[#f8fafc] py-20 md:py-28"
    >
      <div className="page-container">
        <SectionHeading
          eyebrow="Vertrauen aus der Bahnbranche"
          title={
            <span id="cases-heading">
              Echte Zahlen aus{" "}
              <span className="rounded-xl bg-indigo-100/80 px-2 text-indigo-700 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                echten Bahnprojekten
              </span>
            </span>
          }
          description="Von der Schichtplanung über die Dokumentation bis zur Rechnung – so verändert Gleistrix den Alltag in Sicherung, Gleisbau, Schweißtechnik und Ingenieurbüros."
        />

        {/* Reveal liegt bewusst auf dem gesamten Track, nicht auf einzelnen
            Karten: seitlich herausgescrollte Karten würden sonst dauerhaft auf
            opacity 0 stehen und erst beim Klick auf den Pfeil erscheinen. */}
        <Reveal className="relative mt-12 md:mt-16">
          <div
            ref={trackRef}
            className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-5"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
            }}
            aria-label="Praxisbeispiele aus der Bahnbranche"
          >
            {CASE_STUDIES.map((study, index) => (
              <div
                key={study.id}
                className="min-w-[86%] snap-center sm:min-w-[74%] md:min-w-[620px] lg:min-w-[860px]"
              >
                <CaseStudyCard study={study} isDark={index % 2 === 1} />
              </div>
            ))}
          </div>

          <CarouselControls
            onScroll={scrollCarousel}
            prevLabel="Vorheriges Praxisbeispiel anzeigen"
            nextLabel="Nächstes Praxisbeispiel anzeigen"
            className="mt-7"
          />
        </Reveal>
      </div>
    </section>
  );
}
