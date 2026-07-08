import Link from "next/link";
import Reveal from "@/components/landing/Reveal";

/** Dunkler CTA-Banner als premium Abschluss oberhalb der Footer-Karte. */
export default function FooterCTA() {
  return (
    <Reveal>
      <div className="relative isolate overflow-hidden rounded-[2.25rem] bg-[#070b16] px-6 py-16 text-center shadow-[0_40px_120px_-40px_rgba(2,6,23,0.65)] ring-1 ring-white/10 md:px-16 md:py-24">
        {/* Spotlight-Glow von oben */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 50% -20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 28%, transparent 60%)",
          }}
        />
        {/* dezenter Farbschimmer unten */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40"
          style={{
            background:
              "radial-gradient(80% 140% at 50% 130%, rgba(99,102,241,0.22) 0%, transparent 65%)",
          }}
        />

        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          Bereit, deinen Bahnbetrieb digital zu steuern?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300/90 sm:text-lg">
          Mit Gleistrix planst du Projekte, Teams, Fahrzeuge, Dokumente, Lager und Abrechnung
          zentral in einer modernen Plattform.
        </p>
        <div className="mt-9">
          <Link
            href="/demo-buchen"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b16]"
          >
            Demo anfragen
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
