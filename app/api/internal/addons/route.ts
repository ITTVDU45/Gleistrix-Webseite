import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { notifyPurchaseReleased } from "@/lib/admin/notify";
import { getPublishedPricing } from "@/lib/admin/pricing";
import { addonPurchaseFor } from "@/lib/admin/purchase";
import { addPurchase, getPurchase, readStore } from "@/lib/admin/store";

/**
 * Gegenrichtung zur Mandantenmeldung: Die App meldet, dass ein Nutzer ein
 * Add-on freigeschaltet hat.
 *
 * Der bisherige Fluss ging nur Website → App. Hier kommt zum ersten Mal etwas
 * zurück, und es ist geldrelevant: Jede Freischaltung kostet den Mandanten
 * monatlich zusätzlich. Deshalb entsteht der Preis auch hier SERVERSEITIG aus
 * der freigegebenen Preisliste – ein Betrag im Rumpf wird nicht gelesen. Die
 * App kennt keine Preise und soll auch keine bestimmen.
 *
 * Das Add-on läuft in der App bereits, wenn diese Meldung eintrifft. Die
 * Website gibt es also nicht frei, sie hält es fest.
 *
 *     POST /api/internal/addons
 *     Authorization: Bearer {SERVICE_SHARED_SECRET}
 *     Idempotency-Key: {Vorgangskennung der App}
 *
 *     { "kennung": "muster-bau",
 *       "module": ["lagerverwaltung"],
 *       "mengen": { "lagerverwaltung": 2000 } }
 *
 * Antwort 201 mit `{ kaufId, monatlich }`, bei Wiederholung mit demselben
 * Schlüssel 200 und derselbe Rumpf.
 */

/** Wie überall: 32 Zeichen = 128 Bit. */
const MIN_SECRET_LENGTH = 32;

/** Grenze gegen aufgeblähte Meldungen; großzügig für jeden echten Katalog. */
const MAX_MODULES = 50;

function secret(): string | null {
  const value = process.env.SERVICE_SHARED_SECRET;
  return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

/**
 * Vergleich in konstanter Zeit. Ein `===` verriete über die Antwortzeit, wie
 * viele Zeichen am Anfang bereits stimmen.
 */
function tokenIsValid(header: string | null, expected: string): boolean {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Aus dem Idempotency-Key wird die Kauf-ID – derselbe Schlüssel, derselbe Kauf. */
function purchaseIdFor(key: string): string {
  return `pur_zub_${key.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64)}`;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const expected = secret();
  if (!expected) {
    console.error("Add-on-Meldung abgelehnt: SERVICE_SHARED_SECRET fehlt oder ist zu kurz.");
    return NextResponse.json({ error: "Schnittstelle nicht konfiguriert." }, { status: 503 });
  }
  if (!tokenIsValid(request.headers.get("authorization"), expected)) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const idempotencyKey = text(request.headers.get("idempotency-key"));
  if (!idempotencyKey) {
    return NextResponse.json(
      {
        error:
          "Kopfzeile Idempotency-Key fehlt – ohne sie wäre eine Wiederholung ein zweiter Kauf.",
      },
      { status: 400 },
    );
  }

  let body: { kennung?: unknown; module?: unknown; mengen?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Rumpf ist kein gültiges JSON." }, { status: 400 });
  }

  const kennung = text(body.kennung);
  if (!kennung) return NextResponse.json({ error: "kennung fehlt." }, { status: 400 });

  const moduleIds = Array.isArray(body.module)
    ? body.module.filter((id): id is string => typeof id === "string").slice(0, MAX_MODULES)
    : [];
  if (moduleIds.length === 0) {
    return NextResponse.json({ error: "module ist leer." }, { status: 400 });
  }

  // Wiederholung: Derselbe Schlüssel liefert denselben Kauf, ohne einen zweiten
  // anzulegen. Genau dafür ist der Kopf da.
  const purchaseId = purchaseIdFor(idempotencyKey);
  const existing = await getPurchase(purchaseId);
  if (existing) {
    return NextResponse.json(
      { kaufId: existing.id, monatlich: existing.monthlyTotal },
      { status: 200 },
    );
  }

  const { companies } = await readStore();
  const company = companies.find((entry) => entry.slug === kennung);
  if (!company) {
    return NextResponse.json({ error: `Unbekannter Mandant: ${kennung}.` }, { status: 404 });
  }

  const pricing = await getPublishedPricing();
  const active = new Set(
    pricing.modules.filter((module) => module.isActive).map((module) => module.id),
  );
  const unbekannt = moduleIds.filter((id) => !active.has(id));
  if (unbekannt.length > 0) {
    // Kein stilles Verwerfen: Die App hätte dem Nutzer sonst etwas
    // freigeschaltet, wofür ihm niemand eine Rechnung stellt.
    return NextResponse.json(
      { error: `Nicht freigegebene Module: ${unbekannt.join(", ")}.` },
      { status: 422 },
    );
  }

  const mengen =
    body.mengen && typeof body.mengen === "object" && !Array.isArray(body.mengen)
      ? Object.fromEntries(
          Object.entries(body.mengen as Record<string, unknown>).map(([id, value]) => [
            id,
            Math.max(0, Math.floor(Number(value) || 0)),
          ]),
        )
      : {};

  const purchase = addonPurchaseFor({
    id: purchaseId,
    companyId: company.id,
    moduleIds,
    usageAmounts: mengen,
    config: pricing,
    createdAt: new Date().toISOString(),
  });

  await addPurchase(purchase);

  // Kaufbestätigung an den Ansprechpartner, sofern eine aktive Vorlage am
  // Auslöser „Kauf freigegeben" hängt. Doppelt kann sie nicht kommen: eine
  // Wiederholung mit demselben Idempotency-Key ist oben schon abgebogen.
  //
  // Der Versand darf die Antwort NICHT scheitern lassen. Das Add-on läuft in
  // der App bereits; ein Fehler hier ließe sie den Kauf für ungemeldet halten
  // und erneut schicken – dann stünde er doppelt in der Abrechnung.
  const bestaetigung = await notifyPurchaseReleased(company, purchase, pricing);
  if (!bestaetigung.sent) {
    console.warn(`Kaufbestätigung für ${purchase.id}: ${bestaetigung.note}`);
  }

  return NextResponse.json(
    { kaufId: purchase.id, monatlich: purchase.monthlyTotal },
    { status: 201 },
  );
}
