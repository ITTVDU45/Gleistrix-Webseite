import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { INDUSTRIES } from "@/data/industries";
import { INTEGRATION_PAGES } from "@/data/integration-pages";
import { MODULES } from "@/data/modules";
import { listPublicArticles } from "@/lib/admin/blog/store";

export const revalidate = 600;

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles();

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...MODULES.map((entry) => ({ url: `${SITE_URL}/produkt/${entry.slug}` })),
    ...INDUSTRIES.map((entry) => ({ url: `${SITE_URL}/branchen/${entry.slug}` })),
    ...INTEGRATION_PAGES.map((entry) => ({ url: `${SITE_URL}/integrationen/${entry.slug}` })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: new Date(article.date),
    })),
  ];
}
