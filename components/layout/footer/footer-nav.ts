import { MODULES, MODULE_CATALOG } from "@/data/modules";

/**
 * `action: "consent"` öffnet statt eines Seitenwechsels den
 * Datenschutz-Dialog. `href` bleibt trotzdem gesetzt und zeigt auf die
 * Datenschutzerklärung – ohne JavaScript führt der Eintrag dorthin, statt
 * ins Leere zu laufen.
 */
export type FooterLink = {
  href: string;
  label: string;
  action?: "consent";
};
export type FooterColumn = { heading: string; links: readonly FooterLink[] };

/**
 * Die Modulspalte kommt aus dem Katalog, nicht aus einer zweiten Liste. Sonst
 * fehlt hier jedes Modul, das später dazukommt – genau das war vorher der Fall.
 */
const MODULE_LINKS: readonly FooterLink[] = MODULES.map((module) => ({
  href: `${MODULE_CATALOG.basePath}/${module.slug}`,
  label: module.title,
}));

/**
 * Footer-Navigation. Links zeigen auf vorhandene Routen bzw. Landing-Anker.
 * `/#agb` ist der einzige verbliebene Platzhalter – eine AGB-Seite gibt es
 * noch nicht.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Plattform",
    links: MODULE_LINKS,
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
      { href: "/blog", label: "News & Ratgeber" },
      { href: "/#faq-heading", label: "Hilfe" },
      { href: "/integrationen", label: "Integrationen" },
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/impressum", label: "Impressum" },
    ],
  },
] as const;

export const FOOTER_LEGAL: readonly FooterLink[] = [
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/impressum", label: "Impressum" },
  { href: "/#agb", label: "AGB" },
  { href: "/datenschutz", label: "Cookie-Einstellungen", action: "consent" },
] as const;
