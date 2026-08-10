import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Catalog, CatalogEntry } from "@/data/catalog";
import { groupEntries } from "@/data/catalog";

/**
 * Inhalt eines Megamenüs. Die Spalten entstehen aus den Gruppen des Katalogs –
 * dieselbe Reihenfolge wie auf der Übersichtsseite, weil beide `groupEntries`
 * benutzen.
 *
 * Die Komponente hält keinen Zustand: Öffnen und Schließen steuert der Header,
 * damit Maus- und Tastaturbedienung an einer Stelle liegen.
 */

/** Feste Klassen statt interpolierter Werte – Tailwind liest den Quelltext. */
const COLUMN_CLASS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export default function MegaMenu({
  catalog,
  onNavigate,
}: {
  catalog: Catalog;
  onNavigate?: () => void;
}) {
  const groups = groupEntries(catalog.entries);
  const columns = COLUMN_CLASS[Math.min(groups.length, 4)] ?? COLUMN_CLASS[4];

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_36px_90px_-38px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 px-7 py-4">
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-indigo-600">
          {catalog.plural}
        </span>
        <span className="text-xs text-slate-400">{catalog.menuNote}</span>
      </div>

      <div className={`grid gap-x-6 gap-y-8 px-5 py-6 ${columns}`}>
        {groups.map((group) => (
          <div key={group.heading} className="min-w-0">
            <h3 className="px-3 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-slate-400">
              {group.heading}
            </h3>
            <ul className="mt-3 space-y-0.5">
              {group.entries.map((entry) => (
                <li key={entry.slug}>
                  <MegaMenuItem basePath={catalog.basePath} entry={entry} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link
        href={catalog.overviewHref}
        onClick={onNavigate}
        className="group flex items-center justify-between gap-4 border-t border-slate-200/70 bg-slate-50/70 px-7 py-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
      >
        {catalog.overviewLabel}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 text-indigo-600 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

function MegaMenuItem({
  basePath,
  entry,
  onNavigate,
}: {
  basePath: string;
  entry: CatalogEntry;
  onNavigate?: () => void;
}) {
  const Icon = entry.icon;

  return (
    <Link
      href={`${basePath}/${entry.slug}`}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white text-indigo-600 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50">
        {entry.logo ? (
          <Image
            src={entry.logo.src}
            alt=""
            width={entry.logo.width}
            height={entry.logo.height}
            sizes="36px"
            className="h-4 w-auto max-w-[1.4rem] object-contain"
          />
        ) : (
          <Icon aria-hidden className="h-[18px] w-[18px]" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.86rem] font-semibold leading-snug text-slate-900">
          {entry.title}
        </span>
        <span className="mt-0.5 block line-clamp-2 text-xs leading-snug text-slate-500">
          {entry.tagline}
        </span>
      </span>
    </Link>
  );
}
