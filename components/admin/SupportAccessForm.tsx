"use client";

import { useActionState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

import { openSupportSessionAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  companyId: string;
  supportEmail: string | null;
  configIssue: "no-account" | "no-secret" | null;
  isProvisioned: boolean;
};

const ISSUE_TEXT: Record<"no-account" | "no-secret", string> = {
  "no-account":
    "Support-Konto ist nicht konfiguriert. GLEISTRIX_SUPPORT_EMAIL und GLEISTRIX_SUPPORT_PASSWORD setzen.",
  "no-secret":
    "SERVICE_SHARED_SECRET fehlt oder ist zu kurz (mindestens 32 Zeichen). Es muss in beiden Deployments identisch sein.",
};

export default function SupportAccessForm({
  companyId,
  supportEmail,
  configIssue,
  isProvisioned,
}: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    openSupportSessionAction,
    {},
  );
  const handoffForm = useRef<HTMLFormElement>(null);
  const submittedToken = useRef<string | null>(null);

  useEffect(() => {
    const request = state.supportRequest;
    if (!request || submittedToken.current === request.token) return;
    submittedToken.current = request.token;
    handoffForm.current?.requestSubmit();
  }, [state.supportRequest]);

  if (configIssue) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        {ISSUE_TEXT[configIssue]}
      </p>
    );
  }

  if (!isProvisioned) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        Support-Zugriff ist möglich, sobald die Provisionierung dieses Mandanten abgeschlossen ist.
      </p>
    );
  }

  return (
    <>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="companyId" value={companyId} />

        <p className="text-sm text-muted-foreground">
          Anmeldung als <strong className="font-medium text-foreground">{supportEmail}</strong>.
          Jeder Zugriff wird protokolliert.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="reason">Grund des Zugriffs</Label>
            <Input
              id="reason"
              name="reason"
              required
              placeholder="Ticket #482 – Abrechnung prüfen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportPassword">Gleistrix-Support-Passwort</Label>
            <Input
              id="supportPassword"
              name="supportPassword"
              type="password"
              autoComplete="off"
              required
            />
          </div>
        </div>

        {state.error ? (
          <p
            role="alert"
            className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
          >
            {state.error}
          </p>
        ) : null}

        {state.success && state.supportRequest ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
            {state.success} Die Instanz wird per sicherer POST-Übergabe geöffnet.
          </p>
        ) : null}

        <Button type="submit" variant="outline" disabled={isPending}>
          {isPending ? "Wird erstellt …" : "Support-Zugang anfordern"}
        </Button>
      </form>

      {state.supportRequest ? (
        <form
          ref={handoffForm}
          action={state.supportRequest.action}
          method="post"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 rounded-lg border border-dashed px-3 py-2.5 text-sm text-muted-foreground"
        >
          <input type="hidden" name="token" value={state.supportRequest.token} />
          <span>Falls der neue Tab blockiert wurde: </span>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4"
          >
            Instanz im Support-Modus öffnen
            <ExternalLink className="size-3.5" aria-hidden />
          </button>
        </form>
      ) : null}
    </>
  );
}
