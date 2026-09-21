"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Stummer Endlos-Loop über einem Standbild.
 *
 * Das Standbild bleibt darunter liegen und dient als Poster: Es ist bereits
 * optimiert, trägt den Alt-Text und ist bei Bedarf das LCP-Element. Das Video
 * lädt erst, wenn es in den Sichtbereich kommt (`preload="none"` plus
 * IntersectionObserver), und blendet danach darüber ein.
 *
 * Bei „Bewegung reduzieren“ oder aktiviertem Datensparmodus wird es nie
 * geladen – dann bleibt es beim Standbild.
 */
type LoopVideoProps = {
  src: string;
  className?: string;
};

export default function LoopVideo({ src, className }: LoopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // ponytail: saveData setzt nur Chromium, anderswo ist connection undefined –
    // dort läuft der Loop wie gewohnt.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay kann scheitern (Energiesparmodus, Hintergrund-Tab). Dann
          // bleibt schlicht das Standbild stehen.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // Vorlauf, damit der Loop beim Erscheinen schon läuft statt erst zu laden.
      { rootMargin: "200px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      onPlaying={() => setIsPlaying(true)}
      // Beim Anhalten wieder auf das Standbild blenden – sonst bliebe das
      // eingefrorene Videobild über der Karte stehen.
      onPause={() => setIsPlaying(false)}
      className={cn(
        // Deckkraft und Zoom teilen sich eine Transition: Zwei getrennte
        // transition-Utilities würden sich gegenseitig überschreiben.
        "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isPlaying ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
