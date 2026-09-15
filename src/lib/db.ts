import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

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

/* Global database handle */
let sqliteDb: SqliteDatabase | null = null;
let initialized = false;

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
 * Initializes the SQLite database engine using Node.js native DatabaseSync.
 * If SQLite fails or is unavailable in an edge context, it gracefully falls back to JSON.
 */
function getDb(): SqliteDatabase | null {
  if (sqliteDb) return sqliteDb;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
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
    if (!initialized) {
      initialized = true;
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
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const raw = require("fs").readFileSync(fullPath, "utf-8");
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

  // Fallback to JSON file
  try {
    const raw = await readFile(filePath(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeData<T>(name: string, data: T): Promise<void> {
  await ensureDir();
  const db = getDb();
  const now = new Date().toISOString();

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

  // Dual-write to JSON file to keep file backups synchronized
  try {
    await writeFile(filePath(name), JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed writing JSON backup:", err);
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
  tables: { name: string; count: number }[];
}> {
  const db = getDb();
  if (!db) {
    return { connected: false, engine: "JSON Fallback", tables: [] };
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
      tables,
    };
  } catch {
    return { connected: false, engine: "Error", tables: [] };
  }
}
