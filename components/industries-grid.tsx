"use client";

import IndustryCard from "@/components/industry-card";
import { INDUSTRIES } from "@/data/industries";

export default function IndustriesGrid() {
  return (
    <section className="page-container py-14 text-white" aria-labelledby="industries-heading">
      <h2 id="industries-heading" className="text-2xl md:text-3xl font-semibold mb-6">
        Branchen im Überblick
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {INDUSTRIES.map((it, idx) => (
          <IndustryCard key={it.id} item={it} reverse={idx % 2 === 1} />
        ))}
      </div>
    </section>
  );
}


