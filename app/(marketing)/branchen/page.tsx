import Link from "next/link";
import IndustriesGrid from "@/components/industries-grid";
import { Button } from "@/components/ui/button";
import Squares from "@/components/visuals/Squares";
import FunktionenSection from "@/components/sections/FunktionenSection";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";
import CTASection from "@/components/sections/CTASection";

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="relative text-white overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.35} squareSize={52} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      {/* Breadcrumb (optional) */}
      <nav aria-label="Breadcrumb" className="page-container pt-6 text-sm text-white/70">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">Startseite</Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-white">Branchen</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative py-16">
        <div className="page-container relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">Branchen, die auf Gleistrix vertrauen</h1>
          <p className="mt-3 text-lg text-white/90 max-w-3xl">
            Gleistrix passt sich Ihrer Realität an – von Gleisbausicherung bis auftragsbasierten Services.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo-buchen">
              <Button className="h-11 px-6 bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
                Demo anfordern
              </Button>
            </Link>
            <Link href="/#funktionen">
              <Button className="h-11 px-6 bg-transparent text-white border border-white/40 hover:border-white/70 hover:bg-white/10">
                Funktionen ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="relative">
        <div className="relative z-10">
          <IndustriesGrid />
        </div>
      </section>

      {/* Funktionen (Accordion) */}
      <section id="loesungen" className="relative w-full py-16">
        <div className="page-container relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold">Eine Lösung für alle Prozesse.</h2>
          </div>
          <FeaturesAccordion />
        </div>
      </section>

      {/* CTA Section (shared) */}
      <CTASection />
    </main>
  );
}


