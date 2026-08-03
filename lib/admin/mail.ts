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

/** Ohne diese Werte kommt keine Verbindung zustande. */
const REQUIRED_ENV = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

/** Impliziertes TLS – bei allen anderen Ports wird per STARTTLS hochgestuft. */
const IMPLICIT_TLS_PORT = 465;

const DEFAULT_PORT = 587;

/**
 * Welche SMTP-Variablen fehlen – für die Anzeige im Adminbereich.
 * Gibt nur Variablennamen zurück, nie deren Werte.
 */
export function mailConfigIssue(): string | null {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length === 0) return null;

  return `SMTP ist nicht vollständig konfiguriert – es fehlt: ${missing.join(", ")}.`;
}

/** Absender und Empfänger der Website-Benachrichtigungen. */
export function mailFrom(): string {
  return process.env.SMTP_FROM || "noreply@gleistrix.com";
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

  const port = Number.parseInt(process.env.SMTP_PORT || String(DEFAULT_PORT), 10);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.isFinite(port) ? port : DEFAULT_PORT,
    secure: port === IMPLICIT_TLS_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
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
