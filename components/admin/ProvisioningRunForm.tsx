"use client";

import { useActionState } from "react";

import { runProvisioningStepAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

/**
 * Führt einen Provisionierungsschritt aus.
 *
 * Eigene Komponente statt eines einfachen Formulars, weil diese Aufrufe echte
 * Ressourcen anlegen und scheitern können – ohne sichtbare Fehlermeldung bliebe
 * unklar, warum ein Schritt auf „fehlgeschlagen" steht.
 */
export default function ProvisioningRunForm({
  companyId,
  stepId,
  disabledHint,
}: {
  companyId: string;
  stepId: string;
  /** Fehlt ein Zugang, steht hier der Hinweis statt des Knopfes. */
  disabledHint?: string;
}) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    runProvisioningStepAction,
    {},
  );

  if (disabledHint) {
    return <p className="text-xs text-muted-foreground">{disabledHint}</p>;
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="stepId" value={stepId} />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Wird ausgeführt …" : "Automatisch ausführen"}
      </Button>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-inset ring-rose-600/20"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
