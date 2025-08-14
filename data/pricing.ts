export type BillingCycle = "monthly" | "yearly";

export type PricingPlan = {
  id: string;
  title: string;
  priceMonthly: number; // base monthly EUR price
  admins: number;
  users: number;
  features: string[];
  highlighted?: boolean;
  analyticsId: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    title: "Starter",
    priceMonthly: 80,
    admins: 1,
    users: 1,
    features: ["Zeiterfassung", "Kalender", "Dokumentation"],
    analyticsId: "pricing_starter_cta",
  },
  {
    id: "team",
    title: "Team",
    priceMonthly: 120,
    admins: 1,
    users: 4,
    features: [
      "Alles aus Starter",
      "Benutzerverwaltung",
      "Projektplanung & Disposition",
    ],
    highlighted: true,
    analyticsId: "pricing_team_cta",
  },
  {
    id: "business",
    title: "Business",
    priceMonthly: 149,
    admins: 2,
    users: 5,
    features: ["Alles aus Team", "Rollen & Rechte", "Erweiterte Reports"],
    analyticsId: "pricing_business_cta",
  },
];

export function formatPriceEUR(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(
    value
  );
}

// Computes the displayed per-month price for the selected billing cycle.
// Yearly: 2 months free => effective monthly = priceMonthly * (10/12)
export function getDisplayMonthlyPrice(baseMonthly: number, cycle: BillingCycle): number {
  if (cycle === "yearly") return Math.round((baseMonthly * 10) / 12);
  return baseMonthly;
}


