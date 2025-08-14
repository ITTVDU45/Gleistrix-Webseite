"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });
import { motion } from "framer-motion";

type RoadmapItem = { title: string; desc: string };

const ITEMS: RoadmapItem[] = [
  {
    title: "Instandhaltungsmanagement",
    desc:
      "Planung, Dokumentation und Nachverfolgung aller Wartungsmaßnahmen. Fristenplanung, Protokolle und Erinnerungen für Maschinen, Fahrzeuge & Werkzeuge.",
  },
  {
    title: "E‑Learning & Streckenkenntnis",
    desc:
      "Digitale Schulungen, Quiz, Qualifikationsmatrix und Streckenkenntnis‑Tracking – direkt im System.",
  },
  {
    title: "Predictive Maintenance (KI)",
    desc:
      "KI‑gestützte Auswertung von Maschinendaten zur Ausfallvorhersage – reduziert Standzeiten.",
  },
  {
    title: "Material‑ & Geräteverwaltung",
    desc:
      "Vom Verbrauchsmaterial bis zur Signallampe: Lagerbestände, Ausgabe und Rückverfolgung.",
  },
  {
    title: "ECM‑Workflow (ECM 1–4)",
    desc:
      "Planung, Durchführung und Dokumentation zertifizierter Instandhaltung mit Dispositionskopplung.",
  },
  {
    title: "Digitale Bautageberichte",
    desc:
      "Zeiten, Vorkommnisse und Fotos mit Signatur & Standort – automatisch mit der Zeiterfassung verknüpft.",
  },
  {
    title: "Auftraggeber‑Portal",
    desc:
      "Zeitnachweise, Baufortschritte und Protokolle digital teilen – inkl. Download & Freigabe.",
  },
  {
    title: "Subunternehmer‑Integration",
    desc:
      "Externe Firmen sicher einbinden, Zeiten getrennt erfassen und Prozesse unter Kontrolle halten.",
  },
  {
    title: "Mobile App (iOS/Android)",
    desc:
      "Echtzeitdaten vom Einsatzort – offlinefähig: Zeiterfassung, Rückmeldung, Fotos & Unterschriften.",
  },
  {
    title: "Audit‑ & Compliance‑Modul",
    desc:
      "Erfüllung von EN 50126 ff., ISO 9001 & QS‑Vorgaben mit modularem Prüf‑ und Nachweissystem.",
  },
];

export default function ComingSoonSection() {
  const [index, setIndex] = useState(0);
  // responsive cards-per-page: 2 on mobile, 3 on >= sm
  const [visible, setVisible] = useState(3);
  // Set on mount and on resize using a media query
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setVisible(mq.matches ? 2 : 3);
    apply();
    mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply as any);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', apply) : mq.removeListener(apply as any);
    };
  }, []);

  const PAGES_RAW = Math.ceil(ITEMS.length / visible);
  const PAGES = Number.isFinite(PAGES_RAW) && PAGES_RAW > 0 ? PAGES_RAW : 1;
  const goPrev = () => setIndex((i) => ((i - 1) % PAGES + PAGES) % PAGES);
  const goNext = () => setIndex((i) => ((i + 1) % PAGES + PAGES) % PAGES);
  // Always render exactly 3 items per page. For incomplete last page, wrap from start.
  const getItem = (idx: number): RoadmapItem => {
    if (ITEMS.length === 0) return { title: "", desc: "" };
    return ITEMS[idx % ITEMS.length];
  };
  const pages = Array.from({ length: PAGES }, (_, p) =>
    Array.from({ length: visible }, (_, i) => getItem(p * visible + i))
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => {
      setIndex((i) => ((i + 1) % PAGES + PAGES) % PAGES);
    }, 4500);
    return () => clearInterval(id);
  }, [PAGES]);
  // Clamp index when PAGES changes
  useEffect(() => {
    setIndex((i) => (PAGES > 0 ? i % PAGES : 0));
  }, [PAGES]);

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-gray-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="page-container relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-white">Wir denken weiter</h2>
          <p className="text-white/80">In Kürze für Sie verfügbar</p>
        </div>

        {/* slider: three cards per view, auto‑advance */}
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
          <motion.div
            className="flex will-change-transform min-w-full"
            animate={{ x: `-${(index % PAGES) * 100}%` }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.6 }}
          >
            {pages.map((page, pIdx) => (
              <div key={pIdx} className="flex-none basis-full px-2 sm:px-4">
                {/* Always 3 cards per page to enforce exact paging */}
                <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-fr gap-3 lg:gap-4">
                  {page.map((item, i) => {
                    const gradients = [
                      "from-sky-100 via-blue-200 to-violet-200",
                      "from-sky-50 via-blue-100 to-violet-100",
                      "from-blue-100 via-indigo-200 to-violet-200",
                      "from-sky-200 via-blue-300 to-violet-300",
                    ];
                    const g = gradients[(pIdx * visible + i) % gradients.length];
                    return (
                      <motion.div
                        key={item.title}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`h-full min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] flex flex-col overflow-hidden rounded-xl p-4 sm:p-6 shadow-sm text-white bg-gradient-to-r ${g}`}
                      >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-snug tracking-tight break-words">{item.title}</h3>
                        <p className="opacity-90 text-sm sm:text-base leading-relaxed break-words">{item.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
          {PAGES > 1 && (
            <>
              <button
                type="button"
                aria-label="Vorherige Seite"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.78 15.53a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 111.06 1.06L9.06 10l3.72 3.72a.75.75 0 010 1.06z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Nächste Seite"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.22 4.47a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L10.94 10 7.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* pager dots */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: PAGES }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-slate-900' : 'bg-slate-300'}`}
              aria-label={`Geplantes Modul ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


