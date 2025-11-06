import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Note: this route uses the simpler Request.formData() approach in most handlers.
// The formidable-based parser was removed because it was unused and caused lint errors.

export async function POST(req: Request) {
  const uploadDir = join(process.cwd(), "/public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string; // like "profile" or "resume"

  if (!file || !name) {
    return NextResponse.json({ error: "Missing file or name" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExt = file.name.split(".").pop();
  const fileName = `${name}.${fileExt}`;
  const filePath = join(uploadDir, fileName);

  await writeFile(filePath, buffer);
  return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
}
