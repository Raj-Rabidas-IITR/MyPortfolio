import { connectDB } from "@/lib/db";
import { Profile } from "@/lib/models/Profile";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne();
  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  let profile = await Profile.findOne();

  if (profile) {
    await Profile.updateOne({}, body);
  } else {
    profile = await Profile.create(body);
  }

  return NextResponse.json(profile);
}
