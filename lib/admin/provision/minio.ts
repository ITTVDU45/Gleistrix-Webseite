import { Client } from "minio";

import type { Tenant } from "@/types/admin";

/**
 * Provisionierungsschritt „minio-bucket“: ein eigener Bucket je Mandant.
 *
 * Bewusst OHNE Bucket-Policy. Ohne Policy gilt bei MinIO die Voreinstellung
 * „privat“ – nur wer gültige Zugangsdaten hat, kommt an die Objekte. Jede
 * Policy, die wir hier setzen könnten, wäre entweder wirkungslos oder würde
 * den Zugriff versehentlich öffnen. Die Beschränkung auf den Mandanten gehört
 * an den MinIO-Benutzer (eigener Access Key je Instanz), nicht an den Bucket.
 *
 * ponytail: anlegen und Versionierung, mehr nicht. Lifecycle-Regeln,
 * Objekt-Lock oder eigene Access Keys kommen, wenn sie gebraucht werden.
 */

/** Ein hängender Speicher darf die Server Action nicht blockieren. */
const REQUEST_TIMEOUT_MS = 15_000;

const DEFAULT_PORT = 443;
const DEFAULT_REGION = "us-east-1";

/** MINIO_ENDPOINT ist ein Hostname – ein mitkopiertes Schema würde den Client sprengen. */
function endpoint(): string | null {
  const value = process.env.MINIO_ENDPOINT?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  return value || null;
}

function credentials(): { accessKey: string; secretKey: string } | null {
  const accessKey = process.env.MINIO_ACCESS_KEY?.trim();
  const secretKey = process.env.MINIO_SECRET_KEY;
  return accessKey && secretKey ? { accessKey, secretKey } : null;
}

export type MinioConfigIssue = "no-endpoint" | "no-credentials" | null;

/** Was für die Bucket-Anlage noch fehlt – für die Anzeige im Adminbereich. */
export function minioIssue(): MinioConfigIssue {
  if (!endpoint()) return "no-endpoint";
  if (!credentials()) return "no-credentials";
  return null;
}

export const MINIO_ISSUE_TEXT: Record<"no-endpoint" | "no-credentials", string> = {
  "no-endpoint": "MINIO_ENDPOINT fehlt – ohne Adresse lässt sich kein Bucket anlegen.",
  "no-credentials": "MINIO_ACCESS_KEY oder MINIO_SECRET_KEY fehlt.",
};

function region(): string {
  return process.env.MINIO_REGION?.trim() || DEFAULT_REGION;
}

/**
 * Ein Client je Prozess – er hält intern Verbindungen offen. In der Entwicklung
 * überlebt er den Hot-Reload über globalThis (wie in lib/admin/mongo.ts).
 */
const globalForMinio = globalThis as unknown as { gleistrixMinio?: Client };

function client(): Client {
  const host = endpoint();
  const account = credentials();
  if (!host || !account) throw new Error("MinIO ist nicht konfiguriert.");

  const port = Number(process.env.MINIO_PORT);
  globalForMinio.gleistrixMinio ??= new Client({
    endPoint: host,
    port: Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT,
    useSSL: process.env.MINIO_USE_SSL !== "false",
    accessKey: account.accessKey,
    secretKey: account.secretKey,
    region: region(),
  });

  return globalForMinio.gleistrixMinio;
}

/** MinIO meldet einen Bucket, den wir selbst schon angelegt haben, mit diesem Code. */
function isOurBucket(error: unknown): boolean {
  return (error as { code?: unknown } | null)?.code === "BucketAlreadyOwnedByYou";
}

/** Nur die erste Zeile: Treibermeldungen können Adressen und Header enthalten. */
function reason(error: unknown): string {
  return error instanceof Error ? error.message.split("\n")[0] : "Unbekannter Fehler";
}

function withTimeout<T>(task: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    task,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label}: MinIO hat nicht innerhalb von ${REQUEST_TIMEOUT_MS / 1000} Sekunden geantwortet.`)),
        REQUEST_TIMEOUT_MS,
      ),
    ),
  ]);
}

export type MinioProvisionResult = { ok: true; note: string } | { ok: false; error: string };

/**
 * Legt den Bucket des Mandanten an. Idempotent: ein vorhandener Bucket ist
 * kein Fehler, sondern der gewünschte Zustand.
 */
export async function createTenantBucket(tenant: Tenant): Promise<MinioProvisionResult> {
  const issue = minioIssue();
  if (issue) return { ok: false, error: MINIO_ISSUE_TEXT[issue] };

  const bucket = tenant.minioBucket;

  try {
    const minio = client();

    if (await withTimeout(minio.bucketExists(bucket), "Bucket-Prüfung")) {
      return { ok: true, note: `Bucket ${bucket} war bereits vorhanden – nichts geändert.` };
    }

    try {
      await withTimeout(minio.makeBucket(bucket, region()), "Bucket-Anlage");
    } catch (error) {
      // Zwischen Prüfung und Anlage kann ein zweiter Lauf zuvorgekommen sein.
      // Nur der eigene Bucket zählt als erledigt – BucketAlreadyExists gehört
      // jemand anderem und muss ein Fehler bleiben.
      if (!isOurBucket(error)) throw error;
      return { ok: true, note: `Bucket ${bucket} war bereits vorhanden – nichts geändert.` };
    }

    // Versionierung ist eine Zugabe: ältere oder abgespeckte S3-Server können sie
    // nicht. Der Bucket steht trotzdem, deshalb nur eine Notiz statt eines Fehlers.
    try {
      await withTimeout(
        minio.setBucketVersioning(bucket, { Status: "Enabled" }),
        "Versionierung",
      );
      return { ok: true, note: `Bucket ${bucket} angelegt, Versionierung aktiv, kein öffentlicher Zugriff.` };
    } catch (error) {
      return {
        ok: true,
        note: `Bucket ${bucket} angelegt, kein öffentlicher Zugriff. Versionierung nicht aktiviert: ${reason(error)}`,
      };
    }
  } catch (error) {
    return { ok: false, error: `Bucket ${bucket} konnte nicht angelegt werden: ${reason(error)}` };
  }
}
