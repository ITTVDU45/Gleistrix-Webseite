"use client";

import { useState } from "react";
import PricingBox from "@/components/pricing/pricing-box";
import PricingFooterNote from "@/components/pricing/pricing-footer-note";
import { PRICING_PLANS, type BillingCycle, getDisplayMonthlyPrice, formatPriceEUR } from "@/data/pricing";

export default function PricingSection() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const computePrice = (baseMonthly: number) => formatPriceEUR(getDisplayMonthlyPrice(baseMonthly, cycle));

  return (
    <section aria-labelledby="pricing-heading" className="relative overflow-hidden bg-white pb-20 pt-32 md:pb-28 md:pt-40">
      {/* Weiche Hintergrund-Verläufe */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.13),transparent)]" />
      </div>

      <div className="page-container relative text-center">
        <span className="inline-flex items-center rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-700">
          Preise
        </span>
        <h1 id="pricing-heading" className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Fair, transparent und <span className="text-gradient-accent">skalierbar</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
          Alle Features in jedem Plan – wähle die Team-Größe, die zu deinem Betrieb passt.
        </p>

        {/* Billing-Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="glass inline-flex items-center gap-1 rounded-full p-1 shadow-soft-sm">
            <button
              type="button"
              aria-pressed={cycle === "monthly"}
              onClick={() => setCycle("monthly")}
              className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
                cycle === "monthly" ? "bg-indigo-600 text-white shadow-soft-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monatlich
            </button>
            <button
              type="button"
              aria-pressed={cycle === "yearly"}
              onClick={() => setCycle("yearly")}
              className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
                cycle === "yearly" ? "bg-indigo-600 text-white shadow-soft-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Jährlich
              <span className={`text-xs ${cycle === "yearly" ? "text-indigo-100" : "text-emerald-600"}`}>
                2 Monate gratis
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Karten */}
      <div className="page-container relative mt-14">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {PRICING_PLANS.map((plan) => (
            <PricingBox
              key={plan.id}
              title={plan.title}
              priceLabel={computePrice(plan.priceMonthly)}
              admins={plan.admins}
              users={plan.users}
              features={plan.features}
              highlighted={plan.highlighted}
              ctaLabel="Demo anfragen"
              ctaHref="/demo-buchen"
              analyticsId={plan.analyticsId}
            />
          ))}
        </div>
        <PricingFooterNote />
      </div>
    </section>
  );
}
