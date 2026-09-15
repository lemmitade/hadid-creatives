import { NextRequest, NextResponse } from "next/server";
import { readData, writeData, generateId } from "@/lib/db";
import type { Lead } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, company, phone, message, preferredDate, downloadType } = body;

    if (!type || !["contact", "discovery", "download", "newsletter"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const lead: Lead = {
      id: generateId(),
      type,
      name: name || "",
      email: email || "",
      company: company || "",
      phone: phone || "",
      message: message || "",
      preferredDate: preferredDate || "",
      downloadType: downloadType || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const leads = await readData<Lead[]>("leads", []);
    leads.push(lead);
    await writeData("leads", leads);

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
