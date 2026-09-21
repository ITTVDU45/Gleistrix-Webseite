/** Echtes Seitenverhältnis der Lockup-Dateien unter /public/logos. */
const LOCKUP_WIDTH = 1664;
const LOCKUP_HEIGHT = 326;

type BrandLogoProps = {
  /** Höhe setzen, Breite ergibt sich aus dem Seitenverhältnis (z. B. "h-8 md:h-9"). */
  className?: string;
  /** Weisse Variante für dunkle Flächen. */
  inverted?: boolean;
};

export default function BrandLogo({ className = "h-8", inverted = false }: BrandLogoProps) {
  return (
    // Bewusst <img> statt next/image: die Datei ist ein SVG, das der Optimizer
    // ohnehin unverändert durchreicht – und so bleibt /public/logos die einzige
    // Quelle der Wahrheit für die Marke.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={inverted ? "/logos/gleistrix-logo-weiss.svg" : "/logos/gleistrix-logo.svg"}
      alt="Gleistrix"
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      draggable={false}
      className={`w-auto select-none ${className}`}
    />
  );
}
