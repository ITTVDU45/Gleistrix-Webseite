import type { Metadata } from "next";
import { SITE, SITE_URL } from "@/lib/constants";

/**
 * Standard-Vorschaubild für geteilte Links.
 *
 * Next.js liefert `app/opengraph-image.tsx` nur so lange automatisch aus, wie
 * eine Seite kein eigenes `openGraph`-Objekt setzt – genau das tut diese
 * Funktion. Ohne diese Vorbelegung verlieren alle Seiten außer der Startseite
 * ihr og:image, und geteilte Links erscheinen als bildlose Textzeile.
 */
const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Einheitliche vollständige Metadaten für öffentliche Seiten. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * Seiteneigenes Vorschaubild, als Pfad ab der Wurzel (z. B. "/reports.png").
   * Wird gegen SITE_URL zur vollen Adresse aufgelöst – relative Angaben
   * ignorieren Facebook, LinkedIn und Slack.
   *
   * Ohne Angabe greift DEFAULT_OG_IMAGE, sodass jede Seite eine gefüllte Karte
   * hat.
   */
  image?: string;
  type?: "website" | "article";
  /** Veröffentlichungsdatum als ISO-String, nur für `type: "article"`. */
  publishedTime?: string;
  index?: boolean;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const socialTitle = `${title} | ${SITE.name}`;
  const images = [new URL(image ?? DEFAULT_OG_IMAGE, SITE_URL).toString()];

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
      images,
      ...(type === "article"
        ? { type: "article" as const, ...(publishedTime ? { publishedTime } : {}) }
        : { type: "website" as const }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images,
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
