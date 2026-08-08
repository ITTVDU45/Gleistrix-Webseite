# Die Gegenstelle in app.gleistrix.de

Stand: 06.08.2026 · Gegenstück zu `docs/umbau-mandantenfaehig.md`
Repo der App: `~/Desktop/Gleistrix/Gleistrix`

Die Website-Seite ist fertig und getestet. Dieses Dokument beschreibt, was in
der App entstehen muss, damit beide Seiten zusammenspielen.

**Ausführbare Referenz:** `lib/admin/app-sync.transport.check.ts` im
Website-Repo spielt den Vertrag als Platzhalter-Server. Wer die App-Seite baut,
kann dort nachlesen und abgleichen, was die Website tatsächlich sendet und
erwartet — das ist verbindlicher als jede Prosa.

---

## Schritt 0 — Zwei Dinge klären, bevor Code entsteht

### 0.1 Wer darf auf die Kundendatenbanken zugreifen?

**Das ist die Lücke, die als Erstes beißt.** Die Website legt je Kunde eine
Datenbank `gleistrix_<kennung>` und einen Benutzer `svc_<kennung>` an. Der
Benutzer ist nach der Festlegung „ein Datenbankzugang für alle Mandanten"
funktionslos — die App verbindet sich mit **ihrem eigenen** Zugang.

Nur: Dieser Zugang hat auf eine frisch angelegte Kundendatenbank **keine
Rechte**. Niemand vergibt sie. Ein neuer Mandant wäre also angelegt und für die
App trotzdem unlesbar.

**Auf der Website-Seite ist das inzwischen gelöst.** Der Schritt `mongo-role`
gewährt dem App-Benutzer nach dem Anlegen der Datenbank `readWrite` darauf —
über `grantRolesToUser`, je Mandant nachgezogen.

Eine Randnotiz, die leicht Zeit kostet: **MongoDB kennt in Rollen kein
Namensmuster** wie `gleistrix_*`. Ein Privileg nennt entweder eine konkrete
Datenbank oder alle. Eine „Rolle für alle Gleistrix-Datenbanken" lässt sich also
nicht anlegen; die Alternative wäre `readWriteAnyDatabase`, und damit dürfte die
App auch `gleistrix_control` mit Anfragen, Kontakten und Käufen lesen und
schreiben. Deshalb der Weg über die Provisionierung.

**Was du dafür tun musst:**

1. Einen eigenen Datenbankbenutzer für die App anlegen, in `admin`, **ohne**
   Rollen — die kommen je Mandant dazu:
   ```js
   use admin
   db.createUser({ user: "app_mandanten", pwd: "…", roles: [] })
   ```
2. Seinen **Namen** in die `.env` der Website eintragen:
   `MONGODB_APP_USERNAME=app_mandanten`. Das Passwort kennt nur die App.
3. In der App `MONGODB_URI` auf diesen Benutzer zeigen lassen.

Bestandsmandanten, die vor dieser Umstellung entstanden sind, bekommen die
Rechte nicht rückwirkend: Für sie den Schritt `mongo-role` im Adminbereich
einmal erneut ausführen.

### 0.2 Wo liegt das Mandantenverzeichnis der App?

Die App muss bei jeder Anfrage wissen: welcher Mandant, welche Datenbank?

- **Empfohlen: eigenes Verzeichnis in der App.** Genau dafür gibt es
  `POST /api/internal/tenants` — die Website übergibt Kennung, Datenbankname
  und Bucket, die App legt daraus ihren eigenen Eintrag an. Beide Seiten
  bleiben unabhängig.
- **Alternative: `gleistrix_control` mitlesen.** Spart die Ablage, koppelt die
  App aber an das Schema der Website. Dann wäre die Registrierungsschnittstelle
  überflüssig — eine bewusste Entscheidung, kein Nebenweg.

Der Rest dieses Dokuments geht von der empfohlenen Variante aus.

---

## Schritt 1 — Mandantenfähig werden

Bevor eine Schnittstelle Sinn ergibt, muss die App mehrere Mandanten
auseinanderhalten können. Das ist der große Teil, und er hat nichts mit der
Website zu tun.

1. **Verbindung je Anfrage nach Datenbankname.** Heute ist der Name fest
   verdrahtet. Er muss aus dem aufgelösten Mandanten kommen: ein MongoClient,
   `client.db(name)` je Anfrage — keine Verbindung je Mandant.
2. **Mandantenauflösung am Login.** Ein Benutzer gehört zu genau einem
   Mandanten. Die Zuordnung Benutzer → Kennung gehört in das Verzeichnis aus
   0.2, nicht in die Kundendatenbank — sonst müsste man sie kennen, um sie zu
   finden.
3. **Feature-Flags je Mandant.** Heute haben sie `scope: 'global'`. Der
   Modulsatz kommt künftig von der Website und gilt je Mandant.
4. **Speicher je Mandant.** Der Bucketname kommt mit der Registrierung; heute
   ist er vermutlich fest.

Erst wenn das steht, lohnt Schritt 2.

---

## Schritt 2 — `POST /api/internal/tenants`

Der Endpunkt, den die Website beim Provisionierungsschritt `app-sync` aufruft.

```
POST /api/internal/tenants
Authorization: Bearer {SERVICE_SHARED_SECRET}
Idempotency-Key: {Kauf-ID, z. B. pur_m1x2y3}
Content-Type: application/json
```

```jsonc
{
  "kennung": "muster-bau",
  "unternehmen": "Muster Bau GmbH",
  "datenbank": "gleistrix_muster_bau",
  "bucket": "gleistrix-muster-bau",
  "erstbenutzer": { "email": "info@example.de", "name": "Max Mustermann" },
  "paket": { "id": "professional", "name": "Professional", "benutzer": 14 },
  "module": ["einsatztafel", "zeiterfassung"]
}
```

**Antwort `201`** mit `{ "tenantId": "...", "einladungsLink": "..." }`.
Nach bereits erfolgter Passwortvergabe fehlt `einladungsLink` bewusst.

### Sieben Punkte, an denen man sich verbaut

1. **`datenbank` unverändert übernehmen.** Nicht aus `kennung` ableiten! Dort
   stehen Unterstriche statt Bindestrichen: `muster-bau` → `gleistrix_muster_bau`.
   Wer das nachbaut, trifft bei jedem Kunden mit Bindestrich die falsche
   Datenbank.
2. **Kein Passwort im Rumpf, und das ist Absicht.** Die App verbindet sich mit
   ihrem eigenen Zugang und wählt die Kundendatenbank nur über den Namen.
   Erwarte kein Zugangsdatum und fordere keins nach.
3. **`Idempotency-Key` ernst nehmen.** Derselbe Schlüssel muss **denselben**
   Mandanten liefern, nicht einen zweiten anlegen — und mit **`200`** statt
   `201` antworten, bei identischem Rumpf. Die Website wiederholt nach jedem
   Fehlschlag, und der Admin kann den Knopf beliebig oft drücken. Dafür braucht
   die App eine kleine Ablage `key → { tenantId, einladungsLink }`. Ein dort
   gespeicherter Link darf jedoch nicht ungeprüft zurückgegeben werden: Er kann
   inzwischen eingelöst oder abgelaufen sein.
4. **`200` ist Erfolg.** Die Website wertet jede 2xx als Erfolg. Wer nur `201`
   als gültig behandelt, produziert bei der ersten Wiederholung einen
   Fehlschlag im Protokoll, und der Admin wiederholt endlos.
5. **`module` ist der vollständige Satz, kein Zuwachs.** Er enthält Grundkauf
   plus alle Zubuchungen. Die App setzt den Modulsatz **absolut** — was nicht
   drinsteht, ist nicht freigeschaltet. Bei einem gesperrten Mandanten kommt
   eine leere Liste; das ist der Zugangsstopp und muss greifen.
6. **`paket.benutzer` ist das Kontingent**, nicht die Zahl vorhandener Konten.
7. **Fehler als JSON `{ "error": "..." }`** mit passendem Statuscode. Die
   Website übernimmt diesen Text **wörtlich** ins Protokoll und zeigt ihn dem
   Superadmin. Formuliere ihn so, dass er dort weiterhilft — „Datenbank nicht
   erreichbar" statt „Internal Server Error".

### Was der Endpunkt tun muss

1. Bearer-Token gegen `SERVICE_SHARED_SECRET` prüfen — **zeitkonstant**
   vergleichen, nicht mit `===`.
2. `Idempotency-Key` nachschlagen; bei Treffer später mit `200` antworten, den
   Einladungsstatus aber trotzdem frisch auswerten.
3. Mandanteneintrag anlegen: Kennung, Unternehmen, Datenbankname, Bucket,
   Paket, Modulsatz, Benutzerkontingent.
4. Erstbenutzer anlegen — **ohne Passwort**, mit einem einmaligen
   Einladungstoken.
5. `einladungsLink` bauen, der auf die Passwortvergabe zeigt.
6. Schlüssel, `tenantId` und Link ablegen, dann `201` antworten.

Die Website verschickt den Link anschließend per Mail an den Ansprechpartner.
Er sollte also mindestens einige Tage gültig sein.

---

## Schritt 2a — Erstzugang und Loginstatus

Die Unternehmensseite der Website liest nach der Provisionierung den aktuellen
Zugangsstand direkt aus der App.

```
GET /api/internal/tenant-activity?kennung=muster-bau
Authorization: Bearer {SERVICE_SHARED_SECRET}
```

Die Antwort enthält `hasLoggedIn`, `lastLoginAt`, den Benutzer der letzten
Anmeldung, den Passwort-/Einladungsstatus und höchstens 20 erfolgreiche
Loginaktivitäten. Keine Passwörter und keine Einladungstoken verlassen die App.

Für „Einladung erneut senden“ fordert die Website serverseitig einen gültigen
Link an:

```
POST /api/internal/tenant-invitation
Authorization: Bearer {SERVICE_SHARED_SECRET}
Content-Type: application/json

{ "kennung": "muster-bau" }
```

Empfänger und Token bestimmt allein die App aus dem Mandantenverzeichnis. Eine
offene Einladung wird wiederverwendet, eine abgelaufene ersetzt. Existiert der
Erstbenutzer bereits, antwortet die App mit `409`; ein verbrauchter Link wird
niemals erneut verschickt.

---

## Schritt 3 — `POST /api/internal/demo`

Für Demozugänge aus dem Adminbereich. Deutlich kleiner als Schritt 2.

```
POST /api/internal/demo
Authorization: Bearer {SERVICE_SHARED_SECRET}

{ "action": "grant", "email": "…", "company": "…", "days": 14 }
{ "action": "revoke", "email": "…" }
```

Antwort bei `grant`: `{ "url": "…", "expiresAt": "2026-08-20T09:00:00.000Z" }` —
beide Felder optional, die Website rechnet das Ablaufdatum sonst selbst. Im
Fehlerfall `{ "error": "…" }` mit Statuscode.

Ein Demozugang ist **kein** befristeter Mandant, sondern etwas Eigenes daneben.
Willst du das anders, ist es eine Entwurfsentscheidung: dann fällt dieser
Endpunkt weg und `tenants` bekommt ein Ablaufdatum.

---

## Schritt 4 — Support-Login anpassen (ÄNDERUNG an Bestehendem)

Die Route `GET /api/internal/support-login?token=…` gibt es in der App bereits.
**Ihre Prüflogik muss sich ändern**, sonst kommt der Support in keinen Mandanten
mehr.

Bisher war die Audience der Host des Mandanten. Seit alle Mandanten dieselbe URL
teilen, ist sie die **Kennung** — und damit die einzige Grenze zwischen zwei
Mandanten.

```
token = base64url(JSON) + "." + hmacSha256Hex(base64url(JSON), SERVICE_SHARED_SECRET)
JSON  = { "sub": "support@gleistrix.de", "aud": "muster-bau", "exp": 1785949870 }
```

Prüfschritte, exakt so:

1. Am **letzten** Punkt trennen — E-Mail und Domain enthalten selbst Punkte.
2. HMAC-SHA256 über den **kodierten** Rumpf mit `SERVICE_SHARED_SECRET`, hex,
   gegen die Signatur vergleichen.
3. Rumpf base64url-dekodieren; `sub`, `aud` und `exp` müssen vorhanden sein.
4. `exp * 1000 < Date.now()` → abgelaufen. Laufzeit ist **120 Sekunden**.
5. **`aud` gegen die Kennung des aufgelösten Mandanten prüfen** — nicht gegen
   den Host. Das ist die Änderung.

`lib/admin/support.check.ts` im Website-Repo spiegelt diese Schritte und pinnt
das Format; dort steht auch der Fall „Token für Mandant A darf bei Mandant B
nicht greifen".

---

## Schritt 5 — Add-ons zurückmelden

Schaltet ein Nutzer in der App ein Add-on frei, zahlt der Mandant es monatlich
zusätzlich. Die App meldet das an die Website — dieser Endpunkt ist dort
**fertig und getestet**.

```
POST {WEBSITE_URL}/api/internal/addons
Authorization: Bearer {SERVICE_SHARED_SECRET}
Idempotency-Key: {eigene Vorgangskennung der App}

{ "kennung": "muster-bau",
  "module": ["lagerverwaltung"],
  "mengen": { "lagerverwaltung": 2000 } }
```

Antwort `201` mit `{ "kaufId": "pur_zub_…", "monatlich": 1079 }`; bei
Wiederholung mit demselben Schlüssel `200` und derselbe Rumpf.

**Wichtig:**

- **Keinen Preis senden.** Die App kennt keine Preise; ein mitgesendeter Betrag
  wird ignoriert. Die Website rechnet aus ihrer freigegebenen Preisliste.
- `mengen` nur bei Modulen mit Nutzungspreis (heute: Lagerverwaltung, 0,50 € je
  Artikel). Ohne die Menge fehlte der größte Posten im Preis.
- **Erst melden, dann freischalten.** Antwortet die Website mit `422`
  („Nicht freigegebene Module"), darf das Add-on in der App **nicht** aktiv
  werden — sonst nutzt der Kunde etwas, wofür ihm niemand eine Rechnung stellt.
- `Idempotency-Key` ist Pflicht, sonst `400`.

Mögliche Antworten: `401` falsches Geheimnis · `404` unbekannte Kennung ·
`422` Modul nicht freigegeben · `503` Geheimnis auf der Website nicht gesetzt.

### Abbestellen

```
POST {WEBSITE_URL}/api/internal/addons/abbestellung
Authorization: Bearer {SERVICE_SHARED_SECRET}

{ "kennung": "muster-bau", "kaufId": "pur_zub_…" }
```

Antwort `200` mit `{ "kaufId": "…", "endetAm": "2026-08-31T23:59:59.999Z" }`.

**Die Regel: wirksam zum Monatsende, keine anteilige Erstattung.** Bis dahin ist
bezahlt — das Modul **bleibt bis `endetAm` freigeschaltet** und darf in der App
nicht sofort verschwinden. Danach fällt es aus der Meldung und aus der
Monatssumme.

`kaufId` ist die ID, die die Website bei der Freischaltung zurückgegeben hat —
die App muss sie sich also merken. Ein zweiter Aufruf ändert nichts und liefert
dasselbe Datum; die Laufzeit verschiebt sich nicht.

---

## Schritt 6 — Umgebungsvariablen der App

| Variable | Zweck |
| --- | --- |
| `SERVICE_SHARED_SECRET` | **Identisch mit der Website.** Mindestens 32 Zeichen. Authentifiziert beide Richtungen und signiert die Support-Token. |
| `WEBSITE_URL` | Ziel der Add-on-Meldung, z. B. `https://gleistrix.de` |
| `MONGODB_URI` | Der EINE Zugang der App. Braucht Rechte auf allen `gleistrix_*` — siehe 0.1. |
| `MINIO_*` | Objektspeicher; der Bucketname kommt je Mandant aus der Registrierung. |

---

## Reihenfolge und erster gemeinsamer Test

1. **0.1 entscheiden** — sonst ist jeder Mandant nach der Anlage unbrauchbar.
2. **Schritt 1** (mandantenfähig) — der große Brocken, unabhängig von der Website.
3. **Schritt 2** (`/api/internal/tenants`) — danach lässt sich der
   Provisionierungslauf im Adminbereich zum ersten Mal vollständig durchspielen.
4. **Schritt 4** (Support-Login) — sonst kommt der Support in keinen Mandanten.
5. **Schritt 3** (Demo) und **Schritt 5** (Add-ons) — unabhängig voneinander,
   Reihenfolge egal.

**Erster gemeinsamer Test:** Im Adminbereich unter `/admin/unternehmen` einen
Mandanten anlegen, die drei Ressourcen-Schritte laufen lassen, dann `app-sync`.
Läuft er durch, steht der Mandant in der App und der Einladungslink geht raus.
Schlägt er fehl, steht die Meldung der App im Protokoll — dort steht dann auch,
woran es lag.

## Was auf der Website-Seite noch offen ist

- **Abbestellen von Add-ons** ist nicht gebaut. Braucht vorher die Regel: sofort
  oder zum Laufzeitende, und was passiert mit dem angebrochenen Monat?
- **SMTP ist nicht konfiguriert.** Die Einladungsmail ist gebaut, verschickt aber
  nichts, solange `SMTP_HOST`/`USER`/`PASS` fehlen. Im Protokoll steht dann
  „Link von Hand weitergeben".
- **MongoDB läuft ohne TLS** auf Port 57017, und der Anwendungsbenutzer ist
  derselbe wie der Cluster-Administrator. Beides gehört vor den ersten echten
  Kunden geradegezogen.
