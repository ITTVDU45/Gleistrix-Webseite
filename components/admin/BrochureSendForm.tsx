"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";

import { sendBrochureAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  requestId: string;
  /** Nur zur Anzeige – der Server holt den Empfänger selbst aus dem Datensatz. */
  recipient: string;
  defaultSubject: string;
  defaultBody: string;
  /** Bereits versendet: dann ist der Versand ein bewusstes Nachfassen. */
  sent: boolean;
};

export default function BrochureSendForm({
  requestId,
  recipient,
  defaultSubject,
  defaultBody,
  sent,
}: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    sendBrochureAction,
    {},
  );

  return (
    // ponytail: <details> statt eines eigenen Auf-/Zu-States – die Liste soll
    // nicht aus lauter Textfeldern bestehen.
    <details className="w-full">
      <summary className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
        <Send className="size-3.5" aria-hidden />
        {sent ? "Erneut senden" : "Broschüre senden"}
      </summary>

      <form action={formAction} className="mt-3 space-y-3 rounded-lg border p-3">
        <input type="hidden" name="requestId" value={requestId} />

        <p className="text-sm text-muted-foreground">
          Empfänger: <span className="font-medium text-foreground">{recipient}</span>
        </p>

        <div className="space-y-2">
          <Label htmlFor={`subject-${requestId}`}>Betreff</Label>
          <Input
            id={`subject-${requestId}`}
            name="subject"
            required
            defaultValue={defaultSubject}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`body-${requestId}`}>Text</Label>
          <textarea
            id={`body-${requestId}`}
            name="body"
            rows={8}
            required
            defaultValue={defaultBody}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>

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

        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Wird gesendet …" : "Jetzt senden"}
        </Button>
      </form>
    </details>
  );
}
