import type { Catalog } from "@/data/catalog";
import { INDUSTRY_CATALOG } from "@/data/industries";
import { INTEGRATION_CATALOG } from "@/data/integration-pages";
import { MODULE_CATALOG } from "@/data/modules";

/**
 * Hauptnavigation.
 *
 * Einträge mit `catalog` öffnen ein Megamenü; ihr `href` bleibt trotzdem
 * erreichbar – per Klick auf den Eintrag, per Tastatur und ohne JavaScript.
 */
export type NavItem = {
  href: string;
  label: string;
  /** Gesetzt ⇒ der Eintrag klappt ein Megamenü auf. */
  catalog?: Catalog;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: MODULE_CATALOG.overviewHref, label: "Module", catalog: MODULE_CATALOG },
  { href: INDUSTRY_CATALOG.overviewHref, label: "Branchen", catalog: INDUSTRY_CATALOG },
  {
    href: INTEGRATION_CATALOG.overviewHref,
    label: "Integrationen",
    catalog: INTEGRATION_CATALOG,
  },
  { href: "/#ki-agenten", label: "KI-Agenten" },
  { href: "/preise", label: "Preise" },
  { href: "/blog", label: "News & Ratgeber" },
  { href: "/ueber-uns", label: "Kontakt" },
] as const;
