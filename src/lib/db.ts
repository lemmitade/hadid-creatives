import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const DATA_DIR = join(process.cwd(), "data");
const DB_FILE = join(DATA_DIR, "hadid.sqlite");

interface SqliteStatement {
  run(...args: unknown[]): unknown;
  get(...args: unknown[]): unknown;
  all(...args: unknown[]): unknown[];
}

interface SqliteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
}

/* Global handles */
let sqliteDb: SqliteDatabase | null = null;
let sqliteInitialized = false;

let pgClient: NeonQueryFunction<false, false> | null = null;
let pgInitialized = false;

function getPostgresUrl(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    null
  );
}

function getPgClient(): NeonQueryFunction<false, false> | null {
  const url = getPostgresUrl();
  if (!url) return null;
  if (!pgClient) {
    try {
      pgClient = neon(url);
    } catch (err) {
      console.error("Failed to initialize Neon Postgres client:", err);
      return null;
    }
  }
  return pgClient;
}

async function ensureDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    /* already exists */
  }
}

function filePath(name: string): string {
  return join(DATA_DIR, `${name}.json`);
}

/**
 * Initializes and auto-seeds Postgres on Vercel or serverless environments.
 */
async function ensurePgTables(sql: NeonQueryFunction<false, false>): Promise<void> {
  if (pgInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS content_overrides (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS collections (
        collection TEXT,
        id TEXT,
        data TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (collection, id)
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Check if empty, then auto-seed from local data files
    const existing = (await sql`SELECT COUNT(*)::int as count FROM collections`) as { count: number }[];
    const count = Number(existing[0]?.count || 0);
    if (count === 0) {
      console.log("Seeding Neon/Vercel Postgres from local data files...");
      await seedPgFromJson(sql);
    }
    pgInitialized = true;
  } catch (err) {
    console.error("Error creating/migrating Postgres schema:", err);
  }
}

/**
 * Seeds Postgres from local JSON data files
 */
export async function seedPgFromJson(sql?: NeonQueryFunction<false, false>): Promise<number> {
  const client = sql || getPgClient();
  if (!client) return 0;
  let totalSeeded = 0;

  try {
    if (!existsSync(DATA_DIR)) return 0;
    const files = readdirSync(DATA_DIR);
    const now = new Date().toISOString();

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const collection = file.replace(".json", "");
      const fullPath = join(DATA_DIR, file);

      try {
        const raw = readFileSync(fullPath, "utf-8");
        const parsed = JSON.parse(raw);

        if (collection === "content-overrides" && typeof parsed === "object" && !Array.isArray(parsed)) {
          for (const [k, v] of Object.entries(parsed)) {
            await client`
              INSERT INTO content_overrides (key, value, updated_at)
              VALUES (${k}, ${String(v)}, ${now})
              ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
            `;
            totalSeeded++;
          }
        } else if (collection === "settings" && typeof parsed === "object" && !Array.isArray(parsed)) {
          for (const [k, v] of Object.entries(parsed)) {
            const val = typeof v === "string" ? v : JSON.stringify(v);
            await client`
              INSERT INTO settings (key, value, updated_at)
              VALUES (${k}, ${val}, ${now})
              ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
            `;
            totalSeeded++;
          }
        } else if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const id = (item as { id?: string }).id || generateId();
            await client`
              INSERT INTO collections (collection, id, data, updated_at)
              VALUES (${collection}, ${String(id)}, ${JSON.stringify(item)}, ${now})
              ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
            `;
            totalSeeded++;
          }
        }
      } catch (fileErr) {
        console.warn(`Could not seed ${file}:`, fileErr);
      }
    }
  } catch (err) {
    console.warn("Could not complete Postgres seeding:", err);
  }
  return totalSeeded;
}

/**
 * Initializes the SQLite database engine using Node.js native DatabaseSync for local development.
 */
function getDb(): SqliteDatabase | null {
  if (sqliteDb) return sqliteDb;
  // In Vercel or when Postgres is configured, bypass local SQLite
  if (getPostgresUrl() || process.env.VERCEL) return null;

  try {
    // Dynamic require so bundlers (Webpack / Turbopack / Vercel) don't trace node:sqlite at build time
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const dynamicRequire = eval("require");
    const { DatabaseSync } = dynamicRequire("node:sqlite");
    if (!DatabaseSync) return null;
    sqliteDb = new DatabaseSync(DB_FILE) as SqliteDatabase;

    // Initialize core schema
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS content_overrides (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS collections (
        collection TEXT,
        id TEXT,
        data TEXT,
        updated_at TEXT,
        PRIMARY KEY (collection, id)
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TEXT
      );
    `);

    // One-time migration from existing JSON files if SQLite tables are empty
    if (!sqliteInitialized) {
      sqliteInitialized = true;
      migrateJsonToSqlite(sqliteDb);
    }

    return sqliteDb;
  } catch (err) {
    console.warn("SQLite initialized in fallback mode:", err);
    return null;
  }
}

/**
 * Migrates existing data from data/*.json into SQLite tables if empty
 */
function migrateJsonToSqlite(db: SqliteDatabase) {
  try {
    if (!existsSync(DATA_DIR)) return;

    const files = readdirSync(DATA_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const collection = file.replace(".json", "");
      const fullPath = join(DATA_DIR, file);

      try {
        const raw = readFileSync(fullPath, "utf-8");
        const parsed = JSON.parse(raw);

        if (collection === "content-overrides" && typeof parsed === "object" && !Array.isArray(parsed)) {
          const insertStmt = db.prepare("INSERT OR REPLACE INTO content_overrides (key, value, updated_at) VALUES (?, ?, ?)");
          for (const [k, v] of Object.entries(parsed)) {
            insertStmt.run(k, String(v), new Date().toISOString());
          }
        } else if (collection === "settings" && typeof parsed === "object" && !Array.isArray(parsed)) {
          const insertStmt = db.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
          for (const [k, v] of Object.entries(parsed)) {
            insertStmt.run(k, typeof v === "string" ? v : JSON.stringify(v), new Date().toISOString());
          }
        } else if (Array.isArray(parsed)) {
          const checkStmt = db.prepare("SELECT COUNT(*) as count FROM collections WHERE collection = ?");
          const res = checkStmt.get(collection) as { count: number } | undefined;
          if (!res || res.count === 0) {
            const insertStmt = db.prepare("INSERT OR REPLACE INTO collections (collection, id, data, updated_at) VALUES (?, ?, ?, ?)");
            for (const item of parsed) {
              const id = item.id || generateId();
              insertStmt.run(collection, String(id), JSON.stringify(item), new Date().toISOString());
            }
          }
        }
      } catch {
        /* skip corrupted files */
      }
    }
  } catch {
    /* directory scan fallback */
  }
}

export async function readData<T>(name: string, fallback: T): Promise<T> {
  // 1. Check Serverless Postgres (Vercel / Neon / Supabase)
  const sql = getPgClient();
  if (sql) {
    try {
      await ensurePgTables(sql);
      if (name === "content-overrides") {
        const rows = (await sql`SELECT key, value FROM content_overrides`) as { key: string; value: string }[];
        if (rows && rows.length > 0) {
          const obj: Record<string, string> = {};
          for (const r of rows) obj[r.key] = r.value;
          return obj as unknown as T;
        }
      } else if (name === "settings") {
        const rows = (await sql`SELECT key, value FROM settings`) as { key: string; value: string }[];
        if (rows && rows.length > 0) {
          const obj: Record<string, unknown> = {};
          for (const r of rows) {
            try {
              obj[r.key] = JSON.parse(r.value);
            } catch {
              obj[r.key] = r.value;
            }
          }
          return obj as unknown as T;
        }
      } else {
        const rows = (await sql`SELECT data FROM collections WHERE collection = ${name} ORDER BY updated_at ASC`) as { data: string }[];
        if (rows && rows.length > 0) {
          return rows.map((r) => JSON.parse(r.data)) as unknown as T;
        }
      }
    } catch (pgErr) {
      console.warn(`Postgres read fallback for ${name}:`, pgErr);
    }
  }

  // 2. Check local SQLite (for local development)
  await ensureDir();
  const db = getDb();
  if (db) {
    try {
      if (name === "content-overrides") {
        const rows = db.prepare("SELECT key, value FROM content_overrides").all() as { key: string; value: string }[];
        if (rows && rows.length > 0) {
          const obj: Record<string, string> = {};
          for (const r of rows) obj[r.key] = r.value;
          return obj as unknown as T;
        }
      } else if (name === "settings") {
        const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
        if (rows && rows.length > 0) {
          const obj: Record<string, unknown> = {};
          for (const r of rows) {
            try {
              obj[r.key] = JSON.parse(r.value);
            } catch {
              obj[r.key] = r.value;
            }
          }
          return obj as unknown as T;
        }
      } else {
        const rows = db.prepare("SELECT data FROM collections WHERE collection = ? ORDER BY rowid ASC").all(name) as { data: string }[];
        if (rows && rows.length > 0) {
          return rows.map((r) => JSON.parse(r.data)) as unknown as T;
        }
      }
    } catch {
      /* fallback to JSON file */
    }
  }

  // 3. Fallback to JSON file
  try {
    const raw = await readFile(filePath(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeData<T>(name: string, data: T): Promise<void> {
  const now = new Date().toISOString();

  // 1. Write to Postgres if connected (Vercel production / Neon)
  const sql = getPgClient();
  if (sql) {
    try {
      await ensurePgTables(sql);
      if (name === "content-overrides" && typeof data === "object" && !Array.isArray(data) && data !== null) {
        await sql`DELETE FROM content_overrides`;
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          await sql`
            INSERT INTO content_overrides (key, value, updated_at)
            VALUES (${k}, ${String(v)}, ${now})
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
          `;
        }
      } else if (name === "settings" && typeof data === "object" && !Array.isArray(data) && data !== null) {
        await sql`DELETE FROM settings`;
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          const val = typeof v === "string" ? v : JSON.stringify(v);
          await sql`
            INSERT INTO settings (key, value, updated_at)
            VALUES (${k}, ${val}, ${now})
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
          `;
        }
      } else if (Array.isArray(data)) {
        await sql`DELETE FROM collections WHERE collection = ${name}`;
        for (const item of data) {
          const id = (item as { id?: string }).id || generateId();
          await sql`
            INSERT INTO collections (collection, id, data, updated_at)
            VALUES (${name}, ${String(id)}, ${JSON.stringify(item)}, ${now})
            ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
          `;
        }
      }
    } catch (e) {
      console.warn("Postgres write error, falling back to SQLite/JSON:", e);
    }
  }

  // 2. Write to local SQLite if available
  await ensureDir();
  const db = getDb();
  if (db) {
    try {
      if (name === "content-overrides" && typeof data === "object" && !Array.isArray(data) && data !== null) {
        db.exec("DELETE FROM content_overrides");
        const insertStmt = db.prepare("INSERT INTO content_overrides (key, value, updated_at) VALUES (?, ?, ?)");
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          insertStmt.run(k, String(v), now);
        }
      } else if (name === "settings" && typeof data === "object" && !Array.isArray(data) && data !== null) {
        db.exec("DELETE FROM settings");
        const insertStmt = db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          insertStmt.run(k, typeof v === "string" ? v : JSON.stringify(v), now);
        }
      } else if (Array.isArray(data)) {
        db.prepare("DELETE FROM collections WHERE collection = ?").run(name);
        const insertStmt = db.prepare("INSERT INTO collections (collection, id, data, updated_at) VALUES (?, ?, ?, ?)");
        for (const item of data) {
          const id = (item as { id?: string }).id || generateId();
          insertStmt.run(name, String(id), JSON.stringify(item), now);
        }
      }
    } catch (e) {
      console.warn("SQLite write error, saving to JSON fallback:", e);
    }
  }

  // 3. Dual-write to JSON file to keep file backups synchronized
  try {
    await writeFile(filePath(name), JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed writing JSON backup:", err);
    }
  }
}

/* Typed collection helpers */

export async function readCollection<T extends { id: string }>(
  name: string,
): Promise<T[]> {
  return readData<T[]>(name, []);
}

export async function writeCollection<T extends { id: string }>(
  name: string,
  items: T[],
): Promise<void> {
  await writeData(name, items);
}

export async function addItem<T extends { id: string }>(
  name: string,
  item: T,
): Promise<void> {
  const items = await readCollection<T>(name);
  items.push(item);
  await writeCollection(name, items);
}

export async function updateItem<T extends { id: string }>(
  name: string,
  id: string,
  updater: (item: T) => T,
): Promise<void> {
  const items = await readCollection<T>(name);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) throw new Error(`Item ${id} not found in ${name}`);
  items[index] = updater(items[index]);
  await writeCollection(name, items);
}

export async function deleteItem<T extends { id: string }>(
  name: string,
  id: string,
): Promise<void> {
  const items = await readCollection<T>(name);
  await writeCollection(
    name,
    items.filter((i) => i.id !== id),
  );
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getDatabaseStatus(): Promise<{
  connected: boolean;
  engine: string;
  isServerless: boolean;
  hasPostgresConfigured: boolean;
  tables: { name: string; count: number }[];
}> {
  const hasPg = !!getPostgresUrl();
  const sql = getPgClient();

  if (sql) {
    try {
      await ensurePgTables(sql);
      const overridesCountRes = (await sql`SELECT COUNT(*)::int as count FROM content_overrides`) as { count: number }[];
      const settingsCountRes = (await sql`SELECT COUNT(*)::int as count FROM settings`) as { count: number }[];
      const collectionsRows = (await sql`SELECT collection, COUNT(*)::int as count FROM collections GROUP BY collection`) as { collection: string; count: number }[];

      const tables = [
        { name: "content_overrides", count: Number(overridesCountRes[0]?.count || 0) },
        { name: "settings", count: Number(settingsCountRes[0]?.count || 0) },
        ...collectionsRows.map((r) => ({ name: `collection: ${r.collection}`, count: Number(r.count) })),
      ];

      return {
        connected: true,
        engine: "Vercel Postgres / Neon (Serverless)",
        isServerless: true,
        hasPostgresConfigured: true,
        tables,
      };
    } catch (err) {
      console.error("Error checking Postgres database status:", err);
    }
  }

  const db = getDb();
  if (!db) {
    return {
      connected: false,
      engine: "JSON Fallback",
      isServerless: false,
      hasPostgresConfigured: hasPg,
      tables: [],
    };
  }

  try {
    const overridesCount = (db.prepare("SELECT COUNT(*) as count FROM content_overrides").get() as { count: number }).count;
    const settingsCount = (db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number }).count;
    const collectionsRows = db.prepare("SELECT collection, COUNT(*) as count FROM collections GROUP BY collection").all() as { collection: string; count: number }[];

    const tables = [
      { name: "content_overrides", count: overridesCount },
      { name: "settings", count: settingsCount },
      ...collectionsRows.map((r) => ({ name: `collection: ${r.collection}`, count: r.count })),
    ];

    return {
      connected: true,
      engine: "SQLite 3 (node:sqlite)",
      isServerless: false,
      hasPostgresConfigured: hasPg,
      tables,
    };
  } catch {
    return {
      connected: false,
      engine: "Error",
      isServerless: false,
      hasPostgresConfigured: hasPg,
      tables: [],
    };
  }
}
