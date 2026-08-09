type EmailAction = {
  href: string;
  label: string;
};

type EmailNotice = {
  bodyHtml: string;
  title: string;
};

type EmailWizardWrapperOptions = {
  action: EmailAction;
  bodyHtml: string;
  closingHtml: string;
  eyebrow: string;
  notice: EmailNotice;
  preheader: string;
  title: string;
};

const BRAND_LOGO_URL =
  "https://www.gleistrix.de/brand/gleistrix-email-logo.png";

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
 * Wiederverwendbare, E-Mail-Client-sichere Hülle für transaktionale Mails.
 *
 * Das Layout verwendet bewusst Präsentationstabellen und Inline-CSS. So bleibt
 * es auch in Outlook stabil, während die Media Query kleinere Displays
 * verdichtet. Dynamische Text- und Linkwerte werden hier escaped; die drei
 * *Html-Felder dürfen nur aus serverseitig erzeugtem, bereits sicherem Markup
 * bestehen.
 */
export function emailWizardWrapper({
  action,
  bodyHtml,
  closingHtml,
  eyebrow,
  notice,
  preheader,
  title,
}: EmailWizardWrapperOptions): string {
  const safeActionHref = escapeHtml(action.href);

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light; supported-color-schemes: light; }
      @media only screen and (max-width: 680px) {
        .email-outer { padding: 24px 12px !important; }
        .email-content { padding: 34px 24px 32px !important; }
        .email-brand { padding: 0 4px 16px !important; }
        .email-brand-meta { display: none !important; }
        .email-title { font-size: 27px !important; line-height: 34px !important; }
        .email-button-table { width: 100% !important; }
        .email-button-cell { width: 100% !important; }
        .email-button { display: block !important; text-align: center !important; }
        .email-footer { padding: 22px 16px 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#eef2f7; color:#172033; font-family:Arial, Helvetica, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; line-height:1px; font-size:1px; mso-hide:all;">
      ${escapeHtml(preheader)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#eef2f7" style="width:100%; border-collapse:collapse; background-color:#eef2f7;">
      <tr>
        <td class="email-outer" align="center" style="padding:42px 16px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:640px; border-collapse:separate;">
            <tr>
              <td class="email-brand" style="padding:0 8px 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td align="left" valign="middle">
                      <img src="${BRAND_LOGO_URL}" width="172" alt="Gleistrix" border="0" style="display:block; width:172px; max-width:100%; height:auto; border:0; outline:none; text-decoration:none; font-size:24px; line-height:30px; font-weight:700; color:#2563eb;" />
                    </td>
                    <td class="email-brand-meta" align="right" valign="middle" style="font-size:11px; line-height:16px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:#64748b;">
                      Sicherer Erstzugang
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td bgcolor="#ffffff" style="overflow:hidden; background-color:#ffffff; border:1px solid #dce3ed; border-radius:16px; box-shadow:0 14px 36px rgba(38, 51, 77, 0.10);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td bgcolor="#4f46e5" height="6" style="height:6px; background-color:#4f46e5; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td class="email-content" style="padding:48px 50px 44px;">
                      <p style="margin:0 0 14px; font-size:12px; line-height:18px; font-weight:700; letter-spacing:1.35px; text-transform:uppercase; color:#4f46e5;">
                        ${escapeHtml(eyebrow)}
                      </p>
                      <h1 class="email-title" style="margin:0 0 24px; font-size:32px; line-height:39px; font-weight:700; letter-spacing:-0.6px; color:#172033;">
                        ${escapeHtml(title)}
                      </h1>

                      <div style="font-size:16px; line-height:26px; color:#344054;">
                        ${bodyHtml}
                      </div>

                      <table class="email-button-table" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0 32px; border-collapse:separate;">
                        <tr>
                          <td class="email-button-cell" align="center" bgcolor="#4f46e5" style="background-color:#4f46e5; border-radius:12px; box-shadow:0 7px 16px rgba(79, 70, 229, 0.20);">
                            <a class="email-button" href="${safeActionHref}" target="_blank" style="display:inline-block; padding:15px 24px; font-size:16px; line-height:20px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:12px; white-space:nowrap;">
                              ${escapeHtml(action.label)}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7ff" style="width:100%; border-collapse:separate; background-color:#f5f7ff; border:1px solid #dfe3ff; border-radius:12px;">
                        <tr>
                          <td style="padding:20px 22px;">
                            <p style="margin:0 0 5px; font-size:14px; line-height:20px; font-weight:700; color:#3730a3;">
                              ${escapeHtml(notice.title)}
                            </p>
                            <div style="font-size:13px; line-height:20px; color:#56627a;">
                              ${notice.bodyHtml}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <div style="margin-top:30px; padding-top:26px; border-top:1px solid #e8ecf2; font-size:15px; line-height:23px; color:#344054;">
                        ${closingHtml}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-footer" align="center" style="padding:24px 28px 0; font-size:12px; line-height:19px; color:#7b879d;">
                Diese Nachricht wurde automatisch von Gleistrix versendet.<br />
                <a href="https://www.gleistrix.de" target="_blank" style="color:#59657a; text-decoration:underline;">www.gleistrix.de</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
