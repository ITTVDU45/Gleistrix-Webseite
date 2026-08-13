import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/catalog/CatalogDetail";
import { INDUSTRIES, INDUSTRY_CATALOG } from "@/data/industries";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo-metadata";

export const dynamicParams = false;
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INDUSTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = INDUSTRIES.find((item) => item.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: entry.metaTitle ?? `Software für ${entry.title}`,
    description: entry.metaDescription ?? entry.description,
    path: `/branchen/${entry.slug}`,
    image: entry.image,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const entry = INDUSTRIES.find((item) => item.slug === slug);
  if (!entry) notFound();
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "Branchen", path: "/branchen" },
    { name: entry.title, path: `/branchen/${entry.slug}` },
  ]);

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <CatalogDetail catalog={INDUSTRY_CATALOG} entry={entry} />
    </main>
  );
}
