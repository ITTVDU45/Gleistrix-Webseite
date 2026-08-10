"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

import { useConsent } from "@/components/consent/consent-provider";
import {
  CONSENT_CATEGORY_INFO,
  createSelection,
  type OptionalConsentCategory,
} from "@/lib/consent/config";

type ConsentGateProps = {
  category: OptionalConsentCategory;
  /** Name des eingebetteten Dienstes, z. B. „Cal.com Terminbuchung“. */
  service: string;
  /** Verantwortlicher Anbieter inklusive Sitz. */
  provider: string;
  children: React.ReactNode;
};

/**
 * Lädt eingebettete Drittinhalte erst nach einer Einwilligung.
 *
 * Ohne Einwilligung wird kein Request an den Anbieter ausgelöst — die
 * Kind-Komponenten werden gar nicht erst gerendert (§ 25 Abs. 1 TDDDG). Das
 * ist der Unterschied zu einem Overlay, das den Inhalt nur verdeckt: dort
 * hätte der Anbieter die IP-Adresse längst bekommen.
 */
export function ConsentGate({
  category,
  service,
  provider,
  children,
}: ConsentGateProps) {
  const { isReady, hasConsent, saveSelection, state } = useConsent();
  const [isAllowedOnce, setIsAllowedOnce] = useState(false);

  // Vor dem Lesen des Cookies nichts laden — sonst startet der Drittanbieter
  // schon, bevor die Einwilligung bekannt ist.
  if (!isReady) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-[#f8fafc]">
        <span className="sr-only">Inhalt wird vorbereitet</span>
      </div>
    );
  }

  if (isAllowedOnce || hasConsent(category)) {
    return <>{children}</>;
  }

  const categoryLabel =
    CONSENT_CATEGORY_INFO.find((entry) => entry.id === category)?.label ??
    category;

  function allowCategoryPermanently() {
    // Bestehende Auswahl beibehalten und nur diese Kategorie ergänzen.
    saveSelection({
      ...(state?.categories ?? createSelection(false)),
      [category]: true,
    });
  }

  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-slate-900/8 bg-[#f8fafc] px-6 py-12">
      <div className="max-w-md text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft-sm">
          <Lock className="size-5" aria-hidden />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          {service} ist noch nicht geladen
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Dieser Inhalt wird von {provider} bereitgestellt. Beim Laden werden
          technische Daten wie Ihre IP-Adresse an den Anbieter übertragen und
          Informationen auf Ihrem Gerät gespeichert. Das passiert nur, wenn Sie
          zustimmen.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => setIsAllowedOnce(true)}
            className="h-11 rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2"
          >
            Einmalig laden
          </button>
          <button
            type="button"
            onClick={allowCategoryPermanently}
            className="h-11 rounded-full border border-slate-900/10 bg-white px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2"
          >
            Immer erlauben
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Kategorie {categoryLabel} ·{" "}
          <Link
            href="/datenschutz"
            className="underline underline-offset-2 transition-colors hover:text-indigo-600"
          >
            Datenschutz
          </Link>
        </p>
      </div>
    </div>
  );
}
