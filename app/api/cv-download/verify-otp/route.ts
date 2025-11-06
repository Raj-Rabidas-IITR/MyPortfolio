import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CVDownload from '@/lib/models/CVDownload';

// POST - Verify OTP
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find user with OTP
    const user = await CVDownload.findOne({ email }).select('+otp +otpExpiry');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please request a new OTP.' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.verified) {
      return NextResponse.json({
        message: 'Email already verified',
        verified: true,
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify user
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: 'Email verified successfully! You can now download the CV.',
      verified: true,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}
