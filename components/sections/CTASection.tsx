"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("@/components/visuals/Aurora"), { ssr: false });
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });

export default function CTASection() {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Animated Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.3} squareSize={56} borderColor="#223" hoverFillColor="#0b1020" />
        <Aurora colorStops={["#60A5FA", "#6366F1", "#A78BFA"]} blend={0.45} amplitude={0.9} speed={0.5} />
      </div>
      <div className="page-container relative z-10">
        <div className="relative mx-auto max-w-5xl text-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur py-16 px-6 sm:px-10">
        <h2 className="text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">
          Bereit für digitale Bahninfrastruktur?
        </h2>
        <p className="mt-2 text-white/90">Buchen Sie jetzt Ihre kostenlose Demo.</p>
        <div className="mt-8 flex justify-center">
          <a href="/demo-buchen">
            <Button className="bg-white text-black hover:bg-white/90 shadow-md">
              Demo buchen
            </Button>
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}


