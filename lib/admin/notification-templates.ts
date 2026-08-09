import type {
  CompanyUserRole,
  NotificationTemplate,
  NotificationTrigger,
} from "@/types/admin";

// Endung ausgeschrieben, damit `node lib/admin/notification-templates.check.ts`
// den Import auflösen kann; Bundler und tsc (allowImportingTsExtensions) auch.
import { emailWizardWrapper } from "./email-wizard-wrapper.ts";

/**
 * Platzhalter, Rendering und Mailaufbau der Benachrichtigungsvorlagen.
 *
 * Diese Datei ist bewusst FREI von Serverabhängigkeiten (kein nodemailer, kein
 * Datenbankzugriff). Nur so kann das Vorlagen-Popup die Vorschau im Browser
 * live erzeugen, ohne für jeden Tastendruck eine Server Action zu rufen.
 * Der Versand liegt daneben in lib/admin/notify.ts.
 */

/* --------------------------------------------------------------- Platzhalter */

export type PlaceholderKey =
  | "unternehmen"
  | "ansprechpartner"
  | "name"
  | "email"
  | "rolle"
  | "link"
  | "paket"
  | "kennung"
  | "app"
  | "datum";

export type Placeholder = {
  key: PlaceholderKey;
  label: string;
  /** Beispielwert – steht in der Vorschau und im Titel des Chips. */
  example: string;
};

export const PLACEHOLDERS: Placeholder[] = [
  { key: "unternehmen", label: "Name des Unternehmens", example: "Muster Bau GmbH" },
  { key: "ansprechpartner", label: "Ansprechpartner des Unternehmens", example: "Petra Muster" },
  { key: "name", label: "Name des Empfängers", example: "Jonas Weber" },
  { key: "email", label: "E-Mail des Empfängers", example: "j.weber@muster-bau.de" },
  { key: "rolle", label: "Rolle des Empfängers", example: "Administrator" },
  {
    key: "link",
    label: "Einladungs- oder Zielverweis",
    example: "https://app.gleistrix.de/auth/set-password?token=…",
  },
  { key: "paket", label: "Zugewiesenes Paket", example: "Professional" },
  { key: "kennung", label: "Mandantenkennung", example: "muster-bau" },
  { key: "app", label: "Adresse der Anwendung", example: "https://app.gleistrix.de" },
  { key: "datum", label: "Heutiges Datum", example: "9. August 2026" },
];

export type PlaceholderValues = Partial<Record<PlaceholderKey, string>>;

/** Beispielwerte für die Vorschau – aus dem Katalog, damit beides nie auseinanderläuft. */
export function sampleValues(): PlaceholderValues {
  return Object.fromEntries(
    PLACEHOLDERS.map((placeholder) => [placeholder.key, placeholder.example]),
  ) as PlaceholderValues;
}

/* ------------------------------------------------------------------ Auslöser */

export type TriggerInfo = {
  id: NotificationTrigger;
  label: string;
  description: string;
};

export const TRIGGERS: TriggerInfo[] = [
  {
    id: "nutzer.eingeladen",
    label: "Nutzer eingeladen",
    description:
      "Ein weiterer Nutzer wurde einem Unternehmen hinzugefügt. {{link}} enthält den einmaligen Passwortlink.",
  },
  {
    id: "unternehmen.gesperrt",
    label: "Zugang gesperrt",
    description: "Der Zugang eines Unternehmens wurde gesperrt.",
  },
  {
    id: "unternehmen.entsperrt",
    label: "Sperre aufgehoben",
    description: "Der Zugang eines Unternehmens wurde wieder freigegeben.",
  },
  {
    id: "kauf.freigegeben",
    label: "Kauf freigegeben",
    description: "Ein Kauf wurde erfolgreich an die App gemeldet.",
  },
];

export function triggerLabel(trigger: NotificationTrigger | null): string {
  if (!trigger) return "Nur manueller Versand";
  return TRIGGERS.find((entry) => entry.id === trigger)?.label ?? trigger;
}

export function isTrigger(value: string): value is NotificationTrigger {
  return TRIGGERS.some((entry) => entry.id === value);
}

/* -------------------------------------------------------------------- Rollen */

export const ROLE_LABEL: Record<CompanyUserRole, string> = {
  superadmin: "Superadmin",
  admin: "Administrator",
  user: "Benutzer",
  lager: "Lager",
};

export const ROLE_HINT: Record<CompanyUserRole, string> = {
  superadmin: "Voller Zugriff inklusive Benutzerverwaltung",
  admin: "Verwaltet Projekte, Personal und Auswertungen",
  user: "Arbeitet in den freigegebenen Modulen",
  lager: "Zugriff auf Lager und Material",
};

export const COMPANY_USER_ROLES: CompanyUserRole[] = ["superadmin", "admin", "user", "lager"];

export function isCompanyUserRole(value: string): value is CompanyUserRole {
  return (COMPANY_USER_ROLES as string[]).includes(value);
}

/* ----------------------------------------------------------------- Rendering */

const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z]+)\s*\}\}/g;

/**
 * Ersetzt {{platzhalter}} durch die übergebenen Werte.
 *
 * Unbekannte oder unbefüllte Platzhalter bleiben WÖRTLICH stehen. Sie still zu
 * leeren erzeugte Sätze wie „Ihr Zugang für  ist bereit." – ein sichtbares
 * {{unternehmen}} in der Vorschau ist der ehrlichere Hinweis.
 */
export function renderPlaceholders(text: string, values: PlaceholderValues): string {
  return text.replace(PLACEHOLDER_PATTERN, (match, key: string) => {
    const value = values[key as PlaceholderKey];
    return value && value.length > 0 ? value : match;
  });
}

/** Welche Platzhalter im Text stehen, die der Katalog nicht kennt. */
export function unknownPlaceholders(...texts: string[]): string[] {
  const known = new Set<string>(PLACEHOLDERS.map((placeholder) => placeholder.key));
  const found = new Set<string>();

  for (const text of texts) {
    for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
      if (!known.has(match[1])) found.add(match[1]);
    }
  }

  return [...found];
}

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
 * Fließtext zu Absätzen.
 *
 * Der Admin schreibt reinen Text, kein HTML – deshalb wird hier escaped. Eine
 * Leerzeile trennt Absätze, ein einfacher Umbruch bleibt ein Umbruch. Ohne das
 * käme die Mail als eine einzige Textwand an.
 */
export function bodyToHtml(body: string): string {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  if (paragraphs.length === 0) return "";

  return paragraphs
    .map((block, index) => {
      const content = escapeHtml(block).replace(/\n/g, "<br />");
      const margin = index === paragraphs.length - 1 ? "0" : "0 0 16px";
      return `<p style="margin:${margin};">${content}</p>`;
    })
    .join("\n");
}

export type RenderedMail = {
  subject: string;
  html: string;
  text: string;
};

/** Der Teil einer Vorlage, aus dem die Mail entsteht – auch ungespeichert. */
export type TemplateDraft = Pick<
  NotificationTemplate,
  "subject" | "eyebrow" | "title" | "body" | "actionLabel" | "actionUrl"
>;

/**
 * Baut aus Vorlage und Werten die fertige Mail.
 *
 * Dieselbe Funktion versorgt Vorschau und Versand. Zwei Wege wären zwei
 * Wahrheiten – die Vorschau zeigte dann etwas anderes, als beim Kunden ankommt.
 */
export function renderNotification(
  template: TemplateDraft,
  values: PlaceholderValues,
): RenderedMail {
  const subject = renderPlaceholders(template.subject, values);
  const title = renderPlaceholders(template.title, values);
  const eyebrow = renderPlaceholders(template.eyebrow, values);
  const body = renderPlaceholders(template.body, values);

  const actionLabel = renderPlaceholders(template.actionLabel, values).trim();
  const actionHref = renderPlaceholders(template.actionUrl, values).trim();
  // Ein Knopf ohne Ziel führt ins Leere; ein Ziel ohne Beschriftung ist unklickbar.
  const action = actionLabel && actionHref ? { label: actionLabel, href: actionHref } : undefined;

  return {
    subject,
    html: emailWizardWrapper({
      preheader: subject,
      eyebrow: eyebrow || "Gleistrix",
      title: title || subject,
      bodyHtml: bodyToHtml(body),
      action,
      closingHtml: `
        <p style="margin:0;">Mit freundlichen Grüßen</p>
        <p style="margin:2px 0 0; font-weight:700; color:#172033;">Ihr Gleistrix-Team</p>
      `,
    }),
    text: [
      body,
      action ? `\n${action.label}: ${action.href}` : "",
      "\nMit freundlichen Grüßen\nIhr Gleistrix-Team",
    ]
      .filter((part) => part.length > 0)
      .join("\n"),
  };
}

/**
 * Eingebaute Einladungsmail, falls für „Nutzer eingeladen" keine aktive Vorlage
 * hinterlegt ist.
 *
 * Steht bewusst hier und nicht in den Server Actions: Vorschau und Versand
 * müssen denselben Text benutzen, sonst zeigt das Popup etwas anderes, als beim
 * Eingeladenen ankommt.
 */
export const INVITE_FALLBACK_TEMPLATE: TemplateDraft = {
  subject: "Ihr Zugang zu Gleistrix – {{unternehmen}}",
  eyebrow: "Persönlicher Zugang",
  title: "Willkommen bei Gleistrix",
  body: [
    "Guten Tag {{name}},",
    "",
    "für Sie wurde ein Zugang zu Gleistrix für {{unternehmen}} eingerichtet. Ihre Rolle: {{rolle}}.",
    "",
    "Über den folgenden einmaligen Link legen Sie Ihr persönliches Passwort fest. Bitte geben Sie ihn nicht weiter.",
  ].join("\n"),
  actionLabel: "Passwort festlegen",
  actionUrl: "{{link}}",
};

/** Leere Vorlage für das „Neu"-Popup. */
export function emptyTemplate(): TemplateDraft &
  Pick<NotificationTemplate, "name" | "trigger" | "isActive"> {
  return {
    name: "",
    trigger: null,
    subject: "",
    eyebrow: "Nachricht von Gleistrix",
    title: "",
    body: "",
    actionLabel: "",
    actionUrl: "",
    isActive: false,
  };
}
