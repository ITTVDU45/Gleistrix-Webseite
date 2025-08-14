import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Nachricht sind erforderlich' },
        { status: 400 }
      );
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const emailContent = `
Neue Kontaktanfrage von der Gleistrix-Website:

Name: ${name}
E-Mail: ${email}
Telefon: ${phone || 'Nicht angegeben'}

Nachricht:
${message}

---
Diese Nachricht wurde automatisch von der Gleistrix-Website gesendet.
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@gleistrix.com',
      to: process.env.CONTACT_EMAIL || 'info@gleistrix.com',
      subject: `Neue Kontaktanfrage von ${name}`,
      text: emailContent,
      replyTo: email,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Ihre Nachricht wurde erfolgreich gesendet!' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
