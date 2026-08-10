import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { listPublicArticles } from "@/lib/admin/blog/store";

import BlogCarousel from "./BlogCarousel";
import SectionHeading from "./SectionHeading";

/**
 * News-Sektion der Startseite.
 *
 * Die sechs Artikel standen früher als Konstante in dieser Datei. Sie kommen
 * jetzt aus der Ablage – gepflegt im Adminbereich unter „Blog & News“, mit
 * data/blog.ts als Auslieferungszustand. Damit ist die Sektion vor der ersten
 * Pflege genauso vollständig wie vorher, führt aber auf echte Artikelseiten
 * statt pauschal auf die Übersicht.
 *
 * Server-Komponente ohne Props: einsetzbar auf jeder Seite, die sie braucht.
 */
export default async function BlogSection() {
  const posts = await listPublicArticles(6);
  if (posts.length === 0) return null;

  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="scroll-mt-24 overflow-hidden bg-[#f8fafc] py-20 md:py-28"
    >
      <div className="page-container">
        <SectionHeading
          eyebrow="Blog"
          title={
            <span id="blog-heading">
              News &amp; <span className="text-gradient-accent">Ratgeber</span>
            </span>
          }
          description="Aktuelle Einblicke zu Disposition, Sicherung, Abrechnung und vernetzten Bahn-Workflows."
        />

        <BlogCarousel posts={posts} />

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-soft-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            Alle Beiträge ansehen
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
