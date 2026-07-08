import { Check } from "lucide-react";
import type { Industry } from "@/data/industries";
import Image from "next/image";

export default function IndustryCard({ item, reverse = false }: { item: Industry; reverse?: boolean }) {
  const Icon = item.icon;
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-900/8 bg-white shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="grid items-center gap-6 p-5 md:grid-cols-2 md:gap-10 md:p-8">
        {/* Bild */}
        {item.image && (
          <div className={`min-w-0 ${reverse ? "md:order-2" : "md:order-1"}`}>
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl ring-1 ring-slate-900/8">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Text */}
        <div className={`min-w-0 ${reverse ? "md:order-1" : "md:order-2"}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Icon aria-hidden className="h-5 w-5" />
            </span>
            <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
          </div>
          <p className="mt-3 leading-relaxed text-slate-500">{item.blurb}</p>

          <p className="mt-5 text-sm font-semibold text-slate-900">Speziell dafür entwickelt:</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
