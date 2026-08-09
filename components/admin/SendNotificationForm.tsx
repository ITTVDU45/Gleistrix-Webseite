"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";

import { type FormState, sendNotificationAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { triggerLabel } from "@/lib/admin/notification-templates";
import type { NotificationTemplate } from "@/types/admin";

type Recipient = { id: string; name: string; email: string };

type Props = {
  companyId: string;
  contactName: string;
  contactEmail: string;
  templates: Pick<NotificationTemplate, "id" | "name" | "trigger">[];
  /** Zusätzlich eingeladene Nutzer dieses Mandanten. */
  recipients: Recipient[];
};

const CONTROL_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function SendNotificationForm({
  companyId,
  contactName,
  contactEmail,
  templates,
  recipients,
}: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    sendNotificationAction,
    {},
  );

  if (templates.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        Es ist noch keine Vorlage angelegt.{" "}
        <Link href="/admin/einstellungen" className="font-medium underline underline-offset-4">
          Unter Einstellungen anlegen
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="companyId" value={companyId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="notify-template" className="text-sm font-medium">
            Vorlage
          </label>
          <select id="notify-template" name="templateId" required className={CONTROL_CLASS}>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({triggerLabel(template.trigger)})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="notify-recipient" className="text-sm font-medium">
            Empfänger
          </label>
          {/* Nur gespeicherte Adressen zur Auswahl – der Server löst sie ohnehin
              selbst auf, sonst wäre der Adminbereich ein Versandrelais. */}
          <select id="notify-recipient" name="recipient" className={CONTROL_CLASS}>
            <option value="">
              {contactName ? `${contactName} · ` : ""}
              {contactEmail} (Ansprechpartner)
            </option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name} · {recipient.email}
              </option>
            ))}
          </select>
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

      {state.success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          {state.success}
        </p>
      ) : null}

      <Button type="submit" variant="outline" disabled={isPending}>
        <Send className="size-4" aria-hidden />
        {isPending ? "Wird versendet …" : "Jetzt senden"}
      </Button>
    </form>
  );
}
