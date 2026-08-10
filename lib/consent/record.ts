/**
 * Serverseitiger Einwilligungsnachweis (Art. 7 Abs. 1 DSGVO, Rechenschafts-
 * pflicht nach Art. 5 Abs. 2 DSGVO).
 *
 * Gespeichert wird nur, was für den Nachweis nötig ist. Die IP-Adresse landet
 * niemals im Klartext, sondern ausschließlich als gesalzener Hash — und nur
 * dann, wenn ein Salt konfiguriert ist (Datenminimierung, Art. 5 Abs. 1 lit. c
 * DSGVO). Ohne Salt fehlt das Feld ganz; der Nachweis bleibt trotzdem gültig,
 * weil Zeitpunkt, Version und Auswahl die tragenden Angaben sind.
 *
 * Dieses Modul darf nur aus Route Handlers oder Server Functions importiert
 * werden, niemals aus Client Components.
 */

import { createHash } from "node:crypto";

import { isMongoConfigured } from "@/lib/admin/mongo";

import type { ConsentState } from "./state";

export type ConsentProofRecord = {
  /** Zugleich fachliche id für die Collection – identisch mit consentId. */
  id: string;
  consentId: string;
  version: number;
  /** Zeitpunkt der Entscheidung im Browser. */
  timestamp: string;
  /** Zeitpunkt des Eingangs auf dem Server — unabhängig von der Client-Uhr. */
  recordedAt: string;
  method: ConsentState["method"];
  categories: ConsentState["categories"];
  /** SHA-256 über Salt + IP; `null`, wenn kein Salt konfiguriert ist. */
  ipHash: string | null;
  userAgent: string | null;
  /** Seite, auf der die Entscheidung getroffen wurde. */
  page: string | null;
};

function firstForwardedIp(header: string | null): string | null {
  if (!header) return null;

  const trimmed = header.split(",")[0]?.trim();
  return trimmed ? trimmed : null;
}

function hashIp(ip: string | null): string | null {
  const salt = process.env.CONSENT_IP_SALT;

  if (!ip || !salt) return null;

  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function truncate(value: string | null, maxLength: number): string | null {
  if (!value) return null;

  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

export function buildConsentProofRecord(
  state: ConsentState,
  request: Request,
  page: string | null,
): ConsentProofRecord {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return {
    id: state.id,
    consentId: state.id,
    version: state.version,
    timestamp: state.timestamp,
    recordedAt: new Date().toISOString(),
    method: state.method,
    categories: state.categories,
    ipHash: hashIp(firstForwardedIp(forwardedFor) ?? realIp),
    userAgent: truncate(request.headers.get("user-agent"), 256),
    page: truncate(page, 512),
  };
}

/**
 * Legt den Nachweis ab.
 *
 * Mit Datenbank: eigene Collection, ein Dokument je Entscheidung.
 *
 * Ohne Datenbank bewusst NICHT der Dateispeicher aus lib/admin/db/file-store.ts:
 * der hält den gesamten Adminstand in einem JSON-Dokument und schreibt ihn bei
 * jeder Änderung komplett neu. Bei Besucherverkehr wäre das ein wachsendes
 * Dokument mit konkurrierenden Schreibern – der falsche Ort für einen Log.
 * Stattdessen eine strukturierte Logzeile, die sich über einen Log-Drain
 * revisionssicher archivieren lässt.
 */
export async function persistConsentProof(
  record: ConsentProofRecord,
): Promise<void> {
  if (!isMongoConfigured()) {
    console.info(`[consent] ${JSON.stringify(record)}`);
    return;
  }

  const { saveConsentProof } = await import("@/lib/admin/db/consentProofs");
  await saveConsentProof(record);
}
