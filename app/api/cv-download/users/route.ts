import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CVDownload from '@/lib/models/CVDownload';

// GET - Fetch all CV download users
export async function GET() {
  try {
    await connectDB();

    // Fetch all users, sorted by creation date (newest first)
    const users = await CVDownload.find({})
      .select('-otp -otpExpiry') // Exclude sensitive fields
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching CV download users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
