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

/** Angelegter Mandant – dient nur als Vorlage für Name und Ansprechpartner. */
export type DemoCompany = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
};

/** Mandantenpaket, dessen Module der Demomandant bekommt. */
export type DemoPackage = {
  id: string;
  name: string;
  moduleCount: number;
};

type Props = {
  candidates: DemoCandidate[];
  companies: DemoCompany[];
  packages: DemoPackage[];
  defaultDays: number;
  maxDays: number;
  configIssue: string | null;
};

const MANUAL = "";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Formular für einen Demozugang.
 *
 * Was hier entsteht, ist ein eigener Mandant mit eigener Datenbank, eigenem
 * Bucket und eigenem Ablaufdatum – deshalb sind Unternehmen und Paket Pflicht.
 * Die Auswahlliste oben füllt die Felder nur vor: Ein bestehender Mandant ist
 * die Vorlage für den Namen, nicht das Ziel der Demo.
 */
export default function DemoReleaseForm({
  candidates,
  companies,
  packages,
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

  const vorlage = lead
    ? { company: lead.company, contactName: lead.contactName, email: lead.email }
    : company
      ? { company: company.name, contactName: company.contactName, email: company.contactEmail }
      : { company: "", contactName: "", email: "" };

  if (configIssue) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        {configIssue}
      </p>
    );
  }

  if (packages.length === 0) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        Es ist kein freigegebenes Mandantenpaket vorhanden. Ohne Paket bekäme der Demomandant keine
        Module und wäre in der App sofort gesperrt – bitte zuerst unter Pakete eines anlegen.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="leadId" value={lead?.id ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="source">Daten übernehmen</Label>
          <select
            id="source"
            value={selection}
            onChange={(event) => setSelection(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value={MANUAL}>Freie Eingabe – Daten selbst eintragen</option>
            {candidates.length > 0 ? (
              <optgroup label="Anfragen">
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={`lead:${candidate.id}`}>
                    {candidate.company} · {candidate.contactName}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {companies.length > 0 ? (
              <optgroup label="Bestehende Mandanten">
                {companies.map((entry) => (
                  <option key={entry.id} value={`company:${entry.id}`}>
                    {entry.name} · {entry.contactEmail}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
          <p className="text-xs text-muted-foreground">
            Füllt die Felder nur vor. Die Demo bekommt in jedem Fall einen eigenen Mandanten mit
            eigener Datenbank und eigenem Speicher.
          </p>
        </div>

        {/* key erzwingt ein Remount, damit defaultValue der Auswahl folgt. */}
        <div className="space-y-2">
          <Label htmlFor="company">Unternehmen</Label>
          <Input
            key={`company-${selection}`}
            id="company"
            name="company"
            required
            maxLength={200}
            defaultValue={vorlage.company}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName">Ansprechpartner</Label>
          <Input
            key={`contact-${selection}`}
            id="contactName"
            name="contactName"
            maxLength={200}
            defaultValue={vorlage.contactName}
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
            defaultValue={vorlage.email}
          />
          <p className="text-xs text-muted-foreground">
            Bekommt den Einladungslink und vergibt darüber sein Passwort.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="packageId">Paket</Label>
          <select id="packageId" name="packageId" required className={SELECT_CLASS}>
            <option value="">Bitte wählen …</option>
            {packages.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name} · {entry.moduleCount} Module
              </option>
            ))}
          </select>
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
          <p className="text-xs text-muted-foreground">
            Danach sperrt die App den Zugang von selbst.
          </p>
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
              Anmeldung der App öffnen
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          ) : null}
        </div>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Mandant wird angelegt …" : "Demoversion freigeben"}
      </Button>
    </form>
  );
}
