import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/constants";

/** Einheitliche vollständige Metadaten für öffentliche Seiten. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * Vorschaubild für geteilte Links, als Pfad ab der Wurzel (z. B.
   * "/reports.png"). Wird gegen SITE_URL zur vollen Adresse aufgelöst –
   * relative Angaben ignorieren Facebook, LinkedIn und Slack.
   *
   * Ohne Bild fällt die Karte auf `summary` zurück: `summary_large_image` ohne
   * Bild verspricht eine große Fläche, die dann leer bleibt.
   */
  image?: string;
  type?: "website" | "article";
  index?: boolean;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const socialTitle = `${title} | ${SITE.name}`;
  const images = image ? [new URL(image, SITE_URL).toString()] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "de_DE",
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/** BreadcrumbList für sichtbare Breadcrumb-Navigation und Suchmaschinen. */
export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}

/**
 * FAQPage für Detailseiten mit Fragenabschnitt.
 *
 * Google zeigt daraus seit 2023 nur noch selten ein aufklappbares Rich Result,
 * ordnet die Antworten aber weiterhin der Seite zu – und Antwortmaschinen lesen
 * sie direkt aus. Bedingung: Frage und Antwort müssen genau so auch sichtbar
 * auf der Seite stehen, sonst gilt die Auszeichnung als Spam.
 */
export function faqPageJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
