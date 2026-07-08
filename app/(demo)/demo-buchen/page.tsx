"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { ArrowLeft, Star } from "lucide-react";

export default function DemoBuchenPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Weiche Hintergrund-Verläufe */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent)]" />
        <div className="absolute -right-32 top-40 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.10),transparent)]" />
      </div>

      {/* Topbar mit Logo + Zurück-Link */}
      <div className="page-container relative z-10 flex items-center justify-between pb-8 pt-6">
        <Link href="/" className="inline-flex items-center" aria-label="Gleistrix Startseite">
          <Image
            src="/Gleistrix Logo (500 x 300 px).png"
            alt="Gleistrix Logo"
            width={500}
            height={300}
            className="h-11 w-auto"
            priority
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-900/5 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Zur Startseite
        </Link>
      </div>

      {/* Überschrift */}
      <div className="page-container relative z-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
            Kostenlos & unverbindlich
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
            Jetzt 14 Tage <span className="text-gradient-accent">Demo buchen</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Mit ein paar kurzen Infos zu dir können wir uns optimal vorbereiten – und du erlebst den
            vollen Mehrwert von Gleistrix.
          </p>
        </div>
      </div>

      {/* Zwei-Spalten-Layout */}
      <div className="page-container relative z-10 mt-10 pb-24">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <CalEmbed />
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
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#4f46e5" },
          dark: { "cal-brand": "#6366f1" },
        },
        hideEventTypeDetails: false,
        layout: "week_view",
      });
    })();
  }, []);
  return (
    <div className="h-[720px] overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft md:h-[780px]">
      <Cal
        namespace="demozugang"
        calLink="gleistrix/demozugang"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "week_view", theme: "light" }}
      />
    </div>
  );
}

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  stars: number;
};

const TESTIMONIALS: Testimonial[] = [
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
    quote:
      "Zeiten, Berichte und Nachweise – alles zentral und revisionssicher. Spart uns täglich Zeit.",
    author: "Michael Köhler",
    role: "Geschäftsführer, Sicherungsunternehmen",
    stars: 5,
  },
];

function TestimonialsSlider() {
  const [index, setIndex] = useState(0);

  return (
    <div className="glass rounded-3xl p-6 shadow-soft md:p-8">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.author} className="flex-none basis-full">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: testimonial.stars }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-lg font-medium leading-relaxed text-slate-700 md:text-xl">
                „{testimonial.quote}“
              </blockquote>
              <div className="mt-5 text-sm">
                <div className="font-semibold text-slate-900">{testimonial.author}</div>
                <div className="text-slate-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            aria-label="Vorheriges Testimonial"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((testimonial, dotIndex) => (
              <button
                key={testimonial.author}
                onClick={() => setIndex(dotIndex)}
                className={`h-1.5 rounded-full transition-all ${dotIndex === index ? "w-6 bg-indigo-600" : "w-3 bg-slate-300"}`}
                aria-label={`Testimonial ${dotIndex + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
            aria-label="Nächstes Testimonial"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
