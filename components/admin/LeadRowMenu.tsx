"use client";

import { useActionState, useEffect, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { type FormState, deleteLeadAction, saveLeadAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type Props = {
  lead: {
    id: string;
    company: string;
    contactName: string;
    email: string;
    phone?: string;
    message?: string;
  };
};

const CONTROL_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const ITEM_CLASS =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-muted";

/** Feste Menübreite – gemessen wäre sie vor dem Öffnen 0. */
const MENU_WIDTH = 176;

/**
 * Aktionen einer Anfrage hinter drei Punkten.
 *
 * ponytail: gleiche Mechanik wie CompanyRowMenu (Popover + natives <dialog>);
 * eine gemeinsame Abstraktion lohnt erst beim dritten Menü.
 */
export default function LeadRowMenu({ lead }: Props) {
  const menuId = `lead-menu-${lead.id}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(saveLeadAction, {});

  // Abhängigkeit ist das ganze state-Objekt: bei zweimal derselben
  // Erfolgsmeldung bliebe der Dialog sonst offen.
  useEffect(() => {
    if (state.success) editRef.current?.close();
  }, [state]);

  function closeMenu(): void {
    const menu = menuRef.current;
    if (menu?.matches(":popover-open")) menu.hidePopover();
  }

  function positionMenu(): void {
    const anchor = triggerRef.current?.getBoundingClientRect();
    const menu = menuRef.current;
    if (!anchor || !menu) return;

    menu.style.top = `${anchor.bottom + 4}px`;
    menu.style.left = `${Math.max(8, anchor.right - MENU_WIDTH)}px`;
    // Ein fixiertes Menü liefe beim Scrollen vom Knopf weg.
    document.addEventListener("scroll", closeMenu, { capture: true, once: true });
  }

  function openDialog(dialog: HTMLDialogElement | null): void {
    closeMenu();
    dialog?.showModal();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={menuId}
        onClick={positionMenu}
        title={`Aktionen für ${lead.company}`}
        className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <MoreHorizontal className="size-4" aria-hidden />
        <span className="sr-only">Aktionen</span>
      </button>

      {/* popover="auto": Schließen per Klick daneben und Escape gibt es nativ. */}
      <div
        id={menuId}
        ref={menuRef}
        popover="auto"
        className="fixed inset-auto m-0 w-44 rounded-lg border bg-card p-1 text-foreground shadow-lg"
      >
        <button type="button" className={ITEM_CLASS} onClick={() => openDialog(editRef.current)}>
          <Pencil className="size-4" aria-hidden />
          Bearbeiten
        </button>
        <button
          type="button"
          className={`${ITEM_CLASS} text-rose-700 hover:bg-rose-50`}
          onClick={() => openDialog(deleteRef.current)}
        >
          <Trash2 className="size-4" aria-hidden />
          Löschen
        </button>
      </div>

      {/* Natives <dialog>: Fokusfalle, Escape und Backdrop ohne eigene Logik. */}
      <dialog
        ref={editRef}
        aria-labelledby={`${menuId}-edit-title`}
        className="w-[min(32rem,94vw)] rounded-xl border bg-card p-0 text-left text-foreground shadow-lg backdrop:bg-slate-950/50"
      >
        <form action={formAction}>
          <input type="hidden" name="leadId" value={lead.id} />

          <header className="border-b px-6 py-4">
            <h2 id={`${menuId}-edit-title`} className="text-sm font-semibold tracking-tight">
              Anfrage bearbeiten
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Termin, Notiz und Status bleiben in der Zeile darunter.
            </p>
          </header>

          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label htmlFor={`${menuId}-company`} className="text-sm font-medium">
                Firmenname
              </label>
              <input
                id={`${menuId}-company`}
                name="company"
                required
                defaultValue={lead.company}
                className={CONTROL_CLASS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor={`${menuId}-contact-name`} className="text-sm font-medium">
                  Ansprechpartner
                </label>
                <input
                  id={`${menuId}-contact-name`}
                  name="contactName"
                  required
                  defaultValue={lead.contactName}
                  className={CONTROL_CLASS}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`${menuId}-email`} className="text-sm font-medium">
                  E-Mail
                </label>
                <input
                  id={`${menuId}-email`}
                  name="email"
                  type="email"
                  required
                  defaultValue={lead.email}
                  className={CONTROL_CLASS}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${menuId}-phone`} className="text-sm font-medium">
                Telefon
              </label>
              <input
                id={`${menuId}-phone`}
                name="phone"
                defaultValue={lead.phone ?? ""}
                className={CONTROL_CLASS}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`${menuId}-message`} className="text-sm font-medium">
                Nachricht
              </label>
              <textarea
                id={`${menuId}-message`}
                name="message"
                rows={3}
                defaultValue={lead.message ?? ""}
                className={`${CONTROL_CLASS} h-auto py-2`}
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
          </div>

          <footer className="flex justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => editRef.current?.close()}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Speichert …" : "Speichern"}
            </Button>
          </footer>
        </form>
      </dialog>

      <dialog
        ref={deleteRef}
        aria-labelledby={`${menuId}-delete-title`}
        className="w-[min(30rem,94vw)] rounded-xl border bg-card p-0 text-left text-foreground shadow-lg backdrop:bg-slate-950/50"
      >
        <div className="px-6 py-5">
          <h2 id={`${menuId}-delete-title`} className="text-sm font-semibold tracking-tight">
            Anfrage von {lead.company} löschen?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Die Anfrage verschwindet aus dem Eingang. Ein bereits daraus übernommener Kontakt
            bleibt im Verzeichnis bestehen.
          </p>
        </div>

        <footer className="flex justify-end gap-2 border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={() => deleteRef.current?.close()}>
            Abbrechen
          </Button>
          <form action={deleteLeadAction}>
            <input type="hidden" name="leadId" value={lead.id} />
            <Button type="submit" variant="destructive">
              Endgültig löschen
            </Button>
          </form>
        </footer>
      </dialog>
    </>
  );
}
