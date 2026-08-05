import { randomBytes } from "node:crypto";
import { MongoClient } from "mongodb";
import type { Tenant } from "@/types/admin";

/**
 * Provisionierung der Mandanten-Datenbank (Schritte `mongo-database` und
 * `mongo-role` aus lib/admin/tenant.ts).
 *
 * Eigener Client aus MONGODB_ADMIN_URI statt des Clients aus lib/admin/mongo.ts:
 * der hängt an den Anwendungs-Zugangsdaten und darf gar keine Benutzer anlegen.
 * Der Admin-Client wird je Aufruf geöffnet und wieder geschlossen – er läuft
 * mit root-Rechten und soll nicht als Pool im Prozess stehen bleiben.
 *
 * Nur serverseitig verwenden: MONGODB_ADMIN_URI darf nie in einen Client-Bundle
 * geraten. Also niemals aus einer "use client"-Datei importieren.
 */

/** Verbindungsaufbau soll schnell scheitern, statt eine Server Action hängen zu lassen. */
const SERVER_SELECTION_TIMEOUT_MS = 8000;

/** Marker-Collection: eine MongoDB-Datenbank entsteht erst mit dem ersten Dokument. */
const MARKER_COLLECTION = "_provisioning";
const MARKER_ID = "created";

/** 64 Zeichen, alle URI-sicher – nichts davon muss kodiert werden. */
const PASSWORD_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const PASSWORD_LENGTH = 32;

/** MongoDB-Fehlercode für „Benutzer existiert bereits“. */
const USER_ALREADY_EXISTS = 51003;

export type Result = { ok: true; note: string } | { ok: false; error: string };

export type MongoAdminIssue = "no-admin-uri" | null;

function adminUri(): string | null {
  return process.env.MONGODB_ADMIN_URI?.trim() || null;
}

/** Was für die MongoDB-Provisionierung noch fehlt – für die Anzeige im Adminbereich. */
export function mongoAdminIssue(): MongoAdminIssue {
  return adminUri() ? null : "no-admin-uri";
}

export const MONGO_ADMIN_ISSUE_TEXT: Record<"no-admin-uri", string> = {
  "no-admin-uri":
    "MONGODB_ADMIN_URI fehlt – ohne Administrator-Zugang lassen sich weder Datenbank noch Benutzer anlegen.",
};

/**
 * Fehlertext für die Anzeige: erste Zeile, und Zugangsdaten aus etwaigen URIs
 * entfernt. Treibermeldungen zitieren gelegentlich die Verbindungszeichenfolge.
 */
function safeMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Unbekannter Fehler";
  return raw.split("\n")[0].replace(/\/\/[^@\s/]+@/g, "//***@");
}

async function withAdminClient<T>(run: (client: MongoClient) => Promise<T>): Promise<T> {
  const uri = adminUri();
  if (!uri) throw new Error(MONGO_ADMIN_ISSUE_TEXT["no-admin-uri"]);

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });
  try {
    await client.connect();
    return await run(client);
  } finally {
    await client.close();
  }
}

/**
 * Legt die Datenbank des Mandanten an.
 *
 * MongoDB kennt kein „CREATE DATABASE“: eine Datenbank existiert erst, sobald
 * das erste Dokument geschrieben ist. Deshalb setzt dieser Schritt einen Marker
 * in `_provisioning`. Die ~46 Collections der Gleistrix-App entstehen später
 * beim ersten Start der Instanz.
 *
 * Idempotent: existiert die Datenbank schon, gilt der Schritt als erledigt.
 */
export async function createTenantDatabase(tenant: Tenant): Promise<Result> {
  try {
    return await withAdminClient(async (client) => {
      const existing = await client.db("admin").command({
        listDatabases: 1,
        nameOnly: true,
        filter: { name: tenant.mongoDatabase },
      });
      if (Array.isArray(existing.databases) && existing.databases.length > 0) {
        return { ok: true, note: `Datenbank ${tenant.mongoDatabase} war bereits vorhanden.` };
      }

      await client
        .db(tenant.mongoDatabase)
        .collection<{ _id: string; createdAt: string }>(MARKER_COLLECTION)
        .updateOne(
          { _id: MARKER_ID },
          { $setOnInsert: { createdAt: new Date().toISOString() } },
          { upsert: true },
        );

      return { ok: true, note: `Datenbank ${tenant.mongoDatabase} angelegt.` };
    });
  } catch (error) {
    return { ok: false, error: safeMessage(error) };
  }
}

/**
 * Legt den Mandantenbenutzer an – angelegt IN der Mandanten-Datenbank, mit
 * readWrite ausschließlich auf ebendiese. Damit sieht der Benutzer keine andere
 * Mandanten-Datenbank.
 *
 * Idempotent, und ein bestehender Benutzer wird NIE überschrieben: sonst würde
 * ein laufender Mandant mit dem alten Passwort ausgesperrt. Existiert er schon,
 * gilt der Schritt als erledigt und das übergebene Passwort bleibt ungenutzt.
 */
/**
 * Ergebnis der Benutzeranlage.
 *
 * `created` unterscheidet „neu angelegt" von „war schon da". Das ist keine
 * Kosmetik: nur bei einem NEU angelegten Benutzer ist das übergebene Passwort
 * auch das gültige. Wer die Verbindungsdaten weiterreicht (Vercel-Umgebung),
 * darf das ausschließlich dann tun – sonst schreibt er ein Passwort weiter,
 * das am Benutzer nie gesetzt wurde, und sperrt den Mandanten aus.
 */
export type UserResult =
  | { ok: true; note: string; created: boolean }
  | { ok: false; error: string };

export async function createTenantUser(tenant: Tenant, password: string): Promise<UserResult> {
  if (!password) {
    return { ok: false, error: "Kein Passwort übergeben – der Benutzer wurde nicht angelegt." };
  }

  const existing = {
    ok: true as const,
    created: false,
    note: `Benutzer ${tenant.mongoUser} war bereits vorhanden – Passwort unverändert.`,
  };

  try {
    return await withAdminClient(async (client) => {
      const db = client.db(tenant.mongoDatabase);

      const info = await db.command({ usersInfo: tenant.mongoUser });
      if (Array.isArray(info.users) && info.users.length > 0) return existing;

      try {
        await db.command({
          createUser: tenant.mongoUser,
          pwd: password,
          roles: [{ role: "readWrite", db: tenant.mongoDatabase }],
        });
      } catch (error) {
        // Zwischen usersInfo und createUser kann ein zweiter Lauf zuvorgekommen
        // sein. Auch dann steht der Benutzer – kein Fehler, aber auch kein
        // zweiter Versuch mit neuem Passwort.
        if (!isUserAlreadyExists(error)) throw error;
        return existing;
      }

      return {
        ok: true,
        created: true,
        note: `Benutzer ${tenant.mongoUser} mit readWrite auf ${tenant.mongoDatabase} angelegt.`,
      };
    });
  } catch (error) {
    return { ok: false, error: safeMessage(error) };
  }
}

function isUserAlreadyExists(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  if (code === USER_ALREADY_EXISTS) return true;
  return error instanceof Error && /already exists/i.test(error.message);
}

/**
 * Passwort für einen Mandantenbenutzer: 32 Zeichen aus einem 64er-Alphabet,
 * also 192 Bit. 64 Zeichen sind exakt 6 Bit – kein Modulo-Bias.
 *
 * Wird nur einmal beim Anlegen erzeugt und gehört danach in die Umgebung der
 * Mandanteninstanz. Nicht protokollieren.
 */
export function generateTenantPassword(): string {
  return Array.from(randomBytes(PASSWORD_LENGTH), (byte) => PASSWORD_ALPHABET[byte & 63]).join("");
}

/**
 * Verbindungszeichenfolge FÜR DEN MANDANTEN – das, was als MONGODB_URI in sein
 * Deployment geht.
 *
 * Host und Verbindungsparameter kommen aus MONGODB_ADMIN_URI (dieselbe
 * Instanz), Zugangsdaten und authSource werden ersetzt: der Mandantenbenutzer
 * liegt in seiner eigenen Datenbank, nicht in admin.
 */
export function tenantMongoUri(tenant: Tenant, password: string): string {
  const admin = adminUri();
  if (!admin) throw new Error(MONGO_ADMIN_ISSUE_TEXT["no-admin-uri"]);

  // Schema, optionale Zugangsdaten, Hosts, optionaler Pfad, optionale Parameter.
  const parts = /^(mongodb(?:\+srv)?:\/\/)(?:[^@/]*@)?([^/?]+)(?:\/[^?]*)?(?:\?(.*))?$/.exec(admin);
  if (!parts) throw new Error("MONGODB_ADMIN_URI hat kein erkennbares Format.");

  const [, scheme, hosts, query] = parts;
  const params = new URLSearchParams(query ?? "");
  params.set("authSource", tenant.mongoDatabase);

  const auth = `${encodeURIComponent(tenant.mongoUser)}:${encodeURIComponent(password)}`;
  return `${scheme}${auth}@${hosts}/${tenant.mongoDatabase}?${params.toString()}`;
}
