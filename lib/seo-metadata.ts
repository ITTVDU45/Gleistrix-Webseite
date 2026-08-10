import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/constants";

/**
 * Einheitliche, vollständige Metadaten für öffentliche Marketingseiten.
 * Verhindert insbesondere, dass Unterseiten die Open-Graph-URL und den
 * Open-Graph-Titel der Startseite erben.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const socialTitle = `${title} | ${SITE.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "de_DE",
      type,
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
  };
}
