"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Industry } from "@/data/industries";
import Image from "next/image";

export default function IndustryCard({ item, reverse = false }: { item: Industry; reverse?: boolean }) {
  const Icon = item.icon;
  return (
    <Card className="h-full rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur text-white overflow-hidden">
      <div className={`p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 items-start gap-4 md:gap-6`}>
        {/* Image side (left on normal, right on reverse) */}
        {item.image && (
          <div className={`${reverse ? "md:order-2" : "md:order-1"} w-28 sm:w-32 md:w-full md:max-w-[320px] lg:max-w-[360px] shrink-0 mx-auto md:mx-0 justify-self-start`}>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <Image src={item.image} alt={item.title} width={360} height={240} className="w-full h-auto object-cover" />
            </div>
          </div>
        )}

        {/* Text side (right on normal, left on reverse) */}
        <div className={`min-w-0 ${reverse ? "md:order-1" : "md:order-2"}`}>
          <CardHeader className="space-y-2 p-0">
            <div className="flex items-center gap-3">
              <Icon aria-hidden className="h-6 w-6" />
              <CardTitle className="text-xl text-white">{item.title}</CardTitle>
            </div>
            <p className="text-sm text-white/80">{item.blurb}</p>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <p className="text-sm font-medium mb-2 text-white">Speziell für Sie entwickelt:</p>
            <ul className="space-y-1 text-sm">
              {item.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}


