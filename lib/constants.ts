export const COLORS = {
  primary: "#4f46e5",
  secondary: "#8b5cf6",
  background: "#f8fafc",
  text: "#0f172a",
} as const;

/**
 * Kanonische Adresse der Marketingseite – www ist die gewinnende Variante.
 * Sitemap, robots.txt und die canonical-Links hängen daran; ohne einheitliche
 * Basis indexiert Google dieselbe Seite doppelt (mit und ohne www).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.gleistrix.de"
).replace(/\/+$/, "");

export const SITE = {
  name: "Gleistrix",
  url: SITE_URL,
  description:
    "Gleistrix bündelt Projektmanagement, Einsatzplanung, Dokumente, Lager, Abrechnung und KI-Agenten in einer zentralen SaaS-Lösung für Bahndienstleister.",
} as const;


