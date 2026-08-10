import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/catalog/CatalogDetail";
import { INDUSTRIES, INDUSTRY_CATALOG } from "@/data/industries";

/** Nur die Slugs aus data/industries.ts existieren – alles andere ist 404. */
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INDUSTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = INDUSTRIES.find((item) => item.slug === slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = INDUSTRIES.find((item) => item.slug === slug);
  if (!entry) notFound();

  return (
    <main className="bg-white">
      <CatalogDetail catalog={INDUSTRY_CATALOG} entry={entry} />
    </main>
  );
}
