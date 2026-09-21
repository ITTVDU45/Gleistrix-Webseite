import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo-metadata";

const RATGEBER_TITLE = "Bahnbau Ratgeber: Disposition, Zeiterfassung & Abrechnung";

// Der Titel als reiner String unterbrach die Vorlage des Root-Layouts: Die
// Artikelseiten darunter hießen im Suchergebnis nur "SIPO-Einsätze …" ohne
// Marke. Mit eigener Vorlage tragen sie wieder "| Gleistrix".
export const metadata: Metadata = {
  ...pageMetadata({
    title: RATGEBER_TITLE,
    description:
      "Praxiswissen für Bahndienstleister zu Disposition, Sicherung, Zeiterfassung, Fuhrpark, Nachweisen, Projektsteuerung und Abrechnung im Bahnbau.",
    path: "/blog",
  }),
  title: { default: RATGEBER_TITLE, template: `%s | ${SITE.name}` },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
