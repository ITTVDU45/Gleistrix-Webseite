"use client";

import { Briefcase, HardHat, ShieldCheck, TrainFront, Users, Warehouse } from "lucide-react";
import CardMedia from "@/components/media/CardMedia";
import { CAROUSEL_CARD_ATTR, CarouselControls, useSnapCarousel } from "./carousel";

type IconKey = "shield" | "train" | "hardhat" | "users" | "warehouse" | "briefcase";
type Audience = { iconKey: IconKey; title: string; description: string; image: { src: string; alt: string } };

const ICONS = {
  shield: ShieldCheck,
  train: TrainFront,
  hardhat: HardHat,
  users: Users,
  warehouse: Warehouse,
  briefcase: Briefcase,
} as const;

export default function MobileAudienceCarousel({ items }: { items: Audience[] }) {
  const { trackRef, scrollCarousel } = useSnapCarousel();
  return (
    <div className="mt-9 sm:hidden" role="group" aria-roledescription="Karussell" aria-label="Zielgruppen von Gleistrix">
      <div ref={trackRef} className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
        {items.map((item, index) => {
          const Icon = ICONS[item.iconKey];
          return <article key={item.title} {...{ [CAROUSEL_CARD_ATTR]: true }} className="group w-full min-w-full shrink-0 snap-center overflow-hidden rounded-3xl border border-slate-900/8 bg-[#f8fafc]" aria-label={`${index + 1} von ${items.length}: ${item.title}`}><CardMedia src={item.image.src} alt={item.image.alt} sizes="100vw" /><div className="relative p-6"><span className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft ring-1 ring-slate-900/5"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p></div></article>;
        })}
      </div>
      <CarouselControls onScroll={scrollCarousel} prevLabel="Vorherige Zielgruppe" nextLabel="Nächste Zielgruppe" className="mt-5" />
    </div>
  );
}
