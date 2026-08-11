import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/catalog/CatalogDetail";
import { INTEGRATION_CATALOG, INTEGRATION_PAGES } from "@/data/integration-pages";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo-metadata";

export const dynamicParams = false;
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INTEGRATION_PAGES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = INTEGRATION_PAGES.find((item) => item.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: `${entry.title} Integration für Bahndienstleister`,
    description: entry.description,
    path: `/integrationen/${entry.slug}`,
    // Nur das Foto, nicht `entry.logo`: Integrationslogos sind schmale
    // Freisteller mit Transparenz und ergeben als Vorschaubild eine Karte, die
    // auf dunklen Oberflächen unsichtbar ist.
    image: entry.image,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = INTEGRATION_PAGES.find((item) => item.slug === slug);
  if (!entry) notFound();
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "Integrationen", path: "/integrationen" },
    { name: entry.title, path: `/integrationen/${entry.slug}` },
  ]);

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <CatalogDetail catalog={INTEGRATION_CATALOG} entry={entry} />
    </main>
  );
}
