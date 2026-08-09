"use client";

import { useActionState, useState } from "react";

import {
  deletePricingModuleAction,
  savePricingModuleAction,
  type FormState,
} from "@/app/admin/actions";
import FeaturesPicker from "@/components/admin/pricing/FeaturesPicker";
import { useDialogForm } from "@/components/admin/pricing/Modal";
import {
  CHECKBOX_CLASS,
  Field,
  FormMessage,
  SELECT_CLASS,
} from "@/components/admin/pricing/ui";
import { Mono } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TIER_LABEL, type ModuleTier } from "@/lib/admin/modules";
import { ICON_KEYS, MODULE_ICONS } from "@/lib/pricing/icons";
import type { PricingModule } from "@/types/pricing";

const TIER_ORDER: ModuleTier[] = ["standard", "complex", "ai"];

/** Ohne Modul legt das Formular ein neues an – nur dann ist die Kennung frei wählbar. */
type Props = {
  module?: PricingModule;
  /** Bereits vergebene Leistungen bzw. Extras – als Auswahlvorschlag. */
  featureSuggestions?: string[];
  extraSuggestions?: string[];
};

export default function ModuleForm({
  module,
  featureSuggestions = [],
  extraSuggestions = [],
}: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingModuleAction,
    {},
  );
  const [hasUsage, setHasUsage] = useState(Boolean(module?.usage));
  const formRef = useDialogForm(state, !module);

  const prefix = module ? `module-${module.id}` : "module-new";
  const usage = module?.usage;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="moduleId" value={module?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {module ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Kennung</p>
            <p className="pt-1">
              <Mono>{module.id}</Mono>
            </p>
            <p className="text-xs text-muted-foreground">
              Unveränderlich – Mandanten-Pakete verweisen darauf.
            </p>
          </div>
        ) : (
          <Field
            id={`${prefix}-id`}
            label="Kennung"
            hint="Kleinbuchstaben, Ziffern und Bindestriche."
          >
            <Input id={`${prefix}-id`} name="newId" placeholder="lagerverwaltung" required />
          </Field>
        )}

        <Field id={`${prefix}-title`} label="Titel">
          <Input
            id={`${prefix}-title`}
            name="title"
            defaultValue={module?.title ?? ""}
            required
          />
        </Field>

        <Field id={`${prefix}-price`} label="Preis pro Monat (EUR)">
          <Input
            id={`${prefix}-price`}
            name="price"
            inputMode="decimal"
            defaultValue={module?.price ?? 0}
            required
          />
        </Field>

        <Field id={`${prefix}-tier`} label="Stufe">
          <select
            id={`${prefix}-tier`}
            name="tier"
            defaultValue={module?.tier ?? "standard"}
            className={SELECT_CLASS}
          >
            {TIER_ORDER.map((tier) => (
              <option key={tier} value={tier}>
                {TIER_LABEL[tier]}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${prefix}-icon`} label="Icon">
          <select
            id={`${prefix}-icon`}
            name="iconKey"
            defaultValue={module?.iconKey ?? ICON_KEYS[0]}
            className={SELECT_CLASS}
          >
            {ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {MODULE_ICONS[key].label}
              </option>
            ))}
          </select>
        </Field>

        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={module?.isActive ?? true}
            className={CHECKBOX_CLASS}
          />
          Auf der Preisseite sichtbar
        </label>
      </div>

      <Field id={`${prefix}-description`} label="Beschreibung">
        <Input
          id={`${prefix}-description`}
          name="description"
          defaultValue={module?.description ?? ""}
        />
      </Field>

      <Field
        id={`${prefix}-image`}
        label="Bild"
        hint="Pfad unter /public, z. B. /module/lagerverwaltung.png. Leer lassen zeigt nur das Icon."
      >
        <Input
          id={`${prefix}-image`}
          name="imageSrc"
          defaultValue={module?.imageSrc ?? ""}
          placeholder="/module/lagerverwaltung.png"
        />
      </Field>

      <Field
        id={`${prefix}-features`}
        label="Leistungen"
        hint="Der Umfang, den dieses Modul abdeckt."
      >
        <FeaturesPicker
          name="features"
          initial={module?.features ?? []}
          suggestions={featureSuggestions}
        />
      </Field>

      <Field
        id={`${prefix}-extras`}
        label="Extras"
        hint="Zusätzliches über den Grundumfang hinaus."
      >
        <FeaturesPicker
          name="extras"
          initial={module?.extras ?? []}
          suggestions={extraSuggestions}
        />
      </Field>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-medium">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="usageEnabled"
              checked={hasUsage}
              onChange={(event) => setHasUsage(event.target.checked)}
              className={CHECKBOX_CLASS}
            />
            Nutzungspreis
          </label>
        </legend>

        {hasUsage ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field id={`${prefix}-usage-price`} label="Preis je Einheit (EUR)">
              <Input
                id={`${prefix}-usage-price`}
                name="usageUnitPrice"
                inputMode="decimal"
                defaultValue={usage?.unitPrice ?? 0}
              />
            </Field>

            <Field id={`${prefix}-usage-max`} label="Reglermaximum">
              <Input
                id={`${prefix}-usage-max`}
                name="usageSliderMax"
                type="number"
                min={1}
                defaultValue={usage?.sliderMax ?? 1000}
              />
            </Field>

            <Field id={`${prefix}-usage-step`} label="Schrittweite">
              <Input
                id={`${prefix}-usage-step`}
                name="usageStep"
                type="number"
                min={1}
                defaultValue={usage?.step ?? 50}
              />
            </Field>

            <Field id={`${prefix}-usage-label`} label="Beschriftung">
              <Input
                id={`${prefix}-usage-label`}
                name="usageLabel"
                defaultValue={usage?.label ?? ""}
              />
            </Field>

            <Field
              id={`${prefix}-usage-hint`}
              label="Erläuterung"
              className="sm:col-span-2 lg:col-span-4"
            >
              <Input
                id={`${prefix}-usage-hint`}
                name="usageHint"
                defaultValue={usage?.hint ?? ""}
              />
            </Field>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Ohne Nutzungspreis kostet das Modul nur den Monatspreis.
          </p>
        )}
      </fieldset>

      <FormMessage state={state} />

      <Button type="submit" size="sm" variant={module ? "outline" : "default"} disabled={isPending}>
        {isPending ? "Wird gespeichert …" : module ? "Speichern" : "Add-on anlegen"}
      </Button>
    </form>
  );
}

/**
 * Eigenes Formular, weil das Löschen bei referenzierten Modulen mit einer Meldung abbricht.
 *
 * `redirectTo` ist für die Detailseite: nach dem Löschen gibt es die Seite nicht
 * mehr, der Admin soll dort nicht stehen bleiben.
 */
export function DeleteModuleForm({
  moduleId,
  redirectTo,
}: {
  moduleId: string;
  redirectTo?: string;
}) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    deletePricingModuleAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="moduleId" value={moduleId} />
      {/* Die Action leitet selbst um – ein Client-Redirect käme zu spät, die
          neu gerenderte Detailseite würde vorher mit 404 antworten. */}
      {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
      <Button type="submit" size="sm" variant="ghost" disabled={isPending}>
        {isPending ? "Wird gelöscht …" : "Löschen"}
      </Button>
      <FormMessage state={state} />
    </form>
  );
}
