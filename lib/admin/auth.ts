import { cookies } from "next/headers";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  readSessionToken,
  type SessionPayload,
} from "./session";

/**
 * Test-Zugang für die lokale Entwicklung. In Produktion greifen ausschließlich
 * ADMIN_EMAIL / ADMIN_PASSWORD aus der Umgebung.
 *
 * ponytail: ein einzelner Root-Account aus der Umgebung. Sobald es mehrere
 * Superadmins gibt, gehören sie in die Datenbank – mit scrypt-Hash pro Nutzer.
 */
export const DEV_CREDENTIALS = {
  email: "admin@gleistrix.de",
  password: "Gleistrix!2026",
} as const;

function credentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) return { email, password };

  if (process.env.NODE_ENV === "production") return null;
  return { ...DEV_CREDENTIALS };
}

/** Konstante Laufzeit über den Vergleich – die Länge selbst gilt als unkritisch. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const expected = credentials();
  if (!expected) {
    return {
      ok: false,
      error: "Adminzugang ist nicht konfiguriert (ADMIN_EMAIL / ADMIN_PASSWORD fehlen).",
    };
  }

  const emailMatches = timingSafeEqual(
    email.trim().toLowerCase(),
    expected.email.toLowerCase(),
  );
  const passwordMatches = timingSafeEqual(password, expected.password);
  if (!emailMatches || !passwordMatches) {
    return { ok: false, error: "E-Mail oder Passwort ist falsch." };
  }

  const token = await createSessionToken(expected.email);
  if (!token) {
    return {
      ok: false,
      error: "Sessions sind nicht konfiguriert (ADMIN_SESSION_SECRET fehlt).",
    };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return { ok: true };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}
