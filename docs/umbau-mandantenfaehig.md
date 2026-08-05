# Umbau auf die mandantenfähige App

Stand: 05.08.2026 · Ausgangsbranch: `feat/konfigurator-anfrage` (Commit `b4f154a`)

## Was sich ändert

Bisher war je Kunde eine eigene Instanz der Gleistrix-App vorgesehen: eigenes
Vercel-Projekt, eigene Subdomain, eigene Datenbank. Ab jetzt gilt:

- **Eine** Anwendung unter `app.gleistrix.de` für alle Kunden.
- `gleistrix.de/admin` bleibt, wie es ist, und wird zugleich das Admin-Dashboard
  der Applikation. Kein eigenes `admin.gleistrix.de`.
- Die Trennung der Kundendaten bleibt auf Datenbankebene: je Kunde eine eigene
  Datenbank `gleistrix_<kennung>` mit Benutzer `svc_<kennung>`.
- `gleistrix_control` bleibt die gemeinsame Datenbank von Website, Adminbereich
  und App.

## Bestandsaufnahme

| Datei | Zustand | Bleibt? |
| --- | --- | --- |
| `lib/admin/provision/mongo.ts` | fertig, gegen den Server getestet | **ja** |
| `lib/admin/provision/minio.ts` | fertig, Bucket privat | **ja** |
| `lib/admin/provision/vercel.ts` | fertig, aber gegenstandslos | **entfällt** |
| `lib/admin/tenant.ts` | 5 Schritte, davon 2 gegenstandslos | wird gekürzt |
| `lib/admin/demo.ts` | Gegenstelle in der App fehlt | geht in `app-sync.ts` auf |
| `lib/admin/db/*` | 14 Collections, in Betrieb | **ja**, plus `purchases` |

## Schritt 1 — Vercel-Provisionierung ausbauen

Betrifft `lib/admin/tenant.ts`, `lib/admin/provision/vercel.ts`,
`app/admin/actions.ts`, `types/admin.ts`.

- Schritte `deployment` und `dns-record` aus der Schrittliste entfernen.
- `lib/admin/provision/vercel.ts` löschen; `runDeployment()` in
  `app/admin/actions.ts` entfällt mitsamt der Env-Übergabe. Damit verschwindet
  auch die Fallunterscheidung über `user.created` — sie existierte nur, um kein
  falsches Passwort in eine Mandantenumgebung zu schreiben. Der
  `created`-Rückgabewert in `provision/mongo.ts` bleibt trotzdem: er zeigt im
  Protokoll, ob ein Benutzer neu entstand oder schon da war.
- `Tenant` verliert das Subdomain-Feld. Alle Mandanten erreichen dieselbe URL.
- `VERCEL_API_TOKEN` und die Projekt-ID werden nicht mehr gelesen. In Vercel
  können die Variablen danach weg.

Aufräumen (manuell, nicht im Code): Vercel-Projekt `gleistrix-testmandant`
samt Subdomain löschen, ebenso `gleistrix_testmandant` und `svc_testmandant`
auf dem MongoDB-Server. Und `node_modules/.provrun` löschen.

## Schritt 2 — Collection `purchases`

Neu: `lib/admin/db/purchases.ts`, Eintrag in `COLLECTIONS` in
`lib/admin/db/collections.ts`, Index in `lib/admin/db/bootstrap.ts`.

Ein Dokument je Kauf, nach dem Muster der bestehenden Repositories:

```jsonc
{
  "id": "pur_...",
  "companyId": "cmp_...",        // Fremdschlüssel auf companies
  "packageId": "pkg_...",        // Fremdschlüssel auf pricing_packages
  "moduleIds": ["mod_...", "mod_..."],
  "users": 12,                    // gebuchte Benutzerzahl
  "capacityId": "cap_...",
  "monthlyTotal": 289.9,          // eingefrorener Preis zum Kaufzeitpunkt
  "implementationPrice": 1500,
  "status": "offen",             // offen | freigegeben | fehlgeschlagen
  "syncedAt": null,               // ISO-Zeitstempel der App-Rückmeldung
  "syncError": null,              // letzte Fehlermeldung, für Wiederholung
  "createdAt": "2026-08-05T10:12:00.000Z"
}
```

Der Preis wird **eingefroren** mitgeschrieben. Ändert sich später die Preisliste,
darf sich der Bestandspreis nicht rückwirkend verschieben.

## Schritt 3 — Schnittstelle zur App

Neu: `lib/admin/app-sync.ts`. Ersetzt `lib/admin/demo.ts` bzw. nimmt es auf.

Zwei Umgebungsvariablen, beide serverseitig:
`GLEISTRIX_APP_URL` und `SERVICE_SHARED_SECRET`.

**Vertrag** — das ist der Teil, den du in `app.gleistrix.de` als Gegenstelle
baust:

```
POST {GLEISTRIX_APP_URL}/api/internal/tenants
Authorization: Bearer {SERVICE_SHARED_SECRET}
Idempotency-Key: {purchase.id}
```

```jsonc
{
  "kennung": "mustermann-bau",       // = Datenbankname ohne Präfix
  "unternehmen": "Mustermann Bau GmbH",
  "datenbank": "gleistrix_mustermann-bau",
  "bucket": "gleistrix-mustermann-bau",
  "erstbenutzer": { "email": "info@example.de", "name": "Max Mustermann" },
  "paket": { "id": "pkg_...", "name": "Professional", "benutzer": 12 },
  "module": ["einsatztafel", "zeiterfassung"],
  "gueltigBis": null                  // gesetzt bei Demozugängen
}
```

Antwort `201` mit `{ "tenantId": "...", "einladungsLink": "..." }`, bei
erneutem Aufruf mit demselben `Idempotency-Key` derselbe Rumpf und `200`.

Zwei Punkte, die im Adminbereich sichtbar sein müssen: Das Mandantenpasswort
wird **nicht** über diese Schnittstelle übertragen — die App verbindet sich mit
dem Benutzer, den Schritt 4 anlegt, und liest die Zugangsdaten aus ihrer eigenen
Umgebung. Und ein Fehlschlag darf den Kauf nicht verlieren: `status` geht auf
`fehlgeschlagen`, `syncError` hält die Meldung, ein Knopf wiederholt.

## Schritt 4 — Provisionierungslauf kürzen

Der Lauf schrumpft auf vier Schritte:

1. `mongo-database` — Datenbank anlegen *(unverändert)*
2. `mongo-role` — Benutzer mit `readWrite` nur auf diese Datenbank *(unverändert)*
3. `minio-bucket` — privater Bucket *(unverändert)*
4. `app-sync` — **neu**, meldet den Mandanten an die App

Schritt 4 braucht das in Schritt 2 erzeugte Passwort nicht. Was die App zum
Verbinden braucht, ist der Datenbankname; die Zugangsdaten liegen in ihrer
Umgebung. Falls du je Mandant getrennte Zugangsdaten in der App willst, muss
das Passwort dorthin — dann aber über einen eigenen, verschlüsselten Weg und
nicht im JSON-Rumpf oben.

## Schritt 5 — Adminseite `/admin/kaeufe`

Liste analog zu `/admin/anfragen`: Unternehmen, Paket, Monatspreis, Status,
Zeitpunkt. Detailseite mit den gebuchten Modulen und dem Protokoll der
Provisionierungsschritte. Ein Knopf „An App melden" für fehlgeschlagene Läufe.

`revalidateAdmin()` in `app/admin/actions.ts` um `/admin/kaeufe` ergänzen.

## Reihenfolge

Schritt 1 zuerst — er löscht Code und macht den Rest übersichtlicher. Dann 2,
weil 3 und 5 darauf aufsetzen. 3 und 4 gehören zusammen. 5 zum Schluss.

Schritte 1 und 2 sind ohne die App testbar. Schritt 3 lässt sich erst
vollständig prüfen, wenn die Gegenstelle steht — bis dahin gegen einen
Platzhalter-Endpunkt testen und `status` auf `fehlgeschlagen` laufen lassen.

## Vor dem Start

- `feat/konfigurator-anfrage` pushen. Commit `b4f154a` liegt nur lokal.
- Kein `next build`, solange der Dev-Server läuft — das hat zweimal `.next`
  zerstört.

## Offen, unabhängig vom Umbau

- **Zwei widersprüchliche Preissysteme.** Die Mandanten-Pakete (150/390/890 €)
  und die Konfiguratorformel weichen um bis zu 265 €/Monat voneinander ab. Das
  ist eine kaufmännische Entscheidung, keine technische. Solange sie offen ist,
  steht in `purchases.monthlyTotal` je nach Quelle etwas anderes.
- **SMTP fehlt** — Broschürenversand und Einladungsmails ungetestet.
- **MongoDB ohne TLS** auf Port 57017. Let's Encrypt stellt keine Zertifikate
  für IP-Adressen aus; dafür bräuchte der Server einen Hostnamen.
- **Anwendungsbenutzer ist `root`.** Besser wäre ein zweiter Benutzer mit
  `readWrite` nur auf `gleistrix_control`; `MONGODB_ADMIN_URI` bleibt getrennt
  davon für die Provisionierung.
