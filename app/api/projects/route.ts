import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    // Handle tags: if it's a string, convert to array
    let tags: string[] = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags;
    } else if (typeof body.tags === 'string') {
      tags = body.tags.split(',').map((tag: string) => tag.trim());
    }

    const newProject = await Project.create({
      title: body.title,
      description: body.description,
      github: body.github,
      liveDemo: body.liveDemo,
      image: body.image, // should be a full URL or path from upload
      tags,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (err) {
    console.error("Failed to create project:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
