"use client";

import { useActionState } from "react";

import { savePricingTextsAction, type FormState } from "@/app/admin/actions";
import { Field, FormMessage, TEXTAREA_CLASS } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PricingTexts } from "@/types/pricing";

type TextField = { name: keyof PricingTexts; label: string; multiline?: boolean };

/** Reihenfolge wie auf der Preisseite von oben nach unten. */
const FIELDS: TextField[] = [
  { name: "heroEyebrow", label: "Hero – Kennzeile" },
  { name: "heroTitle", label: "Hero – Überschrift" },
  { name: "heroDescription", label: "Hero – Beschreibung", multiline: true },
  { name: "configuratorTitle", label: "Konfigurator – Überschrift" },
  { name: "configuratorDescription", label: "Konfigurator – Beschreibung", multiline: true },
  { name: "packagesTitle", label: "Pakete – Überschrift" },
  { name: "packagesDescription", label: "Pakete – Beschreibung", multiline: true },
  { name: "usersTitle", label: "Benutzer – Überschrift" },
  { name: "capacityTitle", label: "Kapazität – Überschrift" },
  { name: "capacityDescription", label: "Kapazität – Beschreibung", multiline: true },
  { name: "standardModulesTitle", label: "Standardmodule – Überschrift" },
  { name: "complexModulesTitle", label: "Komplexmodule – Überschrift" },
  { name: "aiModuleTitle", label: "KI-Module – Überschrift" },
  { name: "summaryTitle", label: "Zusammenfassung – Überschrift" },
  { name: "ctaLabel", label: "Beschriftung der Schaltfläche" },
  { name: "implementationTitle", label: "Implementierung – Überschrift" },
  { name: "implementationDescription", label: "Implementierung – Beschreibung", multiline: true },
  { name: "integrationsTitle", label: "Integrationen – Überschrift" },
  { name: "integrationsDescription", label: "Integrationen – Beschreibung", multiline: true },
];

type Props = { texts: PricingTexts };

export default function TextsForm({ texts }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingTextsAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ name, label, multiline }) => (
          <Field
            key={name}
            id={`text-${name}`}
            label={label}
            className={multiline ? "sm:col-span-2" : undefined}
          >
            {multiline ? (
              <textarea
                id={`text-${name}`}
                name={name}
                className={TEXTAREA_CLASS}
                rows={3}
                defaultValue={texts[name]}
              />
            ) : (
              <Input id={`text-${name}`} name={name} defaultValue={texts[name]} />
            )}
          </Field>
        ))}
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Wird gespeichert …" : "Texte speichern"}
      </Button>
    </form>
  );
}
