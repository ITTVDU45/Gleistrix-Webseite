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
    /** Für den Löschdialog: Er nennt beim Namen, was verschwindet. */
    tenant: { mongoDatabase: string; minioBucket: string };
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

  // Eigener Zustand für den Abbau: Er kann scheitern und muss dann sagen, wie
  // weit er gekommen ist – ein stilles `action={…}` verschluckte genau das.
  const [teardown, teardownAction, teardownPending] = useActionState<FormState, FormData>(
    deleteCompanyAction,
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
        <form action={teardownAction}>
          <input type="hidden" name="companyId" value={company.id} />

          <div className="px-6 py-5">
            <h2 id={`${menuId}-delete-title`} className="text-sm font-semibold tracking-tight">
              {company.name} vollständig abbauen?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entfernt wird alles: der Zugriff der App auf die Mandantendaten, der Bucket{" "}
              <Mono>{company.tenant.minioBucket}</Mono> mit sämtlichen Dateien und Objektversionen
              sowie die Datenbank <Mono>{company.tenant.mongoDatabase}</Mono> samt ihrem Benutzer.
              Das ist nicht umkehrbar – hier liegt danach keine Sicherung mehr.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Käufe, Nutzungsdaten und das Zugriffsprotokoll bleiben als Beleg erhalten.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Reihenfolge: erst der Zugang, dann der Bucket, dann die Datenbank, zuletzt der
              Eintrag hier. Bricht ein Schritt ab, bleibt der Mandant stehen und der Abbau lässt
              sich wiederholen.
            </p>

            <label htmlFor={`${menuId}-confirm`} className="mt-4 block text-sm">
              Zum Bestätigen die Kennung <Mono>{company.slug}</Mono> eingeben
            </label>
            <input
              id={`${menuId}-confirm`}
              name="confirm"
              autoComplete="off"
              // Zwei Submit-Knöpfe mit gegensätzlicher Wirkung liegen in
              // diesem Formular. Enter nähme den ersten in Dokumentreihenfolge
              // – also den Notausgang, nicht den Abbau. Beide wollen einen
              // bewussten Klick.
              onKeyDown={(event) => {
                if (event.key === "Enter") event.preventDefault();
              }}
              className={`mt-1 ${CONTROL_CLASS}`}
            />

            {teardown.error ? (
              <p
                role="alert"
                className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
              >
                {teardown.error}
              </p>
            ) : null}
            {teardown.success ? (
              <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                {teardown.success}
              </p>
            ) : null}
          </div>

          <footer className="flex flex-wrap justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => deleteRef.current?.close()}>
              Abbrechen
            </Button>
            {/* Der Notausgang von früher: nur der Eintrag, Ressourcen bleiben. */}
            <Button
              type="submit"
              name="mode"
              value="eintrag"
              variant="outline"
              disabled={teardownPending}
            >
              Nur aus dem Adminbereich entfernen
            </Button>
            <Button
              type="submit"
              name="mode"
              value="abbauen"
              variant="destructive"
              disabled={teardownPending}
            >
              {/* Der Lauf kann zehn Sekunden und mehr dauern – ohne diesen Text
                  hält der Superadmin den Klick für hängengeblieben. */}
              {teardownPending ? "Baut ab …" : "Vollständig abbauen"}
            </Button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
