import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { togglePricingModuleActiveAction } from "@/app/admin/actions";
import ModuleForm, { DeleteModuleForm } from "@/components/admin/pricing/ModuleForm";
import { NeutralBadge, TierBadge } from "@/components/admin/pricing/ui";
import { EmptyState, Section } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatPriceEUR } from "@/data/pricing";
import { getModule } from "@/lib/admin/modules";
import { getDraftPricing, isModuleInUse, moduleUsage } from "@/lib/admin/pricing";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const config = await getDraftPricing();
  return { title: getModule(config, id)?.title ?? "Add-on" };
}

export default async function AddonDetailPage({ params }: Props) {
  const { id } = await params;
  const config = await getDraftPricing();
  const addon = getModule(config, id);
  if (!addon) notFound();

  const usage = await moduleUsage(addon.id);
  const inUse = isModuleInUse(usage);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/pakete"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Alle Add-ons
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{addon.title}</h1>
          <TierBadge tier={addon.tier} />
          {addon.isActive ? null : <NeutralBadge>Archiviert</NeutralBadge>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPriceEUR(addon.price)} pro Monat
          {addon.usage
            ? ` · zzgl. ${formatPriceEUR(addon.usage.unitPrice, true)} je Einheit`
            : ""}
        </p>
      </header>

      <Section
        title="Add-on bearbeiten"
        description="Änderungen landen im Entwurf und werden erst mit der Freigabe öffentlich."
      >
        <ModuleForm module={addon} />
      </Section>

      <Section
        title="Gebucht bei"
        description="Modul-Kennungen sind Fremdschlüssel. Solange sie hier auftauchen, lässt sich das Add-on nicht löschen."
      >
        {inUse ? (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mandanten-Pakete
              </dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {usage.packages.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Keine</span>
                ) : (
                  usage.packages.map((name) => (
                    <span
                      key={name}
                      className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {name}
                    </span>
                  ))
                )}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Unternehmen
              </dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {usage.companies.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Keine</span>
                ) : (
                  usage.companies.map((name) => (
                    <span
                      key={name}
                      className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {name}
                    </span>
                  ))
                )}
              </dd>
            </div>

            {/* Käufe blockieren das Löschen ebenfalls – ohne diese Spalte stünde
                hier zweimal „Keine", während der Löschknopf trotzdem abweist. */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Käufe
              </dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {usage.purchases.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Keine</span>
                ) : (
                  usage.purchases.map((purchaseId) => (
                    <Link
                      key={purchaseId}
                      href={`/admin/kaeufe/${purchaseId}`}
                      className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      {purchaseId}
                    </Link>
                  ))
                )}
              </dd>
            </div>
          </dl>
        ) : (
          <EmptyState>
            Dieses Add-on ist in keinem Mandanten-Paket, bei keinem Unternehmen und in keinem
            Kauf referenziert.
          </EmptyState>
        )}
      </Section>

      <Section
        title="Archivieren und löschen"
        description="Archivierte Add-ons verschwinden von der Preisseite, bleiben bei Mandanten aber nutzbar. Gelöscht wird nur, was nirgends referenziert ist."
        className="border-rose-200"
      >
        <div className="flex flex-wrap items-start gap-3">
          <form action={togglePricingModuleActiveAction}>
            <input type="hidden" name="moduleId" value={addon.id} />
            <Button type="submit" size="sm" variant="outline">
              {addon.isActive ? "Archivieren" : "Reaktivieren"}
            </Button>
          </form>

          <DeleteModuleForm moduleId={addon.id} redirectTo="/admin/pakete" />
        </div>
      </Section>
    </div>
  );
}
