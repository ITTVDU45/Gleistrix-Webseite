"use client";

import { useActionState } from "react";

import { savePricingCapacityAction, type FormState } from "@/app/admin/actions";
import { CHECKBOX_CLASS, Field, FormMessage } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PricingCapacity } from "@/types/pricing";

/** Ohne Kapazität legt das Formular eine neue Stufe an. */
type Props = { capacity?: PricingCapacity };

export default function CapacityForm({ capacity }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingCapacityAction,
    {},
  );

  const prefix = capacity ? `capacity-${capacity.id}` : "capacity-new";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="capacityId" value={capacity?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field id={`${prefix}-label`} label="Bezeichnung">
          <Input
            id={`${prefix}-label`}
            name="label"
            defaultValue={capacity?.label ?? ""}
            placeholder="Bis 50 Projekte pro Monat"
            required
          />
        </Field>

        <Field id={`${prefix}-short`} label="Kurzlabel">
          <Input
            id={`${prefix}-short`}
            name="shortLabel"
            defaultValue={capacity?.shortLabel ?? ""}
            placeholder="bis 50"
            required
          />
        </Field>

        <Field id={`${prefix}-projects`} label="Projekte pro Monat">
          <Input
            id={`${prefix}-projects`}
            name="projects"
            type="number"
            min={1}
            defaultValue={capacity?.projects ?? 50}
            required
          />
        </Field>

        <Field id={`${prefix}-surcharge`} label="Monatlicher Aufschlag (EUR)">
          <Input
            id={`${prefix}-surcharge`}
            name="monthlySurcharge"
            inputMode="decimal"
            defaultValue={capacity?.monthlySurcharge ?? 0}
            required
          />
        </Field>

        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={capacity?.isDefault ?? false}
            className={CHECKBOX_CLASS}
          />
          Vorauswahl im Konfigurator
        </label>
      </div>

      <FormMessage state={state} />

      <Button type="submit" size="sm" variant={capacity ? "outline" : "default"} disabled={isPending}>
        {isPending ? "Wird gespeichert …" : capacity ? "Speichern" : "Kapazität anlegen"}
      </Button>
    </form>
  );
}
