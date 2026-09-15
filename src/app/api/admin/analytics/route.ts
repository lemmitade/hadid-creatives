import { NextResponse } from "next/server";
import { readData } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { AnalyticsData } from "@/lib/types";

export async function GET() {
  try {
    await requireAuth();
    const data = await readData<AnalyticsData>("analytics", { pageViews: [], events: [] });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}
