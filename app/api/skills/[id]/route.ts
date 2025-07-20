import { connectDB } from "@/lib/db";
import { Skill } from "@/lib/models/Skill";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const skill = await Skill.findById(params.id);
  return NextResponse.json(skill);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();
  const updated = await Skill.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Skill.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
