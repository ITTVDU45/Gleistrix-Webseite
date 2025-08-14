"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });
import Image from "next/image";
import { useEffect, useState } from "react";

type UseCase = {
  title: string;
  desc: string[];
  img: string;
};

export default function EinsatzmoeglichkeitenSection() {
  const items: UseCase[] = [
    {
      title: "Sicherungspersonal & Truppplanung",
      desc: [
        "Effiziente, schichtgenaue und qualifikationsbasierte Planung – von Einzelposten bis Sicherungskolonnen.",
        "Rückmeldungen, Vertretungen und Ausfälle werden automatisch berücksichtigt.",
      ],
      img: "/Sicherungspersonal%20gleis.png",
    },
    {
      title: "Sicherungsmaßnahmen & Bahnübergänge",
      desc: [
        "BÜB, BÜP, BÜNE, Schaltanträge oder SPS normgerecht koordinieren.",
        "Genehmigungen, Zeitfenster, Technik und Personal immer im Blick – mit Erinnerungen für Fristen und Nachweise.",
      ],
      img: "/Sicherungsmaßnahmen%20%26%20Bahnübergänge.png",
    },
    {
      title: "Technik- & Fahrzeugplanung",
      desc: [
        "Zweiwegetechnik, Fahrzeuge und Warnsysteme zentral verwalten.",
        "Gleistrix prüft Verfügbarkeit, Wartungsintervalle und vermeidet Einsatzüberschneidungen.",
      ],
      img: "/Fahrzeugplanung.png",
    },
    {
      title: "Standortbezogene Disposition",
      desc: [
        "Einsätze nach Baumaßnahme, Strecke, Betriebsstelle oder Auftraggeber flexibel disponieren – auch bei kurzfristigen Änderungen den Überblick behalten.",
      ],
      img: "/Standortbezogene%20Disposition.png",
    },
  ];

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-gray-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="page-container relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-white">Für Unternehmen, bei denen Genauigkeit entscheidet</h2>
          <p className="text-white/80">
          Gleistrix unterstützt Sie von der Absicherung bis zur Abrechnung – effizient, transparent und zuverlässig.
          </p>
        </div>
        {/* Unified slider for all breakpoints (1 card on mobile, 2 on md+) */}
        <UseCaseSlider items={items} />
      </div>
    </section>
  );
}

function UseCaseSlider({ items }: { items: UseCase[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1); // 1 mobile, 2 on md+
  const goPrev = () => setIndex((i) => (i - 1 + Math.max(1, Math.ceil(items.length / visible))) % Math.max(1, Math.ceil(items.length / visible)));
  const goNext = () => setIndex((i) => (i + 1) % Math.max(1, Math.ceil(items.length / visible)));

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setVisible(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply as any);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', apply) : mq.removeListener(apply as any);
    };
  }, []);

  // Build pages of size `visible`
  const pages = (() => {
    const out: UseCase[][] = [];
    for (let i = 0; i < items.length; i += visible) out.push(items.slice(i, i + visible));
    return out.length ? out : [items];
  })();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % pages.length);
    }, 15000);
    return () => clearInterval(id);
  }, [pages.length]);

  useEffect(() => {
    setIndex((i) => (pages.length ? i % pages.length : 0));
  }, [visible]);

  return (
    <div className="-mx-4 px-4">
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div
          className="flex will-change-transform"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.6 }}
        >
          {pages.map((page, pIdx) => (
            <div key={pIdx} className="flex-none basis-full px-2">
              <div className={`grid ${visible === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                {page.map((item) => (
                  <div key={item.title} className="rounded-2xl ring-1 ring-white/10 bg-white/5 shadow-sm p-4">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                      <Image src={item.img} alt={item.title} fill className="object-cover" />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white leading-snug break-words">{item.title}</h3>
                    {item.desc.map((p, i) => (
                      <p key={i} className="text-white/80 mt-2 break-words">{p}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
        <button
          type="button"
          aria-label="Vorheriger Slide"
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow ring-1 ring-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.78 15.53a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 111.06 1.06L9.06 10l3.72 3.72a.75.75 0 010 1.06z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Nächster Slide"
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow ring-1 ring-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.22 4.47a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L10.94 10 7.22 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="mt-3 flex justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white/90' : 'w-3 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

