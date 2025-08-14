import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    ? "bg-white/10 backdrop-blur shadow-xl shadow-violet-500/20 scale-[1.03]"
    : "bg-white/[0.03] backdrop-blur shadow-sm";

  return (
    <Card className={`relative h-full flex flex-col rounded-2xl transition-transform duration-200 hover:-translate-y-1 border-0 ${containerClasses}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-white text-xl">{title}</CardTitle>
          {highlighted && <HighlightBadge />}
        </div>
        <div className="mt-2">
          <span className="text-4xl font-extrabold text-white">{priceLabel}</span>
          <span className="text-white/70 text-sm"> / Monat</span>
        </div>
        <p className="text-white/80 text-sm">Admins: {admins} • Nutzer: {users}</p>
      </CardHeader>
      <CardContent className="mt-auto">
        <ul className="space-y-2 text-sm">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-white/90">
              <Check className="h-4 w-4 mt-0.5" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href={ctaHref} aria-label={`${title} ${ctaLabel}`} data-analytics={analyticsId}>
            <Button className="w-full bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


