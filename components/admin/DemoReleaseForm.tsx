"use client";

import { useActionState, useRef, useState } from "react";
import { ExternalLink, Plus } from "lucide-react";

import { releaseDemoAction, type FormState } from "@/app/admin/actions";
import NewCompanyForm from "@/components/admin/NewCompanyForm";
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
  /** Für den Anlege-Dialog – dieselbe Auswahl wie auf der Unternehmensseite. */
  packages: { id: string; name: string }[];
  defaultDays: number;
  maxDays: number;
  configIssue: string | null;
};

const MANUAL = "";

/**
 * Firmenname aus einer Anfrage: Die Demo entsteht oft, bevor es den Mandanten
 * gibt – dann steht in der Auswahl der Name der Anfrage statt einer Kennung.
 */
const FROM_LEAD = "lead";

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

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
  // Das Unternehmen steht getrennt: Die Quelle setzt es vor, überschrieben wird
  // es aber von Hand – etwa wenn zur Anfrage längst ein Mandant existiert.
  const [companyChoice, setCompanyChoice] = useState("");
  const newCompanyRef = useRef<HTMLDialogElement>(null);

  const lead = selection.startsWith("lead:")
    ? candidates.find((candidate) => candidate.id === selection.slice(5))
    : undefined;

  const company = companies.find((entry) => entry.id === companyChoice);
  const companyName = companyChoice === FROM_LEAD ? (lead?.company ?? "") : (company?.name ?? "");
  const emailPrefill = company && companyChoice !== FROM_LEAD ? company.contactEmail : (lead?.email ?? "");

  /** Quelle gewechselt: Unternehmen mitziehen, damit beide Felder zusammenpassen. */
  function chooseSource(value: string): void {
    setSelection(value);
    if (value.startsWith("company:")) setCompanyChoice(value.slice(8));
    else if (value.startsWith("lead:")) setCompanyChoice(FROM_LEAD);
    else setCompanyChoice("");
  }

  if (configIssue) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        {configIssue}
      </p>
    );
  }

  return (
    <>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="leadId" value={lead?.id ?? ""} />
        {/* Nur bei Auswahl eines Mandanten gesetzt – stammt der Name aus einer
            Anfrage, bleibt die Zuordnung offen, statt sie zu raten. */}
        <input type="hidden" name="companyId" value={company?.id ?? ""} />
        <input type="hidden" name="company" value={companyName} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="source">Empfänger übernehmen</Label>
            <select
              id="source"
              value={selection}
              onChange={(event) => chooseSource(event.target.value)}
              className={SELECT_CLASS}
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
            <div className="flex gap-2">
              <select
                id="company"
                required
                value={companyChoice}
                onChange={(event) => setCompanyChoice(event.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Bitte wählen …</option>
                {lead ? <option value={FROM_LEAD}>{lead.company} · aus Anfrage</option> : null}
                {companies.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Neues Unternehmen anlegen"
                onClick={() => newCompanyRef.current?.showModal()}
              >
                <Plus className="size-4" aria-hidden />
                <span className="sr-only">Neues Unternehmen anlegen</span>
              </Button>
            </div>
            {companies.length === 0 && !lead ? (
              <p className="text-xs text-muted-foreground">
                Noch kein Unternehmen angelegt – über „+“ eines hinzufügen.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail des Interessenten</Label>
            {/* key erzwingt ein Remount, damit defaultValue der Auswahl folgt. */}
            <Input
              key={`email-${selection}-${companyChoice}`}
              id="email"
              name="email"
              type="email"
              required
              defaultValue={emailPrefill}
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

      {/* Natives <dialog>: Fokusfalle, Escape und Backdrop ohne eigene Logik.
          Das Formular liegt außerhalb des Freigabe-Formulars – verschachtelte
          <form> gibt es im HTML nicht. */}
      <dialog
        ref={newCompanyRef}
        aria-labelledby="new-company-title"
        className="w-[min(42rem,94vw)] rounded-xl border bg-card p-0 text-left text-foreground shadow-lg backdrop:bg-slate-950/50"
      >
        <header className="border-b px-6 py-4">
          <h2 id="new-company-title" className="text-sm font-semibold tracking-tight">
            Neues Unternehmen anlegen
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Der Mandant startet in der Provisionierung und steht danach auch auf der
            Unternehmensseite.
          </p>
        </header>

        <div className="p-6">
          <NewCompanyForm
            packages={packages}
            stay
            onCreated={(created) => {
              setCompanyChoice(created.id);
              // Die Quelle passt nicht mehr – der neue Mandant ist keine Anfrage.
              setSelection(MANUAL);
              newCompanyRef.current?.close();
            }}
          />
        </div>

        <footer className="flex justify-end border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={() => newCompanyRef.current?.close()}>
            Abbrechen
          </Button>
        </footer>
      </dialog>
    </>
  );
}
