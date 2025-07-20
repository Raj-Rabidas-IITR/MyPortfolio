import { connectDB } from "@/lib/db";
import { Education } from "@/lib/models/Education";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const newEdu = await Education.create(body);
    return NextResponse.json(newEdu, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create education entry" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const education = await Education.find().sort({ year: -1 });
    return NextResponse.json(education);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}
