// Exports course content (courses, modules, lessons, exercises and their
// translations) from the local SQLite database as SQL for Cloudflare D1:
//   node scripts/export-content-sql.mjs [db] > .open-next/content.sql
//   npx wrangler d1 execute gapir-db --remote --file .open-next/content.sql
// Rows are upserted by primary key (INSERT … ON CONFLICT DO UPDATE), never
// deleted: the content tables cascade into user progress, so a DELETE would
// wipe learners' results. IDs match because D1 was first filled from this
// database and the seed keeps IDs stable (upserts by order).
// Users, sessions and progress are never exported.
import Database from "better-sqlite3";

const TABLES = [
  "Course", "CourseTranslation", "Module", "ModuleTranslation", "Lesson", "LessonTranslation",
  "Exercise", "ExerciseTranslation", "ExerciseOption", "ExerciseOptionTranslation",
];

const db = new Database(process.argv[2] ?? "prisma/dev.db", { readonly: true });
const quote = (value) => {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
  return `'${String(value).replace(/'/g, "''")}'`;
};

const lines = ["PRAGMA defer_foreign_keys = true;"];
for (const table of TABLES) {
  const keys = db.prepare(`PRAGMA table_info("${table}")`).all().filter((column) => column.pk).sort((a, b) => a.pk - b.pk).map((column) => column.name);
  for (const row of db.prepare(`SELECT * FROM "${table}"`).all()) {
    const columns = Object.keys(row);
    const updates = columns.filter((column) => !keys.includes(column)).map((column) => `"${column}" = excluded."${column}"`);
    lines.push(`INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(", ")}) VALUES (${columns.map((column) => quote(row[column])).join(", ")}) ON CONFLICT(${keys.map((key) => `"${key}"`).join(", ")}) DO ${updates.length ? `UPDATE SET ${updates.join(", ")}` : "NOTHING"};`);
  }
}
process.stdout.write(`${lines.join("\n")}\n`);
