import { connectDB } from "@/lib/db";
import { Skill } from "@/lib/models/Skill";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const skills = await Skill.find().sort({ createdAt: -1 });
  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const skill = await Skill.create(body);
  return NextResponse.json(skill, { status: 201 });
}
