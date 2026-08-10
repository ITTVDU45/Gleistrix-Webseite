import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/catalog/CatalogDetail";
import { MODULES, MODULE_CATALOG } from "@/data/modules";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo-metadata";

export const dynamicParams = false;
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MODULES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = MODULES.find((item) => item.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: `${entry.title} für Bahndienstleister`,
    description: entry.description,
    path: `/produkt/${entry.slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = MODULES.find((item) => item.slug === slug);
  if (!entry) notFound();
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "Module", path: "/produkt" },
    { name: entry.title, path: `/produkt/${entry.slug}` },
  ]);

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <CatalogDetail catalog={MODULE_CATALOG} entry={entry} />
    </main>
  );
}
