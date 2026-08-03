"use client";

import { useActionState } from "react";

import { savePricingCategoriesAction, type FormState } from "@/app/admin/actions";
import { Field, FormMessage, TEXTAREA_CLASS } from "@/components/admin/pricing/ui";
import { Button } from "@/components/ui/button";

type Props = { categories: string[] };

export default function CategoriesForm({ categories }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    savePricingCategoriesAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field
        id="integration-categories"
        label="Kategorien"
        hint="Eine Kategorie je Zeile. Die erste Zeile ist der Filter „Alle“."
      >
        <textarea
          id="integration-categories"
          name="categories"
          className={TEXTAREA_CLASS}
          rows={6}
          defaultValue={categories.join("\n")}
        />
      </Field>

      <FormMessage state={state} />

      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Wird gespeichert …" : "Kategorien speichern"}
      </Button>
    </form>
  );
}
