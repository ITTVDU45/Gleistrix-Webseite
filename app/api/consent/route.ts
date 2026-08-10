/**
 * Nimmt Einwilligungsentscheidungen entgegen, dokumentiert sie als Nachweis
 * (Art. 7 Abs. 1 DSGVO) und setzt den Consent-Cookie serverseitig neu.
 *
 * Der Browser setzt den Cookie bereits selbst, damit die Entscheidung sofort
 * wirkt – auch offline oder bei einem Fehler hier. Dieser Endpunkt bestätigt
 * sie autoritativ mit sauberen Attributen und schreibt den Nachweis.
 */

import {
  buildConsentProofRecord,
  persistConsentProof,
} from "@/lib/consent/record";
import {
  buildConsentCookieHeader,
  validateConsentState,
} from "@/lib/consent/state";

export const runtime = "nodejs";

/** Grenze gegen aufgeblähte Anfragen; eine echte Entscheidung ist wenige hundert Byte groß. */
const MAX_BODY_BYTES = 4096;

function readPage(payload: Record<string, unknown>): string | null {
  const page = payload.page;

  // Nur seiteninterne Pfade: ein absoluter Fremd-URL im Nachweis wäre eine
  // vom Client bestimmte Angabe über einen fremden Ort.
  return typeof page === "string" && page.startsWith("/") ? page : null;
}

/**
 * Hinter einem Proxy ist `request.url` intern http — der tatsächlich vom
 * Browser genutzte Protokollwert steht in `x-forwarded-proto`.
 */
function isSecureRequest(request: Request): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }

  return new URL(request.url).protocol === "https:";
}

function fail(message: string, status: number) {
  return Response.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);

  if (declaredLength > MAX_BODY_BYTES) {
    return fail("Die Anfrage ist zu groß.", 413);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return fail("Die Anfrage konnte nicht gelesen werden.", 400);
  }

  if (!payload || typeof payload !== "object") {
    return fail("Die Anfrage ist ungültig.", 400);
  }

  const body = payload as Record<string, unknown>;
  const state = validateConsentState(body.consent);

  if (!state) {
    return fail("Die Einwilligung ist ungültig.", 400);
  }

  const record = buildConsentProofRecord(state, request, readPage(body));

  try {
    await persistConsentProof(record);
  } catch (error) {
    // Die Entscheidung des Nutzers gilt trotzdem – sie steht bereits im
    // Browser-Cookie. Nur der Nachweis konnte nicht abgelegt werden.
    console.error("Einwilligungsnachweis konnte nicht gespeichert werden", error);

    return fail("Der Nachweis konnte nicht gespeichert werden.", 500);
  }

  return Response.json(
    { ok: true, consentId: state.id },
    {
      headers: {
        "Set-Cookie": buildConsentCookieHeader(state, {
          secure: isSecureRequest(request),
        }),
      },
    },
  );
}
