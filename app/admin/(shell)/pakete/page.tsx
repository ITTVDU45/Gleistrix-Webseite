import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  deletePricingCapacityAction,
  deletePricingIntegrationAction,
  deletePricingPackageAction,
} from "@/app/admin/actions";
import CapacityForm from "@/components/admin/pricing/CapacityForm";
import CategoriesForm from "@/components/admin/pricing/CategoriesForm";
import IntegrationForm from "@/components/admin/pricing/IntegrationForm";
import Modal from "@/components/admin/pricing/Modal";
import ModuleForm from "@/components/admin/pricing/ModuleForm";
import PackageForm, { ExtraUserForm } from "@/components/admin/pricing/PackageForm";
import PublishBar from "@/components/admin/pricing/PublishBar";
import TextsForm from "@/components/admin/pricing/TextsForm";
import { MoveButtons, NeutralBadge, TierBadge } from "@/components/admin/pricing/ui";
import {
  EmptyState,
  Section,
  StatCard,
  formatDateTime,
  formatNumber,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatPriceEUR } from "@/data/pricing";
import { TIER_LABEL, type ModuleTier } from "@/lib/admin/modules";
import {
  getDraftPricing,
  getPublishedPricing,
  hasUnpublishedChanges,
  suggestionList,
} from "@/lib/admin/pricing";

export const metadata = { title: "Preisseite" };

const TIER_ORDER: ModuleTier[] = ["standard", "complex", "ai"];

function isTier(value: string | undefined): value is ModuleTier {
  return (TIER_ORDER as string[]).includes(value ?? "");
}

type Props = { searchParams: Promise<{ stufe?: string }> };

export default async function PricingPage({ searchParams }: Props) {
  const [draft, published, { stufe }] = await Promise.all([
    getDraftPricing(),
    getPublishedPricing(),
    searchParams,
  ]);

  const hasChanges = hasUnpublishedChanges(draft, published);
  const activeModules = draft.modules.filter((module) => module.isActive);

  // Leistungen sind Freitext – als Auswahl dient, was bereits irgendwo vergeben ist,
  // plus die Titel der aktiven Add-ons.
  const packageFeatures = suggestionList([
    ...draft.packages.flatMap((pkg) => pkg.features),
    ...activeModules.map((module) => module.title),
  ]);
  const moduleFeatures = suggestionList(draft.modules.flatMap((module) => module.features));
  const moduleExtras = suggestionList(draft.modules.flatMap((module) => module.extras));

  // Filter über die Adresse statt über Client-State: die Seite ist eine
  // Server-Komponente und bleibt es damit auch.
  const tierFilter = isTier(stufe) ? stufe : null;
  const visibleModules = tierFilter
    ? draft.modules.filter((module) => module.tier === tierFilter)
    : draft.modules;

  // Add-ons werden innerhalb ihrer Stufe sortiert – die Preisseite gruppiert
  // danach, ein Tausch über die Stufengrenze bliebe dort ohne Wirkung.
  const positionInTier = new Map<string, { index: number; total: number }>();
  for (const tier of TIER_ORDER) {
    const ofTier = draft.modules.filter((module) => module.tier === tier);
    ofTier.forEach((module, index) =>
      positionInTier.set(module.id, { index, total: ofTier.length }),
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Preisseite</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pakete, Kapazitäten, Add-ons, Integrationen und Texte der öffentlichen Preisseite.
          Bearbeitet wird ein Entwurf – erst die Freigabe macht ihn sichtbar.
        </p>
        <Link
          href="/admin/pakete/mandanten"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
        >
          Zu den Mandanten-Paketen
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pakete"
          value={formatNumber(draft.packages.length)}
          hint={`${formatPriceEUR(draft.extraUserPrice)} je Zusatzbenutzer`}
        />
        <StatCard
          label="Aktive Add-ons"
          value={formatNumber(activeModules.length)}
          hint={`${formatNumber(draft.modules.length)} im Katalog`}
        />
        <StatCard
          label="Kapazitäten"
          value={formatNumber(draft.capacities.length)}
          hint={`${formatNumber(draft.integrations.length)} Integrationen`}
        />
        <StatCard
          label="Freigabe"
          value={hasChanges ? "Offen" : "Aktuell"}
          hint={hasChanges ? "Entwurf weicht ab" : "Entwurf und Freigabe identisch"}
        />
      </div>

      <PublishBar
        hasChanges={hasChanges}
        publishedAt={formatDateTime(published.updatedAt)}
        draftAt={formatDateTime(draft.updatedAt)}
      />

      <Section
        title={`Pakete (${draft.packages.length})`}
        description="Grundpreis, enthaltene Benutzer, Leistungen und Implementierungskosten je Paket."
        action={
          <Modal
            label="Paket hinzufügen"
            title="Neues Paket"
            description="Grundpreis, enthaltene Benutzer, Leistungen und einmalige Implementierung."
          >
            <PackageForm suggestions={packageFeatures} />
          </Modal>
        }
      >
        {draft.packages.length === 0 ? (
          <EmptyState>Noch kein Paket angelegt.</EmptyState>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {draft.packages.map((pkg, index) => (
              <li key={pkg.id} className="flex flex-col rounded-xl border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{pkg.name}</h3>
                      {pkg.isDefault ? <NeutralBadge>Vorauswahl</NeutralBadge> : null}
                      <MoveButtons
                        kind="package"
                        id={pkg.id}
                        isFirst={index === 0}
                        isLast={index === draft.packages.length - 1}
                        label={`Paket ${pkg.name}`}
                      />
                    </div>
                    {pkg.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
                    ) : null}
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold tabular-nums">
                      {formatPriceEUR(pkg.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">pro Monat</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                  <span>{formatNumber(pkg.includedUsers)} Benutzer inklusive</span>
                  <span>{formatPriceEUR(pkg.implementationPrice)} Implementierung</span>
                  <span>{formatNumber(pkg.features.length)} Leistungen</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
                  <Modal
                    label="Bearbeiten"
                    variant="outline"
                    title={pkg.name}
                    description="Änderungen gelten erst nach der Freigabe auf der Preisseite."
                  >
                    <PackageForm pkg={pkg} suggestions={packageFeatures} />
                  </Modal>

                  <form action={deletePricingPackageAction}>
                    <input type="hidden" name="packageId" value={pkg.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      disabled={draft.packages.length <= 1}
                    >
                      Löschen
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t pt-5">
          <h3 className="text-sm font-semibold">Zusätzliche Benutzer</h3>
          <p className="mb-4 mt-0.5 text-sm text-muted-foreground">
            Gilt paketübergreifend für jeden Benutzer über dem Freikontingent des gewählten Pakets.
          </p>
          <ExtraUserForm extraUserPrice={draft.extraUserPrice} />
        </div>
      </Section>

      <Section
        title={`Add-ons (${draft.modules.length})`}
        description="Alle Stufen in einer Liste. Archivierte Add-ons verschwinden von der Preisseite, bleiben bei Mandanten aber nutzbar."
        action={
          <Modal
            label="Add-on hinzufügen"
            title="Neues Add-on"
            description="Die Kennung ist nach dem Anlegen unveränderlich – Mandanten-Pakete verweisen darauf."
          >
            <ModuleForm featureSuggestions={moduleFeatures} extraSuggestions={moduleExtras} />
          </Modal>
        }
      >
        <nav className="mb-4 flex flex-wrap gap-2" aria-label="Nach Stufe filtern">
          {[null, ...TIER_ORDER].map((tier) => {
            const isCurrent = tier === tierFilter;
            const count = tier
              ? draft.modules.filter((module) => module.tier === tier).length
              : draft.modules.length;

            return (
              <Link
                key={tier ?? "alle"}
                href={tier ? `/admin/pakete?stufe=${tier}` : "/admin/pakete"}
                scroll={false}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    : "rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                }
              >
                {tier ? TIER_LABEL[tier] : "Alle"} ({formatNumber(count)})
              </Link>
            );
          })}
        </nav>

        {visibleModules.length === 0 ? (
          <EmptyState>
            {tierFilter
              ? "In dieser Stufe gibt es noch kein Add-on."
              : "Noch kein Add-on angelegt."}
          </EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleModules.map((module) => (
              <li key={module.id} className="relative">
                {/* Außerhalb des Links: ein Formular im Link wäre ungültiges
                    Markup, und der Klick würde die Detailseite öffnen. */}
                <span className="absolute right-3 top-3 z-10">
                  <MoveButtons
                    kind="module"
                    id={module.id}
                    isFirst={(positionInTier.get(module.id)?.index ?? 0) === 0}
                    isLast={
                      (positionInTier.get(module.id)?.index ?? 0) ===
                      (positionInTier.get(module.id)?.total ?? 1) - 1
                    }
                    label={`Add-on ${module.title}`}
                  />
                </span>
                <Link
                  href={`/admin/pakete/addons/${module.id}`}
                  className="flex h-full flex-col rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  <div className="flex flex-wrap items-center gap-2 pr-16">
                    <TierBadge tier={module.tier} />
                    {module.isActive ? null : <NeutralBadge>Archiviert</NeutralBadge>}
                  </div>

                  <h3 className="mt-2.5 text-sm font-semibold">{module.title}</h3>
                  {module.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  ) : null}

                  <p className="mt-3 text-sm font-medium tabular-nums">
                    {formatPriceEUR(module.price)}
                    <span className="font-normal text-muted-foreground"> pro Monat</span>
                  </p>
                  {module.usage ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      zzgl. {formatPriceEUR(module.usage.unitPrice, true)} je Einheit
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={`Projektkapazitäten (${draft.capacities.length})`}
        description="Bestimmen den monatlichen Aufschlag. Die Implementierungskosten hängen am Paket."
      >
        {draft.capacities.length === 0 ? (
          <EmptyState>Noch keine Kapazitätsstufe angelegt.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {draft.capacities.map((capacity, index) => (
              <li key={capacity.id} className="rounded-xl border p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{capacity.label}</h3>
                      {capacity.isDefault ? <NeutralBadge>Vorauswahl</NeutralBadge> : null}
                      <MoveButtons
                        kind="capacity"
                        id={capacity.id}
                        isFirst={index === 0}
                        isLast={index === draft.capacities.length - 1}
                        label={`Kapazität ${capacity.label}`}
                      />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPriceEUR(capacity.monthlySurcharge)} pro Monat
                    </p>
                  </div>

                  <form action={deletePricingCapacityAction}>
                    <input type="hidden" name="capacityId" value={capacity.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Löschen
                    </Button>
                  </form>
                </div>

                <CapacityForm capacity={capacity} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t pt-5">
          <h3 className="mb-4 text-sm font-semibold">Neue Kapazität</h3>
          <CapacityForm />
        </div>
      </Section>

      <Section
        title={`Integrationen (${draft.integrations.length})`}
        description="Logos und Kurzbeschreibungen im Integrationsraster."
      >
        {draft.integrations.length === 0 ? (
          <EmptyState>Noch keine Integration angelegt.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {draft.integrations.map((integration, index) => (
              <li key={integration.id} className="rounded-xl border p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{integration.title}</h3>
                      <MoveButtons
                        kind="integration"
                        id={integration.id}
                        isFirst={index === 0}
                        isLast={index === draft.integrations.length - 1}
                        label={`Integration ${integration.title}`}
                      />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{integration.category}</p>
                  </div>

                  <form action={deletePricingIntegrationAction}>
                    <input type="hidden" name="integrationId" value={integration.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Löschen
                    </Button>
                  </form>
                </div>

                <IntegrationForm
                  integration={integration}
                  categories={draft.integrationCategories}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t pt-5">
          <h3 className="mb-4 text-sm font-semibold">Neue Integration</h3>
          <IntegrationForm categories={draft.integrationCategories} />
        </div>
      </Section>

      <Section title="Kategorien" description="Filterleiste über dem Integrationsraster.">
        <CategoriesForm categories={draft.integrationCategories} />
      </Section>

      <Section
        title="Texte"
        description="Alle Freitexte der Preisseite. Preisangaben stehen bewusst nicht darin – sie werden berechnet."
      >
        <TextsForm texts={draft.texts} />
      </Section>
    </div>
  );
}
