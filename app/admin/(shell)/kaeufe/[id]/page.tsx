import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PurchaseSyncForm from "@/components/admin/PurchaseSyncForm";
import {
  EmptyState,
  KeyValue,
  Mono,
  PurchaseStatusPill,
  Section,
  StepStatusPill,
  formatDateTime,
  formatNumber,
} from "@/components/admin/ui";
import { formatPriceEUR } from "@/data/pricing";
import { APP_SYNC_ISSUE_TEXT, appSyncIssue } from "@/lib/admin/app-sync";
import { allModules, getPublishedPricing } from "@/lib/admin/pricing";
import { getCompany, getPurchase } from "@/lib/admin/store";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const purchase = await getPurchase(id);
  return { title: purchase ? `Kauf ${purchase.id}` : "Kauf" };
}

export default async function PurchaseDetailPage({ params }: Props) {
  const { id } = await params;
  const purchase = await getPurchase(id);
  if (!purchase) notFound();

  const [company, pricing] = await Promise.all([
    getCompany(purchase.companyId),
    getPublishedPricing(),
  ]);

  const moduleTitleById = new Map(allModules(pricing).map((module) => [module.id, module.title]));
  const packageName =
    pricing.packages.find((pkg) => pkg.id === purchase.packageId)?.name ?? purchase.packageId;
  const capacityLabel =
    pricing.capacities.find((capacity) => capacity.id === purchase.capacityId)?.label ??
    purchase.capacityId;

  const issue = appSyncIssue();
  const syncStep = company?.provisioning.find((step) => step.id === "app-sync");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/kaeufe"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Alle Käufe
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {company?.name ?? "Unbekanntes Unternehmen"}
          </h1>
          <PurchaseStatusPill status={purchase.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Gekauft am {formatDateTime(purchase.createdAt)} · <Mono>{purchase.id}</Mono>
        </p>
      </div>

      {purchase.syncError ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <strong className="font-medium">Meldung an die App fehlgeschlagen.</strong>{" "}
          {purchase.syncError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Gebuchter Umfang"
          description="Eingefroren zum Kaufzeitpunkt – eine spätere Preisänderung verschiebt ihn nicht."
        >
          <dl>
            {/* Eine Zubuchung trägt weder Paket noch Kapazität noch Benutzerzahl –
                die gehören zum Grundkauf. Leere Felder anzuzeigen behauptete das
                Gegenteil. */}
            {purchase.kind === "zubuchung" ? (
              <>
                <KeyValue label="Art" value="Zubuchung aus der App" />
                <KeyValue
                  label="Monatlich zusätzlich"
                  value={formatPriceEUR(purchase.monthlyTotal)}
                />
              </>
            ) : (
              <>
                <KeyValue label="Paket" value={packageName} />
                <KeyValue label="Benutzer" value={formatNumber(purchase.users)} />
                <KeyValue label="Kapazität" value={capacityLabel} />
                <KeyValue label="Monatspreis" value={formatPriceEUR(purchase.monthlyTotal)} />
                <KeyValue
                  label="Implementierung"
                  value={formatPriceEUR(purchase.implementationPrice)}
                />
              </>
            )}
            {purchase.usageAmounts
              ? Object.entries(purchase.usageAmounts).map(([moduleId, amount]) => (
                  <KeyValue
                    key={moduleId}
                    label={`Menge · ${moduleTitleById.get(moduleId) ?? moduleId}`}
                    value={formatNumber(amount)}
                  />
                ))
              : null}
          </dl>
        </Section>

        <Section
          title="Mandant"
          description={
            company
              ? "Ressourcen, in die dieser Kauf mündet."
              : "Das Unternehmen zu diesem Kauf existiert nicht mehr."
          }
        >
          {company ? (
            <dl>
              <KeyValue label="Kennung" value={<Mono>{company.slug}</Mono>} />
              <KeyValue
                label="MongoDB-Datenbank"
                value={<Mono>{company.tenant.mongoDatabase}</Mono>}
              />
              <KeyValue label="MinIO-Bucket" value={<Mono>{company.tenant.minioBucket}</Mono>} />
              <KeyValue
                label="Unternehmen"
                value={
                  <Link
                    href={`/admin/unternehmen/${company.id}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Detailseite öffnen
                  </Link>
                }
              />
            </dl>
          ) : (
            <EmptyState>Kein zugeordnetes Unternehmen.</EmptyState>
          )}
        </Section>
      </div>

      <Section
        title={`Gebuchte Module (${purchase.moduleIds.length})`}
        description="Kennungen aus dem Kauf; unbekannte stammen aus einer inzwischen geänderten Preisliste."
      >
        {purchase.moduleIds.length === 0 ? (
          <EmptyState>Dieser Kauf enthält keine Zusatzmodule.</EmptyState>
        ) : (
          <ul className="grid gap-2 lg:grid-cols-2">
            {purchase.moduleIds.map((moduleId) => (
              <li key={moduleId} className="rounded-lg border px-3.5 py-3">
                <span className="text-sm font-medium">
                  {moduleTitleById.get(moduleId) ?? "Unbekanntes Modul"}
                </span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <Mono>{moduleId}</Mono>
                </p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Provisionierung"
        description="Protokoll der Schritte, die diesen Mandanten bereitstellen."
      >
        {company ? (
          <ul className="divide-y">
            {company.provisioning.map((step) => (
              <li key={step.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{step.label}</span>
                  <StepStatusPill status={step.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(step.updatedAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.note}</p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>Ohne Unternehmen gibt es kein Protokoll.</EmptyState>
        )}
      </Section>

      {company ? (
        <Section
          title="An die App melden"
          description="Wiederholung ist gefahrlos: Die Kauf-ID dient als Idempotency-Key, ein zweiter Mandant entsteht dadurch nicht."
        >
          <div className="flex flex-wrap items-start gap-4">
            <PurchaseSyncForm
              purchaseId={purchase.id}
              label={purchase.status === "freigegeben" ? "Erneut melden" : "An App melden"}
              disabledHint={issue ? APP_SYNC_ISSUE_TEXT[issue] : undefined}
            />
            {purchase.syncedAt ? (
              <p className="text-sm text-muted-foreground">
                Zuletzt gemeldet am {formatDateTime(purchase.syncedAt)}.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {syncStep?.status === "done"
                  ? "Der Provisionierungsschritt ist erledigt."
                  : "Noch nicht an die App gemeldet."}
              </p>
            )}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
