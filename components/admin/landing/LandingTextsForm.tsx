"use client";

import { useActionState } from "react";

import { saveLandingModuleTextsAction, type FormState } from "@/app/admin/actions";
import { Field, FormMessage, TEXTAREA_CLASS } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LandingModuleTexts } from "@/types/landing";

/** Kopf der Modul-Sektion auf der Startseite. */
export default function LandingTextsForm({ texts }: { texts: LandingModuleTexts }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveLandingModuleTextsAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Field id="landing-eyebrow" label="Marke" hint="Kleine Zeile über der Überschrift.">
          <Input id="landing-eyebrow" name="eyebrow" defaultValue={texts.eyebrow} />
        </Field>

        <Field id="landing-title" label="Überschrift">
          <Input id="landing-title" name="title" defaultValue={texts.title} required />
        </Field>
      </div>

      <Field id="landing-description" label="Beschreibung">
        <textarea
          id="landing-description"
          name="description"
          defaultValue={texts.description}
          className={TEXTAREA_CLASS}
        />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Wird gespeichert …" : "Überschrift speichern"}
      </Button>
    </form>
  );
}
