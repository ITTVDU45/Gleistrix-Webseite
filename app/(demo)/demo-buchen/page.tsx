"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("@/components/visuals/Aurora"), { ssr: false });

export default function DemoBuchenPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-[#0f172a] overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={["#60A5FA", "#6366F1", "#A78BFA"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>
      {/* Top bar with only logo */}
      <div className="page-container pt-6 pb-8 relative z-10">
        <Link href="/" className="inline-flex items-center" aria-label="Gleistrix Home">
          <Image
            src="/Gleistrix Logo (500 x 300 px).png"
            alt="Gleistrix Logo"
            width={500}
            height={300}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Hero heading and subtext */}
      <div className="page-container relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Jetzt 14 Tage Demo buchen - kostenlos und unverbindlich
          </h1>
          <p className="mt-4 text-white/80 text-lg">
            Mit ein paar kurzen Infos zu Ihnen können wir uns optimal vorbereiten –
            und Sie erleben den vollen Mehrwert von Gleistrix.
          </p>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="page-container mt-10 pb-24 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Cal.com embed */}
          <CalEmbed />
          {/* Testimonials slider */}
          <TestimonialsSlider />
        </div>
      </div>
    </main>
  );
}

function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "demozugang" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#395f72" },
          dark: { "cal-brand": "#5b919b" },
        },
        hideEventTypeDetails: false,
        layout: "week_view",
      });
    })();
  }, []);
  return (
    <div className="relative rounded-2xl gradient-border h-[720px] md:h-[780px]">
      <Cal
        namespace="demozugang"
        calLink="gleistrix/demozugang"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "week_view", theme: "dark" }}
      />
      <style jsx>{`
        .gradient-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: 1rem; /* matches rounded-2xl */
          background: linear-gradient(90deg, #60A5FA, #6366F1, #A78BFA);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

// Field removed with form

function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const items = [
    {
      quote:
        "Mit Gleistrix planen wir Projekte erstmals vollständig digital und normkonform – ein großer Schritt in der Disposition.",
      author: "Werner Freitag",
      role: "Technischer Leiter, Stadtwerke",
      stars: 5,
    },
    {
      quote:
        "Die Einsatzplanung ist deutlich schneller geworden. Unser Team ist begeistert von der Übersicht.",
      author: "Nina Bauer",
      role: "Disposition, Gleisbauunternehmen",
      stars: 5,
    },
    {
      quote: "Zeiten, Berichte und Nachweise – alles zentral und revisionssicher. Spart uns täglich Zeit.",
      author: "Michael Köhler",
      role: "Geschäftsführer, Sicherungsunternehmen",
      stars: 5,
    },
  ];
  return (
    <div className="rounded-2xl bg-white/95 ring-1 ring-slate-200 shadow-sm p-6 md:p-8">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t, i) => (
            <div key={i} className="basis-full flex-none">
              <blockquote className="text-slate-800">
                <p className="text-lg md:text-xl font-medium leading-relaxed">“{t.quote}”</p>
                <div className="mt-4 text-sm text-slate-600">
                  <div className="font-semibold text-slate-800">{t.author}</div>
                  <div>{t.role}</div>
                </div>
                <div className="mt-4 text-yellow-500">{"★★★★★".slice(0, t.stars)}</div>
              </blockquote>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            aria-label="Vorheriger"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-slate-900/80" : "w-3 bg-slate-400/50"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            aria-label="Nächster"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}


