import "dotenv/config";
import Database from "better-sqlite3";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const configured = process.env.DATABASE_URL ?? "file:./dev.db";
const databasePath = configured === "file:./dev.db"
  ? resolve("prisma/dev.db")
  : configured.startsWith("file:")
    ? configured.slice(5)
    : configured;
const db = new Database(databasePath);
db.exec("CREATE TABLE IF NOT EXISTS _gapir_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");
const migrationsRoot = resolve("prisma/migrations");
const migrationNames = readdirSync(migrationsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const migrationName of migrationNames) {
  const applied = db.prepare("SELECT name FROM _gapir_migrations WHERE name = ?").get(migrationName);
  if (applied) {
    console.log(`Migration ${migrationName} is already applied`);
    continue;
  }
  const sql = readFileSync(resolve(migrationsRoot, migrationName, "migration.sql"), "utf8");
  db.transaction(() => {
    db.exec(sql);
    db.prepare("INSERT INTO _gapir_migrations (name, applied_at) VALUES (?, ?)").run(migrationName, new Date().toISOString());
  })();
  console.log(`Applied migration ${migrationName}`);
}
db.exec("PRAGMA optimize");
db.close();
