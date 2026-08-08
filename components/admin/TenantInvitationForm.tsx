"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";

import { sendTenantInvitationAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type Props = {
  companyId: string;
  email: string;
  isProvisioned: boolean;
  canSend: boolean;
  completionHint?: string;
  disabledHint?: string;
};

export default function TenantInvitationForm({
  companyId,
  email,
  isProvisioned,
  canSend,
  completionHint,
  disabledHint,
}: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    sendTenantInvitationAction,
    {},
  );

  if (!isProvisioned) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        Der Erstzugang kann versendet werden, sobald der Mandant erfolgreich an die App gemeldet
        wurde.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="companyId" value={companyId} />

      <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
        <p className="font-medium text-foreground">Empfänger: {email}</p>
        <p className="mt-1 text-muted-foreground">
          Die E-Mail enthält kein Passwort. Der einmalige Link führt zur sicheren Passwortvergabe
          in der Gleistrix-App.
        </p>
      </div>

      {!canSend && completionHint ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          {completionHint}
        </p>
      ) : null}

      {canSend && disabledHint ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
          {disabledHint}
        </p>
      ) : null}

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

      {canSend ? (
        <Button type="submit" variant="outline" disabled={isPending || Boolean(disabledHint)}>
          <Mail className="size-4" aria-hidden />
          {isPending ? "Einladung wird versendet …" : "Einladung erneut senden"}
        </Button>
      ) : null}
    </form>
  );
}
