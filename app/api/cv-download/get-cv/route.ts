import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CVDownload from '@/lib/models/CVDownload';
import { Profile } from '@/lib/models/Profile';

// GET - Download CV (only for verified users)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists and is verified
    const user = await CVDownload.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please complete verification first.' },
        { status: 404 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: 'Email not verified. Please verify your email first.' },
        { status: 403 }
      );
    }

    // Update download count and timestamp
    user.downloadCount = (user.downloadCount || 0) + 1;
    user.lastDownloadAt = new Date();
    await user.save();

    // Get CV URL from profile
    const profile = await Profile.findOne();
    
    if (!profile?.resumeUrl) {
      return NextResponse.json(
        { error: 'CV not available. Please contact the administrator.' },
        { status: 404 }
      );
    }

    // Fetch CV from Cloudinary URL
    const response = await fetch(profile.resumeUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch CV file.' },
        { status: 500 }
      );
    }

    const fileBuffer = await response.arrayBuffer();

    // Return the file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Raj_Rabidas_CV.pdf"',
      },
    });
  } catch (error) {
    console.error('Error downloading CV:', error);
    return NextResponse.json(
      { error: 'Failed to download CV. Please try again.' },
      { status: 500 }
    );
  }
}
