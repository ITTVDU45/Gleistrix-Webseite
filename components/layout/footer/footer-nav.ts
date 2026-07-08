export type FooterLink = { href: string; label: string };
export type FooterColumn = { heading: string; links: readonly FooterLink[] };

/**
 * Footer-Navigation. Links zeigen auf vorhandene Routen bzw. Landing-Anker.
 * Rein rechtliche Seiten (Datenschutz, Impressum, AGB) existieren noch nicht
 * als eigene Route und verweisen als Platzhalter auf die Startseite.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Plattform",
    links: [
      { href: "/produkt/projektplanung-disposition", label: "Projektmanagement" },
      { href: "/produkt/kalender-einsatzuebersicht", label: "Plantafel" },
      { href: "/produkt/dokumentenmanagement", label: "Dokumentenmanagement" },
      { href: "/produkt", label: "Lagerverwaltung" },
      { href: "/produkt/rechnungsstellung", label: "Abrechnung" },
    ],
  },
  {
    heading: "KI-Agenten",
    links: [
      { href: "/#ki-agenten", label: "LV-Agent" },
      { href: "/#ki-agenten", label: "Dokumentationsagent" },
      { href: "/#ki-agenten", label: "Mängel-Agent" },
      { href: "/#ki-agenten", label: "Ausschreibungsagent" },
      { href: "/#ki-agenten", label: "Abrechnungsagent" },
    ],
  },
  {
    heading: "Unternehmen",
    links: [
      { href: "/ueber-uns", label: "Über Gleistrix" },
      { href: "/branchen", label: "Branchen" },
      { href: "/preise", label: "Preise" },
      { href: "/demo-buchen", label: "Kontakt" },
      { href: "/demo-buchen", label: "Demo anfragen" },
    ],
  },
  {
    heading: "Ressourcen",
    links: [
      { href: "/#faq-heading", label: "Hilfe" },
      { href: "/produkt", label: "Dokumentation" },
      { href: "/#datenschutz", label: "Datenschutz" },
      { href: "/#impressum", label: "Impressum" },
      { href: "/#module", label: "Module" },
    ],
  },
] as const;

export const FOOTER_LEGAL: readonly FooterLink[] = [
  { href: "/#datenschutz", label: "Datenschutz" },
  { href: "/#impressum", label: "Impressum" },
  { href: "/#agb", label: "AGB" },
  { href: "/#cookies", label: "Cookie-Einstellungen" },
] as const;
