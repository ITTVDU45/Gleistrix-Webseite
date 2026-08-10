"use client";

import { useConsent } from "@/components/consent/consent-provider";
import { cn } from "@/lib/utils";

/**
 * Dauerhafter Zugang zu den Datenschutz-Einstellungen im Footer.
 *
 * Art. 7 Abs. 3 DSGVO verlangt, dass der Widerruf so einfach möglich ist wie
 * die Erteilung der Einwilligung — dafür muss dieser Einstieg auf jeder Seite
 * erreichbar bleiben, nicht nur beim ersten Besuch.
 */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const { openSettings } = useConsent();

  return (
    <button
      type="button"
      onClick={openSettings}
      className={cn("text-left", className)}
    >
      Cookie-Einstellungen
    </button>
  );
}
