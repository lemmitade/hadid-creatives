import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import type { AnalyticsData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, path, referrer, name, meta } = body;

    const data = await readData<AnalyticsData>("analytics", {
      pageViews: [],
      events: [],
    });

    const timestamp = new Date().toISOString();

    if (type === "pageview") {
      data.pageViews.push({ path: path || "/", referrer: referrer || "", timestamp });
      /* Keep last 10000 page views */
      if (data.pageViews.length > 10000) {
        data.pageViews = data.pageViews.slice(-10000);
      }
    } else if (type === "event") {
      data.events.push({ name: name || "", path: path || "/", timestamp, meta: meta || "" });
      if (data.events.length > 10000) {
        data.events = data.events.slice(-10000);
      }
    }

    await writeData("analytics", data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
