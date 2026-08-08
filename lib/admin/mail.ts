import nodemailer from "nodemailer";

/**
 * Mailversand über den konfigurierten SMTP-Server.
 *
 * Nur auf dem Server verwenden – die Zugangsdaten stehen in der Umgebung und
 * dürfen weder gebündelt noch protokolliert werden.
 *
 * ponytail: eine dünne Schicht um nodemailer statt einer Mail-Abstraktion.
 * Ein Transport, zwei Aufrufer. Mehr lohnt sich erst mit Vorlagen oder
 * Warteschlange.
 */

/** Impliziertes TLS – bei allen anderen Ports wird per STARTTLS hochgestuft. */
const IMPLICIT_TLS_PORT = 465;

const DEFAULT_PORT = 587;

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value?.trim()) return value.trim();
  }
  return undefined;
}

function smtpConfig() {
  return {
    host: firstEnv("SMTP_HOST", "EMAIL_HOST"),
    port: firstEnv("SMTP_PORT", "EMAIL_PORT"),
    user: firstEnv("SMTP_USER", "EMAIL_USER"),
    pass: firstEnv("SMTP_PASS", "EMAIL_PASS"),
    secure: firstEnv("SMTP_SECURE", "EMAIL_SECURE"),
  };
}

/**
 * Welche SMTP-Variablen fehlen – für die Anzeige im Adminbereich.
 * Gibt nur Variablennamen zurück, nie deren Werte.
 */
export function mailConfigIssue(): string | null {
  const config = smtpConfig();
  const missing = [
    config.host ? null : "SMTP_HOST/EMAIL_HOST",
    config.user ? null : "SMTP_USER/EMAIL_USER",
    config.pass ? null : "SMTP_PASS/EMAIL_PASS",
  ].filter((name): name is string => Boolean(name));
  if (missing.length === 0) return null;

  return `SMTP ist nicht vollständig konfiguriert – es fehlt: ${missing.join(", ")}.`;
}

/** Absender und Empfänger der Website-Benachrichtigungen. */
export function mailFrom(): string {
  const address = firstEnv("SMTP_FROM", "EMAIL_FROM") || "noreply@gleistrix.com";
  const name = firstEnv("SMTP_FROM_NAME", "EMAIL_FROM_NAME");
  return name ? `${name} <${address}>` : address;
}

export function contactRecipient(): string {
  return process.env.CONTACT_EMAIL || "info@gleistrix.com";
}

/**
 * Herkunft der Produktbroschüre.
 *
 * Im Repository liegt keine PDF: entweder wird eine Datei vom Server angehängt
 * (BROCHURE_FILE_PATH) oder es geht ein Link raus (BROCHURE_FILE_URL). Fehlen
 * beide, wird nur der Text verschickt.
 */
export function brochureFile(): { path: string | null; url: string | null } {
  return {
    path: process.env.BROCHURE_FILE_PATH || null,
    url: process.env.BROCHURE_FILE_URL || null,
  };
}

export type MailAttachment = { filename: string; path: string };

export type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
};

/** Ein Transport je Prozess – der Verbindungsaufbau je Mail wäre reine Latenz. */
let transporter: nodemailer.Transporter | null = null;

function transport(): nodemailer.Transporter {
  if (transporter) return transporter;

  const config = smtpConfig();
  const port = Number.parseInt(config.port || String(DEFAULT_PORT), 10);
  const secure = config.secure
    ? config.secure.toLowerCase() === "true"
    : port === IMPLICIT_TLS_PORT;
  transporter = nodemailer.createTransport({
    host: config.host,
    port: Number.isFinite(port) ? port : DEFAULT_PORT,
    secure,
    auth: { user: config.user, pass: config.pass },
  });

  return transporter;
}

/**
 * Verschickt eine Mail. Wirft, wenn der Versand scheitert – der Aufrufer
 * entscheidet, ob das den Vorgang scheitern lässt.
 */
export async function sendMail(options: MailOptions): Promise<void> {
  const issue = mailConfigIssue();
  if (issue) throw new Error(issue);

  await transport().sendMail({ from: mailFrom(), ...options });
}
