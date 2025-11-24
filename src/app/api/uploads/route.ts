import fs from "fs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

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

    // Build target directory under public/uploads/{userId}/{folder}
    const userId = decoded?.userId || "anonymous";
    const baseDir = path.join(process.cwd(), "public", "uploads", userId);
    const targetDir = folder ? path.join(baseDir, folder) : baseDir;

    await fs.promises.mkdir(targetDir, { recursive: true });

    const saved = [] as Array<{
      url: string;
      name: string;
      size: number;
      type: string;
    }>;

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = sanitizeFileName(file.name || "file");
      const diskPath = path.join(targetDir, safeName);
      await fs.promises.writeFile(diskPath, buffer);

      const publicUrl = path
        .join("/uploads", userId, folder || "", safeName)
        .replace(/\\/g, "/");

      saved.push({
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({ files: saved }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error?.message },
      { status: 500 }
    );
  }
}
