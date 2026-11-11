// Exports course content (courses, modules, lessons, exercises and their
// translations) from the local SQLite database as SQL for Cloudflare D1:
//   node scripts/export-content-sql.mjs > .open-next/content.sql
//   npx wrangler d1 execute gapir-db --remote --file .open-next/content.sql
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
// Children first when deleting, parents first when inserting.
for (const table of [...TABLES].reverse()) lines.push(`DELETE FROM "${table}";`);
for (const table of TABLES) {
  const rows = db.prepare(`SELECT * FROM "${table}"`).all();
  for (const row of rows) {
    const columns = Object.keys(row);
    lines.push(`INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(", ")}) VALUES (${columns.map((column) => quote(row[column])).join(", ")});`);
  }
}
process.stdout.write(`${lines.join("\n")}\n`);
