import { connectDB } from "@/lib/db";
import { Experience } from "@/lib/models/Experience";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const exp = await Experience.findById(params.id);
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(exp);
  } catch {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const body = await req.json();
    const updated = await Experience.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    await Experience.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
