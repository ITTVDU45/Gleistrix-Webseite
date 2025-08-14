"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });

type Testimonial = {
  name: string;
  role: string;
  company: string;
  link?: string;
  quote: string;
  image: string;
};

export default function TestimonialsSection() {
  const items: Testimonial[] = [
    {
      name: "Marc-Anthony Widmann",
      role: "Geschäftsführer",
      company: "Eisenmann Services GmbH",
      link: "#",
      quote:
        "Mit Gleistrix haben wir unsere Zeit- und Schichtprozesse modernisiert. Bedienung klar, Abrechnung präzise – unsere operative Effizienz ist deutlich gestiegen.",
      image: "/Gleisbauunternehmen.png",
    },
    {
      name: "Julia Berger",
      role: "Leitung Disposition",
      company: "RailSecure GmbH",
      link: "#",
      quote:
        "Disposition, Zeiterfassung und Abrechnung greifen nahtlos ineinander. Gerade kurzfristige Änderungen setzen wir mit Gleistrix souverän um.",
      image: "/Sicherungspersonal%20gleis.png",
    },
    {
      name: "Thomas Klein",
      role: "Projektleiter",
      company: "InfraTech Bau",
      link: "#",
      quote:
        "Transparenz in Projekten und Ressourcen – endlich alles in einem System. Das spart Abstimmungen und vermeidet Doppelarbeit.",
      image: "/Fahrzeugplanung.png",
    },
  ];

  const [index, setIndex] = useState(0);
  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 9000);
    return () => clearInterval(id);
  }, [items.length]);

  const t = items[index];

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-gray-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.35} squareSize={56} borderColor="#223" hoverFillColor="#0b1020" />
      </div>

      <div className="page-container relative z-10">
        <h2 className="text-center text-3xl font-semibold mb-8">Unsere Kunden vertrauen Gleistrix</h2>

        <div className="relative rounded-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur p-4 sm:p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
              <Image src={t.image} alt={t.name} fill className="object-cover" />
            </div>
            <div className="md:pl-4">
              <blockquote className="text-white/80 text-lg leading-relaxed italic">“{t.quote}”</blockquote>
              <div className="mt-6">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-white/70 text-sm">{t.role}</div>
                <a href={t.link ?? "#"} className="text-sky-300 text-sm hover:underline">
                  {t.company}
                </a>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button
            type="button"
            aria-label="Vorheriges Testimonial"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Nächstes Testimonial"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
          >
            ›
          </button>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white/90" : "w-3 bg-white/40"}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


