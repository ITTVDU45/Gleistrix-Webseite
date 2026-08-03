"use client";

import { useActionState } from "react";

import { saveContactAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Contact } from "@/types/admin";

type Props = {
  /** Ohne Kontakt legt das Formular einen neuen an, mit Kontakt bearbeitet es ihn. */
  contact?: Contact;
};

export default function ContactForm({ contact }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveContactAction,
    {},
  );

  // Die Seite zeigt das Formular je Zeile erneut – ohne eigenen Präfix wären
  // die Feld-IDs mehrfach vergeben und die Labels zeigten alle auf das erste.
  const uid = contact?.id ?? "neu";

  return (
    <form action={formAction} className="space-y-4">
      {contact ? <input type="hidden" name="contactId" value={contact.id} /> : null}
      {/* Die Action schreibt companyId aus dem Formular zurück – ohne dieses
          Feld würde eine Bearbeitung die Zuordnung zum Mandanten löschen. */}
      <input type="hidden" name="companyId" value={contact?.companyId ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`company-${uid}`}>Firma</Label>
          <Input
            id={`company-${uid}`}
            name="company"
            required
            defaultValue={contact?.company ?? ""}
            placeholder="Muster Bau GmbH"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`contactName-${uid}`}>Name</Label>
          <Input
            id={`contactName-${uid}`}
            name="contactName"
            required
            defaultValue={contact?.contactName ?? ""}
            placeholder="Sabine Ahrens"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`email-${uid}`}>E-Mail</Label>
          <Input
            id={`email-${uid}`}
            name="email"
            type="email"
            required
            defaultValue={contact?.email ?? ""}
            placeholder="s.ahrens@muster-bau.de"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`phone-${uid}`}>Telefon</Label>
          <Input
            id={`phone-${uid}`}
            name="phone"
            type="tel"
            defaultValue={contact?.phone ?? ""}
            placeholder="030 1234567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`role-${uid}`}>Rolle</Label>
          <Input
            id={`role-${uid}`}
            name="role"
            defaultValue={contact?.role ?? ""}
            placeholder="Bauleitung"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`note-${uid}`}>Notiz</Label>
          <Input
            id={`note-${uid}`}
            name="note"
            defaultValue={contact?.note ?? ""}
            placeholder="Ruft lieber vormittags zurück"
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

      {state.success ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          {state.success}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} variant={contact ? "outline" : "default"}>
        {isPending ? "Speichert …" : contact ? "Änderungen speichern" : "Kontakt anlegen"}
      </Button>
    </form>
  );
}
