"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

import type { FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

/**
 * Pop-up auf Basis des nativen <dialog>-Elements.
 *
 * showModal() bringt Fokusfalle, Escape-Taste und Inertisierung des Hintergrunds
 * mit – deshalb braucht der Adminbereich dafür keine zusätzliche Abhängigkeit.
 * Der Inhalt bleibt im DOM, solange der Dialog geschlossen ist; das ist gewollt,
 * damit Server-Komponenten ihn als children hineinreichen können.
 */

type Props = {
  /** Beschriftung des öffnenden Buttons. */
  label: string;
  title: string;
  description?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  children: ReactNode;
};

export default function Modal({
  label,
  title,
  description,
  variant = "default",
  size = "sm",
  children,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        onClick={() => dialogRef.current?.showModal()}
      >
        {label}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-xl border bg-card text-foreground shadow-lg backdrop:bg-slate-900/50"
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-sm font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Dialog schließen"
            onClick={() => dialogRef.current?.close()}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </dialog>
    </>
  );
}

/**
 * Formular-Ref, der nach einer erfolgreichen Action den umgebenden Dialog schließt.
 *
 * Außerhalb eines Dialogs findet closest() nichts – dasselbe Formular funktioniert
 * damit auf der Detailseite unverändert weiter.
 *
 * @param resetOnSuccess Bei Anlege-Formularen: leert die Felder, damit das Pop-up
 *   beim nächsten Öffnen nicht die zuletzt eingegebenen Werte zeigt.
 */
export function useDialogForm(state: FormState, resetOnSuccess = false) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.success) return;
    if (resetOnSuccess) formRef.current?.reset();
    formRef.current?.closest("dialog")?.close();
  }, [state.success, resetOnSuccess]);

  return formRef;
}
