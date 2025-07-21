import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { NextResponse } from "next/server";

// GET /api/projects/:id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
// PUT /api/projects/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const body = await req.json();

    // Handle tags: convert string to array if needed
    let tags: string[] = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags;
    } else if (typeof body.tags === 'string') {
      tags = body.tags.split(',').map((tag: string) => tag.trim());
    }

    const updated = await Project.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        description: body.description,
        github: body.github,
        liveDemo: body.liveDemo,
        image: body.image, // ✅ fixed here
        tags,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}


// DELETE /api/projects/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const deleted = await Project.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
