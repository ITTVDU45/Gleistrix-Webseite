"use client";

import type { LucideIcon } from "lucide-react";
import { CAROUSEL_CARD_ATTR, CarouselControls, useSnapCarousel } from "./carousel";

type Audience = { icon: LucideIcon; title: string; description: string };

export default function MobileAudienceCarousel({ items }: { items: Audience[] }) {
  const { trackRef, scrollCarousel } = useSnapCarousel();
  return (
    <div className="mt-9 sm:hidden" role="group" aria-roledescription="Karussell" aria-label="Zielgruppen von Gleistrix">
      <div ref={trackRef} className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        {items.map((item, index) => {
          const Icon = item.icon;
          return <article key={item.title} {...{ [CAROUSEL_CARD_ATTR]: true }} className="w-full min-w-full shrink-0 snap-center rounded-3xl border border-slate-900/8 bg-[#f8fafc] p-6" aria-label={`${index + 1} von ${items.length}: ${item.title}`}><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p></article>;
        })}
      </div>
      <CarouselControls onScroll={scrollCarousel} prevLabel="Vorherige Zielgruppe" nextLabel="Nächste Zielgruppe" className="mt-5" />
    </div>
  );
}
