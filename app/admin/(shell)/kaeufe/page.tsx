import Link from "next/link";

import {
  EmptyState,
  PurchaseStatusPill,
  Section,
  StatCard,
  formatDateTime,
  formatNumber,
} from "@/components/admin/ui";
import { formatPriceEUR } from "@/data/pricing";
import { getPublishedPricing } from "@/lib/admin/pricing";
import { getPurchases, readStore } from "@/lib/admin/store";

export const metadata = { title: "Käufe" };

export default async function AdminPurchasesPage() {
  const [purchases, { companies }, pricing] = await Promise.all([
    getPurchases(),
    readStore(),
    getPublishedPricing(),
  ]);
  const companyById = new Map(companies.map((company) => [company.id, company]));
  // Wie auf der Detailseite: Ein „pkg_…" in der Spalte „Paket" erfüllt die
  // Überschrift nur formal.
  const packageNameById = new Map(pricing.packages.map((pkg) => [pkg.id, pkg.name]));

  const open = purchases.filter((purchase) => purchase.status === "offen");
  const failed = purchases.filter((purchase) => purchase.status === "fehlgeschlagen");
  const monthly = purchases
    .filter((purchase) => purchase.status === "freigegeben")
    .reduce((sum, purchase) => sum + purchase.monthlyTotal, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Käufe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Jeder Kauf hält seinen Preis zum Kaufzeitpunkt fest. Freigegeben heißt: der Mandant ist
          in der App gemeldet.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offen" value={formatNumber(open.length)} />
        <StatCard
          label="Fehlgeschlagen"
          value={formatNumber(failed.length)}
          hint={failed.length > 0 ? "Meldung an die App wiederholen" : undefined}
        />
        <StatCard
          label="Monatserlös"
          value={formatPriceEUR(monthly)}
          hint="Summe der freigegebenen Käufe"
        />
      </div>

      <Section
        title={`Alle Käufe (${purchases.length})`}
        description="Ein Klick auf einen Eintrag öffnet die Detailseite mit Modulen und Protokoll."
      >
        {purchases.length === 0 ? (
          <EmptyState>Noch kein Kauf erfasst.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Unternehmen</th>
                  <th className="pb-2 pr-4 font-medium">Paket</th>
                  <th className="pb-2 pr-4 text-right font-medium">Benutzer</th>
                  <th className="pb-2 pr-4 text-right font-medium">Monatspreis</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Zeitpunkt</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {purchases.map((purchase) => {
                  const company = companyById.get(purchase.companyId);

                  return (
                    <tr key={purchase.id} className="transition-colors hover:bg-muted/40">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/kaeufe/${purchase.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {company?.name ?? "Unbekanntes Unternehmen"}
                        </Link>
                        {purchase.syncError ? (
                          <p className="text-xs text-rose-700">{purchase.syncError}</p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4">
                        {purchase.kind === "zubuchung" ? (
                          <span className="text-muted-foreground">
                            Zubuchung · {purchase.moduleIds.length} Modul
                            {purchase.moduleIds.length === 1 ? "" : "e"}
                          </span>
                        ) : (
                          (packageNameById.get(purchase.packageId) ?? purchase.packageId)
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {/* Eine Zubuchung trägt keine Benutzerzahl – „0" läse
                            sich wie „null Benutzer gebucht". */}
                        {purchase.kind === "zubuchung" ? (
                          <span className="text-muted-foreground">–</span>
                        ) : (
                          formatNumber(purchase.users)
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatPriceEUR(purchase.monthlyTotal)}
                      </td>
                      <td className="py-3 pr-4">
                        <PurchaseStatusPill status={purchase.status} />
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {formatDateTime(purchase.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
