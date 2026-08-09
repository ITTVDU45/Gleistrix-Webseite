"use client";

import { useActionState, useRef, useState } from "react";
import { ExternalLink, Plus } from "lucide-react";

import { releaseDemoAction, type FormState } from "@/app/admin/actions";
import NewCompanyForm from "@/components/admin/NewCompanyForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Anfrage, aus der die Freigabe entstanden ist – nur für die Zuordnung. */
export type DemoCandidate = {
  id: string;
  company: string;
  contactName: string;
  email: string;
};

/** Angelegter Mandant – er bekommt die Befristung. */
export type DemoCompany = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  /** Läuft für diesen Mandanten schon eine Demo, steht hier ihr Ende. */
  demoExpiresAt?: string | null;
  /** Ohne Module wäre der Zugang in der App sofort gesperrt. */
  hasModules: boolean;
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

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(value));
}

/**
 * Formular für einen Demozugang.
 *
 * Eine Demo ist die Befristung eines angelegten Mandanten, kein zweiter
 * Mandant daneben: Deshalb wird hier ausgewählt statt getippt, und der
 * Einladungslink geht an den Ansprechpartner, der am Mandanten steht.
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
  const [companyId, setCompanyId] = useState("");
  const [leadId, setLeadId] = useState("");
  // Frisch aus dem Dialog: Bis die Seite neu geladen ist, steht der Mandant
  // noch nicht in `companies` – ohne diesen Eintrag zeigte die Auswahl ins Leere.
  const [created, setCreated] = useState<DemoCompany | null>(null);

  const auswahl =
    created && created.id === companyId
      ? [created, ...companies.filter((entry) => entry.id !== created.id)]
      : companies;
  const company = auswahl.find((entry) => entry.id === companyId);
  const newCompanyRef = useRef<HTMLDialogElement>(null);

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
        <input type="hidden" name="leadId" value={leadId} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="companyId">Unternehmen</Label>
            <div className="flex gap-2">
              <select
                id="companyId"
                name="companyId"
                required
                value={companyId}
                onChange={(event) => setCompanyId(event.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Bitte wählen …</option>
                {auswahl.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name} · {entry.contactEmail}
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
            {auswahl.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Noch kein Unternehmen angelegt – über „+“ eines hinzufügen.
              </p>
            ) : null}
            {company && !company.hasModules ? (
              <p className="text-xs text-amber-800">
                {company.name} hat kein Paket mit Modulen. Der Zugang wäre in der App sofort
                gesperrt – bitte zuerst auf der Unternehmensseite ein Paket zuweisen.
              </p>
            ) : null}
            {company?.demoExpiresAt ? (
              <p className="text-xs text-muted-foreground">
                Läuft derzeit bis {formatDate(company.demoExpiresAt)} – eine Freigabe verlängert
                auf die neue Laufzeit.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="empfaenger">Einladung geht an</Label>
            <Input
              id="empfaenger"
              value={
                company ? `${company.contactName || company.name} · ${company.contactEmail}` : ""
              }
              placeholder="Erst ein Unternehmen wählen"
              readOnly
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Der Ansprechpartner des Mandanten – änderbar auf dessen Unternehmensseite.
            </p>
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
              Danach sperrt die App den Zugang von selbst. Ein Grundkauf hebt die Befristung auf.
            </p>
          </div>

          {candidates.length > 0 ? (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="lead">Anfrage zuordnen (optional)</Label>
              <select
                id="lead"
                value={leadId}
                onChange={(event) => setLeadId(event.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Keine Anfrage</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.company} · {candidate.contactName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Die zugeordnete Anfrage wandert auf „in Kontakt“.
              </p>
            </div>
          ) : null}
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
            Der Mandant steht danach auch auf der Unternehmensseite. Die Demoversion gibst du ihm
            anschließend hier.
          </p>
        </header>

        <div className="p-6">
          <NewCompanyForm
            packages={packages}
            stay
            onCreated={(neu) => {
              setCreated({
                id: neu.id,
                name: neu.name,
                contactName: "",
                contactEmail: neu.contactEmail,
                // Ein frisch angelegter Mandant hat sein Paket aus dem Dialog;
                // ob Module dranhängen, prüft die Action serverseitig.
                hasModules: true,
              });
              setCompanyId(neu.id);
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
