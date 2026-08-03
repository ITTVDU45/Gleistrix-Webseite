import Link from "next/link";

import { Section, formatNumber } from "@/components/admin/ui";
import { formatPriceEUR } from "@/data/pricing";
import {
  TIER_LABEL,
  effectiveModuleIds,
  moduleCatalog,
  type ModuleTier,
} from "@/lib/admin/modules";
import { getDraftPricing } from "@/lib/admin/pricing";
import { readStore } from "@/lib/admin/store";

export const metadata = { title: "Module" };

const TIER_ORDER: ModuleTier[] = ["standard", "complex", "ai"];

export default async function ModulesPage() {
  // Entwurfsstand, damit ein neu angelegtes Modul hier sofort auftaucht.
  const [{ companies, packages }, pricing] = await Promise.all([readStore(), getDraftPricing()]);
  const packageById = new Map(packages.map((p) => [p.id, p]));
  const catalog = moduleCatalog(pricing);

  // Wie viele Mandanten nutzen ein Modul tatsächlich – Sperren eingerechnet.
  const activeCount = new Map<string, number>();
  for (const company of companies) {
    const pkg = packageById.get(company.packageId ?? "") ?? null;
    for (const moduleId of effectiveModuleIds(pricing, company, pkg)) {
      activeCount.set(moduleId, (activeCount.get(moduleId) ?? 0) + 1);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Module</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Der Katalog stammt aus dem öffentlichen Konfigurator. Freigeben und Sperren geschieht je
          Unternehmen auf der Detailseite.
        </p>
      </header>

      {TIER_ORDER.map((tier) => {
        const modules = catalog.filter((m) => m.tier === tier);
        if (modules.length === 0) return null;

        return (
          <Section key={tier} title={TIER_LABEL[tier]}>
            <ul className="grid gap-2 lg:grid-cols-2">
              {modules.map((module) => {
                const count = activeCount.get(module.id) ?? 0;
                const inPackages = packages.filter((p) => p.moduleIds.includes(module.id));

                return (
                  <li key={module.id} className="rounded-lg border px-3.5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{module.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{module.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium tabular-nums">
                        {formatPriceEUR(module.price)}
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs text-muted-foreground">
                      Aktiv bei {formatNumber(count)} von {formatNumber(companies.length)} Mandanten
                      {inPackages.length > 0
                        ? ` · in ${inPackages.map((p) => p.name).join(", ")}`
                        : " · in keinem Paket"}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Section>
        );
      })}

      <p className="text-sm text-muted-foreground">
        Zum Freigeben oder Sperren ein{" "}
        <Link href="/admin/unternehmen" className="text-primary underline-offset-4 hover:underline">
          Unternehmen
        </Link>{" "}
        öffnen.
      </p>
    </div>
  );
}
