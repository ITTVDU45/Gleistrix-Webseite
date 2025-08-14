"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("@/components/visuals/Aurora"), { ssr: false });

export function HeroSection() {
  return (
    <section className="relative z-0 w-full overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900 text-white min-h-[100svh] md:min-h-[100vh]">
      {/* Aurora animated background */}
      <div className="absolute inset-0" style={{ zIndex: -20 }}>
        <Aurora colorStops={["#60A5FA", "#6366F1", "#A78BFA"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>
      {/* moving glow layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          className="absolute -inset-40 opacity-30 blur-xl bg-[radial-gradient(520px_260px_at_20%_20%,#6366f1,transparent_60%)]"
          animate={{ x: [0, 40, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 18, repeat: 100000, ease: "easeInOut", repeatType: "loop" }}
        />
        <motion.div
          aria-hidden
          className="absolute -inset-40 opacity-25 blur-xl bg-[radial-gradient(600px_280px_at_80%_60%,#22d3ee,transparent_60%)]"
          animate={{ x: [0, -30, 30, 0], y: [0, 15, -15, 0] }}
          transition={{ duration: 22, repeat: 100000, ease: "easeInOut", repeatType: "loop" }}
        />
      </div>

      <div className="page-container pt-26 md:pt-24 pb-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">
            <span className="block">Bahnprojekte effizient managen –</span>
            <span className="block">alles in einer Software</span>
          </h1>
          <p className="mt-4 text-lg/7 text-white max-w-2xl mx-auto">
          Von der ersten Planung bis zur finalen Abnahme: Gleistrix vereint Projektplanung, Ressourcensteuerung und Echtzeit-Zeiterfassung in einem zentralen Tool. Behalte den Überblick über Trupps, Maschinen, Fahrzeuge und Bauabschnitte – transparent, koordiniert und immer auf Kurs.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a href="/demo-buchen">
              <Button className="bg-gradient-to-tr from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
                Kostenlose Demo Anfragen
              </Button>
            </a>
            <a href="#loesungen">
              <Button
                variant="outline"
                className="bg-transparent text-white hover:text-white border border-white/40 hover:border-white/70 hover:bg-white/10 rounded-md"
              >
                Mehr dazu
              </Button>
            </a>
          </div>
          
          {/* Image below buttons */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-4xl aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
              <Image 
                src="/Gleisbauunternehmen.png" 
                alt="Gleisbauunternehmen bei der Arbeit" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;


