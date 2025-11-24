import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Missing BLOB token" }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    const urls: string[] = Array.isArray(body?.urls) ? body.urls : [];

    if (!urls.length) {
      return NextResponse.json({ error: "No urls provided" }, { status: 400 });
    }

    const results: Array<{ url: string; ok: boolean; error?: string }> = [];
    for (const url of urls) {
      try {
        await del(url, { token });
        results.push({ url, ok: true });
      } catch (e: any) {
        results.push({ url, ok: false, error: e?.message || "Delete failed" });
      }
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error: any) {
    console.error("Blob delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
