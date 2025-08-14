import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FEATURES } from "./features";
import { BENEFITS } from "@/app/produkt/benefits";
import { SCREENS } from "@/app/produkt/screens";
import BenefitsSlider from "@/components/sections/BenefitsSlider";
import Squares from "@/components/visuals/Squares";
import FeaturesAccordion from "@/components/sections/FeaturesAccordion";


export const metadata: Metadata = {
  title: "Gleistrix – das All-in-One-ERP für sichere Bahnprojekte",
  description:
    "Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent, prüffähig.",
  openGraph: {
    title: "Gleistrix – das All-in-One-ERP für sichere Bahnprojekte",
    description:
      "Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent, prüffähig.",
    type: "website",
  },
};

export default function ProduktPage() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
        </div>
        <div className="page-container relative z-10 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">
                Gleistrix – das All-in-One-ERP für sichere Bahnprojekte
              </h1>
              <p className="mt-4 text-lg text-white/90">
                Von Angebots- und Projektmanagement bis Disposition, Stundenzettel, Lohn und X-Rechnung – effizient, transparent, prüffähig.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo-buchen">
                  <Button className="h-11 px-6 bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
                    Demo anfordern
                  </Button>
                </Link>
                <a href="#features">
                  <Button className="h-11 px-6 bg-transparent text-white border border-white/40 hover:border-white/70 hover:bg-white/10">
                    Funktionsübersicht
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative w-full aspect-[4/3] md:aspect-video rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <Image src="/Standortbezogene Disposition.png" alt="Mockup" fill className="object-contain p-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Funktionen */}
      <section id="features" className="relative bg-gradient-to-b from-gray-900 to-slate-900 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
        </div>
        <div className="page-container relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold">Funktionen</h2>
            <p className="text-white/80">Alles, was Sie brauchen – in einem System</p>
          </div>
          <FeaturesAccordion />
        </div>
      </section>

      {/* Vorteile */}
      <section className="relative bg-gradient-to-b from-gray-900 to-slate-900 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
        </div>
        <div className="page-container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold">Vorteile</h2>
            <p className="text-white/80">Warum Teams Gleistrix in Produktion einsetzen</p>
          </div>
          <BenefitsSlider items={BENEFITS} autoMs={12000} />
        </div>
      </section>

      {/* Screens Gallery */}
      <section className="relative bg-gradient-to-b from-gray-900 to-slate-900 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
        </div>
        <div className="page-container relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold">Gleistrix in Action</h2>
            <p className="text-white/80">Einblicke in Oberflächen und Workflows</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCREENS.map((s) => (
              <Link key={s.src} href={s.href} className="group relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image src={s.src} alt={s.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                <span className="absolute bottom-2 left-2 text-xs bg-black/40 px-2 py-1 rounded-md">{s.alt}</span>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg">
                    Mehr dazu
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="relative bg-gradient-to-b from-gray-900 to-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
        </div>
        <div className="page-container relative z-10">
          <div className="mx-auto max-w-4xl text-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-8 py-14">
            <h2 className="text-3xl sm:text-4xl font-semibold">Bereit für effiziente Bahnsicherung?</h2>
            <p className="mt-3 text-white/80">Lassen Sie sich Gleistrix live zeigen – 20 Minuten genügen.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/demo-buchen">
                <Button className="h-11 px-6 bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
                  Demo anfordern
                </Button>
              </Link>
              <a href="#features">
                <Button className="h-11 px-6 bg-transparent text-white border border-white/40 hover:border-white/70 hover:bg-white/10">
                  Funktionsübersicht herunterladen
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


