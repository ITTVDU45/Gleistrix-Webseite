"use client";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Karten im Track müssen dieses Attribut tragen, damit die Schrittweite stimmt. */
export const CAROUSEL_CARD_ATTR = "data-carousel-card";

type ScrollDirection = "prev" | "next";

/**
 * Snap-Karussell auf Basis von nativem Scrollen.
 *
 * Die Schrittweite ergibt sich aus der Breite der ersten Karte plus Spaltenabstand,
 * damit sie bei responsiven Kartenbreiten nicht auseinanderläuft. An den Enden wird
 * umgebrochen (letzte → erste und umgekehrt).
 *
 * @param autoplayMs Intervall für den automatischen Weiterlauf. Ohne Wert kein Autoplay;
 *                   bei `prefers-reduced-motion` bleibt es in jedem Fall aus.
 */
export function useSnapCarousel(autoplayMs?: number) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback((direction: ScrollDirection) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>(`[${CAROUSEL_CARD_ATTR}]`);
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0");
    const cardWidth =
      firstCard?.getBoundingClientRect().width ?? track.clientWidth * 0.82;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextScroll =
      direction === "next"
        ? track.scrollLeft + cardWidth + gap
        : track.scrollLeft - cardWidth - gap;

    // Erst umbrechen, wenn der Track bereits am Anschlag steht – nicht schon,
    // wenn der nächste Schritt darüber hinausginge. Sonst wird die letzte Karte
    // übersprungen, weil ihre Snap-Position über `maxScroll` liegt und beim
    // Klick davor direkt auf 0 zurückgesprungen würde.
    const EDGE_TOLERANCE_PX = 8;
    const isAtEnd = track.scrollLeft >= maxScroll - EDGE_TOLERANCE_PX;
    const isAtStart = track.scrollLeft <= EDGE_TOLERANCE_PX;
    const target =
      direction === "next"
        ? isAtEnd
          ? 0
          : Math.min(nextScroll, maxScroll)
        : isAtStart
          ? maxScroll
          : Math.max(nextScroll, 0);

    track.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!autoplayMs) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      // Im versteckten Tab nicht weiterlaufen – sonst steht das Karussell
      // beim Zurückkehren an einer unerwarteten Stelle.
      if (document.hidden) return;
      scrollCarousel("next");
    }, autoplayMs);
    return () => window.clearInterval(interval);
  }, [autoplayMs, scrollCarousel]);

  return { trackRef, scrollCarousel };
}

type CarouselControlsProps = {
  onScroll: (direction: ScrollDirection) => void;
  prevLabel: string;
  nextLabel: string;
  className?: string;
};

/** Pfeile mit auslaufenden Linien, mittig unter dem Track. */
export function CarouselControls({
  onScroll,
  prevLabel,
  nextLabel,
  className = "",
}: CarouselControlsProps) {
  return (
    <div className={`flex items-center justify-center gap-8 ${className}`}>
      <button
        type="button"
        onClick={() => onScroll("prev")}
        className="group flex items-center gap-3 text-indigo-600 transition hover:text-indigo-800"
        aria-label={prevLabel}
      >
        <span className="h-px w-24 bg-current transition group-hover:w-28" />
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={() => onScroll("next")}
        className="group flex items-center gap-3 text-indigo-600 transition hover:text-indigo-800"
        aria-label={nextLabel}
      >
        <ChevronRight className="size-6" />
        <span className="h-px w-24 bg-current transition group-hover:w-28" />
      </button>
    </div>
  );
}
