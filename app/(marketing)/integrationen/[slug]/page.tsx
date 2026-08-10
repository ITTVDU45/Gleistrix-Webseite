import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/catalog/CatalogDetail";
import { INTEGRATION_CATALOG, INTEGRATION_PAGES } from "@/data/integration-pages";

/** Nur die Slugs aus data/integration-pages.ts existieren – alles andere ist 404. */
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INTEGRATION_PAGES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = INTEGRATION_PAGES.find((item) => item.slug === slug);
  if (!entry) return {};

  return {
    title: `${entry.title} verbinden`,
    description: entry.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = INTEGRATION_PAGES.find((item) => item.slug === slug);
  if (!entry) notFound();

  return (
    <main className="bg-white">
      <CatalogDetail catalog={INTEGRATION_CATALOG} entry={entry} />
    </main>
  );
}
