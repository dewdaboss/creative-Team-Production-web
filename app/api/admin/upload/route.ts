import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth";
import { extensionFor, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, uploadGalleryMedia } from "@/lib/gallery";
import { supabaseEnabled } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEGACY_ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
};

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file attached." }, { status: 400 });
  }

  const kind = extensionFor(file.type);
  if (!kind) {
    return NextResponse.json(
      { ok: false, error: "Only JPG/PNG/WebP/GIF images or MP4/WebM/MOV videos." },
      { status: 400 }
    );
  }
  const limit = kind.mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return NextResponse.json(
      {
        ok: false,
        error:
          kind.mediaType === "video"
            ? "Video is too large (max 50 MB). Compress to 1080p MP4 and retry."
            : "Image is too large (max 15 MB).",
      },
      { status: 400 }
    );
  }

  /* ---- preferred: Supabase Storage (works on Vercel, public CDN URLs) ---- */
  if (supabaseEnabled) {
    try {
      const result = await uploadGalleryMedia(file);
      return NextResponse.json({ ok: true, path: result.url, url: result.url, mediaType: result.mediaType });
    } catch (e) {
      console.error("supabase upload failed", e);
      return NextResponse.json(
        { ok: false, error: (e as Error).message || "Supabase upload failed." },
        { status: 502 }
      );
    }
  }

  /* ---- fallback: local disk (self-hosted / dev without Supabase) -------- */
  const ext = LEGACY_ALLOWED[file.type] ?? kind.ext;
  const dir = path.join(process.cwd(), "public", "uploads");
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    console.error("upload write failed", e);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server storage is read-only here. Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see DEPLOY.md) to upload from the live site.",
      },
      { status: 507 }
    );
  }

  return NextResponse.json({ ok: true, path: `/uploads/${name}`, url: `/uploads/${name}`, mediaType: kind.mediaType });
}
