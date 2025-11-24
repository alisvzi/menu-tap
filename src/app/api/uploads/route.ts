import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

async function verifyToken(request: NextRequest) {
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) throw new Error("No token provided");

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key"
  ) as any;

  return decoded;
}

function sanitizeFileName(name: string) {
  const base = name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const time = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const parts = base.split(".");
  const ext = parts.length > 1 ? parts.pop() : undefined;
  const stem = parts.join(".");
  return ext ? `${stem}-${time}-${rand}.${ext}` : `${stem}-${time}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request).catch(() => null);
    const formData = await request.formData();
    const folder = (formData.get("folder") as string) || "";

    // Collect files from both 'file' and 'files' keys
    const files: File[] = [];
    const single = formData.get("file");
    if (single && typeof single !== "string") files.push(single as File);
    const multiples = formData.getAll("files");
    for (const f of multiples) {
      if (typeof f !== "string") files.push(f as File);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing BLOB token" }, { status: 500 });
    }

    const userId = decoded?.userId || "anonymous";

    const uploaded = [] as Array<{ url: string; name: string; size: number; type: string }>;

    for (const file of files) {
      const safeName = sanitizeFileName(file.name || "file");
      const key = [userId, folder].filter(Boolean).join("/");
      const nameWithPrefix = key ? `${key}/${safeName}` : safeName;

      const blob = await put(nameWithPrefix, file, {
        access: "public",
        token,
        addRandomSuffix: true,
        contentType: file.type || "application/octet-stream",
      });

      uploaded.push({
        url: blob.url,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({ files: uploaded }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error?.message },
      { status: 500 }
    );
  }
}
