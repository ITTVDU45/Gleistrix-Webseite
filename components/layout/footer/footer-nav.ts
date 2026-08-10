import { MODULES, MODULE_CATALOG } from "@/data/modules";

export type FooterLink = {
  href: string;
  label: string;
  action?: "consent";
};
export type FooterColumn = { heading: string; links: readonly FooterLink[] };

const MODULE_LINKS: readonly FooterLink[] = MODULES.map((module) => ({
  href: `${MODULE_CATALOG.basePath}/${module.slug}`,
  label: module.title,
}));

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  { heading: "Plattform", links: MODULE_LINKS },
  {
    heading: "Lösungen",
    links: [
      { href: "/erp-bahnbau", label: "ERP für Bahnbau" },
      { href: "/software-sicherungsunternehmen", label: "Software für Sicherungsunternehmen" },
      { href: "/disposition-bahnbau", label: "Disposition Bahnbau" },
      { href: "/branchen", label: "Alle Branchen" },
      { href: "/integrationen", label: "Integrationen" },
    ],
  },
  {
    heading: "Unternehmen",
    links: [
      { href: "/ueber-uns", label: "Über Gleistrix" },
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
