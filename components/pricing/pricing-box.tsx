import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import HighlightBadge from "@/components/pricing/highlight-badge";

export type PricingBoxProps = {
  title: string;
  priceLabel: string;
  admins: number;
  users: number;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
  analyticsId: string;
};

export default function PricingBox(props: PricingBoxProps) {
  const { title, priceLabel, admins, users, features, highlighted, ctaLabel, ctaHref, analyticsId } = props;

  const containerClasses = highlighted
    ? "border-indigo-200 bg-white shadow-soft lg:scale-[1.04]"
    : "border-slate-900/8 bg-white shadow-soft-sm";

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${containerClasses}`}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {highlighted && <HighlightBadge />}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-slate-900">{priceLabel}</span>
        <span className="text-sm text-slate-400"> / Monat</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Admins: {admins} · Nutzer: {users}
      </p>

      <ul className="mt-6 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <Button
          asChild
          className={
            highlighted
              ? "w-full rounded-xl bg-indigo-600 text-white shadow-soft-sm transition-all hover:bg-indigo-500 hover:shadow-soft"
              : "w-full rounded-xl border border-slate-200 bg-white text-slate-700 shadow-none transition-all hover:bg-slate-50 hover:text-slate-900"
          }
          variant={highlighted ? "default" : "outline"}
        >
          <Link href={ctaHref} aria-label={`${title} ${ctaLabel}`} data-analytics={analyticsId}>
            {ctaLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}
