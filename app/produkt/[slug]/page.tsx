import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/catalog/CatalogDetail";
import { MODULES, MODULE_CATALOG } from "@/data/modules";

/** Nur die Slugs aus data/modules.ts existieren – alles andere ist 404. */
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MODULES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = MODULES.find((item) => item.slug === slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = MODULES.find((item) => item.slug === slug);
  if (!entry) notFound();

  return (
    <main className="bg-white">
      <CatalogDetail catalog={MODULE_CATALOG} entry={entry} />
    </main>
  );
}
