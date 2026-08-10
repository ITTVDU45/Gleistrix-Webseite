"use client";

import { useConsent } from "@/components/consent/consent-provider";
import { ConsentSettingsDialog } from "@/components/consent/consent-settings-dialog";
import { CookieBanner } from "@/components/consent/cookie-banner";

/** Bündelt Banner und Einstellungs-Dialog für die Einbindung im Seitenrahmen. */
export function ConsentManager() {
  const { isSettingsOpen } = useConsent();

  return (
    <>
      <CookieBanner />
      {isSettingsOpen ? <ConsentSettingsDialog /> : null}
    </>
  );
}
