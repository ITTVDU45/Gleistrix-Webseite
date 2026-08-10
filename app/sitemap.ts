import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { INDUSTRIES } from "@/data/industries";
import { INTEGRATION_PAGES } from "@/data/integration-pages";
import { MODULES } from "@/data/modules";
import { listPublicArticles } from "@/lib/admin/blog/store";

/**
 * Die Sitemap wird zur Laufzeit erzeugt, weil die Blogartikel aus der Datenbank
 * kommen und geplante Beiträge sonst erst beim nächsten Deployment auftauchen
 * würden. Zehn Minuten Cache entspricht dem, was app/blog/page.tsx nutzt.
 */
export const revalidate = 600;

/** Alles unter /admin und /api bleibt bewusst draußen (siehe app/robots.ts). */
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
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listPublicArticles();
  const now = new Date();

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...MODULES.map((entry) => ({
      url: `${SITE_URL}/produkt/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...INDUSTRIES.map((entry) => ({
      url: `${SITE_URL}/branchen/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...INTEGRATION_PAGES.map((entry) => ({
      url: `${SITE_URL}/integrationen/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      // article.date ist ein ISO-Datum (siehe articleDate in blog/store.ts).
      lastModified: new Date(article.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
