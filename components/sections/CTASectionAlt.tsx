"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";

const DotGrid = dynamic(() => import("@/components/visuals/DotGrid"), { ssr: false });

export default function CTASectionAlt() {
  return (
    <section className="relative w-full py-28 overflow-hidden bg-[#060010] text-white">
      {/* Interactive DotGrid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={10}
          gap={16}
          baseColor="#0b1020"
          activeColor="#60A5FA"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={800}
          returnDuration={1.5}
          className="h-full w-full"
        />
      </div>

      <div className="page-container relative z-10">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-8 py-14 text-center shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">Bereit, Ihre Disposition zu vereinfachen?</h2>
            <p className="mt-3 text-white/80">
              Gleistrix bündelt Planung, Zeiterfassung und Abrechnung in einem System – transparent, effizient, mobil.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/demo-buchen">
                <Button className="h-11 px-6 bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
                  Kostenlose Demo buchen
                </Button>
              </Link>
              <Link href="/#loesungen">
                <Button variant="outline" className="h-11 px-6 bg-transparent text-white border border-white/40 hover:bg-white/10">
                  Funktionen ansehen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


