"use client";

import { cn } from "@/lib/utils";

type ConsentToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Notwendige Kategorie: dauerhaft aktiv und nicht abwählbar. */
  locked?: boolean;
  label: string;
  describedBy?: string;
};

/**
 * Schalter für eine Consent-Kategorie.
 *
 * `role="switch"` statt einer Checkbox-Grafik: Screenreader kündigen damit den
 * Zustand an, ohne dass die Beschriftung ihn zusätzlich beschreiben muss.
 */
export function ConsentToggle({
  checked,
  onChange,
  locked = false,
  label,
  describedBy,
}: ConsentToggleProps) {
  if (locked) {
    return (
      <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
        Immer aktiv
      </span>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2",
        checked
          ? "border-indigo-600 bg-indigo-600"
          : "border-slate-900/12 bg-slate-200 hover:bg-slate-300",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all duration-300",
          checked ? "left-[calc(100%-1.25rem)]" : "left-1",
        )}
      />
    </button>
  );
}
