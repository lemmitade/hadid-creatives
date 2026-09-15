import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { Lead } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const q = url.searchParams.get("q");
    const format = url.searchParams.get("format");

    let leads = await readData<Lead[]>("leads", []);

    if (type) leads = leads.filter((l) => l.type === type);
    if (status) leads = leads.filter((l) => l.status === status);
    if (q) {
      const query = q.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query) ||
          l.company.toLowerCase().includes(query),
      );
    }

    leads.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (format === "csv") {
      const header = "ID,Type,Name,Email,Company,Phone,Message,Date,Status\n";
      const rows = leads
        .map(
          (l) =>
            `"${l.id}","${l.type}","${l.name}","${l.email}","${l.company}","${l.phone}","${l.message.replace(/"/g, '""')}","${l.createdAt}","${l.status}"`,
        )
        .join("\n");
      return new NextResponse(header + rows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json(leads);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { action, id, status } = body;

    if (action === "updateStatus" && id && status) {
      const leads = await readData<Lead[]>("leads", []);
      const index = leads.findIndex((l) => l.id === id);
      if (index !== -1) {
        leads[index].status = status;
        await writeData("leads", leads);
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "delete" && id) {
      const leads = await readData<Lead[]>("leads", []);
      await writeData("leads", leads.filter((l) => l.id !== id));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }
}
