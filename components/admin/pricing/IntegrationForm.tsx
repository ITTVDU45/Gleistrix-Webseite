"use client";

import { useActionState } from "react";

import { savePricingIntegrationAction, type FormState } from "@/app/admin/actions";
import { Field, FormMessage } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PricingIntegration } from "@/types/pricing";

/** Ohne Integration legt das Formular einen neuen Eintrag an. */
type Props = { integration?: PricingIntegration; categories: string[] };

export default function IntegrationForm({ integration, categories }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingIntegrationAction,
    {},
  );

  const prefix = integration ? `integration-${integration.id}` : "integration-new";
  const listId = `${prefix}-categories`;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="integrationId" value={integration?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integration ? null : (
          <Field
            id={`${prefix}-id`}
            label="Kennung"
            hint="Kleinbuchstaben, Ziffern und Bindestriche."
          >
            <Input id={`${prefix}-id`} name="newId" placeholder="datev" required />
          </Field>
        )}

        <Field id={`${prefix}-title`} label="Titel">
          <Input
            id={`${prefix}-title`}
            name="title"
            defaultValue={integration?.title ?? ""}
            placeholder="DATEV"
            required
          />
        </Field>

        <Field id={`${prefix}-category`} label="Kategorie">
          <Input
            id={`${prefix}-category`}
            name="category"
            list={listId}
            defaultValue={integration?.category ?? ""}
            required
          />
          <datalist id={listId}>
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>

        <Field id={`${prefix}-description`} label="Beschreibung" className="sm:col-span-2">
          <Input
            id={`${prefix}-description`}
            name="description"
            defaultValue={integration?.description ?? ""}
          />
        </Field>

        <Field
          id={`${prefix}-src`}
          label="Logo-Pfad"
          hint="Datei unter /public. Ohne Logo werden die Initialen gezeigt."
        >
          <Input
            id={`${prefix}-src`}
            name="src"
            defaultValue={integration?.src ?? ""}
            placeholder="/logos/datev.svg"
          />
        </Field>

        <Field id={`${prefix}-width`} label="Logo-Breite (px)">
          <Input
            id={`${prefix}-width`}
            name="width"
            type="number"
            min={0}
            defaultValue={integration?.width ?? ""}
          />
        </Field>

        <Field id={`${prefix}-height`} label="Logo-Höhe (px)">
          <Input
            id={`${prefix}-height`}
            name="height"
            type="number"
            min={0}
            defaultValue={integration?.height ?? ""}
          />
        </Field>

        <Field id={`${prefix}-initials`} label="Initialen">
          <Input
            id={`${prefix}-initials`}
            name="initials"
            defaultValue={integration?.initials ?? ""}
            placeholder="DV"
          />
        </Field>
      </div>

      <FormMessage state={state} />

      <Button
        type="submit"
        size="sm"
        variant={integration ? "outline" : "default"}
        disabled={isPending}
      >
        {isPending ? "Wird gespeichert …" : integration ? "Speichern" : "Integration anlegen"}
      </Button>
    </form>
  );
}
