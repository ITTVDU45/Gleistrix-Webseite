import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Adminbereich und Schnittstellen gehören nicht in den Index. Das ist
      // kein Zugriffsschutz – der sitzt in der Middleware –, sondern verhindert
      // nur, dass Loginmasken und JSON-Antworten in den Suchergebnissen landen.
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
