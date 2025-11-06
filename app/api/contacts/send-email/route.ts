import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Contact from '@/lib/models/Contact';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { contactId, replyMessage } = body;

    if (!contactId || !replyMessage) {
      return NextResponse.json(
        { error: 'Contact ID and reply message are required' },
        { status: 400 }
      );
    }

    // Fetch contact details
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: `Re: Your message from ${contact.name}`,
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${contact.name},</p>
        <p>${replyMessage}</p>
        <br/>
        <hr/>
        <p><strong>Your original message:</strong></p>
        <p>${contact.message}</p>
        <br/>
        <p>Best regards,<br/>Your Portfolio Team</p>
      `,
    });

    // Update contact status to resolved
    await Contact.findByIdAndUpdate(contactId, { status: 'resolved' });

    return NextResponse.json({
      message: 'Email sent successfully and status updated to resolved',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
