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

  const profile = await Profile.findOneAndUpdate(
    {},         // match any document
    body,       // update with new data
    { upsert: true, new: true } // create if not exists, return updated doc
  );
  console.log("Profile updated:", profile);

  return NextResponse.json(profile);
}

