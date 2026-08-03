/**
 * Signierte Session-Token ohne externe Auth-Bibliothek.
 *
 * Bewusst nur WebCrypto (kein `node:crypto`), damit dieselbe Datei sowohl in
 * der Middleware (Edge Runtime) als auch in Server Actions läuft.
 */

export const SESSION_COOKIE = "gx_admin";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  sub: string;
  exp: number;
};

const DEV_SECRET = "gleistrix-dev-only-secret-nicht-in-produktion";

/**
 * In Produktion ist ADMIN_SESSION_SECRET Pflicht – fehlt es, gibt es keine
 * gültige Session (statt still auf ein bekanntes Secret zurückzufallen).
 */
export function sessionSecret(): string | null {
  const fromEnv = process.env.ADMIN_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;
  return process.env.NODE_ENV === "production" ? null : DEV_SECRET;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  // Explizit über `new Uint8Array`, damit der Puffer als ArrayBuffer typisiert
  // ist – `Uint8Array.from` liefert ArrayBufferLike und passt nicht auf BufferSource.
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(subject: string): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    sub: subject,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret),
    new TextEncoder().encode(body),
  );

  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function readSessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  const secret = sessionSecret();
  if (!secret || !token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  let isValid: boolean;
  try {
    isValid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromBase64Url(signature),
      new TextEncoder().encode(body),
    );
  } catch {
    return null;
  }
  if (!isValid) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(body)),
    ) as SessionPayload;

    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
