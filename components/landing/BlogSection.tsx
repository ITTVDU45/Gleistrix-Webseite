"use client";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type BlogPost = {
  category: string;
  title: string;
  teaser: string;
  image: string;
  imageAlt: string;
  date: string;
  readTime: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    category: "Disposition",
    title: "Plantafel statt Excel: Trupps in Minuten disponieren",
    teaser: "Warum standortbezogene Einsatzplanung Fahrtwege und Leerlauf spürbar reduziert.",
    image: "/Standortbezogene Disposition.png",
    imageAlt: "Standortbezogene Disposition auf der Gleistrix-Plantafel",
    date: "3 Jul 2026",
    readTime: "4 Min. Lesezeit",
  },
  {
    category: "Sicherung",
    title: "SIPO-Einsätze rechtssicher dokumentieren",
    teaser: "So entstehen Nachweise für Sicherungsmaßnahmen direkt aus den Projektdaten.",
    image: "/Sicherungsmaßnahmen & Bahnübergänge.png",
    imageAlt: "Sicherungsmaßnahmen an Bahnübergängen",
    date: "26 Jun 2026",
    readTime: "5 Min. Lesezeit",
  },
  {
    category: "Fuhrpark",
    title: "Fahrzeuge und Technik ohne Doppelbelegung planen",
    teaser: "Verfügbarkeiten, Wartung und Einsatzzuordnung an einem Ort zusammenführen.",
    image: "/Fahrzeugplanung.png",
    imageAlt: "Fahrzeug- und Technikplanung in Gleistrix",
    date: "18 Jun 2026",
    readTime: "3 Min. Lesezeit",
  },
  {
    category: "Abrechnung",
    title: "Von der erfassten Stunde zur X-Rechnung",
    teaser: "Wie geprüfte Leistungen ohne Abtippen in den Rechnungsentwurf fließen.",
    image: "/Rechnungen.png",
    imageAlt: "Rechnungsstellung und Abrechnung in Gleistrix",
    date: "11 Jun 2026",
    readTime: "6 Min. Lesezeit",
  },
  {
    category: "Zeiterfassung",
    title: "Stundenzettel mobil und prüffähig erfassen",
    teaser: "Digitale Zeiterfassung senkt Rückfragen und beschleunigt die Freigabe.",
    image: "/Zeiterfassung.png",
    imageAlt: "Mobile Zeiterfassung und Stundenzettel",
    date: "4 Jun 2026",
    readTime: "3 Min. Lesezeit",
  },
  {
    category: "Auswertung",
    title: "Deckungsbeitrag pro Projekt sichtbar machen",
    teaser: "Kennzahlen zu Auslastung und Marge in Echtzeit statt am Monatsende.",
    image: "/reports.png",
    imageAlt: "Reports und Auswertungen in Gleistrix",
    date: "28 Mai 2026",
    readTime: "4 Min. Lesezeit",
  },
];

export default function BlogSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback((direction: "prev" | "next") => {
    const track = carouselRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>("[data-blog-card]");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0");
    const cardWidth = firstCard?.getBoundingClientRect().width ?? track.clientWidth * 0.82;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextScroll =
      direction === "next" ? track.scrollLeft + cardWidth + gap : track.scrollLeft - cardWidth - gap;
    const target =
      direction === "next" && nextScroll >= maxScroll - 8
        ? 0
        : direction === "prev" && nextScroll <= 0
          ? maxScroll
          : nextScroll;

    track.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => scrollCarousel("next"), 6200);
    return () => window.clearInterval(interval);
  }, [scrollCarousel]);

  return (
    <section id="blog" aria-labelledby="blog-heading" className="scroll-mt-24 overflow-hidden bg-[#f8fafc] py-20 md:py-28">
      <div className="page-container">
        <SectionHeading
          eyebrow="Blog"
          title={
            <span id="blog-heading">
              News &amp; <span className="text-gradient-accent">Ratgeber</span>
            </span>
          }
          description="Aktuelle Einblicke zu Disposition, Sicherung, Abrechnung und vernetzten Bahn-Workflows."
        />

        <div className="relative mt-12 md:mt-16">
          <div
            ref={carouselRef}
            className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-5"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
            }}
            aria-label="Aktuelle Blogartikel"
          >
            {BLOG_POSTS.map((post, index) => (
              <Reveal
                key={post.title}
                delay={index * 0.05}
                className="min-w-[86%] snap-center sm:min-w-[70%] md:min-w-[560px] lg:min-w-[680px]"
              >
                <Link
                  href="/blog"
                  data-blog-card
                  className="group relative block h-[420px] overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft md:h-[460px]"
                >
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 680px, (min-width: 768px) 560px, 86vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-5 shadow-soft md:inset-x-6 md:bottom-6 md:p-6">
                    <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                      {post.category}
                    </span>
                    <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-slate-900 md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 md:text-base">
                      {post.teaser}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
                      <span>{post.date}</span>
                      <span aria-hidden>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => scrollCarousel("prev")}
              className="group flex items-center gap-3 text-indigo-600 transition hover:text-indigo-800"
              aria-label="Vorherige Blogartikel anzeigen"
            >
              <span className="h-px w-24 bg-current transition group-hover:w-28" />
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("next")}
              className="group flex items-center gap-3 text-indigo-600 transition hover:text-indigo-800"
              aria-label="Nächste Blogartikel anzeigen"
            >
              <ChevronRight className="size-6" />
              <span className="h-px w-24 bg-current transition group-hover:w-28" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
