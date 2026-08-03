import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { movePricingEntryAction, type FormState } from "@/app/admin/actions";
import { Label } from "@/components/ui/label";
import { TIER_LABEL, type ModuleTier } from "@/lib/admin/modules";
import { cn } from "@/lib/utils";

/**
 * Bausteine der Preis-Formulare.
 *
 * Für mehrzeilige Eingaben gibt es keine shadcn-Komponente – die Klassen sind
 * bewusst dieselben wie bei <Input>, nur mit automatischer Höhe.
 */

export const TEXTAREA_CLASS =
  "flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30";

export const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export const CHECKBOX_CLASS = "size-4 accent-[var(--primary)]";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ id, label, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Jede Stufe bekommt eine eigene Farbe, damit die Add-on-Karten auf einen Blick sortierbar bleiben. */
const TIER_BADGE: Record<ModuleTier, string> = {
  standard: "bg-sky-50 text-sky-700 ring-sky-600/20",
  complex: "bg-violet-50 text-violet-700 ring-violet-600/20",
  ai: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

export function TierBadge({ tier }: { tier: ModuleTier }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TIER_BADGE[tier],
      )}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}

/** Archiviert, Vorauswahl und Ähnliches – neutral gehalten, damit die Stufenfarbe führt. */
export function NeutralBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
      {children}
    </span>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-600/20"
      >
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
        {state.success}
      </p>
    );
  }

  return null;
}

/**
 * Reihenfolge eines Eintrags ändern.
 *
 * Zwei Formulare statt eines Ziehgriffs: die Seite ist eine Server-Komponente,
 * und ein Tausch mit dem Nachbarn braucht kein Client-JavaScript.
 */
export function MoveButtons({
  kind,
  id,
  isFirst,
  isLast,
  label,
}: {
  kind: "package" | "capacity" | "module" | "integration";
  id: string;
  isFirst: boolean;
  isLast: boolean;
  label: string;
}) {
  // Ein einzelner Eintrag lässt sich nirgendwohin verschieben.
  if (isFirst && isLast) return null;

  const button =
    "flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <span className="flex items-center gap-1">
      <form action={movePricingEntryAction}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button type="submit" className={button} disabled={isFirst} aria-label={`${label} nach oben`}>
          <ChevronUp className="size-4" aria-hidden />
        </button>
      </form>
      <form action={movePricingEntryAction}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button type="submit" className={button} disabled={isLast} aria-label={`${label} nach unten`}>
          <ChevronDown className="size-4" aria-hidden />
        </button>
      </form>
    </span>
  );
}
