"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicBlogArticle } from "@/types/blog";
import Reveal from "./Reveal";
import { CAROUSEL_CARD_ATTR, CarouselControls, useSnapCarousel } from "./carousel";

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", year: "numeric" });

export default function BlogCarousel({ posts }: { posts: PublicBlogArticle[] }) {
  const { trackRef, scrollCarousel } = useSnapCarousel(6200);
  return (
    <div className="relative mt-9 md:mt-16">
      <div ref={trackRef} className="scrollbar-none flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-4 sm:gap-5" aria-label="Aktuelle Blogartikel">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.05} className="w-full min-w-full shrink-0 snap-center sm:min-w-[70%] md:min-w-[560px] lg:min-w-[680px]">
            <Link href={`/blog/${post.slug}`} {...{ [CAROUSEL_CARD_ATTR]: true }} className="group relative block h-[390px] w-full overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:h-[420px] md:h-[460px]">
              {post.imageSrc ? <Image src={post.imageSrc} alt={post.imageAlt} fill sizes="(min-width: 1024px) 680px, (min-width: 768px) 560px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100" />}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 shadow-soft sm:inset-x-4 sm:bottom-4 sm:p-5 md:inset-x-6 md:bottom-6 md:p-6">
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 sm:px-4 sm:py-1.5 sm:text-xs">{post.category}</span>
                <h3 className="mt-3 line-clamp-3 text-lg font-bold leading-tight tracking-tight text-slate-900 sm:mt-4 sm:text-xl md:text-2xl">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500 sm:mt-3 sm:leading-6 md:text-base">{post.teaser}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 sm:mt-5 sm:text-sm"><time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time><span aria-hidden>·</span><span>{post.readMinutes} Min. Lesezeit</span></div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <CarouselControls onScroll={scrollCarousel} prevLabel="Vorherige Blogartikel anzeigen" nextLabel="Nächste Blogartikel anzeigen" className="mt-5 sm:mt-7" />
    </div>
  );
}
