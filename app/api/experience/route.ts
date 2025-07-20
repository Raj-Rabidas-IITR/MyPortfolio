import { connectDB } from "@/lib/db";
import { Experience } from "@/lib/models/Experience";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const newExp = await Experience.create(body);
    return NextResponse.json(newExp, { status: 201 });
  } catch (err) {
    console.error("CREATE EXPERIENCE ERROR:", err);  // 👈 Add this
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}


export async function GET() {
  await connectDB();
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    return NextResponse.json(experiences);
  } catch {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}
