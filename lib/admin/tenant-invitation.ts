import type { Company } from "@/types/admin";

import { emailWizardWrapper } from "./email-wizard-wrapper";
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
    subject: `Ihr Zugang zu Gleistrix - ${company.name}`,
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
    html: emailWizardWrapper({
      preheader: `Ihr persönlicher Zugang für ${company.name} ist bereit.`,
      eyebrow: "Persönlicher Erstzugang",
      title: "Willkommen bei Gleistrix",
      bodyHtml: `
        <p style="margin:0 0 16px;">${safeGreeting}</p>
        <p style="margin:0;">
          Ihr Zugang für <strong style="color:#172033;">${safeCompany}</strong> ist vorbereitet.
          Legen Sie jetzt Ihr persönliches Passwort fest.
        </p>
      `,
      action: {
        href: link,
        label: "Passwort festlegen",
      },
      notice: {
        title: "Einmalig und vertraulich",
        bodyHtml: `
          Der Link kann nur einmal verwendet werden. Bitte geben Sie ihn nicht weiter.<br />
          Falls die Schaltfläche nicht funktioniert, öffnen Sie den
          <a href="${safeLink}" target="_blank" style="color:#4338ca; font-weight:700; text-decoration:underline;">Einladungslink im Browser</a>.
        `,
      },
      closingHtml: `
        <p style="margin:0;">Mit freundlichen Grüßen</p>
        <p style="margin:2px 0 0; font-weight:700; color:#172033;">Ihr Gleistrix-Team</p>
      `,
    }),
  };
}
