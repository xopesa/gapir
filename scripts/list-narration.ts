// Lists Chinese narration texts (lesson theory and teach cards) with their audio
// keys, for voicing in Google AI Studio (see docs/VOICEOVER.md):
//   npx tsx scripts/list-narration.ts <course-slug> <unit number> out.json
import { writeFileSync } from "node:fs";
import { zhRuCourse } from "../prisma/content/zh-ru-unit1";
import { zhUzCourse } from "../prisma/content/zh-uz-unit1";
import { narrationKey } from "../src/lib/audio-keys";

const [slug, unit, out] = process.argv.slice(2);
const course = [zhRuCourse, zhUzCourse].find((item) => item.slug === slug);
if (!course) throw new Error(`No course ${slug}`);
const rows: Array<{ key: string; lesson: number; text: string }> = [];
course.modules[Number(unit) - 1].lessons.forEach((lesson, index) => {
  for (const text of [lesson.theory.zh, ...lesson.exercises.map((exercise) => exercise.teach?.zh)]) {
    if (text && !rows.some((row) => row.key === narrationKey(text))) rows.push({ key: narrationKey(text), lesson: index + 1, text });
  }
});
writeFileSync(out, JSON.stringify(rows));
console.log(`${rows.length} narration text(s)`);
