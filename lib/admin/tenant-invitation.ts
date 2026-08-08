import type { Company } from "@/types/admin";

import type { MailOptions } from "./mail";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

/**
 * Einladungsmail für den Erstbenutzer eines frisch provisionierten Mandanten.
 *
 * Es wird bewusst kein temporäres Passwort versendet. Der signierte,
 * einmalig verwendbare Link führt direkt zur Passwortvergabe in der App.
 */
export function tenantInvitationMail(company: Company, link: string): MailOptions {
  const greeting = company.contactName
    ? `Guten Tag ${company.contactName},`
    : "Guten Tag,";
  const safeGreeting = escapeHtml(greeting);
  const safeCompany = escapeHtml(company.name);
  const safeLink = escapeHtml(link);

  return {
    to: company.contactEmail,
    subject: `Ihr Zugang zu Gleistrix – ${company.name}`,
    text: [
      greeting,
      "",
      `Ihr Zugang für ${company.name} steht bereit.`,
      "Über den folgenden einmaligen Link legen Sie Ihr persönliches Passwort fest:",
      "",
      link,
      "",
      "Der Link kann nur einmal verwendet werden. Bitte geben Sie ihn nicht weiter.",
      "",
      "Mit freundlichen Grüßen",
      "Ihr Gleistrix-Team",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #172033;">
        <h1 style="font-size: 24px; margin: 0 0 20px;">Willkommen bei Gleistrix</h1>
        <p>${safeGreeting}</p>
        <p>
          Ihr Zugang für <strong>${safeCompany}</strong> steht bereit.
          Legen Sie jetzt über den einmaligen Link Ihr persönliches Passwort fest.
        </p>
        <p style="margin: 28px 0;">
          <a href="${safeLink}" style="display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; padding: 13px 20px; border-radius: 8px; font-weight: 600;">
            Passwort festlegen
          </a>
        </p>
        <p style="font-size: 13px; color: #667085;">
          Der Link kann nur einmal verwendet werden. Falls die Schaltfläche nicht funktioniert:<br />
          <span style="word-break: break-all;">${safeLink}</span>
        </p>
        <p>Mit freundlichen Grüßen<br /><strong>Ihr Gleistrix-Team</strong></p>
      </div>
    `,
  };
}
