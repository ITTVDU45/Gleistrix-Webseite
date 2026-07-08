import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SCREENS } from "@/app/produkt/screens";
import Reveal from "./Reveal";

/** Screenshot-Galerie „Gleistrix in Action": verlinkte Modul-Screens mit Hover-Overlay. */
export default function ScreensGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SCREENS.map((screen, index) => (
        <Reveal key={screen.src} delay={index * 0.05} className="h-full">
          <Link
            href={screen.href}
            className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <Image
              src={screen.src}
              alt={screen.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
              <span className="text-sm font-medium text-white">{screen.alt}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
