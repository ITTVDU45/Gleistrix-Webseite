import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Catalog, CatalogEntry } from "@/data/catalog";
import { groupEntries } from "@/data/catalog";
import Reveal from "@/components/landing/Reveal";

/**
 * Übersichtsraster eines Katalogs – nach Gruppen sortiert, jede Karte führt auf
 * die zugehörige Detailseite. Dieselbe Reihenfolge wie im Megamenü, weil beide
 * `groupEntries` verwenden.
 */
export default function CatalogGrid({ catalog }: { catalog: Catalog }) {
  const groups = groupEntries(catalog.entries);

  return (
    <div className="space-y-12 md:space-y-16">
      {groups.map((group) => (
        <section key={group.heading} aria-label={group.heading}>
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {group.heading}
            </h3>
            <span aria-hidden className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">{group.entries.length}</span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.entries.map((entry, index) => (
              <Reveal key={entry.slug} delay={index * 0.04}>
                <CatalogCard basePath={catalog.basePath} entry={entry} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CatalogCard({ basePath, entry }: { basePath: string; entry: CatalogEntry }) {
  const Icon = entry.icon;

  return (
    <Link
      href={`${basePath}/${entry.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-slate-900/8 bg-white p-6 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
    >
      {entry.logo ? (
        <span className="flex h-11 items-center">
          <Image
            src={entry.logo.src}
            alt=""
            width={entry.logo.width}
            height={entry.logo.height}
            sizes="128px"
            className="h-7 w-auto max-w-32 object-contain object-left"
          />
        </span>
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
      )}

      <h4 className="mt-5 text-base font-bold text-slate-900">{entry.title}</h4>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">{entry.tagline}</p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
        Mehr erfahren
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
