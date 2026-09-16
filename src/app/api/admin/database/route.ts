import { NextResponse } from "next/server";
import { getDatabaseStatus, seedPgFromJson, connectAndMigratePg } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

async function updateEnvFile(updates: Record<string, string>): Promise<void> {
  const envPath = join(process.cwd(), ".env.local");
  let content = "";
  try {
    content = await readFile(envPath, "utf-8");
  } catch {
    content = "";
  }

  const lines = content ? content.split(/\r?\n/) : [];
  for (const [key, value] of Object.entries(updates)) {
    const escapedValue = `"${value.replace(/"/g, '\\"')}"`;
    const regex = new RegExp(`^${key}=.*$`);
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        lines[i] = `${key}=${escapedValue}`;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.push(`${key}=${escapedValue}`);
    }
  }

  await writeFile(envPath, lines.join("\n").trim() + "\n", "utf-8");
}

export async function GET() {
  try {
    const status = await getDatabaseStatus();
    return NextResponse.json({
      success: true,
      ...status,
      vercelEnvironment: !!process.env.VERCEL,
      hasPostgresEnv: !!(process.env.NEON_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL),
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

    if (action === "connect_neon" || action === "update_url") {
      const connectionString = (body.connectionString || "").trim();
      if (!connectionString) {
        return NextResponse.json(
          { success: false, error: "Connection string is required." },
          { status: 400 },
        );
      }

      try {
        const result = await connectAndMigratePg(connectionString);

        // Persist to .env.local for local offline and reboot consistency
        await updateEnvFile({
          NEON_DATABASE_URL: connectionString,
          POSTGRES_URL: connectionString,
          DATABASE_URL: connectionString,
        });

        const status = await getDatabaseStatus();
        return NextResponse.json({
          success: true,
          message: result.message,
          seededCount: result.seededCount,
          ...status,
        });
      } catch (connErr) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to connect to Neon Postgres: ${(connErr as Error).message}`,
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 401 },
    );
  }
}

