"use client";

import { useActionState, useState } from "react";

import { createPurchaseAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatePrice, formatPriceEUR } from "@/data/pricing";
import type { PricingConfig } from "@/types/pricing";

type Props = {
  companyId: string;
  /** Freigegebener Stand – ein Kauf darf sich nur auf Sichtbares beziehen. */
  pricing: PricingConfig;
  /** Vorbelegung aus der Benutzerzahl des Mandanten. */
  defaultUsers: number;
};

const CONTROL =
  "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Erfasst einen Kauf und zeigt dabei laufend den Preis.
 *
 * Die Vorschau rechnet mit derselben Funktion wie der öffentliche Preisrechner
 * und wie die Server Action. Verbindlich ist trotzdem allein die Rechnung auf
 * dem Server – hier geht es darum, dass niemand einen Preis einfriert, den er
 * nicht gesehen hat.
 */
export default function NewPurchaseForm({ companyId, pricing, defaultUsers }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createPurchaseAction,
    {},
  );

  const active = pricing.modules.filter((module) => module.isActive);
  const [packageId, setPackageId] = useState(
    () => (pricing.packages.find((pkg) => pkg.isDefault) ?? pricing.packages[0])?.id ?? "",
  );
  const [capacityId, setCapacityId] = useState(
    () =>
      (pricing.capacities.find((capacity) => capacity.isDefault) ?? pricing.capacities[0])?.id ??
      "",
  );
  const [users, setUsers] = useState(String(defaultUsers));
  const [moduleIds, setModuleIds] = useState<string[]>([]);
  const [usageAmounts, setUsageAmounts] = useState<Record<string, string>>({});

  const breakdown = calculatePrice(pricing, {
    packageId,
    capacityId,
    users: Number.parseInt(users || "0", 10) || 0,
    moduleIds,
    usageAmounts: Object.fromEntries(
      Object.entries(usageAmounts).map(([id, value]) => [
        id,
        Number.parseInt(value || "0", 10) || 0,
      ]),
    ),
  });

  function toggleModule(id: string): void {
    setModuleIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }

  if (pricing.packages.length === 0) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        Es ist noch keine Preisliste freigegeben. Erst unter /admin/pakete freigeben, dann lässt
        sich ein Kauf erfassen.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="companyId" value={companyId} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="purchase-package">Paket</Label>
          <select
            id="purchase-package"
            name="packageId"
            value={packageId}
            onChange={(event) => setPackageId(event.target.value)}
            className={`${CONTROL} w-full`}
          >
            {pricing.packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} · {formatPriceEUR(pkg.price)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase-users">Benutzer</Label>
          <Input
            id="purchase-users"
            name="users"
            type="number"
            min={1}
            value={users}
            onChange={(event) => setUsers(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchase-capacity">Kapazität</Label>
          <select
            id="purchase-capacity"
            name="capacityId"
            value={capacityId}
            onChange={(event) => setCapacityId(event.target.value)}
            className={`${CONTROL} w-full`}
          >
            {pricing.capacities.map((capacity) => (
              <option key={capacity.id} value={capacity.id}>
                {capacity.label}
                {capacity.monthlySurcharge > 0
                  ? ` · +${formatPriceEUR(capacity.monthlySurcharge)}`
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Module</legend>
        <div className="grid gap-2 lg:grid-cols-2">
          {active.map((module) => {
            const checked = moduleIds.includes(module.id);

            return (
              <div key={module.id} className="rounded-lg border px-3 py-2.5">
                <label className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    name="moduleIds"
                    value={module.id}
                    checked={checked}
                    onChange={() => toggleModule(module.id)}
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{module.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatPriceEUR(module.price)} / Monat
                    </span>
                  </span>
                </label>

                {/* Nutzungspreis: ohne Menge fehlte der groesste Posten im
                    eingefrorenen Preis. */}
                {checked && module.usage ? (
                  <div className="mt-2 space-y-1 border-t pt-2">
                    <Label htmlFor={`usage-${module.id}`} className="text-xs">
                      {module.usage.label} · {formatPriceEUR(module.usage.unitPrice)} je Einheit
                    </Label>
                    <Input
                      id={`usage-${module.id}`}
                      name={`usage_${module.id}`}
                      type="number"
                      min={0}
                      max={module.usage.sliderMax}
                      step={module.usage.step}
                      value={usageAmounts[module.id] ?? "0"}
                      onChange={(event) =>
                        setUsageAmounts((current) => ({
                          ...current,
                          [module.id]: event.target.value,
                        }))
                      }
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </fieldset>

      <dl className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
        <div className="flex justify-between py-0.5">
          <dt className="text-muted-foreground">Paket</dt>
          <dd className="tabular-nums">{formatPriceEUR(breakdown.basePrice)}</dd>
        </div>
        {breakdown.extraUsers > 0 ? (
          <div className="flex justify-between py-0.5">
            <dt className="text-muted-foreground">{breakdown.extraUsers} Zusatzbenutzer</dt>
            <dd className="tabular-nums">{formatPriceEUR(breakdown.extraUsersPrice)}</dd>
          </div>
        ) : null}
        {breakdown.capacitySurcharge > 0 ? (
          <div className="flex justify-between py-0.5">
            <dt className="text-muted-foreground">Kapazität</dt>
            <dd className="tabular-nums">{formatPriceEUR(breakdown.capacitySurcharge)}</dd>
          </div>
        ) : null}
        {breakdown.modulesPrice > 0 ? (
          <div className="flex justify-between py-0.5">
            <dt className="text-muted-foreground">Module</dt>
            <dd className="tabular-nums">{formatPriceEUR(breakdown.modulesPrice)}</dd>
          </div>
        ) : null}
        {breakdown.usagePrice > 0 ? (
          <div className="flex justify-between py-0.5">
            <dt className="text-muted-foreground">Nutzung</dt>
            <dd className="tabular-nums">{formatPriceEUR(breakdown.usagePrice)}</dd>
          </div>
        ) : null}
        <div className="mt-1.5 flex justify-between border-t pt-2 font-medium">
          <dt>Monatlich</dt>
          <dd className="tabular-nums">{formatPriceEUR(breakdown.monthlyTotal)}</dd>
        </div>
        <div className="flex justify-between py-0.5 text-muted-foreground">
          <dt>Implementierung einmalig</dt>
          <dd className="tabular-nums">{formatPriceEUR(breakdown.implementationPrice)}</dd>
        </div>
      </dl>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          {state.success}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Wird erfasst …" : "Kauf erfassen"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Der Preis wird beim Speichern eingefroren und ändert sich später nicht mehr mit der
          Preisliste.
        </p>
      </div>
    </form>
  );
}
