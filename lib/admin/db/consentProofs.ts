import type { ConsentProofRecord } from "@/lib/consent/record";

import { COLLECTIONS, col, toDoc } from "./collections";

/**
 * Einwilligungsnachweise (Art. 7 Abs. 1 DSGVO).
 *
 * Bewusst nicht über die Fassade in lib/admin/store.ts: die ruft `bootstrap()`
 * und damit `seedIfEmpty()`. Ein öffentlicher Besucher-Endpunkt darf keine
 * Demodaten anlegen.
 *
 * `recordedAt` wird als Date abgelegt, nicht als ISO-String. Nur so greift ein
 * TTL-Index — auf einem String tut er nichts. Die Aufbewahrungsfrist ist eine
 * Rechtsentscheidung und steht deshalb nicht im Code; sie wird einmalig auf der
 * Datenbank gesetzt, z. B. drei Jahre entsprechend der Regelverjährung:
 *
 *   db.consent_proofs.createIndex(
 *     { recordedAt: 1 },
 *     { expireAfterSeconds: 94608000, name: "recordedAt_ttl" }
 *   )
 */

/**
 * Einmalige, fehlertolerante Indexanlage.
 *
 * Schlägt sie fehl, wird der Nachweis trotzdem geschrieben — ein fehlender
 * Index macht Abfragen langsam, ein verworfener Nachweis dagegen die
 * Rechenschaftspflicht unerfüllbar.
 */
let indexReady: Promise<void> | null = null;

async function collection() {
  const consentProofs = await col(COLLECTIONS.consentProofs);

  indexReady ??= consentProofs
    .createIndex({ recordedAt: -1 })
    .then(() => undefined)
    .catch((error: unknown) => {
      indexReady = null;
      console.warn("Index auf consent_proofs konnte nicht angelegt werden", error);
    });

  await indexReady;

  return consentProofs;
}

/**
 * Legt den Nachweis ab — idempotent.
 *
 * `_id` ist die consentId. Ein wiederholt eintreffender Request (Netz-Retry,
 * `keepalive` beim Seitenwechsel) beschreibt dieselbe Entscheidung und darf
 * deshalb nicht mit einem Schlüsselkonflikt scheitern.
 */
export async function saveConsentProof(
  record: ConsentProofRecord,
): Promise<void> {
  const { _id, ...rest } = toDoc(record);

  await (await collection()).replaceOne(
    { _id },
    { ...rest, recordedAt: new Date(record.recordedAt) },
    { upsert: true },
  );
}
