"use client";

import { useActionState } from "react";

import { syncPurchaseAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

/**
 * Meldet einen Kauf an die App.
 *
 * Eigene Komponente wie ProvisioningRunForm: Der Aufruf geht nach draußen und
 * kann scheitern – ohne sichtbare Meldung bliebe unklar, warum der Kauf weiter
 * auf „fehlgeschlagen" steht.
 */
export default function PurchaseSyncForm({
  purchaseId,
  label = "An App melden",
  disabledHint,
}: {
  purchaseId: string;
  label?: string;
  /** Fehlt das Geheimnis, steht hier der Hinweis statt des Knopfes. */
  disabledHint?: string;
}) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    syncPurchaseAction,
    {},
  );

  if (disabledHint) {
    return <p className="text-xs text-muted-foreground">{disabledHint}</p>;
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="purchaseId" value={purchaseId} />
      <Button type="submit" size="sm" variant="outline" disabled={isPending}>
        {isPending ? "Wird gemeldet …" : label}
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
