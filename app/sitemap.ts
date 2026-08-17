import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { INDUSTRIES } from "@/data/industries";
import { INTEGRATION_PAGES } from "@/data/integration-pages";
import { MODULES } from "@/data/modules";
import { listPublicArticles } from "@/lib/admin/blog/store";

export const revalidate = 600;

/**
 * Letzte inhaltliche Überarbeitung der Katalog- und Übersichtsseiten.
 *
 * Google nutzt `lastmod`, um Crawl-Budget zu verteilen – ohne die Angabe bleibt
 * eine Änderung länger unbemerkt. Ein Datum für alle diese Seiten ist hier
 * korrekt, weil sie gemeinsam überarbeitet wurden: Modul-, Branchen- und
 * Integrationsseiten haben an diesem Tag Querverweise bekommen, die Branchen-
 * und Integrationsseiten zusätzlich Inhalt.
 *
 * Bewusst grob und von Hand gepflegt: Ein Datum pro Eintrag wäre genauer,
 * müsste aber in jedem der 20 Datensätze mitgeführt werden. Wer Inhalte
 * ändert, hebt diesen Wert – ein zu altes lastmod ist harmlos, ein zu neues
 * kostet Glaubwürdigkeit, weil Google unzuverlässige Angaben künftig ignoriert.
 */
const CONTENT_REVISION = new Date("2026-08-17");

const STATIC_PATHS = [
  "/",
  "/produkt",
  "/preise",
  "/branchen",
  "/integrationen",
  "/blog",
  "/ueber-uns",
  "/demo-buchen",
  "/impressum",
  "/datenschutz",
  // Suchintention-orientierte Landingpages. Jede Seite deckt ein eigenständiges
  // Thema ab und verlinkt in die tieferen Modul- und Branchenseiten.
  //
  // Die drei Keyword-Landingpages /erp-bahnbau, /disposition-bahnbau und
  // /software-sicherungsunternehmen fehlen hier bewusst: sie leiten dauerhaft
  // auf die Startseite, die Modulseite bzw. die Branchenseite weiter (siehe
  // next.config.ts). Weitergeleitete URLs gehören nicht in die Sitemap.
] as const;

/**
 * Statische Seiten, deren Inhalt zur CONTENT_REVISION überarbeitet wurde. Die
 * übrigen bleiben ohne lastmod.
 */
const REVISED_PATHS = new Set<string>(["/", "/produkt", "/preise", "/branchen", "/integrationen"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles();

  return [
    // Ohne lastmod: Impressum, Datenschutz, /blog, /ueber-uns und /demo-buchen
    // wurden inhaltlich nicht angefasst. Ein Datum zu behaupten, das nicht
    // stimmt, ist schlechter als keins.
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      ...(REVISED_PATHS.has(path) ? { lastModified: CONTENT_REVISION } : {}),
    })),
    ...MODULES.map((entry) => ({
      url: `${SITE_URL}/produkt/${entry.slug}`,
      lastModified: CONTENT_REVISION,
    })),
    ...INDUSTRIES.map((entry) => ({
      url: `${SITE_URL}/branchen/${entry.slug}`,
      lastModified: CONTENT_REVISION,
    })),
    // Integrationen, die auf die Übersicht kanonisieren, bleiben draußen: eine
    // URL, die selbst auf eine andere als die zu indexierende Fassung
    // verweist, gehört nicht in die Sitemap.
    ...INTEGRATION_PAGES.filter((entry) => !entry.canonicalTo).map((entry) => ({
      url: `${SITE_URL}/integrationen/${entry.slug}`,
      lastModified: CONTENT_REVISION,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: new Date(article.date),
    })),
  ];
}
