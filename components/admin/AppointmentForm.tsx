"use client";

import { useActionState } from "react";

import { setLeadAppointmentAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  leadId: string;
  appointmentAt?: string;
  note?: string;
};

/**
 * ISO-Zeitpunkt → Wert für `datetime-local` (Ortszeit, ohne Zone).
 * `toISOString()` wäre UTC und würde den Termin im Feld verschieben.
 */
function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AppointmentForm({ leadId, appointmentAt, note }: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    setLeadAppointmentAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="leadId" value={leadId} />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor={`appointment-${leadId}`}>Termin</Label>
          <Input
            id={`appointment-${leadId}`}
            name="appointmentAt"
            type="datetime-local"
            defaultValue={toLocalInput(appointmentAt)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`note-${leadId}`}>Notiz</Label>
          <Input
            id={`note-${leadId}`}
            name="note"
            defaultValue={note ?? ""}
            placeholder="Teams-Link vorab senden"
          />
        </div>
        <Button type="submit" variant="outline" disabled={isPending}>
          {isPending ? "Speichert …" : "Speichern"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Feld leeren und speichern entfernt den Termin wieder.
      </p>

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
    </form>
  );
}
