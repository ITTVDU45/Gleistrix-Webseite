/**
 * Selbsttest für die Nachmigration gespeicherter Provisionierungspläne.
 *
 * Warum es diesen Check gibt: `reconcileProvisioning` läuft beim Start über
 * BESTEHENDE Mandanten. Verliert es dabei den erreichten Stand, gilt ein längst
 * angelegter Bucket wieder als offen – und ein zweiter Lauf legt Ressourcen
 * doppelt an. Der Check pinnt genau das: neue Schritte kommen dazu, alte
 * fliegen raus, und was erledigt war, bleibt erledigt.
 *
 * Ausführen: `node lib/admin/tenant.check.ts`
 */
import assert from "node:assert/strict";

const { provisioningIsCurrent, provisioningPlan, reconcileProvisioning, tenantFor } = await import(
  "./tenant.ts"
);

const tenant = tenantFor("muster-bau");

/** So sah ein Plan vor dem Umbau aus: fünf Schritte, drei davon erledigt. */
const legacy = [
  {
    id: "mongo-database" as const,
    label: "MongoDB-Datenbank anlegen",
    target: "gleistrix_muster_bau",
    requiredEnv: "MONGODB_ADMIN_URI",
    status: "done" as const,
    note: "Datenbank angelegt.",
    updatedAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "mongo-role" as const,
    label: "MongoDB-Rolle & Benutzer anlegen",
    target: "svc_muster_bau",
    requiredEnv: "MONGODB_ADMIN_URI",
    status: "done" as const,
    note: "Benutzer angelegt.",
    updatedAt: "2026-07-01T09:01:00.000Z",
  },
  {
    id: "minio-bucket" as const,
    label: "MinIO-Bucket anlegen",
    target: "gleistrix-muster-bau",
    requiredEnv: "MINIO_ENDPOINT",
    status: "failed" as const,
    note: "MinIO war nicht erreichbar.",
    updatedAt: "2026-07-01T09:02:00.000Z",
  },
  // Die beiden Schritte, die es nicht mehr gibt.
  {
    id: "deployment" as unknown as "mongo-database",
    label: "Gleistrix-Instanz deployen",
    target: "muster-bau.gleistrix.de",
    requiredEnv: "VERCEL_API_TOKEN",
    status: "done" as const,
    note: "Projekt angelegt.",
    updatedAt: "2026-07-01T09:03:00.000Z",
  },
  {
    id: "dns-record" as unknown as "mongo-database",
    label: "DNS-Eintrag setzen",
    target: "muster-bau.gleistrix.de",
    requiredEnv: "VERCEL_API_TOKEN",
    status: "done" as const,
    note: "Domain angehängt.",
    updatedAt: "2026-07-01T09:04:00.000Z",
  },
];

const migrated = reconcileProvisioning(tenant, legacy);

// 1. Genau die vier aktuellen Schritte, in der Reihenfolge des Bauplans.
assert.deepEqual(
  migrated.map((step) => step.id),
  ["mongo-database", "mongo-role", "minio-bucket", "app-sync"],
  `Unerwartete Schrittliste: ${migrated.map((step) => step.id).join(", ")}`,
);

// 2. Erledigtes bleibt erledigt – sonst liefe die Provisionierung doppelt.
const database = migrated.find((step) => step.id === "mongo-database");
assert.equal(database?.status, "done", "Ein erledigter Schritt darf nicht zurückfallen");
assert.equal(database?.note, "Datenbank angelegt.", "Das Protokoll des Laufs muss erhalten bleiben");
assert.equal(database?.updatedAt, "2026-07-01T09:00:00.000Z", "Der Zeitpunkt muss erhalten bleiben");

// 3. Auch ein Fehlschlag bleibt sichtbar, samt Ursache.
const bucket = migrated.find((step) => step.id === "minio-bucket");
assert.equal(bucket?.status, "failed", "Ein Fehlschlag darf nicht stillschweigend verschwinden");
assert.equal(bucket?.note, "MinIO war nicht erreichbar.", "Die Fehlermeldung muss erhalten bleiben");

// 4. Der neue Schritt kommt offen dazu und trägt den Hinweis aus dem Bauplan.
const sync = migrated.find((step) => step.id === "app-sync");
assert.equal(sync?.status, "pending", "app-sync muss offen beginnen");
assert.equal(sync?.requiredEnv, "SERVICE_SHARED_SECRET");
assert.ok(
  sync?.note?.includes(tenant.mongoDatabase),
  "Der Hinweis muss den Datenbanknamen nennen, den die App bekommt",
);

// 5. Zweiter Lauf ändert nichts mehr – die Migration läuft bei jedem Start.
assert.equal(provisioningIsCurrent(legacy), false, "Der Altbestand gilt als veraltet");
assert.equal(provisioningIsCurrent(migrated), true, "Nach der Migration ist nichts mehr zu tun");
assert.deepEqual(
  reconcileProvisioning(tenant, migrated),
  migrated,
  "Ein zweiter Lauf muss dasselbe Ergebnis liefern",
);

// 6. Ein frischer Plan ist ohne Zutun aktuell.
assert.equal(provisioningIsCurrent(provisioningPlan(tenant)), true);

console.log("tenant.check: alle 6 Pruefungen bestanden");
