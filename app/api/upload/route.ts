import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { Readable } from "stream";

// Cloudinary config (replace with env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string; // e.g., "profile" or "resume"

  if (!file || !name) {
    return NextResponse.json({ error: "Missing file or name" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const stream = Readable.from(buffer);

  // Use a unique public_id to avoid accidental overwrite and caching issues
  const uniquePublicId = `${name}-${Date.now()}`;

  const uploadPromise = (): Promise<UploadApiResponse> =>
    new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "uploads",
          public_id: uniquePublicId,
          overwrite: false,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            const e = error as unknown;
            const msg = typeof (e as { message?: unknown }).message === 'string'
              ? (e as { message?: string }).message
              : String(e);
            reject(new Error(msg));
          } else if (result) resolve(result);
          else reject(new Error("Unknown Cloudinary error"));
        }
      );

      stream.pipe(uploadStream);
    });

  try {
    const result = await uploadPromise();

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    const error = err as UploadApiErrorResponse | Error;

    return NextResponse.json(
      {
        error: "Cloudinary upload failed",
        details: "message" in error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
