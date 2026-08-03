/**
 * Verbindungstest gegen den Gleistrix-MongoDB.
 *
 * Aufruf im Projektverzeichnis:  node scripts/check-mongo.mjs
 *
 * Liest .env.local (ersatzweise .env), baut daraus dieselbe URI wie die
 * Anwendung und prüft die Verbindung. Es werden keine Dokumente gelesen oder
 * geschrieben und keine Zugangsdaten ausgegeben.
 */
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    let raw;
    try {
      raw = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, "");
      process.env[match[1]] ??= value;
    }
  }
}

loadEnv();

const host = process.env.MONGODB_HOST?.trim();
const username = process.env.MONGODB_USERNAME?.trim();
const password = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE?.trim() || "gleistrix_control";
const authSource = process.env.MONGODB_AUTH_SOURCE?.trim() || "admin";
const explicitUri = process.env.MONGODB_URI?.trim();

if (!explicitUri && (!host || !username || !password)) {
  console.error("Es fehlen Angaben. Erwartet werden in .env.local:");
  console.error("  MONGODB_HOST=5.9.22.170:57017");
  console.error("  MONGODB_USERNAME=...");
  console.error("  MONGODB_PASSWORD=...");
  console.error("Alternativ eine fertige MONGODB_URI.");
  process.exit(1);
}

const params = new URLSearchParams({
  authSource,
  directConnection: "true",
  serverSelectionTimeoutMS: "8000",
});
if (process.env.MONGODB_TLS === "true") params.set("tls", "true");

const uri =
  explicitUri ??
  `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}/${database}?${params}`;

// Kennwort niemals ausgeben.
console.log(`Verbinde mit ${explicitUri ? "MONGODB_URI" : host} · Datenbank ${database} …`);

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
try {
  await client.connect();
  const db = client.db(database);
  await db.command({ ping: 1 });

  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  console.log("Verbindung steht.");
  console.log(
    collections.length
      ? `Vorhandene Collections: ${collections.map((c) => c.name).join(", ")}`
      : "Datenbank ist noch leer – der Adminbereich legt beim ersten Aufruf an.",
  );
} catch (error) {
  const message = String(error?.message ?? error).split("\n")[0];
  console.error("Verbindung fehlgeschlagen:", message);

  if (/Authentication failed/i.test(message)) {
    console.error("→ Benutzername, Passwort oder MONGODB_AUTH_SOURCE stimmen nicht.");
  } else if (/ECONNREFUSED|ETIMEDOUT|ServerSelection/i.test(message)) {
    console.error("→ Adresse oder Port nicht erreichbar, oder die Firewall blockiert.");
  } else if (/not authorized/i.test(message)) {
    console.error(`→ Der Benutzer hat keine Rechte auf der Datenbank ${database}.`);
  }
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
