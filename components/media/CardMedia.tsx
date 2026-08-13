import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Randloses Bild am Kopf einer Karte.
 *
 * Gegenstück zu `MediaFrame`: Der Rahmen kommt hier von der Karte, nicht vom
 * Bild. Der Zoom hängt am `group`-Hover der Karte, damit Bild und Karte
 * gemeinsam reagieren.
 */
type CardMediaProps = {
  src: string;
  alt: string;
  /** Tailwind-Aspect-Klasse, z. B. "aspect-[16/9]". */
  aspect?: string;
  sizes?: string;
  className?: string;
};

export default function CardMedia({
  src,
  alt,
  aspect = "aspect-[16/9]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
}: CardMediaProps) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-slate-100", aspect, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        // Siehe MediaFrame: SVG-Platzhalter am Optimierer vorbei.
        unoptimized={src.endsWith(".svg")}
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
    </div>
  );
}
