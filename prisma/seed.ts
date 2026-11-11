import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, type ExerciseType } from "../generated/prisma/client";
import { hash } from "bcryptjs";
import { seedCourseContent } from "./content/seed-course";
import { zhUzCourse } from "./content/zh-uz-unit1";
import { zhRuCourse } from "./content/zh-ru-unit1";

// SEED_TARGET: "sqlite" (default, prisma/dev.db), "d1-local" (Wrangler's local D1
// used by `npm run cf:preview`) or "d1-remote" (Cloudflare D1 over the HTTP API).
const seedTarget = process.env.SEED_TARGET ?? "sqlite";
let disposePlatformProxy: (() => Promise<void>) | undefined;

async function createAdapter() {
  if (seedTarget === "d1-local") {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy<{ DB: D1Database }>();
    disposePlatformProxy = proxy.dispose;
    return new PrismaD1(proxy.env.DB);
  }
  if (seedTarget === "d1-remote") {
    const { CLOUDFLARE_D1_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID } = process.env;
    if (!CLOUDFLARE_D1_TOKEN || !CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_DATABASE_ID) {
      throw new Error("Set CLOUDFLARE_D1_TOKEN, CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_DATABASE_ID for SEED_TARGET=d1-remote");
    }
    return new PrismaD1({ CLOUDFLARE_D1_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID });
  }
  const configuredUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  return new PrismaBetterSqlite3({ url: configuredUrl === "file:./dev.db" ? "file:./prisma/dev.db" : configuredUrl });
}

const prisma = new PrismaClient({ adapter: await createAdapter() });
const localeData = ["ru", "uz", "zh", "en"] as const;

async function upsertTranslations(
  kind: "course" | "module" | "lesson" | "exercise" | "option",
  parentId: string,
  records: Record<string, Record<string, string>>,
) {
  for (const locale of localeData) {
    const value = records[locale];
    if (kind === "course") await prisma.courseTranslation.upsert({ where: { courseId_locale: { courseId: parentId, locale } }, update: value, create: { courseId: parentId, locale, title: value.title, description: value.description ?? "" } });
    if (kind === "module") await prisma.moduleTranslation.upsert({ where: { moduleId_locale: { moduleId: parentId, locale } }, update: value, create: { moduleId: parentId, locale, title: value.title, description: value.description ?? "" } });
    if (kind === "lesson") await prisma.lessonTranslation.upsert({ where: { lessonId_locale: { lessonId: parentId, locale } }, update: value, create: { lessonId: parentId, locale, title: value.title, description: value.description ?? "", theory: value.theory ?? "" } });
    if (kind === "exercise") await prisma.exerciseTranslation.upsert({ where: { exerciseId_locale: { exerciseId: parentId, locale } }, update: value, create: { exerciseId: parentId, locale, instruction: value.instruction, question: value.question ?? "", explanation: value.explanation ?? "" } });
    if (kind === "option") await prisma.exerciseOptionTranslation.upsert({ where: { optionId_locale: { optionId: parentId, locale } }, update: { text: value.text }, create: { optionId: parentId, locale, text: value.text } });
  }
}

async function seedOwner() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim();
  if (!email || !password || !name) {
    console.warn("OWNER skipped: set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME in .env");
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { role: "OWNER" } });
    return;
  }
  await prisma.user.create({
    data: {
      name, email, passwordHash: await hash(password, 12), role: "OWNER", locale: "ru",
      preference: { create: { sourceLanguage: "ru", targetLanguage: "uz", dailyGoalMinutes: 10, timezone: "Asia/Tashkent" } },
    },
  });
}

async function seedDemoCourse() {
  const course = await prisma.course.upsert({
    where: { slug: "uzbek-for-beginners" },
    update: { sourceLanguage: "ru", targetLanguage: "uz", level: "A1", status: "PUBLISHED", order: 1, isPremium: false },
    create: { slug: "uzbek-for-beginners", sourceLanguage: "ru", targetLanguage: "uz", level: "A1", status: "PUBLISHED", order: 1, isPremium: false },
  });
  await upsertTranslations("course", course.id, {
    ru: { title: "Узбекский для начинающих", description: "Живые слова и фразы для первых разговоров." },
    uz: { title: "Boshlovchilar uchun o‘zbek tili", description: "Birinchi suhbatlar uchun jonli so‘z va iboralar." },
    zh: { title: "初学者乌兹别克语", description: "第一次对话所需的实用词汇和短语。" },
    en: { title: "Uzbek for Beginners", description: "Useful words and phrases for your first conversations." },
  });

  const courseModule = await prisma.module.upsert({
    where: { courseId_order: { courseId: course.id, order: 1 } },
    update: { status: "PUBLISHED" },
    create: { courseId: course.id, order: 1, status: "PUBLISHED" },
  });
  await upsertTranslations("module", courseModule.id, {
    ru: { title: "Приветствие и знакомство", description: "Начните разговор естественно." },
    uz: { title: "Salomlashish va tanishish", description: "Suhbatni tabiiy boshlang." },
    zh: { title: "问候与认识", description: "自然地开始对话。" },
    en: { title: "Greetings and introductions", description: "Start a conversation naturally." },
  });

  const lesson = await prisma.lesson.upsert({
    where: { moduleId_order: { moduleId: courseModule.id, order: 1 } },
    update: { type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5, status: "PUBLISHED" },
    create: { moduleId: courseModule.id, type: "VOCABULARY", order: 1, xpReward: 20, estimatedMinutes: 5, status: "PUBLISHED" },
  });
  const theory = "Salom — Привет\nAssalomu alaykum — Здравствуйте\nXayr — До свидания\nRahmat — Спасибо";
  await upsertTranslations("lesson", lesson.id, {
    ru: { title: "Приветствия", description: "Четыре фразы для начала и завершения разговора.", theory },
    uz: { title: "Salomlashish", description: "Suhbatni boshlash va tugatish uchun to‘rtta ibora.", theory: "Salom — salomlashish\nAssalomu alaykum — hurmatli salom\nXayr — xayrlashish\nRahmat — minnatdorchilik" },
    zh: { title: "问候语", description: "用于开始和结束对话的四个短语。", theory: "Salom — 你好\nAssalomu alaykum — 您好 / 愿你平安\nXayr — 再见\nRahmat — 谢谢" },
    en: { title: "Greetings", description: "Four phrases to open and close a conversation.", theory: "Salom — Hello\nAssalomu alaykum — Hello / Peace be upon you\nXayr — Goodbye\nRahmat — Thank you" },
  });

  const exercises: Array<{ type: ExerciseType; order: number; payload: object; text: Record<string, Record<string, string>>; options?: Array<{ correct: boolean; text: Record<string, string> }> }> = [
    {
      type: "MULTIPLE_CHOICE", order: 1, payload: {},
      text: {
        ru: { instruction: "Выберите правильный перевод", question: "Как переводится «Salom»?", explanation: "Salom — неформальное приветствие: «Привет»." },
        uz: { instruction: "To‘g‘ri tarjimani tanlang", question: "«Salom» qanday tarjima qilinadi?", explanation: "Salom — oddiy salomlashish." },
        zh: { instruction: "选择正确翻译", question: "“Salom”是什么意思？", explanation: "Salom 是非正式的“你好”。" },
        en: { instruction: "Choose the correct translation", question: "What does “Salom” mean?", explanation: "Salom is an informal hello." },
      },
      options: [
        { correct: true, text: { ru: "Привет", uz: "Salom", zh: "你好", en: "Hello" } },
        { correct: false, text: { ru: "Спасибо", uz: "Rahmat", zh: "谢谢", en: "Thank you" } },
        { correct: false, text: { ru: "До свидания", uz: "Xayr", zh: "再见", en: "Goodbye" } },
      ],
    },
    {
      type: "MATCHING", order: 2, payload: { pairs: [{ left: "Salom", right: "Привет" }, { left: "Rahmat", right: "Спасибо" }, { left: "Xayr", right: "До свидания" }] },
      text: {
        ru: { instruction: "Соедините пары", question: "Сопоставьте узбекские и русские слова", explanation: "Эти три слова пригодятся в каждом коротком разговоре." },
        uz: { instruction: "Juftlarni moslang", question: "O‘zbek va ruscha so‘zlarni moslang", explanation: "Bu so‘zlar har bir qisqa suhbatda kerak bo‘ladi." },
        zh: { instruction: "匹配词语", question: "匹配乌兹别克语和俄语词语", explanation: "这些词在简短对话中很常用。" },
        en: { instruction: "Match the pairs", question: "Match Uzbek and Russian words", explanation: "These words are useful in every short conversation." },
      },
    },
    {
      type: "ARRANGE_WORDS", order: 3, payload: { words: ["alaykum", "Assalomu"], correctWords: ["Assalomu", "alaykum"] },
      text: {
        ru: { instruction: "Составьте фразу", question: "Расположите слова в правильном порядке", explanation: "Полная уважительная форма: Assalomu alaykum." },
        uz: { instruction: "Iborani tuzing", question: "So‘zlarni to‘g‘ri tartibga keltiring", explanation: "To‘liq hurmatli shakl: Assalomu alaykum." },
        zh: { instruction: "组成短语", question: "按正确顺序排列单词", explanation: "完整的礼貌问候是 Assalomu alaykum。" },
        en: { instruction: "Build the phrase", question: "Put the words in the correct order", explanation: "The full respectful greeting is Assalomu alaykum." },
      },
    },
    {
      type: "TRANSLATE", order: 4, payload: { acceptedAnswers: ["Rahmat"] },
      text: {
        ru: { instruction: "Переведите на узбекский", question: "Спасибо", explanation: "Спасибо по-узбекски — Rahmat." },
        uz: { instruction: "O‘zbekchaga tarjima qiling", question: "Спасибо", explanation: "Ruscha «Спасибо» — Rahmat." },
        zh: { instruction: "翻译成乌兹别克语", question: "谢谢", explanation: "乌兹别克语中“谢谢”是 Rahmat。" },
        en: { instruction: "Translate into Uzbek", question: "Thank you", explanation: "Thank you in Uzbek is Rahmat." },
      },
    },
  ];

  for (const item of exercises) {
    const exercise = await prisma.exercise.upsert({
      where: { lessonId_order: { lessonId: lesson.id, order: item.order } },
      update: { type: item.type, payload: JSON.stringify(item.payload), xpReward: 5, status: "PUBLISHED" },
      create: { lessonId: lesson.id, type: item.type, order: item.order, payload: JSON.stringify(item.payload), xpReward: 5, status: "PUBLISHED" },
    });
    await upsertTranslations("exercise", exercise.id, item.text);
    for (const [index, optionData] of (item.options ?? []).entries()) {
      const option = await prisma.exerciseOption.upsert({
        where: { exerciseId_order: { exerciseId: exercise.id, order: index + 1 } },
        update: { isCorrect: optionData.correct },
        create: { exerciseId: exercise.id, order: index + 1, isCorrect: optionData.correct },
      });
      await upsertTranslations("option", option.id, Object.fromEntries(localeData.map((locale) => [locale, { text: optionData.text[locale] }])))
    }
  }
}

async function main() {
  await seedOwner();
  await seedDemoCourse();
  for (const content of [zhUzCourse, zhRuCourse]) {
    const course = await seedCourseContent(prisma, content);
    console.log(`Course ${course.slug}: ${content.modules.reduce((sum, item) => sum + item.lessons.length, 0)} lessons`);
  }
  console.log("Gapir seed completed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
  await disposePlatformProxy?.();
});
