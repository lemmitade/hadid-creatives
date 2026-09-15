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
      data.push(newItem);
      await writeData(collection, data);
      return NextResponse.json({ ok: true, item: newItem });
    }

    if (action === "update") {
      const data = await readData<Record<string, unknown>[]>(collection, []);
      const index = data.findIndex((i) => i.id === id);
      if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      data[index] = { ...data[index], ...item };
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
