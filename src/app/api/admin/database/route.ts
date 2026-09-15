import { NextResponse } from "next/server";
import { getDatabaseStatus, seedPgFromJson } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const status = await getDatabaseStatus();
    return NextResponse.json({
      success: true,
      ...status,
      vercelEnvironment: !!process.env.VERCEL,
      hasPostgresEnv: !!(process.env.POSTGRES_URL || process.env.DATABASE_URL),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = await req.json().catch(() => ({}));
    const action = body.action || "sync";

    if (action === "sync") {
      const seededCount = await seedPgFromJson();
      const status = await getDatabaseStatus();
      return NextResponse.json({
        success: true,
        message: `Database synchronized successfully. ${seededCount} entries processed.`,
        seededCount,
        ...status,
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 401 },
    );
  }
}
