import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import formidable from "formidable";
import { IncomingForm } from "formidable";
import { Readable } from "stream";

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Custom parser function
async function parseForm(req: Request): Promise<{ fields: any; files: any }> {
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    uploadDir: "/tmp",
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Convert Request -> Readable for formidable
async function toReadableStream(req: Request): Promise<Readable> {
  const reader = req.body?.getReader();
  const stream = new Readable({ read() {} });

  async function pump() {
    const { done, value } = await reader!.read();
    if (done) return stream.push(null);
    stream.push(value);
    await pump();
  }

  pump();
  return stream;
}

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
