import { Client } from "minio";

import type { Tenant } from "@/types/admin";

import { teardownGuard } from "./guard";

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

/**
 * Ein hängender Speicher darf die Server Action nicht blockieren.
 *
 * Dreimal dieser Wert ist zugleich die Reserve, die sich die Leerschleife beim
 * Abbau zurücklegt (Objektliste + Löschung + abschließendes removeBucket) – er
 * muss also deutlich unter TEARDOWN_BUDGET_MS in app/admin/actions.ts bleiben.
 */
const REQUEST_TIMEOUT_MS = 10_000;

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

/* ------------------------------------------------------------------- Abbau */

/**
 * Wieviel eine Seite der Objektliste umfasst. Genau eine Seite geht je Aufruf
 * an removeObjects: der Treiber teilt größere Listen selbst in Stapel und
 * feuert sie dann alle gleichzeitig ab.
 */
const PAGE_SIZE = 1000;

/**
 * Bereitet eine Seite der Objektliste für removeObjects auf.
 *
 * Ausgelagert und exportiert, weil hier der Fehler säße, den TypeScript nicht
 * finden kann: `listObjectsQuery` liefert zur Laufzeit `versionId` mit, der Typ
 * `ObjectInfo` kennt das Feld aber nicht. Fällt die versionId weg, schreibt
 * MinIO in einem versionierten Bucket nur einen weiteren Delete-Marker – der
 * Bucket wird nie leer und die Schleife läuft bis ans Zeitlimit.
 *
 * Delete-Marker stehen mit eigener versionId in derselben Liste und müssen mit
 * weg. Verzeichnis-Präfixe kommen ohne `name` und fliegen raus.
 */
export function entriesFor(objects: unknown[]): { name: string; versionId?: string }[] {
  return objects.flatMap((eintrag) => {
    const objekt = eintrag as { name?: unknown; versionId?: unknown } | null;
    const name = typeof objekt?.name === "string" ? objekt.name : null;
    if (!name) return [];
    return [
      typeof objekt?.versionId === "string" ? { name, versionId: objekt.versionId } : { name },
    ];
  });
}

/**
 * Löscht den Bucket des Mandanten samt Inhalt.
 *
 * `removeBucket` verlangt einen leeren Bucket, und „leer" heißt bei aktiver
 * Versionierung: keine aktuellen Objekte, keine alten Versionen, keine
 * Delete-Marker. Deshalb erst die Leerschleife, dann der Bucket.
 *
 * Idempotent: ein bereits entfernter Bucket ist der gewünschte Zustand.
 *
 * `deadline` ist ein Zeitstempel, kein Zeitraum – der Aufrufer teilt sich das
 * Budget der Server Action zwischen mehreren Schritten auf. Reicht es nicht,
 * bricht der Abbau sichtbar ab statt in ein Timeout zu laufen; wiederholen ist
 * gefahrlos und macht dort weiter, wo es aufgehört hat.
 */
export async function removeTenantBucket(
  slug: string,
  tenant: Tenant,
  deadline: number,
): Promise<MinioProvisionResult> {
  const verstoss = teardownGuard(slug, tenant);
  if (verstoss) return { ok: false, error: verstoss };

  const issue = minioIssue();
  if (issue) return { ok: false, error: MINIO_ISSUE_TEXT[issue] };

  const bucket = tenant.minioBucket;

  try {
    const minio = client();

    if (!(await withTimeout(minio.bucketExists(bucket), "Bucket-Prüfung"))) {
      return { ok: true, note: `Bucket ${bucket} war bereits entfernt – nichts geändert.` };
    }

    let keyMarker: string | undefined;
    let versionIdMarker: string | undefined;
    let geloescht = 0;
    let seite;

    do {
      // Vorausschauend, nicht rückblickend: Ein Durchlauf kostet im
      // schlechtesten Fall Objektliste + Löschung, danach kommt noch
      // removeBucket. Prüfte die Schleife nur „Frist schon vorbei", startete
      // sie einen Durchlauf, der die Server Action überzieht – und dann sieht
      // niemand mehr, wie weit sie gekommen ist.
      if (Date.now() + 3 * REQUEST_TIMEOUT_MS > deadline) {
        return {
          ok: false,
          error: `Bucket ${bucket} ist nach ${geloescht} gelöschten Objekten noch nicht leer. Den Abbau bitte erneut ausführen – er setzt dort fort.`,
        };
      }

      // Delimiter leer erzwingt eine flache Liste; ohne IncludeVersion blieben
      // alte Versionen und Delete-Marker unsichtbar. Das Optionsobjekt ist
      // Pflicht, der Treiber zerlegt es ungeprüft.
      seite = await withTimeout(
        minio.listObjectsQuery(bucket, "", "", {
          Delimiter: "",
          MaxKeys: PAGE_SIZE,
          IncludeVersion: true,
          keyMarker,
          versionIdMarker,
        }),
        "Objektliste",
      );

      const eintraege = entriesFor(seite.objects);
      if (eintraege.length > 0) {
        // removeObjects wirft bei Teilfehlern nicht, sondern liefert sie zurück.
        const fehler = await withTimeout(minio.removeObjects(bucket, eintraege), "Objekte löschen");
        if (fehler.length > 0) {
          return {
            ok: false,
            error: `${fehler.length} Objekte in ${bucket} ließen sich nicht löschen – der Bucket bleibt bestehen.`,
          };
        }
        geloescht += eintraege.length;
      }

      keyMarker = seite.keyMarker;
      versionIdMarker = seite.versionIdMarker;
    } while (seite.isTruncated);

    // ponytail: unvollständige Multipart-Uploads werden nicht aufgeräumt.
    // Meldet MinIO hier BucketNotEmpty, obwohl die Schleife durch ist, sind sie
    // die Ursache – dann listIncompleteUploads + removeIncompleteUpload ergänzen.
    await withTimeout(minio.removeBucket(bucket), "Bucket löschen");

    return {
      ok: true,
      note:
        geloescht > 0
          ? `Bucket ${bucket} mit ${geloescht} Objektversionen gelöscht.`
          : `Bucket ${bucket} war leer und wurde gelöscht.`,
    };
  } catch (error) {
    return { ok: false, error: `Bucket ${bucket} konnte nicht gelöscht werden: ${reason(error)}` };
  }
}
