import Image from "next/image";
import Reveal from "@/components/landing/Reveal";
import { cn } from "@/lib/utils";

/**
 * Einheitlicher Bildrahmen für alle Marketing-Sektionen.
 *
 * Bewusst eine Komponente statt Bild-Markup je Sektion: Radius, Rahmen,
 * Schatten, Einblendung und Hover-Zoom bleiben dadurch über die ganze Seite
 * identisch, und ein späterer Wechsel von Platzhalter zu Foto ist ein reiner
 * Pfadtausch.
 */

type Ratio = "wide" | "landscape" | "portrait" | "square" | "banner" | "strip" | "fill";

const RATIO_CLASSES: Record<Ratio, string> = {
  wide: "aspect-[16/9]",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  banner: "aspect-[21/9]",
  // Schmaler Streifen über die volle Breite. Ab sm eine feste Höhe statt eines
  // Verhältnisses – sonst wächst das Bild auf großen Viewports zur eigenen
  // Sektion heran, obwohl es nur einen Übergang markieren soll.
  strip: "aspect-[21/9] sm:aspect-auto sm:h-40 md:h-48",
  // "fill" übernimmt die Höhe der Grid-Spalte statt ein eigenes Verhältnis
  // vorzugeben – für Bilder, die neben einer Kartenspalte auf gleicher Höhe
  // enden sollen. Auf schmalen Viewports fällt es auf 4:3 zurück.
  fill: "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[22rem]",
};

type MediaFrameProps = {
  src: string;
  alt: string;
  ratio?: Ratio;
  /** Kurzer Text, der unten im Bild auf dunklem Verlauf steht. */
  caption?: string;
  /** Verzögerung der Scroll-Einblendung in Sekunden. */
  delay?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export default function MediaFrame({
  src,
  alt,
  ratio = "landscape",
  caption,
  delay = 0,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: MediaFrameProps) {
  return (
    <Reveal delay={delay} className={cn("min-w-0", className)}>
      <figure
        className={cn(
          "group relative isolate w-full overflow-hidden rounded-2xl border border-slate-900/8 bg-slate-100 shadow-soft-sm transition-shadow duration-500 hover:shadow-soft sm:rounded-3xl",
          RATIO_CLASSES[ratio],
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          // Lokale SVG-Platzhalter laufen nicht durch den Bildoptimierer; sobald
          // hier ein Foto liegt, greift die Optimierung wieder automatisch.
          unoptimized={src.endsWith(".svg")}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        {caption && (
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent px-4 pb-4 pt-10 text-sm font-medium text-white sm:px-5 sm:pb-5">
            {caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
