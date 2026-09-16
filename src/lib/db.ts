import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

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

declare global {
  // eslint-disable-next-line no-var
  var _hadidPgPool: Pool | undefined;
}

let pgInitialized = false;

export function getPostgresUrl(): string | null {
  return (
    process.env.NEON_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_URL_NON_POOLING ||
    null
  );
}

export async function resetPgPool(): Promise<void> {
  if (globalThis._hadidPgPool) {
    try {
      await globalThis._hadidPgPool.end();
    } catch {
      /* ignore */
    }
    globalThis._hadidPgPool = undefined;
  }
  pgInitialized = false;
}

export function getPgPool(): Pool | null {
  const url = getPostgresUrl();
  if (!url) return null;

  if (!globalThis._hadidPgPool) {
    try {
      globalThis._hadidPgPool = new Pool({
        connectionString: url,
        ssl:
          url.includes("sslmode=require") ||
          url.includes("db.prisma.io") ||
          url.includes("neon.tech") ||
          url.includes("supabase.co")
            ? { rejectUnauthorized: false }
            : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 8000,
      });
    } catch (err) {
      console.error("Failed to initialize PostgreSQL pool:", err);
      return null;
    }
  }

  return globalThis._hadidPgPool;
}

export async function connectAndMigratePg(connectionString: string): Promise<{
  success: boolean;
  seededCount: number;
  message: string;
}> {
  const isNeon = connectionString.includes("neon.tech");
  const testPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await testPool.query("SELECT 1");
    // Ensure tables exist on target database
    await ensurePgTables(testPool);
    // Seed target database if empty
    const seededCount = await seedPgFromJson(testPool);
    await testPool.end();

    // Reset active pool and update environment in current process
    await resetPgPool();
    process.env.NEON_DATABASE_URL = connectionString;
    process.env.POSTGRES_URL = connectionString;
    process.env.DATABASE_URL = connectionString;

    // Warm up new pool
    getPgPool();

    return {
      success: true,
      seededCount,
      message: isNeon
        ? `Successfully connected to Neon Serverless Postgres! Tables verified and ${seededCount} records synchronized.`
        : `Successfully connected to PostgreSQL! Tables verified and ${seededCount} records synchronized.`,
    };
  } catch (err) {
    try {
      await testPool.end();
    } catch {
      /* ignore */
    }
    throw err;
  }
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
 * Initializes and auto-seeds Postgres on Vercel or cloud environments.
 */
export async function ensurePgTables(pool: Pool): Promise<void> {
  if (pgInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_overrides (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS collections (
        collection TEXT,
        id TEXT,
        data TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (collection, id)
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Check if empty, then auto-seed from local data files
    const res = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text as count FROM collections",
    );
    const count = parseInt(res.rows[0]?.count || "0", 10);
    if (count === 0) {
      console.log("Seeding cloud Postgres from local data files...");
      await seedPgFromJson(pool);
    }
    pgInitialized = true;
  } catch (err) {
    console.error("Error creating/migrating Postgres schema:", err);
  }
}

/**
 * Seeds Postgres from local JSON data files using fast batch operations
 */
export async function seedPgFromJson(customPool?: Pool): Promise<number> {
  const pool = customPool || getPgPool();
  if (!pool) return 0;
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

        if (
          collection === "content-overrides" &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const entries = Object.entries(parsed);
          if (entries.length > 0) {
            const placeholders: string[] = [];
            const values: unknown[] = [];
            let idx = 1;
            for (const [k, v] of entries) {
              placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2})`);
              values.push(k, String(v), now);
              idx += 3;
            }
            await pool.query(
              `INSERT INTO content_overrides (key, value, updated_at) VALUES ${placeholders.join(", ")}
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
              values,
            );
            totalSeeded += entries.length;
          }
        } else if (
          collection === "settings" &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const entries = Object.entries(parsed);
          if (entries.length > 0) {
            const placeholders: string[] = [];
            const values: unknown[] = [];
            let idx = 1;
            for (const [k, v] of entries) {
              const val = typeof v === "string" ? v : JSON.stringify(v);
              placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2})`);
              values.push(k, val, now);
              idx += 3;
            }
            await pool.query(
              `INSERT INTO settings (key, value, updated_at) VALUES ${placeholders.join(", ")}
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
              values,
            );
            totalSeeded += entries.length;
          }
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          const chunkSize = 50;
          for (let i = 0; i < parsed.length; i += chunkSize) {
            const chunk = parsed.slice(i, i + chunkSize);
            const placeholders: string[] = [];
            const values: unknown[] = [];
            let idx = 1;
            for (const item of chunk) {
              const id = (item as { id?: string }).id || generateId();
              placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3})`);
              values.push(collection, String(id), JSON.stringify(item), now);
              idx += 4;
            }
            await pool.query(
              `INSERT INTO collections (collection, id, data, updated_at) VALUES ${placeholders.join(", ")}
               ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
              values,
            );
            totalSeeded += chunk.length;
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
 * Initializes the SQLite database engine using Node.js native DatabaseSync for local offline development.
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

        if (
          collection === "content-overrides" &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const insertStmt = db.prepare(
            "INSERT OR REPLACE INTO content_overrides (key, value, updated_at) VALUES (?, ?, ?)",
          );
          for (const [k, v] of Object.entries(parsed)) {
            insertStmt.run(k, String(v), new Date().toISOString());
          }
        } else if (
          collection === "settings" &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const insertStmt = db.prepare(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)",
          );
          for (const [k, v] of Object.entries(parsed)) {
            insertStmt.run(
              k,
              typeof v === "string" ? v : JSON.stringify(v),
              new Date().toISOString(),
            );
          }
        } else if (Array.isArray(parsed)) {
          const checkStmt = db.prepare(
            "SELECT COUNT(*) as count FROM collections WHERE collection = ?",
          );
          const res = checkStmt.get(collection) as { count: number } | undefined;
          if (!res || res.count === 0) {
            const insertStmt = db.prepare(
              "INSERT OR REPLACE INTO collections (collection, id, data, updated_at) VALUES (?, ?, ?, ?)",
            );
            for (const item of parsed) {
              const id = item.id || generateId();
              insertStmt.run(
                collection,
                String(id),
                JSON.stringify(item),
                new Date().toISOString(),
              );
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
  // 1. Check Serverless / Cloud Postgres (Prisma Postgres / Vercel / Neon / Supabase)
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgTables(pool);
      if (name === "content-overrides") {
        const res = await pool.query<{ key: string; value: string }>(
          "SELECT key, value FROM content_overrides",
        );
        if (res.rows.length > 0) {
          const obj: Record<string, string> = {};
          for (const r of res.rows) obj[r.key] = r.value;
          return obj as unknown as T;
        }
      } else if (name === "settings") {
        const res = await pool.query<{ key: string; value: string }>(
          "SELECT key, value FROM settings",
        );
        if (res.rows.length > 0) {
          const obj: Record<string, unknown> = {};
          for (const r of res.rows) {
            try {
              obj[r.key] = JSON.parse(r.value);
            } catch {
              obj[r.key] = r.value;
            }
          }
          return obj as unknown as T;
        }
      } else {
        const res = await pool.query<{ data: string }>(
          "SELECT data FROM collections WHERE collection = $1 ORDER BY updated_at ASC",
          [name],
        );
        if (res.rows.length > 0) {
          return res.rows.map((r) => JSON.parse(r.data)) as unknown as T;
        }
      }
    } catch (pgErr) {
      console.warn(`Postgres read fallback for ${name}:`, pgErr);
    }
  }

  // 2. Check local SQLite (for local offline development)
  await ensureDir();
  const db = getDb();
  if (db) {
    try {
      if (name === "content-overrides") {
        const rows = db
          .prepare("SELECT key, value FROM content_overrides")
          .all() as { key: string; value: string }[];
        if (rows && rows.length > 0) {
          const obj: Record<string, string> = {};
          for (const r of rows) obj[r.key] = r.value;
          return obj as unknown as T;
        }
      } else if (name === "settings") {
        const rows = db
          .prepare("SELECT key, value FROM settings")
          .all() as { key: string; value: string }[];
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
        const rows = db
          .prepare(
            "SELECT data FROM collections WHERE collection = ? ORDER BY rowid ASC",
          )
          .all(name) as { data: string }[];
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

  // 1. Fast Batch Write to Postgres if connected (Prisma Postgres / Vercel production)
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgTables(pool);
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        if (
          name === "content-overrides" &&
          typeof data === "object" &&
          !Array.isArray(data) &&
          data !== null
        ) {
          await client.query("DELETE FROM content_overrides");
          const entries = Object.entries(data as Record<string, unknown>);
          if (entries.length > 0) {
            const placeholders: string[] = [];
            const values: unknown[] = [];
            let idx = 1;
            for (const [k, v] of entries) {
              placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2})`);
              values.push(k, String(v), now);
              idx += 3;
            }
            await client.query(
              `INSERT INTO content_overrides (key, value, updated_at) VALUES ${placeholders.join(", ")}
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
              values,
            );
          }
        } else if (
          name === "settings" &&
          typeof data === "object" &&
          !Array.isArray(data) &&
          data !== null
        ) {
          await client.query("DELETE FROM settings");
          const entries = Object.entries(data as Record<string, unknown>);
          if (entries.length > 0) {
            const placeholders: string[] = [];
            const values: unknown[] = [];
            let idx = 1;
            for (const [k, v] of entries) {
              const val = typeof v === "string" ? v : JSON.stringify(v);
              placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2})`);
              values.push(k, val, now);
              idx += 3;
            }
            await client.query(
              `INSERT INTO settings (key, value, updated_at) VALUES ${placeholders.join(", ")}
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
              values,
            );
          }
        } else if (Array.isArray(data)) {
          await client.query("DELETE FROM collections WHERE collection = $1", [name]);
          if (data.length > 0) {
            const chunkSize = 50;
            for (let i = 0; i < data.length; i += chunkSize) {
              const chunk = data.slice(i, i + chunkSize);
              const placeholders: string[] = [];
              const values: unknown[] = [];
              let idx = 1;
              for (const item of chunk) {
                const id = (item as { id?: string }).id || generateId();
                placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3})`);
                values.push(name, String(id), JSON.stringify(item), now);
                idx += 4;
              }
              await client.query(
                `INSERT INTO collections (collection, id, data, updated_at) VALUES ${placeholders.join(", ")}
                 ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
                values,
              );
            }
          }
        }
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
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
      if (
        name === "content-overrides" &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        data !== null
      ) {
        db.exec("DELETE FROM content_overrides");
        const insertStmt = db.prepare(
          "INSERT INTO content_overrides (key, value, updated_at) VALUES (?, ?, ?)",
        );
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          insertStmt.run(k, String(v), now);
        }
      } else if (
        name === "settings" &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        data !== null
      ) {
        db.exec("DELETE FROM settings");
        const insertStmt = db.prepare(
          "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)",
        );
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          insertStmt.run(k, typeof v === "string" ? v : JSON.stringify(v), now);
        }
      } else if (Array.isArray(data)) {
        db.prepare("DELETE FROM collections WHERE collection = ?").run(name);
        const insertStmt = db.prepare(
          "INSERT INTO collections (collection, id, data, updated_at) VALUES (?, ?, ?, ?)",
        );
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

/* Atomic Collection Helpers */

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
  const pool = getPgPool();
  const now = new Date().toISOString();

  if (pool) {
    try {
      await ensurePgTables(pool);
      await pool.query(
        `INSERT INTO collections (collection, id, data, updated_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
        [name, String(item.id), JSON.stringify(item), now],
      );
    } catch (e) {
      console.warn("Postgres atomic addItem error:", e);
    }
  }

  const items = await readCollection<T>(name);
  if (!items.find((i) => i.id === item.id)) {
    items.push(item);
  }
  // Dual write SQLite/JSON
  await ensureDir();
  const db = getDb();
  if (db) {
    try {
      const insertStmt = db.prepare(
        "INSERT OR REPLACE INTO collections (collection, id, data, updated_at) VALUES (?, ?, ?, ?)",
      );
      insertStmt.run(name, String(item.id), JSON.stringify(item), now);
    } catch {
      /* ignore */
    }
  }
  try {
    await writeFile(filePath(name), JSON.stringify(items, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
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
  const pool = getPgPool();
  if (pool) {
    try {
      await ensurePgTables(pool);
      await pool.query(
        "DELETE FROM collections WHERE collection = $1 AND id = $2",
        [name, String(id)],
      );
    } catch (e) {
      console.warn("Postgres deleteItem error:", e);
    }
  }

  const items = await readCollection<T>(name);
  await writeCollection(
    name,
    items.filter((i) => i.id !== id),
  );
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function maskConnectionHost(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.host;
    const db = parsed.pathname.replace(/^\//, "");
    return `${host}${db ? `/${db}` : ""}`;
  } catch {
    return "";
  }
}

export async function getDatabaseStatus(): Promise<{
  connected: boolean;
  engine: string;
  isServerless: boolean;
  isNeon: boolean;
  endpoint?: string;
  hasPostgresConfigured: boolean;
  tables: { name: string; count: number }[];
}> {
  const hasPg = !!getPostgresUrl();
  const pool = getPgPool();

  if (pool) {
    try {
      await ensurePgTables(pool);
      const overridesCountRes = await pool.query<{ count: string }>(
        "SELECT COUNT(*)::text as count FROM content_overrides",
      );
      const settingsCountRes = await pool.query<{ count: string }>(
        "SELECT COUNT(*)::text as count FROM settings",
      );
      const collectionsRows = await pool.query<{
        collection: string;
        count: string;
      }>("SELECT collection, COUNT(*)::text as count FROM collections GROUP BY collection");

      const tables = [
        {
          name: "content_overrides",
          count: parseInt(overridesCountRes.rows[0]?.count || "0", 10),
        },
        {
          name: "settings",
          count: parseInt(settingsCountRes.rows[0]?.count || "0", 10),
        },
        ...collectionsRows.rows.map((r) => ({
          name: `collection: ${r.collection}`,
          count: parseInt(r.count, 10),
        })),
      ];

      const url = getPostgresUrl() || "";
      const isNeon = url.includes("neon.tech") || url.includes("neon");
      const engineLabel = isNeon
        ? "Neon Serverless Postgres"
        : url.includes("prisma.io")
        ? "Prisma Postgres (Cloud)"
        : url.includes("supabase.co")
        ? "Supabase Postgres"
        : "PostgreSQL (Cloud)";

      return {
        connected: true,
        engine: engineLabel,
        isServerless: true,
        isNeon,
        endpoint: maskConnectionHost(url),
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
      isNeon: false,
      hasPostgresConfigured: hasPg,
      tables: [],
    };
  }

  try {
    const overridesCount = (
      db.prepare("SELECT COUNT(*) as count FROM content_overrides").get() as {
        count: number;
      }
    ).count;
    const settingsCount = (
      db.prepare("SELECT COUNT(*) as count FROM settings").get() as {
        count: number;
      }
    ).count;
    const collectionsRows = db
      .prepare(
        "SELECT collection, COUNT(*) as count FROM collections GROUP BY collection",
      )
      .all() as { collection: string; count: number }[];

    const tables = [
      { name: "content_overrides", count: overridesCount },
      { name: "settings", count: settingsCount },
      ...collectionsRows.map((r) => ({
        name: `collection: ${r.collection}`,
        count: r.count,
      })),
    ];

    return {
      connected: true,
      engine: "SQLite 3 (node:sqlite)",
      isServerless: false,
      isNeon: false,
      hasPostgresConfigured: hasPg,
      tables,
    };
  } catch {
    return {
      connected: false,
      engine: "Error",
      isServerless: false,
      isNeon: false,
      hasPostgresConfigured: hasPg,
      tables: [],
    };
  }
}
