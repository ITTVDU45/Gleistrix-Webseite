"use client";

import { useActionState } from "react";

import {
  savePricingExtraUserAction,
  savePricingPackageAction,
  type FormState,
} from "@/app/admin/actions";
import FeaturesPicker from "@/components/admin/pricing/FeaturesPicker";
import { useDialogForm } from "@/components/admin/pricing/Modal";
import { CHECKBOX_CLASS, Field, FormMessage } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PricingPackage } from "@/types/pricing";

/** Ohne Paket legt das Formular ein neues an. */
type Props = { pkg?: PricingPackage; suggestions?: string[] };

export default function PackageForm({ pkg, suggestions = [] }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingPackageAction,
    {},
  );
  const formRef = useDialogForm(state, !pkg);

  const prefix = pkg ? `package-${pkg.id}` : "package-new";

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="packageId" value={pkg?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${prefix}-name`} label="Name">
          <Input
            id={`${prefix}-name`}
            name="name"
            defaultValue={pkg?.name ?? ""}
            placeholder="Basispaket"
            required
          />
        </Field>

        <Field id={`${prefix}-price`} label="Grundpreis pro Monat (EUR)">
          <Input
            id={`${prefix}-price`}
            name="price"
            inputMode="decimal"
            defaultValue={pkg?.price ?? 0}
            required
          />
        </Field>

        <Field id={`${prefix}-users`} label="Inkludierte Benutzer">
          <Input
            id={`${prefix}-users`}
            name="includedUsers"
            type="number"
            min={1}
            defaultValue={pkg?.includedUsers ?? 1}
            required
          />
        </Field>

        <Field
          id={`${prefix}-implementation`}
          label="Implementierung einmalig (EUR)"
          hint="Einmalige Kosten der Einführung dieses Pakets."
        >
          <Input
            id={`${prefix}-implementation`}
            name="implementationPrice"
            inputMode="decimal"
            defaultValue={pkg?.implementationPrice ?? 0}
            required
          />
        </Field>
      </div>

      <Field id={`${prefix}-description`} label="Beschreibung">
        <Input
          id={`${prefix}-description`}
          name="description"
          defaultValue={pkg?.description ?? ""}
        />
      </Field>

      <Field
        id={`${prefix}-features`}
        label="Leistungen"
        hint="Vorhandene Leistungen per + übernehmen oder eine neue anlegen."
      >
        <FeaturesPicker
          name="features"
          initial={pkg?.features ?? []}
          suggestions={suggestions}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={pkg?.isDefault ?? false}
          className={CHECKBOX_CLASS}
        />
        Vorauswahl im Konfigurator
      </label>

      <FormMessage state={state} />

      <Button type="submit" size="sm" variant={pkg ? "outline" : "default"} disabled={isPending}>
        {isPending ? "Wird gespeichert …" : pkg ? "Speichern" : "Paket anlegen"}
      </Button>
    </form>
  );
}

/**
 * Der Preis je Zusatzbenutzer hängt nicht am Paket, sondern gilt paketübergreifend –
 * deshalb ein eigenes kleines Formular neben der Paketliste.
 */
export function ExtraUserForm({ extraUserPrice }: { extraUserPrice: number }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingExtraUserAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field
          id="extra-user-price"
          label="Preis je Zusatzbenutzer (EUR)"
          className="min-w-56 flex-1"
        >
          <Input
            id="extra-user-price"
            name="extraUserPrice"
            inputMode="decimal"
            defaultValue={extraUserPrice}
            required
          />
        </Field>

        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? "Wird gespeichert …" : "Speichern"}
        </Button>
      </div>

      <FormMessage state={state} />
    </form>
  );
}
