import { MongoClient, type Db } from "mongodb";

/**
 * Verbindung zum Gleistrix-MongoDB.
 *
 * Die URI wird aus Einzelteilen zusammengesetzt, statt sie als fertigen String
 * zu verlangen: Passwörter enthalten regelmäßig Zeichen, die in einer URI
 * kodiert werden müssen (@, :, /, ?). Wer die URI trotzdem selbst stellen will,
 * setzt MONGODB_URI – dann gilt ausschließlich dieser Wert.
 *
 * Eine Datenbank je Mandant, alle auf demselben Server: diese hier ist die
 * Control-Plane (Adminbereich und Website). Die Mandanten-Datenbanken heißen
 * gleistrix_<kennung> – siehe tenant.ts.
 */

const DEFAULT_DATABASE = "gleistrix_control";
const DEFAULT_AUTH_SOURCE = "admin";

/** Verbindungsaufbau soll schnell scheitern, statt eine Server Action hängen zu lassen. */
const SERVER_SELECTION_TIMEOUT_MS = 8000;

export type MongoConfigIssue = "no-host" | "no-credentials" | null;

function host(): string | null {
  return process.env.MONGODB_HOST?.trim() || null;
}

function credentials(): { username: string; password: string } | null {
  const username = process.env.MONGODB_USERNAME?.trim();
  const password = process.env.MONGODB_PASSWORD;
  return username && password ? { username, password } : null;
}

/** Was für die Datenbankanbindung noch fehlt – für die Anzeige im Adminbereich. */
export function mongoConfigIssue(): MongoConfigIssue {
  if (process.env.MONGODB_URI?.trim()) return null;
  if (!host()) return "no-host";
  if (!credentials()) return "no-credentials";
  return null;
}

export const MONGO_ISSUE_TEXT: Record<"no-host" | "no-credentials", string> = {
  "no-host": "MONGODB_HOST fehlt – ohne Adresse gibt es keine Datenbankverbindung.",
  "no-credentials": "MONGODB_USERNAME oder MONGODB_PASSWORD fehlt.",
};

export function databaseName(): string {
  return process.env.MONGODB_DATABASE?.trim() || DEFAULT_DATABASE;
}

/** Ob überhaupt eine Datenbank konfiguriert ist – sonst greift der Dateispeicher. */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim()) || Boolean(host() && credentials());
}

/**
 * Baut die Verbindungs-URI. Das Passwort wird kodiert, damit Sonderzeichen die
 * URI nicht zerlegen.
 */
export function buildMongoUri(): string | null {
  const fromEnv = process.env.MONGODB_URI?.trim();
  if (fromEnv) return fromEnv;

  const address = host();
  const account = credentials();
  if (!address || !account) return null;

  const auth = `${encodeURIComponent(account.username)}:${encodeURIComponent(account.password)}`;
  const params = new URLSearchParams({
    authSource: process.env.MONGODB_AUTH_SOURCE?.trim() || DEFAULT_AUTH_SOURCE,
    // Ein einzelner Server hinter einem Proxy: ohne directConnection würde der
    // Treiber die Replica-Set-Topologie suchen und daran scheitern.
    directConnection: "true",
    serverSelectionTimeoutMS: String(SERVER_SELECTION_TIMEOUT_MS),
  });
  if (process.env.MONGODB_TLS === "true") params.set("tls", "true");

  return `mongodb://${auth}@${address}/${databaseName()}?${params.toString()}`;
}

/**
 * Ein Client je Prozess.
 *
 * Der Treiber hält intern einen Verbindungspool; ein zweiter Client je Request
 * würde bei jedem Aufruf neu verhandeln. In der Entwicklung überlebt er den
 * Hot-Reload über globalThis.
 */
const globalForMongo = globalThis as unknown as { gleistrixMongo?: Promise<MongoClient> };

function client(): Promise<MongoClient> {
  const uri = buildMongoUri();
  if (!uri) throw new Error("MongoDB ist nicht konfiguriert (MONGODB_HOST/USERNAME/PASSWORD).");

  globalForMongo.gleistrixMongo ??= new MongoClient(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  }).connect();

  return globalForMongo.gleistrixMongo;
}

export async function getDb(): Promise<Db> {
  return (await client()).db(databaseName());
}

/** Verbindung prüfen – für Diagnose und den Statusblock im Adminbereich. */
export async function pingMongo(): Promise<
  { ok: true; database: string } | { ok: false; error: string }
> {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return { ok: true, database: db.databaseName };
  } catch (error) {
    // Nur die erste Zeile weitergeben: Treibermeldungen können die URI enthalten.
    const message = error instanceof Error ? error.message.split("\n")[0] : "Unbekannter Fehler";
    return { ok: false, error: message };
  }
}
