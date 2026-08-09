"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Mail, Plus, Trash2 } from "lucide-react";

import {
  type FormState,
  inviteCompanyUserAction,
  removeCompanyUserAction,
  resendCompanyUserInviteAction,
} from "@/app/admin/actions";
import { EmptyState, formatDateTime } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import {
  COMPANY_USER_ROLES,
  ROLE_HINT,
  ROLE_LABEL,
  type TemplateDraft,
  renderNotification,
  sampleValues,
} from "@/lib/admin/notification-templates";
import type { CompanyUser, CompanyUserRole } from "@/types/admin";

type Props = {
  companyId: string;
  companyName: string;
  contactName: string;
  users: CompanyUser[];
  /** Erst nach erfolgreichem App-Abgleich lässt sich ein Nutzer anlegen. */
  canInvite: boolean;
  disabledHint?: string;
  /**
   * Vorlage, mit der die Einladung tatsächlich verschickt wird.
   *
   * Kommt vom Server, damit die Vorschau die aktive Vorlage aus den
   * Einstellungen zeigt – und nicht einen zweiten, fest verdrahteten Text.
   */
  inviteTemplate: TemplateDraft;
};

const CONTROL_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function CompanyUsersPanel({
  companyId,
  companyName,
  contactName,
  users,
  canInvite,
  disabledHint,
  inviteTemplate,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    inviteCompanyUserAction,
    {},
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CompanyUserRole>("user");

  // Nach erfolgreicher Einladung schliessen und die Felder leeren – sonst
  // stünde beim nächsten Öffnen der eben eingeladene Nutzer noch im Formular.
  useEffect(() => {
    if (!state.success) return;
    dialogRef.current?.close();
    setName("");
    setEmail("");
    setRole("user");
  }, [state.success]);

  /**
   * Vorschau der fertigen Mail.
   *
   * renderNotification ist dieselbe Funktion, die der Server beim Versand
   * benutzt – zwei Wege wären zwei Wahrheiten. Der Link bleibt ein
   * Beispielwert: das echte Token erzeugt erst die App beim Absenden.
   */
  const previewHtml = useMemo(
    () =>
      renderNotification(inviteTemplate, {
        ...sampleValues(),
        unternehmen: companyName,
        ansprechpartner: contactName,
        name: name || "Vorname Nachname",
        email: email || "name@beispiel.de",
        rolle: ROLE_LABEL[role],
      }).html,
    [inviteTemplate, companyName, contactName, name, email, role],
  );

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <EmptyState>
          Ausser dem Erstbenutzer wurde noch niemand in diesen Mandanten eingeladen.
        </EmptyState>
      ) : (
        <ul className="divide-y">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.email} · {ROLE_LABEL[user.role]} · eingeladen am{" "}
                  {formatDateTime(user.invitedAt)}
                  {user.resentAt ? ` · erneut gesendet ${formatDateTime(user.resentAt)}` : ""}
                </p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <ResendButton userId={user.id} />
                <form action={removeCompanyUserAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    title="Entfernt nur den Eintrag hier – der Benutzer in der App bleibt bestehen."
                  >
                    <Trash2 className="size-4" aria-hidden />
                    <span className="sr-only">Aus der Übersicht entfernen</span>
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

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

      {canInvite ? (
        <Button type="button" variant="outline" onClick={() => dialogRef.current?.showModal()}>
          <Plus className="size-4" aria-hidden />
          Nutzer einladen
        </Button>
      ) : (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
          {disabledHint ??
            "Nutzer lassen sich einladen, sobald der Mandant erfolgreich an die App gemeldet wurde."}
        </p>
      )}

      {/* Natives <dialog>: Fokusfalle, Escape und Backdrop ohne eigene Logik. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="invite-dialog-title"
        className="w-[min(72rem,94vw)] rounded-xl border bg-card p-0 text-foreground shadow-lg backdrop:bg-slate-950/50"
      >
        <form action={formAction} className="flex max-h-[88vh] flex-col">
          <input type="hidden" name="companyId" value={companyId} />

          <header className="border-b px-6 py-4">
            <h2 id="invite-dialog-title" className="text-sm font-semibold tracking-tight">
              Nutzer zu {companyName} einladen
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Der Benutzer wird in der Gleistrix-App angelegt und erhält einen einmaligen Link zur
              Passwortvergabe. Es wird kein Passwort versendet.
            </p>
          </header>

          <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="invite-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="invite-name"
                  name="name"
                  required
                  autoComplete="off"
                  placeholder="Jonas Weber"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={CONTROL_CLASS}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="invite-email" className="text-sm font-medium">
                  E-Mail
                </label>
                <input
                  id="invite-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="j.weber@unternehmen.de"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={CONTROL_CLASS}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="invite-role" className="text-sm font-medium">
                  Rolle
                </label>
                <select
                  id="invite-role"
                  name="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as CompanyUserRole)}
                  className={CONTROL_CLASS}
                >
                  {COMPANY_USER_ROLES.map((option) => (
                    <option key={option} value={option}>
                      {ROLE_LABEL[option]}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">{ROLE_HINT[role]}</p>
              </div>

              {state.error ? (
                <p
                  role="alert"
                  className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
                >
                  {state.error}
                </p>
              ) : null}
            </div>

            <div className="min-w-0 space-y-2">
              <p className="text-sm font-medium">Vorschau der Einladungsmail</p>
              <p className="text-xs text-muted-foreground">
                So kommt die Nachricht an – Platzhalter mit Beispielwerten befüllt. Den einmaligen
                Link erzeugt die App erst beim Absenden.
              </p>
              {/* iframe statt dangerouslySetInnerHTML: das Mail-HTML bringt
                  eigene <style>-Regeln mit und färbte sonst die Adminseite ein. */}
              <iframe
                title="Vorschau der Einladungsmail"
                srcDoc={previewHtml}
                sandbox=""
                className="h-[26rem] w-full rounded-lg border bg-white"
              />
            </div>
          </div>

          <footer className="flex flex-wrap justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Einladung wird versendet …" : "Einladen"}
            </Button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}

/** Eigene Komponente: jede Zeile braucht ihren eigenen Aktionsstatus. */
function ResendButton({ userId }: { userId: string }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    resendCompanyUserInviteAction,
    {},
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={isPending}
        title={state.error ?? state.success ?? "Einladung erneut senden"}
      >
        <Mail className="size-4" aria-hidden />
        {isPending ? "Sendet …" : "Erneut senden"}
      </Button>
    </form>
  );
}
