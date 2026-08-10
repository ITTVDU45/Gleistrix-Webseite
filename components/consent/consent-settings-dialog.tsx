"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";

import { useConsent } from "@/components/consent/consent-provider";
import { ConsentToggle } from "@/components/consent/consent-toggle";
import {
  CONSENT_CATEGORY_INFO,
  createSelection,
  isOptionalCategory,
  type ConsentSelection,
} from "@/lib/consent/config";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), summary, input, [tabindex]:not([tabindex="-1"])';

/**
 * Wird ausschließlich im geöffneten Zustand gemountet — dadurch startet die
 * Auswahl bei jedem Öffnen frisch aus dem gespeicherten Zustand, ohne dass ein
 * Effekt State nachziehen muss.
 */
export function ConsentSettingsDialog() {
  const { state, closeSettings, acceptAll, rejectAll, saveSelection } =
    useConsent();

  // Ohne bestehende Entscheidung starten alle optionalen Kategorien auf "aus" —
  // vorangekreuzte Kästchen sind als Einwilligung unwirksam (Art. 4 Nr. 11 DSGVO).
  const [selection, setSelection] = useState<ConsentSelection>(() =>
    state ? { ...state.categories } : createSelection(false),
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => headingRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSettings();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      // Fokus im Dialog halten: ohne diese Klammer landet die Tabulatortaste
      // hinter dem Overlay auf Elementen, die gar nicht bedienbar sind.
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [closeSettings]);

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Einstellungen schließen"
        onClick={closeSettings}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-settings-heading"
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-900/8 bg-white shadow-soft sm:rounded-3xl"
      >
        <div
          aria-hidden
          className="h-1 shrink-0 bg-gradient-to-r from-indigo-500 to-violet-500"
        />

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-900/8 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-indigo-600">
              Datenschutz-Einstellungen
            </p>
            <h2
              ref={headingRef}
              id="consent-settings-heading"
              tabIndex={-1}
              className="mt-2 text-xl font-semibold leading-tight text-slate-900 outline-none"
            >
              Sie entscheiden, was gespeichert wird
            </h2>
          </div>
          <button
            type="button"
            onClick={closeSettings}
            aria-label="Einstellungen schließen"
            className="-mr-2 shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <p className="text-sm leading-relaxed text-slate-500">
            Technisch notwendige Speicherungen brauchen wir, damit die Website
            funktioniert. Alles andere setzen wir nur mit Ihrer Einwilligung ein.
            Sie können Ihre Auswahl jederzeit im Footer unter
            „Cookie-Einstellungen“ ändern oder widerrufen.
          </p>

          <ul className="mt-6 space-y-3">
            {CONSENT_CATEGORY_INFO.map((category) => {
              const isLocked = !isOptionalCategory(category.id);
              const summaryId = `consent-summary-${category.id}`;

              return (
                <li
                  key={category.id}
                  className="rounded-2xl border border-slate-900/8 bg-[#f8fafc] px-5 py-5 transition-colors hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-slate-900">
                      {category.label}
                    </h3>
                    <ConsentToggle
                      checked={isLocked || selection[category.id]}
                      locked={isLocked}
                      label={`Kategorie ${category.label} erlauben`}
                      describedBy={summaryId}
                      onChange={(checked) =>
                        setSelection((current) => ({
                          ...current,
                          [category.id]: checked,
                        }))
                      }
                    />
                  </div>

                  <p
                    id={summaryId}
                    className="mt-2 text-sm leading-relaxed text-slate-500"
                  >
                    {category.summary}
                  </p>

                  <details className="group mt-3">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-indigo-600">
                      <ChevronDown
                        className="size-3.5 transition-transform duration-300 group-open:rotate-180"
                        aria-hidden
                      />
                      {category.services.length} Dienste anzeigen
                    </summary>

                    <div className="mt-3 space-y-3 border-t border-slate-900/8 pt-3">
                      {category.services.map((service) => (
                        <div key={service.name} className="text-sm">
                          <p className="font-medium text-slate-900">
                            {service.name}
                          </p>
                          <p className="mt-0.5 text-slate-500">
                            {service.purpose}
                          </p>
                          <dl className="mt-1.5 space-y-0.5 text-xs text-slate-400">
                            <div className="flex gap-1.5">
                              <dt className="shrink-0">Anbieter:</dt>
                              <dd className="text-slate-500">
                                {service.provider}
                              </dd>
                            </div>
                            <div className="flex gap-1.5">
                              <dt className="shrink-0">Speicherdauer:</dt>
                              <dd className="text-slate-500">
                                {service.duration}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      ))}
                      <p className="text-xs leading-relaxed text-slate-400">
                        Rechtsgrundlage: {category.legalBasis}
                      </p>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-xs leading-relaxed text-slate-400">
            Einzelne Dienste übermitteln Daten in die USA. Dort kann trotz
            Angemessenheitsbeschluss ein Zugriff durch Behörden nicht vollständig
            ausgeschlossen werden. Details in unserer{" "}
            <Link
              href="/datenschutz"
              className="text-slate-500 underline underline-offset-2 transition-colors hover:text-indigo-600"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>

        <footer className="shrink-0 border-t border-slate-900/8 bg-[#f8fafc] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={rejectAll}
              className="h-11 flex-1 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40 focus-visible:ring-offset-2"
            >
              Alle ablehnen
            </button>
            <button
              type="button"
              onClick={() => saveSelection(selection)}
              className="h-11 flex-1 rounded-full border border-slate-900/10 px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2"
            >
              Auswahl speichern
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="h-11 flex-1 rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2"
            >
              Alle akzeptieren
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            <Link
              href="/datenschutz"
              className="transition-colors hover:text-indigo-600"
            >
              Datenschutz
            </Link>
            <span className="px-2" aria-hidden>
              ·
            </span>
            <Link
              href="/impressum"
              className="transition-colors hover:text-indigo-600"
            >
              Impressum
            </Link>
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
