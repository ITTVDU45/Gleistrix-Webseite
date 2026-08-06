import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { monatsende } from "@/lib/admin/purchase";
import { getPurchase, readStore, updatePurchase } from "@/lib/admin/store";

/**
 * Die App meldet, dass ein Nutzer ein Add-on abbestellt hat.
 *
 * WIRKUNG ZUM MONATSENDE, keine anteilige Erstattung: Bis dahin ist bezahlt,
 * also bleibt das Modul nutzbar und der Betrag zählt mit. Die Regel selbst
 * steht in `monatsende()` – hier wird sie nur angewandt.
 *
 * Der Kauf wird NICHT gelöscht. Er ist der Beleg dafür, was wann galt; gelöscht
 * ließe sich später nicht mehr nachvollziehen, wofür ein Kunde bezahlt hat.
 *
 *     POST /api/internal/addons/abbestellung
 *     Authorization: Bearer {SERVICE_SHARED_SECRET}
 *
 *     { "kennung": "muster-bau", "kaufId": "pur_zub_..." }
 *
 * Antwort `200` mit `{ kaufId, endetAm }` – auch bei Wiederholung, dann mit
 * demselben Datum. Ein zweiter Aufruf verlängert oder verkürzt nichts.
 */

const MIN_SECRET_LENGTH = 32;

function secret(): string | null {
  const value = process.env.SERVICE_SHARED_SECRET;
  return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

function tokenIsValid(header: string | null, expected: string): boolean {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const expected = secret();
  if (!expected) {
    console.error("Abbestellung abgelehnt: SERVICE_SHARED_SECRET fehlt oder ist zu kurz.");
    return NextResponse.json({ error: "Schnittstelle nicht konfiguriert." }, { status: 503 });
  }
  if (!tokenIsValid(request.headers.get("authorization"), expected)) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  let body: { kennung?: unknown; kaufId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Rumpf ist kein gültiges JSON." }, { status: 400 });
  }

  const kennung = text(body.kennung);
  const kaufId = text(body.kaufId);
  if (!kennung || !kaufId) {
    return NextResponse.json({ error: "kennung oder kaufId fehlt." }, { status: 400 });
  }

  const purchase = await getPurchase(kaufId);
  if (!purchase) {
    return NextResponse.json({ error: `Unbekannter Kauf: ${kaufId}.` }, { status: 404 });
  }
  if (purchase.kind !== "zubuchung") {
    // Der Grundkauf ist der Vertrag selbst – den beendet niemand über diese
    // Schnittstelle, dafür gibt es die Sperre im Adminbereich.
    return NextResponse.json(
      { error: "Nur Zubuchungen lassen sich hierüber abbestellen." },
      { status: 422 },
    );
  }

  // Die Kennung muss zum Kauf passen. Sonst könnte ein Mandant die Zubuchung
  // eines anderen beenden, wenn er dessen Kauf-ID errät.
  const { companies } = await readStore();
  const company = companies.find((entry) => entry.id === purchase.companyId);
  if (!company || company.slug !== kennung) {
    return NextResponse.json(
      { error: "Der Kauf gehört nicht zu diesem Mandanten." },
      { status: 404 },
    );
  }

  // Wiederholung ändert nichts: Das erste Ende gilt. Ohne diese Sperre schöbe
  // ein zweiter Aufruf im Folgemonat die Laufzeit immer weiter nach hinten.
  if (purchase.endetAm) {
    return NextResponse.json({ kaufId: purchase.id, endetAm: purchase.endetAm }, { status: 200 });
  }

  const endetAm = monatsende(new Date().toISOString());
  await updatePurchase(purchase.id, (current) => ({ ...current, endetAm }));

  return NextResponse.json({ kaufId: purchase.id, endetAm }, { status: 200 });
}
