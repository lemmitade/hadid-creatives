import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const ALLOWED_COLLECTIONS = [
  "testimonials",
  "team",
  "faqs",
  "services",
  "blog-posts",
  "blog-categories",
  "case-studies",
  "client-logos",
  "behind-the-work",
  "selected-cuts",
  "metrics",
  "media",
  "users",
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  try {
    await requireAuth();
    const { collection } = await params;
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }
    const data = await readData(collection, []);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  try {
    await requireAuth();
    const { collection } = await params;
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }

    const body = await request.json();
    const { action, item, id, items } = body;

    if (action === "add") {
      const data = await readData<Record<string, unknown>[]>(collection, []);
      const newItem = { ...item, id: item.id || generateId() };

      // Auto-resolve videoId for selected-cuts if TikTok link
      if (collection === "selected-cuts" && typeof newItem.videoUrl === "string" && !newItem.videoId) {
        const directMatch = (newItem.videoUrl as string).match(/\/video\/(\d+)/);
        if (directMatch) {
          newItem.videoId = directMatch[1];
          newItem.embedUrl = `https://www.tiktok.com/player/v1/${directMatch[1]}?autoplay=1`;
        } else if ((newItem.videoUrl as string).includes("tiktok.com")) {
          try {
            const res = await fetch(newItem.videoUrl as string, { method: "HEAD", redirect: "manual" });
            const loc = res.headers.get("location") || "";
            const match = loc.match(/\/video\/(\d+)/);
            if (match) {
              newItem.videoId = match[1];
              newItem.embedUrl = `https://www.tiktok.com/player/v1/${match[1]}?autoplay=1`;
              newItem.canonicalUrl = loc.split("?")[0];
            }
          } catch {
            /* ignore */
          }
        }
      }

      data.push(newItem);
      await writeData(collection, data);
      return NextResponse.json({ ok: true, item: newItem });
    }

    if (action === "update") {
      const data = await readData<Record<string, unknown>[]>(collection, []);
      const index = data.findIndex((i) => i.id === id);
      if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const updatedItem = { ...data[index], ...item };

      // Auto-resolve videoId if videoUrl changed
      if (collection === "selected-cuts" && typeof updatedItem.videoUrl === "string") {
        const directMatch = (updatedItem.videoUrl as string).match(/\/video\/(\d+)/);
        if (directMatch) {
          updatedItem.videoId = directMatch[1];
          updatedItem.embedUrl = `https://www.tiktok.com/player/v1/${directMatch[1]}?autoplay=1`;
        } else if ((updatedItem.videoUrl as string).includes("tiktok.com")) {
          try {
            const res = await fetch(updatedItem.videoUrl as string, { method: "HEAD", redirect: "manual" });
            const loc = res.headers.get("location") || "";
            const match = loc.match(/\/video\/(\d+)/);
            if (match) {
              updatedItem.videoId = match[1];
              updatedItem.embedUrl = `https://www.tiktok.com/player/v1/${match[1]}?autoplay=1`;
              updatedItem.canonicalUrl = loc.split("?")[0];
            }
          } catch {
            /* ignore */
          }
        }
      }

      data[index] = updatedItem;
      await writeData(collection, data);
      return NextResponse.json({ ok: true, item: data[index] });
    }

    if (action === "delete") {
      const data = await readData<Record<string, unknown>[]>(collection, []);
      await writeData(collection, data.filter((i) => i.id !== id));
      return NextResponse.json({ ok: true });
    }

    if (action === "reorder") {
      if (Array.isArray(items)) {
        await writeData(collection, items);
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}
