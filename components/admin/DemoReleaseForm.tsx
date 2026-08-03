"use client";

import { useActionState, useState } from "react";
import { ExternalLink } from "lucide-react";

import { releaseDemoAction, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Anfrage, aus der die Freigabe entstehen kann – nur die Felder, die das Formular füllt. */
export type DemoCandidate = {
  id: string;
  company: string;
  contactName: string;
  email: string;
};

/** Angelegter Mandant – Demozugänge gehen auch an bestehende Kunden. */
export type DemoCompany = {
  id: string;
  name: string;
  contactEmail: string;
};

type Props = {
  candidates: DemoCandidate[];
  companies: DemoCompany[];
  defaultDays: number;
  maxDays: number;
  configIssue: string | null;
};

const MANUAL = "";

export default function DemoReleaseForm({
  candidates,
  companies,
  defaultDays,
  maxDays,
  configIssue,
}: Props) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    releaseDemoAction,
    {},
  );
  // Eine Auswahlliste, zwei Quellen – deshalb trägt der Wert seine Herkunft mit.
  // Die Liste selbst hat kein name-Attribut; die Anfrage-Kennung geht über ein
  // eigenes verstecktes Feld an die Action, damit dort nichts zu zerlegen ist.
  const [selection, setSelection] = useState(MANUAL);

  const lead = selection.startsWith("lead:")
    ? candidates.find((candidate) => candidate.id === selection.slice(5))
    : undefined;
  const company = selection.startsWith("company:")
    ? companies.find((entry) => entry.id === selection.slice(8))
    : undefined;

  const prefill = lead
    ? { company: lead.company, email: lead.email }
    : company
      ? { company: company.name, email: company.contactEmail }
      : { company: "", email: "" };

  if (configIssue) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        {configIssue}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="leadId" value={lead?.id ?? ""} />
      {/* Nur bei Auswahl eines Mandanten gesetzt – bei freier Eingabe bleibt die
          Zuordnung offen, statt sie über den Firmennamen zu raten. */}
      <input type="hidden" name="companyId" value={company?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="source">Empfänger übernehmen</Label>
          <select
            id="source"
            value={selection}
            onChange={(event) => setSelection(event.target.value)}
            className="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs"
          >
            <option value={MANUAL}>Freie Eingabe – Daten selbst eintragen</option>
            {companies.length > 0 ? (
              <optgroup label="Unternehmen">
                {companies.map((entry) => (
                  <option key={entry.id} value={`company:${entry.id}`}>
                    {entry.name} · {entry.contactEmail}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {candidates.length > 0 ? (
              <optgroup label="Anfragen">
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={`lead:${candidate.id}`}>
                    {candidate.company} · {candidate.contactName}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Unternehmen</Label>
          {/* key erzwingt ein Remount, damit defaultValue der Auswahl folgt. */}
          <Input
            key={`company-${selection}`}
            id="company"
            name="company"
            required
            defaultValue={prefill.company}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-Mail des Interessenten</Label>
          <Input
            key={`email-${selection}`}
            id="email"
            name="email"
            type="email"
            required
            defaultValue={prefill.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">Laufzeit in Tagen</Label>
          <Input
            id="days"
            name="days"
            type="number"
            min={1}
            max={maxDays}
            defaultValue={defaultDays}
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
        <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
          <p>{state.success}</p>
          {state.supportUrl ? (
            <a
              href={state.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 font-medium underline underline-offset-4"
            >
              Demo-Zugang öffnen
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Wird freigeschaltet …" : "Demoversion freigeben"}
      </Button>
    </form>
  );
}
