"use client";

import Image from "next/image";
import Link from "next/link";

import type { PublicBlogArticle } from "@/types/blog";

import Reveal from "./Reveal";
import { CAROUSEL_CARD_ATTR, CarouselControls, useSnapCarousel } from "./carousel";

/**
 * Karussell der Blogkarten.
 *
 * Getrennt von BlogSection, weil das Karussell Client-JavaScript braucht
 * (Scrollposition, Autolauf), das Lesen der Artikel aber auf dem Server
 * passiert. So bleibt die Sektion eine Server-Komponente, die sich ohne
 * weiteres Zutun auf jeder Seite einsetzen lässt.
 */

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function BlogCarousel({ posts }: { posts: PublicBlogArticle[] }) {
  const { trackRef, scrollCarousel } = useSnapCarousel(6200);

  return (
    <div className="relative mt-12 md:mt-16">
      <div
        ref={trackRef}
        className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-5"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 64px, black calc(100% - 64px), transparent 100%)",
        }}
        aria-label="Aktuelle Blogartikel"
      >
        {posts.map((post, index) => (
          <Reveal
            key={post.slug}
            delay={index * 0.05}
            className="min-w-[86%] snap-center sm:min-w-[70%] md:min-w-[560px] lg:min-w-[680px]"
          >
            <Link
              href={`/blog/${post.slug}`}
              {...{ [CAROUSEL_CARD_ATTR]: true }}
              className="group relative block h-[420px] overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft md:h-[460px]"
            >
              {post.imageSrc ? (
                <Image
                  src={post.imageSrc}
                  alt={post.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 680px, (min-width: 768px) 560px, 86vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />

              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-5 shadow-soft md:inset-x-6 md:bottom-6 md:p-6">
                <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
                  {post.category}
                </span>
                <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight text-slate-900 md:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 md:text-base">
                  {post.teaser}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
                  <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readMinutes} Min. Lesezeit</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <CarouselControls
        onScroll={scrollCarousel}
        prevLabel="Vorherige Blogartikel anzeigen"
        nextLabel="Nächste Blogartikel anzeigen"
        className="mt-7"
      />
    </div>
  );
}
