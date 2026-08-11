import type { LucideIcon } from "lucide-react";

/**
 * Gemeinsamer Inhaltskatalog für Module, Branchen und Integrationen.
 *
 * Alle drei Bereiche zeigen im Megamenü dieselbe Struktur und dahinter dieselbe
 * Detailseite – es unterscheiden sich nur Inhalte und Bilder. Deshalb teilen sie
 * sich einen Typ: eine Vorlage, drei Datenlisten, statt drei Mal derselbe
 * Seitenaufbau.
 *
 * Nicht zu verwechseln mit `moduleCatalog()` aus lib/admin/modules – das ist der
 * Preis- und Lizenzkatalog für Mandanten und hat mit den Marketingseiten nichts
 * zu tun.
 */

/** Ein Punkt im Nutzenraster der Detailseite. */
export type CatalogHighlight = {
  title: string;
  text: string;
};

/**
 * Gegenüberstellung im Abschnitt "Herausforderung & Lösung": links die
 * Situation ohne System, rechts dieselbe Situation mit Gleistrix.
 */
export type CatalogChallenge = {
  problem: string;
  solution: string;
};

/** Ein Schritt im Ablaufabschnitt der Detailseite. */
export type CatalogStep = {
  title: string;
  text: string;
};

/**
 * Frage und Antwort im FAQ-Abschnitt. Der Text steht sichtbar im Markup und
 * wird zusätzlich als FAQPage ausgezeichnet – deshalb ganze Sätze ohne
 * Aufzählungen, Links oder Auszeichnungen.
 */
export type CatalogFaq = {
  question: string;
  answer: string;
};

export type CatalogEntry = {
  /** Letztes Segment der URL. Innerhalb eines Katalogs eindeutig. */
  slug: string;
  title: string;
  /** Eine Zeile – im Megamenü unter dem Titel und auf den Übersichtskarten. */
  tagline: string;
  /** Absatz im Seitenkopf der Detailseite. */
  description: string;
  /**
   * Beschreibung für das Suchergebnis. Ohne Angabe greift `description` – die
   * ist als Fließtext im Seitenkopf gedacht und dafür oft zu lang: Google
   * schneidet den Ausschnitt bei rund 160 Zeichen ab, und was dahinter steht,
   * sieht niemand. Deshalb hier eine eigene, kürzere Fassung mit den Begriffen
   * vorn, nach denen tatsächlich gesucht wird.
   */
  metaDescription?: string;
  icon: LucideIcon;
  /** Spaltenüberschrift im Megamenü und in der Übersicht. */
  group: string;
  /** Motiv im Seitenkopf. Ohne Bild rendert die Detailseite die Logokarte. */
  image?: string;
  /** Logo statt Foto – so treten Integrationen auf. */
  logo?: { src: string; width: number; height: number };
  highlights: CatalogHighlight[];
  bullets: string[];
  /**
   * Die folgenden drei Abschnitte sind optional: Ohne Angabe entfällt der
   * jeweilige Abschnitt ersatzlos. Gepflegt sind sie bisher nur für die Module
   * – Branchen und Integrationen rendern dieselbe Vorlage ohne diese Blöcke.
   */
  challenges?: CatalogChallenge[];
  steps?: CatalogStep[];
  /** Erzeugt zusätzlich die FAQPage-Auszeichnung der Detailseite. */
  faqs?: CatalogFaq[];
};

export type CatalogGroup = {
  heading: string;
  entries: CatalogEntry[];
};

/** Kopfdaten eines Katalogs – Beschriftungen für Menü, Übersicht und Seiten. */
export type Catalog = {
  /** Basispfad ohne Schrägstrich am Ende, z. B. "/branchen". */
  basePath: string;
  /** Einzahl, steht als Marke über der Überschrift der Detailseite. */
  singular: string;
  /** Mehrzahl, beschriftet Menü, Brotkrume und Verweisleiste. */
  plural: string;
  /** Zeile rechts oben im Megamenü, z. B. "14 Apps · in einem Klick verbunden". */
  menuNote: string;
  /**
   * Überschrift über der Leistungsliste. `{title}` wird durch den Eintrag
   * ersetzt – "Das steckt in Dokumentenmanagement" passt für Module, nicht für
   * Branchen.
   */
  scopeHeading: string;
  /** Überschrift des Abschlussbanners, ebenfalls mit `{title}`. */
  ctaHeading: string;
  /** Ziel des Links am Fuß des Megamenüs. */
  overviewHref: string;
  overviewLabel: string;
  entries: CatalogEntry[];
};

/** Setzt den Eintragstitel in eine Katalogüberschrift ein. */
export function fillHeading(template: string, title: string): string {
  return template.replaceAll("{title}", title);
}

/**
 * Einträge in Gruppen bündeln. Die Reihenfolge folgt dem ersten Auftreten der
 * Gruppe in der Liste – so bestimmt die Datendatei die Spaltenfolge im
 * Megamenü, ohne dass daneben eine zweite Sortierliste gepflegt werden muss.
 */
export function groupEntries(entries: readonly CatalogEntry[]): CatalogGroup[] {
  const groups: CatalogGroup[] = [];

  for (const entry of entries) {
    const existing = groups.find((group) => group.heading === entry.group);
    if (existing) {
      existing.entries.push(entry);
      continue;
    }
    groups.push({ heading: entry.group, entries: [entry] });
  }

  return groups;
}

/** Nachbareinträge für die Verweisleiste am Fuß einer Detailseite. */
export function relatedEntries(
  entries: readonly CatalogEntry[],
  slug: string,
  limit = 3,
): CatalogEntry[] {
  const current = entries.find((entry) => entry.slug === slug);
  const others = entries.filter((entry) => entry.slug !== slug);
  // Erst die Nachbarn aus derselben Gruppe, dann der Rest – bei kleinen Gruppen
  // bleibt die Leiste so trotzdem gefüllt.
  const sameGroup = others.filter((entry) => entry.group === current?.group);
  const rest = others.filter((entry) => entry.group !== current?.group);

  return [...sameGroup, ...rest].slice(0, limit);
}
