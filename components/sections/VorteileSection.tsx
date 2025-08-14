"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });
import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Advantage = { title: string; desc: string };

export default function VorteileSection() {
  const items: Advantage[] = [
    {
      title: "Für Bahndienstleister entwickelt",
      desc:
        "Gleistrix wurde von Grund auf für den Einsatz in bahnnahen Projekten konzipiert – mit direktem Feedback von Projektleitern, Sicherungspersonal und Planern.",
    },
    {
      title: "Echtzeit statt Excel",
      desc:
        "Alle Einsätze, Zeiten und Ressourcen fließen live in Ihre Projektübersicht – ohne Tabellenchaos und Papierlisten.",
    },
    {
      title: "Schnell, stabil, intuitiv",
      desc:
        "Vollständig im Webbrowser, performante Infrastruktur und kurze Ladezeiten – ideal bei hoher Taktung.",
    },
    {
      title: "Alles in einem System",
      desc:
        "Zeiterfassung, Einsatzplanung, Nachweisdokumente – alle operativen Prozesse gebündelt in einem System.",
    },
    {
      title: "Modular & zukunftssicher",
      desc:
        "Skalierbar von kleinen Teams bis Großprojekte. Funktionen wie Predictive Maintenance oder E‑Learning jederzeit ergänzbar.",
    },
    {
      title: "Nachweisführung inklusive",
      desc:
        "Streckenkenntnis, Qualifikationen und Dokumentationspflichten digital verwalten – übersichtlich und jederzeit abrufbar.",
    },
    {
      title: "Sicher & konform",
      desc:
        "Hosting in DE, DSGVO‑konform und verschlüsselt. Orientierung an relevanten Bahnnormen (z. B. EN 50126 ff.).",
    },
    {
      title: "Unabhängig & partnerschaftlich",
      desc:
        "Wir sind unabhängig und arbeiten eng mit Partnern zusammen – transparent, praxisnah und lösungsorientiert.",
    },
  ];

  const GlassCard = ({ title, desc, delay }: { title: string; desc: string; delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="h-full rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/10 p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-violet-600 flex items-center justify-center text-white shadow-sm">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-semibold text-white leading-snug">{title}</h3>
          <p className="text-white/80 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );

  // slider config
  const [visible, setVisible] = useState(3); // 3 desktop, 2 mobile
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setVisible(mq.matches ? 2 : 3);
    apply();
    mq.addEventListener ? mq.addEventListener("change", apply) : mq.addListener(apply as any);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", apply) : mq.removeListener(apply as any);
    };
  }, []);

  const pages = useMemo(() => {
    const out: typeof items[] = [] as any;
    for (let i = 0; i < items.length; i += visible) {
      out.push(items.slice(i, i + visible));
    }
    return out;
  }, [items, visible]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % pages.length), 12000);
    return () => clearInterval(id);
  }, [pages.length]);

  useEffect(() => {
    setIndex((i) => (pages.length ? i % pages.length : 0));
  }, [pages.length]);

  return (
    <section className="relative w-full py-24 text-white overflow-hidden bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
      </div>

      <div className="page-container relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-white">Die wichtigsten Vorteile der Gleistrix App</h2>
          <p className="text-white/80">Warum Teams Gleistrix in Produktion einsetzen</p>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden rounded-2xl">
          <motion.div
            className="flex will-change-transform min-w-full"
            animate={{ x: `-${index * 100}%` }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
          >
            {pages.map((page, pIdx) => (
              <div key={pIdx} className="flex-none basis-full px-2 sm:px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {page.map((i, iIdx) => (
                    <GlassCard key={i.title} title={i.title} desc={i.desc} delay={(pIdx * visible + iIdx) * 0.03} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
          {/* pager controls */}
          {pages.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white/90" : "w-3 bg-white/40"}`}
                  aria-label={`Vorteile Seite ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


