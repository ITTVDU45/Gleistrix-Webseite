import { NextRequest, NextResponse } from 'next/server';

import { contactRecipient, mailConfigIssue, sendMail } from '@/lib/admin/mail';
import { insertBrochureRequest, insertLead } from '@/lib/admin/store';
import type { BrochureRequest, Lead, LeadKind } from '@/types/admin';

/**
 * Eingang aller Website-Anfragen: Kontakt, Demo, Termin, Broschüre.
 *
 * Reihenfolge ist Absicht – erst speichern, dann mailen. Ein ausgefallener
 * SMTP-Server darf keine Anfrage verschlucken; der Adminbereich liest den
 * Datensatz unabhängig vom Mailversand.
 */

/** "broschuere" ist kein LeadKind (types/admin.ts) – die Anfrage wird als Kontakt geführt. */
type RequestKind = LeadKind | 'broschuere';

const KINDS: readonly RequestKind[] = ['demo', 'termin', 'kontakt', 'broschuere'];

const LABELS: Record<RequestKind, string> = {
  demo: 'Demo-Anfrage',
  termin: 'Terminwunsch',
  kontakt: 'Kontaktanfrage',
  broschuere: 'Broschürenanfrage',
};

/** Grenzen gegen aufgeblähte Datensätze; großzügig genug für echte Anfragen. */
const MAX_SHORT = 200;
const MAX_MESSAGE = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, limit: number): string {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function parseKind(value: unknown): RequestKind {
  return KINDS.includes(value as RequestKind) ? (value as RequestKind) : 'kontakt';
}

export async function POST(request: NextRequest) {
  let lead: Lead;
  let kind: RequestKind;

  try {
    const body = await request.json();

    const name = text(body?.name, MAX_SHORT);
    const email = text(body?.email, MAX_SHORT);
    const phone = text(body?.phone, MAX_SHORT);
    const company = text(body?.company, MAX_SHORT);
    const message = text(body?.message, MAX_MESSAGE);
    kind = parseKind(body?.kind);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Nachricht sind erforderlich' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();
    // Zeitstempel plus Zufall: zwei Anfragen in derselben Millisekunde würden
    // sonst über die _id kollidieren.
    const id = `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

    lead = {
      id,
      kind: kind === 'broschuere' ? 'kontakt' : kind,
      company: company || 'Ohne Firmenangabe',
      contactName: name,
      email,
      phone: phone || undefined,
      message,
      status: 'neu',
      createdAt,
    };

    await insertLead(lead);

    if (kind === 'broschuere') {
      const brochure: BrochureRequest = {
        id: `bro_${id.slice('lead_'.length)}`,
        company: lead.company,
        contactName: name,
        email,
        createdAt,
      };
      await insertBrochureRequest(brochure);
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }

  // Ab hier ist die Anfrage gesichert. Der Mailversand ist nur noch die
  // Benachrichtigung – ein Fehler wird protokolliert, nicht zurückgemeldet.
  const configIssue = mailConfigIssue();

  if (configIssue) {
    console.warn(`Anfrage ${lead.id} gespeichert, aber nicht versendet: ${configIssue}`);
  } else {
    try {
      await sendMail({
        to: contactRecipient(),
        replyTo: lead.email,
        subject: `Neue ${LABELS[kind]} von ${lead.contactName}`,
        text: [
          `Neue ${LABELS[kind]} von der Gleistrix-Website:`,
          '',
          `Name: ${lead.contactName}`,
          `Firma: ${lead.company}`,
          `E-Mail: ${lead.email}`,
          `Telefon: ${lead.phone || 'Nicht angegeben'}`,
          '',
          'Nachricht:',
          lead.message ?? '',
          '',
          '---',
          `Vorgang ${lead.id} – im Adminbereich unter /admin/anfragen.`,
        ].join('\n'),
      });
    } catch (error) {
      console.error(`Mailversand für Anfrage ${lead.id} fehlgeschlagen:`, error);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Ihre Nachricht wurde erfolgreich gesendet!',
  });
}
