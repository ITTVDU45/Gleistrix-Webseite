"use client";

import { useState } from "react";
import PricingBox from "@/components/pricing/pricing-box";
import PricingFooterNote from "@/components/pricing/pricing-footer-note";
import { PRICING_PLANS, BillingCycle, getDisplayMonthlyPrice, formatPriceEUR } from "@/data/pricing";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const computePrice = (baseMonthly: number) => formatPriceEUR(getDisplayMonthlyPrice(baseMonthly, cycle));

  return (
    <section className="relative w-full text-white">
      {/* Hero / Banner */}
      <div className="page-container pt-28 md:pt-32 pb-10 md:pb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">
          Preise für Ihr Unternehmen – jetzt anfragen
        </h1>
        <p className="mt-3 text-white/90 max-w-2xl">
          Fair, transparent und skalierbar. Alle Features in jedem Plan.
        </p>

        {/* Billing Toggle */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 backdrop-blur px-2 py-1">
            <button
            type="button"
            aria-label="Monatlich"
            onClick={() => setCycle("monthly")}
            className={`h-9 px-3 rounded-md text-sm ${
              cycle === "monthly" ? "bg-white/15 ring-1 ring-white/20" : "hover:bg-white/10"
            }`}
          >
            Monatlich
          </button>
            <button
            type="button"
            aria-label="Jährlich (2 Monate gratis)"
            onClick={() => setCycle("yearly")}
            className={`h-9 px-3 rounded-md text-sm ${
              cycle === "yearly" ? "bg-white/15 ring-1 ring-white/20" : "hover:bg-white/10"
            }`}
          >
            Jährlich
            <span className="ml-2 text-xs text-white/80">(2 Monate gratis)</span>
          </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRICING_PLANS.map((p) => (
            <PricingBox
              key={p.id}
              title={p.title}
              priceLabel={computePrice(p.priceMonthly)}
              admins={p.admins}
              users={p.users}
              features={p.features}
              highlighted={p.highlighted}
              ctaLabel="Demo Anfragen"
              ctaHref="/demo-buchen"
              analyticsId={p.analyticsId}
            />
          ))}
        </div>
        <PricingFooterNote />
      </div>
    </section>
  );
}


