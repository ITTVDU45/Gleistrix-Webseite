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

const {
  applyStepResult,
  provisioningIsCurrent,
  provisioningPlan,
  reconcileProvisioning,
  statusFor,
  tenantFor,
} = await import("./tenant.ts");

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

// 7. Der Status folgt dem Lauf: Der neue offene Schritt holt einen Mandanten
// aus „aktiv" zurück in die Provisionierung.
assert.equal(
  statusFor("active", migrated),
  "provisioning",
  "Mit offenem app-sync ist ein Mandant nicht fertig bereitgestellt",
);
assert.equal(
  statusFor("provisioning", migrated.map((step) => ({ ...step, status: "done" as const }))),
  "active",
  "Sind alle Schritte erledigt, wird der Mandant aktiv",
);

// 8. Eine Sperre ist eine bewusste Entscheidung und überlebt beides.
assert.equal(
  statusFor("suspended", migrated.map((step) => ({ ...step, status: "done" as const }))),
  "suspended",
  "Ein durchgelaufener Schritt darf keine Sperre aufheben",
);

/* --------------------------------------------------- Ergebnis eines Schritts */

/**
 * Genau die Luecke, die es gab: Der automatische Lauf schrieb nur die
 * Schrittliste, nicht den Status. Ein durchgelaufener Mandant blieb auf
 * „provisioning" und bekam keinen Support-Zugriff.
 */
const mandant = {
  id: "cmp_muster",
  name: "Muster Bau GmbH",
  slug: "muster-bau",
  contactName: "Max Mustermann",
  contactEmail: "info@example.test",
  seats: 12,
  status: "provisioning" as const,
  packageId: null,
  extraModuleIds: [],
  blockedModuleIds: [],
  tenant,
  provisioning: migrated.map((step) => ({ ...step, status: "done" as const })),
  createdAt: "2026-07-01T08:00:00.000Z",
};

// 9. Der letzte offene Schritt hebt den Mandanten auf „aktiv" - in DERSELBEN
// Schreiboperation, nicht erst beim naechsten Prozessstart.
const offen = {
  ...mandant,
  provisioning: mandant.provisioning.map((step) =>
    step.id === "app-sync" ? { ...step, status: "pending" as const } : step,
  ),
};
const fertig = applyStepResult(offen, "app-sync", {
  status: "done",
  note: "An gleistrix_muster_bau gemeldet.",
  updatedAt: "2026-08-05T12:00:00.000Z",
});
assert.equal(fertig.status, "active", "Der letzte erledigte Schritt muss den Mandanten aktivieren");
assert.equal(fertig.provisioning.find((step) => step.id === "app-sync")?.status, "done");
assert.equal(
  fertig.provisioning.find((step) => step.id === "app-sync")?.note,
  "An gleistrix_muster_bau gemeldet.",
  "Die Meldung des Laufs muss im Protokoll landen",
);

// 10. Ein Fehlschlag holt den Mandanten zurueck in die Provisionierung.
const gescheitert = applyStepResult({ ...mandant, status: "active" }, "app-sync", {
  status: "failed",
  note: "Die Gleistrix-App war nicht erreichbar.",
  updatedAt: "2026-08-05T12:05:00.000Z",
});
assert.equal(gescheitert.status, "provisioning", "Ein Fehlschlag darf keinen aktiven Mandanten stehen lassen");

// 11. Ohne eigene Meldung bleibt der bisherige Hinweis stehen - der manuelle
// Haken hat nichts zu erzaehlen und darf das Protokoll nicht leeren.
const vorher = fertig.provisioning.find((step) => step.id === "minio-bucket")?.note;
const gehakt = applyStepResult(fertig, "minio-bucket", {
  status: "pending",
  updatedAt: "2026-08-05T12:10:00.000Z",
});
assert.equal(
  gehakt.provisioning.find((step) => step.id === "minio-bucket")?.note,
  vorher,
  "Ohne neue Meldung muss der bisherige Hinweis erhalten bleiben",
);
assert.equal(gehakt.status, "provisioning", "Ein zurueckgesetzter Schritt oeffnet die Provisionierung wieder");

// 12. Eine Sperre ueberlebt auch hier.
const gesperrt = applyStepResult({ ...mandant, status: "suspended" }, "app-sync", {
  status: "done",
  updatedAt: "2026-08-05T12:15:00.000Z",
});
assert.equal(gesperrt.status, "suspended", "applyStepResult darf keine Sperre aufheben");

console.log("tenant.check: alle 12 Pruefungen bestanden");
