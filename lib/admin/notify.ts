import type { Company, NotificationTemplate, NotificationTrigger } from "@/types/admin";

import { mailConfigIssue, sendMail } from "./mail";
import {
  type PlaceholderValues,
  type TemplateDraft,
  renderNotification,
} from "./notification-templates";
import { listNotificationTemplates } from "./store";
import { APP_URL } from "./tenant";

/**
 * Versand der Benachrichtigungen – automatisch über einen Auslöser oder von
 * Hand mit einer gewählten Vorlage.
 *
 * Nur der Versand liegt hier. Platzhalter und Mailaufbau stehen in
 * notification-templates.ts, damit die Vorschau im Browser dieselbe Funktion
 * benutzt wie der echte Versand.
 */

export type NotifyResult = { sent: boolean; note: string };

/** Platzhalterwerte aus einem Mandanten – an einer Stelle, für alle Auslöser gleich. */
export function companyValues(company: Company, extra: PlaceholderValues = {}): PlaceholderValues {
  return {
    unternehmen: company.name,
    ansprechpartner: company.contactName,
    kennung: company.slug,
    app: APP_URL,
    datum: new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date()),
    ...extra,
  };
}

/**
 * Verschickt eine konkrete Vorlage.
 *
 * Wirft nicht: ein gescheiterter Mailversand darf den auslösenden Vorgang
 * (Einladung, Sperre, Kauf) nicht rückgängig machen – der ist zu diesem
 * Zeitpunkt bereits passiert. Das Ergebnis wird gemeldet, nicht geworfen.
 */
export async function sendTemplate(
  template: TemplateDraft,
  to: string,
  values: PlaceholderValues,
): Promise<NotifyResult> {
  const issue = mailConfigIssue();
  if (issue) return { sent: false, note: issue };

  const mail = renderNotification(template, values);

  try {
    await sendMail({ to, subject: mail.subject, text: mail.text, html: mail.html });
  } catch (error) {
    console.error(`Benachrichtigung an ${to} fehlgeschlagen:`, error);
    return { sent: false, note: `Die E-Mail an ${to} konnte nicht versendet werden.` };
  }

  return { sent: true, note: `Benachrichtigung an ${to} versendet.` };
}

/** Die aktive Vorlage eines Auslösers, oder nichts. */
export async function activeTemplateFor(
  trigger: NotificationTrigger,
): Promise<NotificationTemplate | null> {
  const templates = await listNotificationTemplates();
  // Mehrere aktive Vorlagen je Auslöser sind über die Oberfläche nicht
  // anlegbar; sollte es sie doch geben, gewinnt die zuletzt geänderte.
  return templates.find((template) => template.isActive && template.trigger === trigger) ?? null;
}

/**
 * Versendet die zum Auslöser hinterlegte Vorlage.
 *
 * Gibt es keine aktive Vorlage, greift `fallback` – sonst passiert nichts.
 * Ein Auslöser ohne Vorlage ist kein Fehler: der Admin hat sich dann bewusst
 * gegen diese Mail entschieden.
 */
export async function notify(input: {
  trigger: NotificationTrigger;
  to: string;
  values: PlaceholderValues;
  fallback?: TemplateDraft;
}): Promise<NotifyResult> {
  const template = (await activeTemplateFor(input.trigger)) ?? input.fallback;
  if (!template) {
    return { sent: false, note: "Für diesen Vorgang ist keine aktive Vorlage hinterlegt." };
  }

  return sendTemplate(template, input.to, input.values);
}
