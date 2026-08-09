/**
 * Selbsttest der ausgehenden Meldung an die App – gegen einen Platzhalter.
 *
 * Ausführen: `node lib/admin/app-sync.transport.check.ts`
 *
 * Warum es diesen Check gibt: `app-sync.check.ts` prüft nur, WAS im Rumpf
 * steht. Ob der Aufruf beim richtigen Pfad landet, das Geheimnis mitschickt,
 * den Idempotency-Key setzt und eine Fehlerantwort richtig deutet, blieb bis
 * hierher ungeprüft – und ließe sich sonst erst prüfen, wenn die Gegenstelle in
 * app.gleistrix.de steht. Genau dafür steht hier ein Platzhalter, der den
 * Vertrag aus docs/umbau-mandantenfaehig.md spielt und festhält, was ankam.
 */
import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server } from "node:http";
import { registerHooks } from "node:module";
import type { AddressInfo } from "node:net";

registerHooks({
  resolve(specifier, context, next) {
    const relativ = specifier.startsWith("./") || specifier.startsWith("../");
    return next(relativ && !specifier.endsWith(".ts") ? `${specifier}.ts` : specifier, context);
  },
});

const SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

type Empfangen = {
  method: string;
  url: string;
  authorization: string;
  idempotencyKey: string;
  contentType: string;
  body: unknown;
};

let letzte: Empfangen | null = null;
/** Was der Platzhalter als Nächstes antwortet. */
let antwort: { status: number; payload: unknown } = {
  status: 201,
  payload: { tenantId: "tnt_123", einladungsLink: "https://app.gleistrix.de/einladung/abc" },
};

function leseRumpf(request: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let daten = "";
    request.on("data", (teil) => (daten += teil));
    request.on("end", () => resolve(daten));
  });
}

const server: Server = createServer(async (request, response) => {
  const roh = await leseRumpf(request);
  letzte = {
    method: request.method ?? "",
    url: request.url ?? "",
    authorization: String(request.headers.authorization ?? ""),
    idempotencyKey: String(request.headers["idempotency-key"] ?? ""),
    contentType: String(request.headers["content-type"] ?? ""),
    body: roh ? JSON.parse(roh) : null,
  };

  response.writeHead(antwort.status, { "content-type": "application/json" });
  response.end(JSON.stringify(antwort.payload));
});

await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = (server.address() as AddressInfo).port;

// Muss VOR dem Import gesetzt sein: app-sync.ts liest APP_URL beim Laden.
process.env.GLEISTRIX_APP_URL = `http://127.0.0.1:${port}`;
process.env.SERVICE_SHARED_SECRET = SECRET;

const { getTenantActivity, getTenantUsers, registerTenant, requestTenantInvitation } = await import(
  "./app-sync.ts"
);

const registration = {
  kennung: "muster-bau",
  unternehmen: "Muster Bau GmbH",
  datenbank: "gleistrix_muster_bau",
  bucket: "gleistrix-muster-bau",
  erstbenutzer: { email: "info@example.test", name: "Max Mustermann" },
  paket: { id: "professional", name: "Professional", benutzer: 14 },
  module: ["einsatztafel"],
  // Kein Demomandant: Das Feld geht trotzdem mit, weil die App es absolut setzt.
  demoLaeuftAbAm: null,
};

/* ------------------------------------------------------------ Erfolgsfall */

const erfolg = await registerTenant(registration, "pur_abc");
assert.equal(erfolg.ok, true, "Eine 201-Antwort muss als Erfolg gelten");
if (!erfolg.ok) throw new Error("unreachable");

// 1. Pfad und Methode wie im Vertrag.
assert.equal(letzte?.method, "POST");
assert.equal(letzte?.url, "/api/internal/tenants", `Falscher Pfad: ${letzte?.url}`);

// 2. Das Geheimnis geht als Bearer mit.
assert.equal(letzte?.authorization, `Bearer ${SECRET}`);
assert.ok(letzte?.contentType.includes("application/json"));

// 3. Der Idempotency-Key trägt die Kauf-ID. Ohne ihn erzeugte jede Wiederholung
// nach einem Fehlschlag einen zweiten Mandanten.
assert.equal(letzte?.idempotencyKey, "pur_abc", "Idempotency-Key fehlt oder ist falsch");

// 4. Der Rumpf kommt unverändert an.
assert.deepEqual(letzte?.body, registration, "Der Rumpf weicht vom Gesendeten ab");

// 5. Die Antwort wird ausgewertet, nicht verworfen.
assert.equal(erfolg.tenantId, "tnt_123");
assert.equal(erfolg.einladungsLink, "https://app.gleistrix.de/einladung/abc");

// 6. KEIN Zugangsdatum unterwegs – das ist die Zusage des Umbaus.
assert.ok(
  !JSON.stringify(letzte?.body).toLowerCase().includes("passwor"),
  "Im Rumpf darf kein Passwort auftauchen",
);

/* ----------------------------------------------------- Login-Aktivitäten */

antwort = {
  status: 200,
  payload: {
    hasLoggedIn: true,
    lastLoginAt: "2026-08-08T18:00:00.000Z",
    lastLoginUser: { name: "Max Mustermann", email: "info@example.test", role: "superadmin" },
    invitation: {
      status: "accepted",
      expiresAt: "2026-08-20T18:00:00.000Z",
      acceptedAt: "2026-08-08T17:00:00.000Z",
    },
    activities: [
      {
        id: "log_1",
        timestamp: "2026-08-08T18:00:00.000Z",
        name: "Max Mustermann",
        email: "info@example.test",
        role: "superadmin",
        description: "Erfolgreiche Anmeldung",
        historical: false,
      },
    ],
  },
};
const aktivitaet = await getTenantActivity("muster-bau");
assert.equal(aktivitaet.ok, true);
if (!aktivitaet.ok) throw new Error("unreachable");
assert.equal(letzte?.method, "GET");
assert.equal(letzte?.url, "/api/internal/tenant-activity?kennung=muster-bau");
assert.equal(letzte?.authorization, `Bearer ${SECRET}`);
assert.equal(aktivitaet.activity.hasLoggedIn, true);
assert.equal(aktivitaet.activity.activities[0]?.email, "info@example.test");

/* ------------------------------------------------ Einladungs-Neuversand */

antwort = {
  status: 200,
  payload: {
    email: "info@example.test",
    einladungsLink: "https://app.gleistrix.de/auth/set-password?token=neu",
    expiresAt: "2026-08-22T18:00:00.000Z",
  },
};
const einladung = await requestTenantInvitation("muster-bau");
assert.equal(einladung.ok, true);
if (!einladung.ok) throw new Error("unreachable");
assert.equal(letzte?.method, "POST");
assert.equal(letzte?.url, "/api/internal/tenant-invitation");
assert.deepEqual(letzte?.body, { kennung: "muster-bau" });
assert.equal(einladung.email, "info@example.test");
assert.ok(einladung.einladungsLink.includes("token=neu"));

/* ----------------------------------------------------------- Wiederholung */

// 7. Der Vertrag sagt: derselbe Schlüssel, derselbe Rumpf, aber 200. Auch das
// muss als Erfolg gelten – sonst stünde eine geglückte Meldung als Fehlschlag
// im Protokoll und der Admin wiederholte sie endlos.
antwort = { status: 200, payload: { tenantId: "tnt_123", einladungsLink: "https://x/y" } };
const wiederholt = await registerTenant(registration, "pur_abc");
assert.equal(wiederholt.ok, true, "Eine 200-Antwort auf die Wiederholung ist Erfolg");

/* ------------------------------------------------------------- Fehlerfall */

// 8. Die Meldung der App landet im Protokoll – nicht ein generischer Text.
antwort = { status: 500, payload: { error: "Datenbank nicht erreichbar" } };
const fehler = await registerTenant(registration, "pur_abc");
assert.equal(fehler.ok, false);
if (fehler.ok) throw new Error("unreachable");
assert.equal(fehler.error, "Datenbank nicht erreichbar", "Die Ursache der App muss durchkommen");

// 9. Antwortet die App ohne Begründung, steht wenigstens der Statuscode da.
antwort = { status: 502, payload: {} };
const ohneGrund = await registerTenant(registration, "pur_abc");
assert.equal(ohneGrund.ok, false);
if (ohneGrund.ok) throw new Error("unreachable");
assert.ok(ohneGrund.error.includes("502"), `Statuscode fehlt in: ${ohneGrund.error}`);

/* --------------------------------------------------- Benutzer des Mandanten */

/**
 * Die Benutzerliste kommt aus der App, nicht aus einem Abzug.
 *
 * Gepinnt wird, was still schiefgehen kann: der Pfad samt Kennung in der
 * Abfrage, und dass unvollständige Einträge die Liste nicht sprengen. Käme statt
 * eines Namens `undefined` durch, stünde das wörtlich auf der Unternehmensseite.
 */
antwort = {
  status: 200,
  payload: {
    benutzer: [
      {
        email: "chef@muster-bau.test",
        name: "Petra Muster",
        rolle: "superadmin",
        aktiv: true,
        letzterLogin: "2026-08-08T07:30:00.000Z",
        angelegtAm: "2026-07-01T09:00:00.000Z",
      },
      // Absichtlich lückenhaft: so kommt es aus einer echten Datenbank, in der
      // niemand den Namen gepflegt hat.
      { email: "lager@muster-bau.test", rolle: "lager", aktiv: false },
      "kein Objekt",
    ],
    einladungen: [
      {
        email: "neu@muster-bau.test",
        name: "Jonas Weber",
        rolle: "user",
        laeuftAbAm: "2026-08-10T07:30:00.000Z",
        eingeladenAm: "2026-08-09T07:30:00.000Z",
      },
    ],
  },
};

const benutzerliste = await getTenantUsers("Muster-Bau");
assert.equal(benutzerliste.ok, true, "Eine 200-Antwort muss als Erfolg gelten");
if (!benutzerliste.ok) throw new Error("unreachable");

assert.equal(letzte?.method, "GET", "Die Benutzerliste wird gelesen, nicht geschrieben");
assert.equal(
  letzte?.url,
  "/api/internal/tenant-users?kennung=muster-bau",
  `Falscher Pfad oder ungenormte Kennung: ${letzte?.url}`,
);
assert.equal(letzte?.authorization, `Bearer ${SECRET}`);

// Der Fremdkörper in der Liste fliegt raus, die echten Einträge bleiben.
assert.equal(benutzerliste.benutzer.length, 2, "Nur echte Objekte gehören in die Liste");
assert.equal(benutzerliste.benutzer[0].name, "Petra Muster");
assert.equal(benutzerliste.benutzer[0].letzterLogin, "2026-08-08T07:30:00.000Z");

// Fehlende Felder werden zu "", nicht zu undefined – sonst stünde das Wort in
// der Oberfläche.
assert.equal(benutzerliste.benutzer[1].name, "", "Fehlender Name wird zum leeren Text");
assert.equal(benutzerliste.benutzer[1].aktiv, false, "aktiv:false darf nicht verlorengehen");
assert.equal(benutzerliste.benutzer[1].letzterLogin, null, "Nie angemeldet bleibt null");

assert.equal(benutzerliste.einladungen.length, 1);
assert.equal(benutzerliste.einladungen[0].email, "neu@muster-bau.test");

// Fehlen die Listen ganz, ist das kein Absturz, sondern leer.
antwort = { status: 200, payload: {} };
const leer = await getTenantUsers("muster-bau");
assert.equal(leer.ok, true);
if (!leer.ok) throw new Error("unreachable");
assert.deepEqual(leer.benutzer, [], "Fehlende Liste ergibt eine leere Liste");
assert.deepEqual(leer.einladungen, []);

/* ------------------------------------------------------- Nicht erreichbar */

await new Promise<void>((resolve) => server.close(() => resolve()));

// 10. Ist die App weg, ist das ein Fehlschlag mit Grund – und kein Absturz der
// Server Action. Genau daran hängt, dass ein Kauf nicht verloren geht.
const tot = await registerTenant(registration, "pur_abc");
assert.equal(tot.ok, false, "Eine unerreichbare App muss ein sauberer Fehlschlag sein");
if (tot.ok) throw new Error("unreachable");
assert.ok(
  tot.error.includes("nicht erreichbar"),
  `Unerwartete Meldung bei toter Gegenstelle: ${tot.error}`,
);

console.log(
  "app-sync.transport.check: Mandanten-, Aktivitäts-, Einladungs- und Benutzervertrag bestanden",
);
