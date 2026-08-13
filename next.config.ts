import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Modulbilder gehen als Server Action hoch; der Standard von 1 MB wäre für
    // ein Screenshot-PNG zu knapp. Die Prüfung auf 4 MB steckt in assets.ts.
    serverActions: { bodySizeLimit: "5mb" },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
  eslint: {
    // Don't block production builds on lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't block production builds on type errors
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  compress: true,

  /**
   * gleistrix.de liefert dieselben Seiten aus wie www.gleistrix.de. Für Google
   * sind das zwei Websites mit identischem Inhalt; die canonical-Links zeigen
   * zwar auf www, aber eine Weiterleitung ist das eindeutigere Signal und
   * verhindert, dass Besucher und Links sich auf zwei Adressen verteilen.
   *
   * Die Bedingung trifft ausschließlich die nackte Domain – localhost und
   * Vorschauadressen bleiben unberührt.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "gleistrix.de" }],
        destination: "https://www.gleistrix.de/:path*",
        permanent: true,
      },
      /**
       * /erp-bahnbau trug denselben Titel wie die Startseite und zielte auf
       * dieselbe Suchanfrage. Zwei URLs, die um eine Anfrage konkurrieren,
       * teilen ihre Links und Autorität auf – Google wählt eine aus, und das
       * war hier die inhaltsärmere Seite. Die Startseite übernimmt das Thema.
       *
       * `permanent: true` sendet 308, nicht 301. Google wertet beide gleich;
       * anders als 301 darf 308 die HTTP-Methode nicht ändern.
       */
      {
        source: "/erp-bahnbau",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
