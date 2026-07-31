type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  inverted?: boolean;
  showWordmark?: boolean;
};

export default function BrandLogo({
  className = "",
  markClassName = "h-10 w-10",
  wordmarkClassName = "text-xl md:text-2xl",
  inverted = false,
  showWordmark = true,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className={`shrink-0 overflow-visible ${markClassName}`}
      >
        <defs>
          <linearGradient id="gleistrix-mark-gradient" x1="9" y1="8" x2="56" y2="57" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#22D3EE" />
            <stop offset="0.42" stopColor="#3B82F6" />
            <stop offset="0.73" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#D946EF" />
          </linearGradient>
          <linearGradient id="gleistrix-mark-highlight" x1="18" y1="9" x2="42" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="gleistrix-mark-glow" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.31 0 0 0 0 0.27 0 0 0 0 0.90 0 0 0 .34 0"
            />
          </filter>
          <clipPath id="gleistrix-mark-clip">
            <path d="M20 5H55L44 18H27L16 29V39L26 49H43V43H32L43 30H59V48L48 59H20L4 43V22L20 5Z" />
          </clipPath>
        </defs>

        <path
          d="M20 5H55L44 18H27L16 29V39L26 49H43V43H32L43 30H59V48L48 59H20L4 43V22L20 5Z"
          fill="#6366F1"
          opacity="0.3"
          filter="url(#gleistrix-mark-glow)"
        />
        <path
          d="M20 5H55L44 18H27L16 29V39L26 49H43V43H32L43 30H59V48L48 59H20L4 43V22L20 5Z"
          fill="url(#gleistrix-mark-gradient)"
        />

        <g clipPath="url(#gleistrix-mark-clip)">
          <path d="M-2 4H58L42 21H18Z" fill="#38BDF8" opacity="0.34" />
          <path d="M3 19L22 38L12 51L-3 39Z" fill="#2563EB" opacity="0.28" />
          <path d="M11 42L33 64H5L-5 49Z" fill="#A855F7" opacity="0.38" />
          <path d="M31 38L66 27V64H43Z" fill="#C026D3" opacity="0.3" />
          <path d="M18 5L40 59" stroke="url(#gleistrix-mark-highlight)" strokeWidth="1.4" />
          <path d="M4 43L27 18" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1" />
          <path d="M26 49L43 30" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1" />
        </g>

        <path
          d="M20 5H55L44 18H27L16 29V39L26 49H43V43H32L43 30H59V48L48 59H20L4 43V22L20 5Z"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.2"
          strokeWidth="0.8"
        />
      </svg>

      {showWordmark && (
        <span
          className={`font-bold leading-none tracking-[-0.045em] ${
            inverted ? "text-white" : "text-slate-950"
          } ${wordmarkClassName}`}
        >
          Gleistrix
        </span>
      )}
    </span>
  );
}
