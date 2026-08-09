import type { Tenant } from "@/types/admin";

import { tenantFor } from "../tenant";

/**
 * Namensschranke vor jedem zerstörerischen Aufruf.
 *
 * Der Abbau läuft mit MONGODB_ADMIN_URI, also mit root-Rechten, und mit den
 * MinIO-Administrator-Zugangsdaten. `dropDatabase` und `removeObjects` fragen
 * nicht nach. Diese Funktion ist die einzige Verteidigung dagegen, dass ein
 * falscher Name die Control-Plane oder einen fremden Mandanten trifft.
 *
 * Rückgabe: `null` heißt „darf abgebaut werden". Jeder Text ist ein Abbruch –
 * niemals ein Überspringen. Passt ein Name nicht ins Schema, ist die Annahme
 * falsch, nicht der Name.
 *
 * Bewusst OHNE Import von lib/admin/mongo.ts: das zöge den MongoDB-Treiber in
 * jeden Importeur und in den Selbsttest unter nacktem `node`. Der Name der
 * Control-Plane wird deshalb hier mit derselben einen Zeile gelesen.
 */

/** Muss mit lib/admin/mongo.ts übereinstimmen – siehe Kommentar oben. */
function controlPlaneDatabase(): string {
  return process.env.MONGODB_DATABASE?.trim() || "gleistrix_control";
}

/**
 * Datenbanken, die kein Abbau je anfassen darf.
 *
 * `gleistrix_control` steht zusätzlich als Literal drin: Ist MONGODB_DATABASE
 * abweichend gesetzt, die Altdatenbank aber noch vorhanden, schützte der
 * konfigurierte Name allein sie nicht.
 */
function forbiddenDatabases(): string[] {
  return [controlPlaneDatabase(), "gleistrix_control", "admin", "local", "config"];
}

export function teardownGuard(slug: string, tenant: Tenant): string | null {
  // 1. Namen neu berechnen statt dem gespeicherten Feld zu trauen. Ein von Hand
  // verbogener oder aus einer alten Migration stammender `tenant` zeigt sonst
  // irgendwohin.
  const erwartet = tenantFor(slug);
  if (
    erwartet.mongoDatabase !== tenant.mongoDatabase ||
    erwartet.mongoUser !== tenant.mongoUser ||
    erwartet.minioBucket !== tenant.minioBucket
  ) {
    return `Die gespeicherten Ressourcennamen passen nicht zur Kennung „${slug}“. Abbau abgebrochen.`;
  }

  // 2. Das Namensschema aus tenantFor – hier als Prüfung, nicht als Erzeugung.
  if (!/^gleistrix_[a-z0-9_]+$/.test(tenant.mongoDatabase)) {
    return `„${tenant.mongoDatabase}“ folgt nicht dem Schema gleistrix_<kennung>. Abbau abgebrochen.`;
  }
  if (!/^svc_[a-z0-9_]+$/.test(tenant.mongoUser)) {
    return `„${tenant.mongoUser}“ folgt nicht dem Schema svc_<kennung>. Abbau abgebrochen.`;
  }
  if (!/^gleistrix-[a-z0-9-]+$/.test(tenant.minioBucket)) {
    return `„${tenant.minioBucket}“ folgt nicht dem Schema gleistrix-<kennung>. Abbau abgebrochen.`;
  }

  // 3. Ein reiner Präfixtest wäre hier wertlos: gleistrix_control erfüllt
  // „gleistrix_“ und ist trotzdem der Adminbereich selbst.
  if (forbiddenDatabases().includes(tenant.mongoDatabase.toLowerCase())) {
    return `„${tenant.mongoDatabase}“ ist keine Mandanten-Datenbank. Abbau abgebrochen.`;
  }

  // 4. Der Benutzer der App und der Anwendungsbenutzer der Control-Plane
  // bedienen ALLE Mandanten. Wer einen davon löscht, sperrt sämtliche Kunden
  // gleichzeitig aus.
  const geteilteBenutzer = [
    process.env.MONGODB_APP_USERNAME?.trim(),
    process.env.MONGODB_USERNAME?.trim(),
  ].filter(Boolean);
  if (geteilteBenutzer.includes(tenant.mongoUser)) {
    return `„${tenant.mongoUser}“ ist ein geteilter Datenbankbenutzer. Abbau abgebrochen.`;
  }

  // 5. Ein leerer Bucketname würde removeObjects auf den Standardbucket loslassen.
  if (tenant.minioBucket.length === 0) {
    return "Kein Bucketname hinterlegt. Abbau abgebrochen.";
  }

  return null;
}
