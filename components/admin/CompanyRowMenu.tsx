"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { type FormState, deleteCompanyAction, updateCompanyAction } from "@/app/admin/actions";
import { Mono } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";

type Props = {
  company: {
    id: string;
    name: string;
    slug: string;
    contactName: string;
    contactEmail: string;
    seats: number;
  };
};

const CONTROL_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const ITEM_CLASS =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-muted";

/**
 * Feste Menübreite.
 *
 * Die Position wird berechnet, bevor das Popover sichtbar ist – gemessen wäre
 * sie an dieser Stelle 0.
 */
const MENU_WIDTH = 176;

export default function CompanyRowMenu({ company }: Props) {
  const menuId = `company-menu-${company.id}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    updateCompanyAction,
    {},
  );

  // Nach dem Speichern schließen – die Zeile darunter zeigt bereits den neuen
  // Stand. Abhängigkeit ist das ganze state-Objekt: bei zweimal derselben
  // Erfolgsmeldung bliebe der Dialog sonst offen.
  useEffect(() => {
    if (state.success) editRef.current?.close();
  }, [state]);

  function closeMenu(): void {
    const menu = menuRef.current;
    if (menu?.matches(":popover-open")) menu.hidePopover();
  }

  /**
   * Das Menü liegt als Popover in der Top-Layer – im overflow-Container der
   * Tabelle würde ein absolut positioniertes Menü abgeschnitten. Position
   * deshalb von Hand, ausgehend vom Knopf.
   */
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
        title={`Aktionen für ${company.name}`}
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
        <Link href={`/admin/unternehmen/${company.id}`} className={ITEM_CLASS} onClick={closeMenu}>
          <Eye className="size-4" aria-hidden />
          Ansehen
        </Link>
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
          <input type="hidden" name="companyId" value={company.id} />

          <header className="border-b px-6 py-4">
            <h2 id={`${menuId}-edit-title`} className="text-sm font-semibold tracking-tight">
              {company.name} bearbeiten
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Die Kennung <Mono>{company.slug}</Mono> bleibt fest – Datenbank und Bucket sind
              daraus abgeleitet.
            </p>
          </header>

          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label htmlFor={`${menuId}-name`} className="text-sm font-medium">
                Firmenname
              </label>
              <input
                id={`${menuId}-name`}
                name="name"
                required
                defaultValue={company.name}
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
                  defaultValue={company.contactName}
                  className={CONTROL_CLASS}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={`${menuId}-contact-email`} className="text-sm font-medium">
                  Kontakt-E-Mail
                </label>
                <input
                  id={`${menuId}-contact-email`}
                  name="contactEmail"
                  type="email"
                  required
                  defaultValue={company.contactEmail}
                  className={CONTROL_CLASS}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${menuId}-seats`} className="text-sm font-medium">
                Benutzer
              </label>
              <input
                id={`${menuId}-seats`}
                name="seats"
                type="number"
                min={1}
                required
                defaultValue={company.seats}
                className={CONTROL_CLASS}
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
            {company.name} löschen?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Der Mandant verschwindet aus dem Adminbereich. Datenbank, MinIO-Bucket und der Zugang
            in der App bleiben bestehen und müssen dort getrennt abgebaut werden. Käufe und
            Nutzungsdaten bleiben als Historie erhalten.
          </p>
        </div>

        <footer className="flex justify-end gap-2 border-t px-6 py-4">
          <Button type="button" variant="ghost" onClick={() => deleteRef.current?.close()}>
            Abbrechen
          </Button>
          <form action={deleteCompanyAction}>
            <input type="hidden" name="companyId" value={company.id} />
            <Button type="submit" variant="destructive">
              Endgültig löschen
            </Button>
          </form>
        </footer>
      </dialog>
    </>
  );
}
