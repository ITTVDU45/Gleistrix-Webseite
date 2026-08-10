import type { ReactNode } from "react";
import { getPublicArticle } from "@/lib/admin/blog/store";
import { SITE, SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd } from "@/lib/seo-metadata";

export default async function BlogArticleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublicArticle(slug);

  if (!article) return children;

  const url = `${SITE_URL}/blog/${article.slug}`;
  const description = article.seo.description || article.teaser;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: url,
    image: article.imageSrc ? [new URL(article.imageSrc, SITE_URL).toString()] : undefined,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/gleistrix-email-logo.png`,
      },
    },
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "News & Ratgeber", path: "/blog" },
    { name: article.title, path: `/blog/${article.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {children}
    </>
  );
}
