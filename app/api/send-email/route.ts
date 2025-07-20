// app/api/send-email/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { user_email, user_name, subject, message } = await req.json();

  // ✅ Define your transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL, // your Gmail
      pass: process.env.SMTP_PASSWORD, // app password
    },
  });

  const mailOptions = {
    from: user_email,
    to: process.env.SMTP_EMAIL, // your Gmail
    subject: `${subject} - from ${user_name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error sending email:', err);
    return NextResponse.json({ success: false, error: 'Email failed to send' }, { status: 500 });
  }
}
