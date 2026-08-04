"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { formatPriceEUR } from "@/data/pricing";
import type { PricingConfig } from "@/types/pricing";

/**
 * Übernimmt die Konfiguration aus dem Preisrechner.
 *
 * Der Konfigurator hängt seine Auswahl an den CTA-Link, die Buchungsseite hat
 * sie bisher verworfen: der Interessent musste alles erneut erklären, und im
 * Adminbereich kam nie an, was er sich zusammengestellt hatte.
 *
 * Die Modultitel kommen aus /api/pricing – dieselbe Quelle wie die Preisseite,
 * deshalb müssen hier keine Server-Daten durchgereicht werden.
 */

type Selection = {
  packageId: string | null;
  users: number;
  capacity: number | null;
  monthly: number | null;
  moduleIds: string[];
  /** Nutzungsmengen je Modul-ID, z. B. Lagerartikel. */
  usage: Record<string, number>;
};

function readSelection(params: URLSearchParams): Selection | null {
  if (params.get("source") !== "pricing-configurator") return null;

  const number = (value: string | null) => {
    const parsed = Number(value);
    return value !== null && Number.isFinite(parsed) ? parsed : null;
  };

  const usage: Record<string, number> = {};
  for (const [key, value] of params.entries()) {
    if (!key.startsWith("usage_")) continue;
    const amount = number(value);
    if (amount !== null && amount > 0) usage[key.slice("usage_".length)] = amount;
  }

  return {
    packageId: params.get("package"),
    users: number(params.get("users")) ?? 1,
    capacity: number(params.get("capacity")),
    monthly: number(params.get("monthly")),
    moduleIds: (params.get("modules") ?? "").split(",").filter(Boolean),
    usage,
  };
}

/** Menschenlesbare Zeilen – zugleich Anzeige und Inhalt der Anfrage. */
function summaryLines(selection: Selection, config: PricingConfig | null): string[] {
  const lines: string[] = [];
  const title = (id: string) => config?.modules.find((m) => m.id === id)?.title ?? id;

  const pkg = config?.packages.find((p) => p.id === selection.packageId);
  if (pkg) lines.push(`Paket: ${pkg.name} (${formatPriceEUR(pkg.price)} pro Monat)`);

  lines.push(`Benutzer: ${selection.users}`);

  const capacity = config?.capacities.find((c) => c.projects === selection.capacity);
  if (capacity) lines.push(`Projektvolumen: ${capacity.label}`);
  else if (selection.capacity) lines.push(`Projektvolumen: bis ${selection.capacity} Projekte`);

  if (selection.moduleIds.length > 0) {
    lines.push(`Module: ${selection.moduleIds.map(title).join(", ")}`);
  }

  for (const [moduleId, amount] of Object.entries(selection.usage)) {
    lines.push(`${title(moduleId)}: ${amount.toLocaleString("de-DE")} Einheiten`);
  }

  if (selection.monthly !== null) {
    lines.push(`Monatlich gesamt: ${formatPriceEUR(selection.monthly, true)} netto`);
  }
  if (pkg) lines.push(`Einmalige Implementierung: ${formatPriceEUR(pkg.implementationPrice)}`);

  return lines;
}

export default function ConfigurationRequest() {
  const params = useSearchParams();
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const selection = readSelection(new URLSearchParams(params.toString()));
  const hasSelection = Boolean(selection);

  useEffect(() => {
    if (!hasSelection) return;

    // Titel und Preise nachladen; ohne sie zeigt die Zusammenfassung die
    // Kennungen, die Anfrage bleibt trotzdem absendbar.
    const controller = new AbortController();
    fetch("/api/pricing", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PricingConfig | null) => setConfig(data))
      .catch(() => undefined);

    return () => controller.abort();
  }, [hasSelection]);

  if (!selection) return null;

  const lines = summaryLines(selection, config);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const note = String(data.get("message") ?? "").trim();

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
          kind: "demo",
          message: [
            "Konfiguration aus dem Preisrechner:",
            ...lines.map((line) => `- ${line}`),
            ...(note ? ["", "Nachricht:", note] : []),
          ].join("\n"),
        }),
      });

      if (!response.ok) throw new Error("Die Anfrage konnte nicht gesendet werden.");
      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unbekannter Fehler.");
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="konfiguration-titel" className="page-container relative z-10 mt-10">
      <div className="grid gap-6 rounded-3xl border border-indigo-200/70 bg-indigo-50/60 p-6 md:grid-cols-2 md:p-8">
        <div>
          <h2 id="konfiguration-titel" className="text-xl font-bold tracking-tight text-slate-900">
            Deine Konfiguration
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Wir haben deine Auswahl aus dem Preisrechner übernommen. Schick sie uns zu, dann
            bereiten wir den Termin passend vor.
          </p>

          <ul className="mt-5 space-y-2">
            {lines.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" strokeWidth={2.4} />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {status === "sent" ? (
          <p className="self-center rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-soft-sm">
            Danke – deine Konfiguration ist bei uns eingegangen. Wir melden uns zeitnah. Den Termin
            kannst du unten direkt buchen.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-2xl bg-white p-5 shadow-soft-sm"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Name</span>
                <input
                  name="name"
                  required
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Unternehmen</span>
                <input
                  name="company"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">E-Mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Telefon</span>
                <input
                  name="phone"
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-slate-700">Nachricht (optional)</span>
              <textarea
                name="message"
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            {error ? (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gesendet …" : "Konfiguration senden"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
