"use client";

import { type ChangeEvent, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  type FormState,
  deleteNotificationTemplateAction,
  saveNotificationTemplateAction,
} from "@/app/admin/actions";
import { EmptyState, formatDateTime } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import {
  PLACEHOLDERS,
  TRIGGERS,
  emptyTemplate,
  renderNotification,
  sampleValues,
  triggerLabel,
  unknownPlaceholders,
} from "@/lib/admin/notification-templates";
import type { NotificationTemplate } from "@/types/admin";

const CONTROL_CLASS =
  "w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Felder, in die sich ein Platzhalter einfügen lässt. */
type InsertTarget = "subject" | "title" | "body" | "actionUrl";

type Draft = ReturnType<typeof emptyTemplate> & { id: string };

function toDraft(template: NotificationTemplate): Draft {
  return {
    id: template.id,
    name: template.name,
    trigger: template.trigger,
    subject: template.subject,
    eyebrow: template.eyebrow,
    title: template.title,
    body: template.body,
    actionLabel: template.actionLabel,
    actionUrl: template.actionUrl,
    isActive: template.isActive,
  };
}

export default function NotificationTemplateManager({
  templates,
}: {
  templates: NotificationTemplate[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<Draft>({ ...emptyTemplate(), id: "" });
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveNotificationTemplateAction,
    {},
  );

  // Merkt sich, wohin ein angeklickter Platzhalter gehört. Ohne das landete er
  // immer im Text, auch wenn der Cursor gerade im Betreff stand.
  const lastFocused = useRef<InsertTarget>("body");
  const fieldRefs = useRef<Partial<Record<InsertTarget, HTMLInputElement | HTMLTextAreaElement>>>(
    {},
  );

  useEffect(() => {
    if (state.success) dialogRef.current?.close();
  }, [state.success]);

  const open = (template?: NotificationTemplate) => {
    setDraft(template ? toDraft(template) : { ...emptyTemplate(), id: "" });
    lastFocused.current = "body";
    dialogRef.current?.showModal();
  };

  /** Fügt {{schlüssel}} an der Cursorposition des zuletzt benutzten Feldes ein. */
  const insertPlaceholder = (key: string) => {
    const target = lastFocused.current;
    const element = fieldRefs.current[target];
    const token = `{{${key}}}`;
    const current = draft[target];

    const start = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? current.length;
    const next = current.slice(0, start) + token + current.slice(end);

    setDraft((value) => ({ ...value, [target]: next }));
    // Nach dem Re-Render den Cursor hinter den eingefügten Platzhalter setzen,
    // sonst springt er ans Feldende und die nächste Eingabe landet falsch.
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const preview = useMemo(() => renderNotification(draft, sampleValues()), [draft]);
  const unknown = useMemo(
    () => unknownPlaceholders(draft.subject, draft.title, draft.body, draft.actionUrl),
    [draft.subject, draft.title, draft.body, draft.actionUrl],
  );

  const register = (target: InsertTarget) => ({
    value: draft[target],
    onFocus: () => {
      lastFocused.current = target;
    },
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((value) => ({ ...value, [target]: event.target.value })),
  });

  return (
    <div className="space-y-4">
      {templates.length === 0 ? (
        <EmptyState>
          Noch keine Vorlage angelegt. Ohne Vorlage verschickt Gleistrix nur die eingebaute
          Einladungsmail.
        </EmptyState>
      ) : (
        <ul className="divide-y">
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{template.name}</p>
                  {template.isActive ? (
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      automatisch
                    </span>
                  ) : (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      nur manuell
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {triggerLabel(template.trigger)} · Betreff: {template.subject} · geändert{" "}
                  {formatDateTime(template.updatedAt)}
                </p>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <Button type="button" size="sm" variant="outline" onClick={() => open(template)}>
                  <Pencil className="size-4" aria-hidden />
                  Bearbeiten
                </Button>
                <form action={deleteNotificationTemplateAction}>
                  <input type="hidden" name="templateId" value={template.id} />
                  <Button type="submit" size="sm" variant="ghost">
                    <Trash2 className="size-4" aria-hidden />
                    <span className="sr-only">Vorlage löschen</span>
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

      <Button type="button" variant="outline" onClick={() => open()}>
        <Plus className="size-4" aria-hidden />
        Neue Vorlage
      </Button>

      {/* Natives <dialog>: Fokusfalle, Escape und Backdrop ohne eigene Logik. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="template-dialog-title"
        className="w-[min(84rem,96vw)] rounded-xl border bg-card p-0 text-foreground shadow-lg backdrop:bg-slate-950/50"
      >
        <form action={formAction} className="flex max-h-[92vh] flex-col">
          <input type="hidden" name="templateId" value={draft.id} />

          <header className="border-b px-6 py-4">
            <h2 id="template-dialog-title" className="text-sm font-semibold tracking-tight">
              {draft.id ? "Vorlage bearbeiten" : "Neue Vorlage"}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Platzhalter anklicken, um sie an der Cursorposition einzufügen. Beim Versand werden
              sie durch die echten Werte des Mandanten ersetzt.
            </p>
          </header>

          <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="tpl-name" className="text-sm font-medium">
                    Name der Vorlage
                  </label>
                  <input
                    id="tpl-name"
                    name="name"
                    required
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, name: event.target.value }))
                    }
                    placeholder="Zugang gesperrt"
                    className={CONTROL_CLASS}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nur für die Übersicht – steht nicht in der Mail.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tpl-trigger" className="text-sm font-medium">
                    Auslöser
                  </label>
                  <select
                    id="tpl-trigger"
                    name="trigger"
                    value={draft.trigger ?? ""}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        trigger: (event.target.value || null) as Draft["trigger"],
                        // Ohne Auslöser gibt es nichts zu automatisieren.
                        isActive: event.target.value ? value.isActive : false,
                      }))
                    }
                    className={CONTROL_CLASS}
                  >
                    <option value="">Nur manueller Versand</option>
                    {TRIGGERS.map((trigger) => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {TRIGGERS.find((trigger) => trigger.id === draft.trigger)?.description ??
                      "Diese Vorlage wird nur verschickt, wenn du sie auf der Unternehmensseite auswählst."}
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-2.5 rounded-lg border px-3.5 py-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={draft.isActive}
                  disabled={!draft.trigger}
                  onChange={(event) =>
                    setDraft((value) => ({ ...value, isActive: event.target.checked }))
                  }
                  className="mt-0.5 size-4"
                />
                <span className="text-sm">
                  Automatisch versenden
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {draft.trigger
                      ? "Beim Auslöser geht diese Vorlage raus. Eine andere aktive Vorlage desselben Auslösers wird dabei deaktiviert."
                      : "Erst einen Auslöser wählen."}
                  </span>
                </span>
              </label>

              <div className="rounded-lg border p-3.5">
                <p className="text-sm font-medium">Platzhalter</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PLACEHOLDERS.map((placeholder) => (
                    <button
                      key={placeholder.key}
                      type="button"
                      onClick={() => insertPlaceholder(placeholder.key)}
                      title={`${placeholder.label} – Beispiel: ${placeholder.example}`}
                      className="rounded-full border bg-muted/50 px-2 py-1 font-mono text-xs transition-colors hover:border-primary hover:bg-primary/10"
                    >
                      {`{{${placeholder.key}}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tpl-subject" className="text-sm font-medium">
                  Betreff
                </label>
                <input
                  id="tpl-subject"
                  name="subject"
                  required
                  ref={(element) => {
                    if (element) fieldRefs.current.subject = element;
                  }}
                  placeholder="Ihr Gleistrix-Zugang für {{unternehmen}}"
                  className={CONTROL_CLASS}
                  {...register("subject")}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                <div className="space-y-2">
                  <label htmlFor="tpl-eyebrow" className="text-sm font-medium">
                    Kleine Zeile
                  </label>
                  <input
                    id="tpl-eyebrow"
                    name="eyebrow"
                    value={draft.eyebrow}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, eyebrow: event.target.value }))
                    }
                    placeholder="Wichtige Mitteilung"
                    className={CONTROL_CLASS}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tpl-title" className="text-sm font-medium">
                    Titel
                  </label>
                  <input
                    id="tpl-title"
                    name="title"
                    ref={(element) => {
                      if (element) fieldRefs.current.title = element;
                    }}
                    placeholder="Ihr Zugang ist bereit"
                    className={CONTROL_CLASS}
                    {...register("title")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tpl-body" className="text-sm font-medium">
                  Text
                </label>
                <textarea
                  id="tpl-body"
                  name="body"
                  required
                  rows={10}
                  ref={(element) => {
                    if (element) fieldRefs.current.body = element;
                  }}
                  placeholder={"Guten Tag {{ansprechpartner}},\n\n…"}
                  className={`${CONTROL_CLASS} font-mono`}
                  {...register("body")}
                />
                <p className="text-xs text-muted-foreground">
                  Reiner Text. Eine Leerzeile beginnt einen neuen Absatz.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="tpl-action-label" className="text-sm font-medium">
                    Knopf-Beschriftung
                  </label>
                  <input
                    id="tpl-action-label"
                    name="actionLabel"
                    value={draft.actionLabel}
                    onChange={(event) =>
                      setDraft((value) => ({ ...value, actionLabel: event.target.value }))
                    }
                    placeholder="Zur Anwendung"
                    className={CONTROL_CLASS}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tpl-action-url" className="text-sm font-medium">
                    Knopf-Ziel
                  </label>
                  <input
                    id="tpl-action-url"
                    name="actionUrl"
                    ref={(element) => {
                      if (element) fieldRefs.current.actionUrl = element;
                    }}
                    placeholder="{{app}}"
                    className={CONTROL_CLASS}
                    {...register("actionUrl")}
                  />
                </div>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  Beide Felder leer lassen: dann steht in der Mail kein Knopf.
                </p>
              </div>

              {unknown.length > 0 ? (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
                  Unbekannte Platzhalter: {unknown.map((key) => `{{${key}}}`).join(", ")} – sie
                  bleiben beim Versand unverändert im Text stehen.
                </p>
              ) : null}

              {state.error ? (
                <p
                  role="alert"
                  className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
                >
                  {state.error}
                </p>
              ) : null}
            </div>

            <div className="min-w-0 space-y-2 lg:sticky lg:top-0 lg:self-start">
              <p className="text-sm font-medium">Vorschau</p>
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Betreff
                </p>
                <p className="text-sm font-medium">{preview.subject || "Noch kein Betreff"}</p>
              </div>
              {/* iframe statt dangerouslySetInnerHTML: das Mail-HTML bringt
                  eigene <style>-Regeln mit und färbte sonst die Adminseite ein. */}
              <iframe
                title="Vorschau der Benachrichtigung"
                srcDoc={preview.html}
                sandbox=""
                className="h-[38rem] w-full rounded-lg border bg-white"
              />
            </div>
          </div>

          <footer className="flex flex-wrap justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Wird gespeichert …" : "Speichern"}
            </Button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}
