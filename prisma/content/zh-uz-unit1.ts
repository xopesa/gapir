// Course "Uzbek for Chinese speakers" (zh → uz).
// Unit 1 source: 乌兹别克语教程(1), 1-dars (vowels, greeting) and 2-dars (b/p/d/t,
// syllables & stress, "Bu… / U…", first words, farewell, Uzbekistan).
// Further units live in their own files (zh-uz-unit2.ts, …).
import { I, same, word, type CourseContent } from "./common";
import { unit2 } from "./zh-uz-unit2";

export type { ContentLocale, CourseContent, ExerciseContent, LessonContent, Mascot, ModuleContent, Text } from "./common";
export const zhUzCourse: CourseContent = {
  slug: "zh-uz-a1",
  sourceLanguage: "zh",
  targetLanguage: "uz",
  level: "A1",
  order: 2,
  title: { zh: "乌兹别克语入门", ru: "Узбекский для китайцев", uz: "Xitoyliklar uçun özbek tili", en: "Uzbek for Chinese speakers" },
  description: {
    zh: "和熊猫、小龙、小老虎一起，从字母和问候开始学乌兹别克语。",
    ru: "Узбекский с нуля для носителей китайского: буквы, звуки и первые фразы вместе с пандой, дракончиком и тигрёнком.",
    uz: "Xitoy tilida sözlaşuvçilar uçun özbek tili: harflar, tovuşlar va ilk iboralar.",
    en: "Uzbek from zero for Chinese speakers: letters, sounds and first phrases with Panda, Dragon and Tiger.",
  },
  modules: [
    {
      title: { zh: "第一单元 · 你好，乌兹别克语！", ru: "Юнит 1 · Привет, узбекский!", uz: "1-bölim · Salom, özbek tili!", en: "Unit 1 · Hello, Uzbek!" },
      description: { zh: "字母、元音、问候语和第一批单词", ru: "Буквы, гласные, приветствия и первые слова", uz: "Harflar, unlilar, salomlaşiş va ilk sözlar", en: "Letters, vowels, greetings and first words" },
      lessons: [
        // ── Lesson 1 ─────────────────────────────────────────────── 1-dars 1.1–1.3
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 4,
          title: { zh: "字母与元音 A · O · U", ru: "Алфавит и гласные A · O · U", uz: "Alifbo va A · O · U unlilari", en: "Alphabet and vowels A · O · U" },
          description: { zh: "28 个字母、6 个元音、22 个辅音", ru: "28 букв, 6 гласных, 22 согласных", uz: "28 harf, 6 unli, 22 undoş", en: "28 letters, 6 vowels, 22 consonants" },
          // Short intro: the facts come one by one, each right before its exercise (`teach`).
          theory: {
            zh: "你好！我是熊猫 Paxta，陪你学乌兹别克语。\n今天一步一步记住三个数字：有几个字母，几个元音，几个辅音。然后学元音 A, O, U。",
            ru: "Привет! Я панда Paxta и буду учить узбекский вместе с тобой.\nСегодня по шагам запомним три числа: сколько букв, сколько гласных и сколько согласных. Потом гласные A, O, U.",
            uz: "Salom! Men panda Paxtaman, özbek tilini birga örganamiz.\nBugun qadamma-qadam uçta sonni eslab qolamiz: neçta harf, neçta unli, neçta undoş. Keyin A, O, U unlilari.",
            en: "Hi! I'm Paxta the panda and I'll learn Uzbek with you.\nToday, step by step, we remember three numbers: how many letters, vowels and consonants. Then the vowels A, O, U.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              teach: { zh: "乌兹别克语用拉丁字母书写。\n新字母表一共有 28 个字母。", ru: "Узбекский пишется латиницей.\nВ новом алфавите 28 букв.", uz: "Özbek tili lotin yozuvida.\nYangi alifboda 28 ta harf bor.", en: "Uzbek is written in Latin letters.\nThe new alphabet has 28 letters." },
              question: { zh: "乌兹别克语共有多少个字母？", ru: "Сколько букв в узбекском алфавите?", uz: "Özbek alifbosida neçta harf bor?" },
              explanation: { zh: "新字母表有 28 个字母，外加隔音符号 ʼ。Ö, Ğ, Ş, Ç 代替了旧的 Oʻ, Gʻ, Sh, Ch。", ru: "В новом алфавите 28 букв и знак ʼ. Ö, Ğ, Ş, Ç заменили старые Oʻ, Gʻ, Sh, Ch.", uz: "Yangi alifboda 28 ta harf va ʼ belgisi bor." },
              options: [{ text: same("28"), correct: true }, { text: same("29") }, { text: same("26") }, { text: same("33") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
              teach: { zh: "其中 4 个是新字母：Ö, Ğ, Ş, Ç。\n它们代替旧写法 Oʻ, Gʻ, Sh, Ch，街上还会看到旧写法。", ru: "Четыре буквы новые: Ö, Ğ, Ş, Ç.\nОни заменили старое написание Oʻ, Gʻ, Sh, Ch, на улице его ещё встретишь.", uz: "Törtta harf yangi: Ö, Ğ, Ş, Ç.\nUlar eski Oʻ, Gʻ, Sh, Ch örnida.", en: "Four letters are new: Ö, Ğ, Ş, Ç.\nThey replace the old Oʻ, Gʻ, Sh, Ch, which you will still see in the street." },
              question: { zh: "旧写法 Sh 现在写成哪个字母？", ru: "Какой буквой теперь пишут старое Sh?", uz: "Eski Sh endi qaysi harf bilan yoziladi?" },
              explanation: { zh: "Sh → Ş，Ch → Ç，Oʻ → Ö，Gʻ → Ğ。", ru: "Sh → Ş, Ch → Ç, Oʻ → Ö, Gʻ → Ğ.", uz: "Sh → Ş, Ch → Ç, Oʻ → Ö, Gʻ → Ğ." },
              options: [{ text: same("Ş"), correct: true }, { text: same("Ç") }, { text: same("S") }, { text: same("Ğ") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              teach: { zh: "28 个字母里，元音有 6 个：\na, o, u, ö, i, e", ru: "Из 28 букв гласных 6:\na, o, u, ö, i, e", uz: "28 ta harfdan 6 tasi unli:\na, o, u, ö, i, e", en: "Of the 28 letters, 6 are vowels:\na, o, u, ö, i, e" },
              question: { zh: "乌兹别克语有几个元音？", ru: "Сколько в узбекском гласных?", uz: "Özbek tilida neçta unli bor?" },
              explanation: { zh: "6 个元音：a, o, u, ö, i, e。", ru: "6 гласных: a, o, u, ö, i, e.", uz: "6 ta unli: a, o, u, ö, i, e." },
              options: [{ text: same("6"), correct: true }, { text: same("5") }, { text: same("7") }, { text: same("24") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "哪一组全是元音？", ru: "В какой группе только гласные?", uz: "Qaysi guruhda faqat unlilar bor?" },
              explanation: { zh: "a, o, u 都是元音；b, d, t 是辅音。", ru: "a, o, u — гласные; b, d, t — согласные.", uz: "a, o, u — unlilar; b, d, t — undoşlar." },
              options: [{ text: same("a, o, u"), correct: true }, { text: same("b, d, t") }, { text: same("a, b, u") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              teach: { zh: "其余的都是辅音：\n28 个字母减去 6 个元音，剩下 22 个辅音，比如 b, d, t。", ru: "Остальные буквы согласные:\n28 букв минус 6 гласных, остаётся 22 согласных, например b, d, t.", uz: "Qolgan harflar undoş:\n28 ta harfdan 6 ta unlini ayirsak, 22 ta undoş qoladi, masalan b, d, t.", en: "All the rest are consonants:\n28 letters minus 6 vowels leaves 22 consonants, like b, d, t." },
              question: { zh: "乌兹别克语有几个辅音字母？", ru: "Сколько в узбекском алфавите согласных букв?", uz: "Özbek alifbosida neçta undoş harf bor?" },
              explanation: { zh: "28 − 6 = 22：22 个辅音字母。", ru: "28 − 6 = 22: согласных букв 22.", uz: "28 − 6 = 22: 22 ta undoş harf." },
              options: [{ text: same("22"), correct: true }, { text: same("24") }, { text: same("6") }, { text: same("28") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "a", speak: "a", instruction: I.choose,
              teach: { zh: "A a：嘴张开，嘴唇舒展。\n和汉语的 a 很像。", ru: "A a: рот открыт, губы растянуты.\nПочти как китайское a.", uz: "A a: oğiz oçiq, lablar yoyiq.", en: "A a: mouth open, lips spread.\nVery close to Chinese a." },
              question: { zh: "发元音 A 时，嘴唇……", ru: "Как работают губы при звуке A?", uz: "A tovuşida lablar qanday böladi?" },
              explanation: { zh: "A 是舌前、低、展唇元音，和汉语单韵母 a 比较接近。", ru: "A — передний низкий нелабиализованный гласный, близок к китайскому a.", uz: "A — old qator, quyi keng, lablanmagan unli." },
              options: [
                { text: { zh: "舒展（展唇）", ru: "растянуты", uz: "yoyiq" }, correct: true },
                { text: { zh: "撮圆（圆唇）", ru: "округлены", uz: "dömboq (lablangan)" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "o", speak: "o", instruction: I.choose,
              teach: { zh: "O o：舌头往后缩，嘴唇撮圆。", ru: "O o: язык отодвинут назад, губы округлены.", uz: "O o: til orqaga tortiladi, lablar dömboq.", en: "O o: tongue pulled back, lips rounded." },
              question: { zh: "O 是什么样的元音？", ru: "Какой это гласный — O?", uz: "O qanday unli?" },
              explanation: { zh: "O：舌后、低、圆唇。舌头后缩，下腭向下，双唇撮圆。", ru: "O: задний, низкий, губы округлены.", uz: "O: orqa qator, quyi keng, lablangan." },
              options: [
                { text: { zh: "舌后、低、圆唇", ru: "задний, низкий, округлый", uz: "orqa, quyi, lablangan" }, correct: true },
                { text: { zh: "舌前、高、展唇", ru: "передний, высокий, растянутый", uz: "old, yuqori, lablanmagan" } },
                { text: { zh: "舌前、低、展唇", ru: "передний, низкий, растянутый", uz: "old, quyi, lablanmagan" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "u", speak: "u", instruction: I.choose,
              teach: { zh: "U u：像汉语的 u，\n但双唇再往前伸一点。", ru: "U u: как китайское u,\nно губы вытянуты вперёд ещё сильнее.", uz: "U u: xitoyça u ga öxşaydi,\nlekin lablar köproq oldinga çöziladi.", en: "U u: like Chinese u,\nbut push the lips further forward." },
              question: { zh: "关于 U，哪个说法正确？", ru: "Что верно про звук U?", uz: "U haqida qaysi gap töğri?" },
              explanation: { zh: "U 和汉语的 u 相似，但双唇要更向前伸出。", ru: "U похож на китайское u, но губы вытянуты вперёд сильнее.", uz: "U xitoyça u ga öxşaydi, lekin lablar oldinga köproq çöziladi." },
              options: [
                { text: { zh: "像汉语 u，但双唇更向前伸", ru: "как китайское u, но губы сильнее вперёд", uz: "xitoyça u kabi, lablar oldinroq" }, correct: true },
                { text: { zh: "像汉语 i，嘴唇展开", ru: "как китайское i, губы растянуты", uz: "xitoyça i kabi, lablar yoyiq" } },
                { text: { zh: "发音时声带不振动", ru: "голосовые связки не работают", uz: "ovoz payçalari titramaydi" } },
              ],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把大写字母和小写字母配对", ru: "Соедините заглавные и строчные буквы", uz: "Katta va kiçik harflarni moslang" },
              explanation: { zh: "katta harf 大写体，kiçik harf 小写体。", ru: "katta harf — заглавная, kiçik harf — строчная.", uz: "Katta harf va kiçik harf juftlari." },
              pairs: [{ left: "A", right: "a" }, { left: "O", right: "o" }, { left: "U", right: "u" }, { left: "Ö", right: "ö" }],
            },
          ],
        },
        // ── Lesson 2 ─────────────────────────────────────────────── 1-dars 1.3–1.5
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "元音 Ö · I · E", ru: "Гласные Ö · I · E", uz: "Ö · I · E unlilari", en: "Vowels Ö · I · E" },
          description: { zh: "后三个元音和元音的分类", ru: "Ещё три гласные и их классификация", uz: "Qolgan uçta unli va ularning tasnifi", en: "Three more vowels and how vowels are classified" },
          theory: {
            zh: "Ö ö — 舌后、次高、圆唇，接近汉语的 o。它总在词的第一个音节出现：böz, döppi, közgu。\nI i — 舌前、高、展唇，接近汉语的 i，发得短促。\nE e — 舌前、次高、展唇，介于英语 let 和 sit 之间。\n小老虎 Bars 的记忆法：圆唇 o, u, ö；展唇 a, i, e。\n前元音 a, i, e；后元音 o, u, ö。高元音 i, u；次高 e, ö；低元音 a, o。",
            ru: "Ö ö — задний, средне-высокий, округлый; близок к китайскому o. Встречается только в первом слоге: böz, döppi, közgu.\nI i — передний, высокий, губы растянуты; как китайское i, но короче.\nE e — передний, средне-высокий, растянутый; между английскими let и sit.\nПодсказка тигрёнка Bars: округлые o, u, ö; растянутые a, i, e.\nПередние a, i, e; задние o, u, ö. Высокие i, u; средние e, ö; низкие a, o.",
            uz: "Ö ö — orqa qator, örta keng, lablangan. Faqat birinçi böğinda keladi: böz, döppi, közgu.\nI i — old qator, yuqori tor, lablanmagan.\nE e — old qator, örta keng, lablanmagan.\nLablangan: o, u, ö; lablanmagan: a, i, e.\nOld qator: a, i, e; orqa qator: o, u, ö.",
            en: "Ö ö — back, mid-high, rounded; close to Chinese o. It only appears in the first syllable: böz, döppi, közgu.\nI i — front, high, unrounded; like Chinese i, but short.\nE e — front, mid-high, unrounded; between English let and sit.\nBars the tiger's tip: rounded o, u, ö; unrounded a, i, e.\nFront a, i, e; back o, u, ö. High i, u; mid e, ö; low a, o.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "ö", speak: "ö", instruction: I.choose,
              question: { zh: "Ö 最接近汉语的哪个单韵母？", ru: "К какому китайскому гласному ближе всего Ö?", uz: "Ö xitoy tilidagi qaysi unliga yaqin?" },
              explanation: { zh: "Ö 接近汉语单韵母 o，但舌面比发 u 时略低，口开得大些。", ru: "Ö близок к китайскому o.", uz: "Ö xitoyça o ga yaqin." },
              options: [{ text: same("o"), correct: true }, { text: same("a") }, { text: same("i") }, { text: same("e") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "Ö 总出现在词的哪个音节？", ru: "В каком слоге встречается Ö?", uz: "Ö sözning qaysi böğinida keladi?" },
              explanation: { zh: "Ö 总在第一个音节：böz, döppi, közgu。", ru: "Всегда в первом слоге: böz, döppi, közgu.", uz: "Doim birinçi böğinda: böz, döppi, közgu." },
              options: [
                { text: { zh: "第一个音节", ru: "в первом", uz: "birinçi böğinda" }, correct: true },
                { text: { zh: "最后一个音节", ru: "в последнем", uz: "oxirgi böğinda" } },
                { text: { zh: "任何音节", ru: "в любом", uz: "istalgan böğinda" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "i", speak: "i", instruction: I.choose,
              question: { zh: "I 是什么样的元音？", ru: "Какой это гласный — I?", uz: "I qanday unli?" },
              explanation: { zh: "I：舌前、高、展唇，与汉语 i 接近，并短促发音。", ru: "I: передний, высокий, растянутый, короткий.", uz: "I: old qator, yuqori, lablanmagan." },
              options: [
                { text: { zh: "舌前、高、展唇", ru: "передний, высокий, растянутый", uz: "old, yuqori, lablanmagan" }, correct: true },
                { text: { zh: "舌后、高、圆唇", ru: "задний, высокий, округлый", uz: "orqa, yuqori, lablangan" } },
                { text: { zh: "舌前、低、展唇", ru: "передний, низкий, растянутый", uz: "old, quyi, lablanmagan" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "e", speak: "e", instruction: I.choose,
              question: { zh: "E 的发音介于……", ru: "Звук E находится между…", uz: "E tovuşi … oraliğida" },
              explanation: { zh: "E 介于英语 let 中的 e 和 sit 中的 i 之间。", ru: "Между e в let и i в sit.", uz: "Inglizça let va sit oraliğida." },
              options: [
                { text: { zh: "英语 let 和 sit 之间", ru: "английскими let и sit", uz: "inglizça let va sit" }, correct: true },
                { text: { zh: "英语 arm 和 bought 之间", ru: "английскими arm и bought", uz: "inglizça arm va bought" } },
                { text: { zh: "汉语 a 和 o 之间", ru: "китайскими a и o", uz: "xitoyça a va o" } },
              ],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把元音和它的特点配对", ru: "Соедините гласный и его признаки", uz: "Unlini belgisi bilan moslang" },
              explanation: { zh: "高：i, u；低：a, o。展唇：a, i；圆唇：o, u。", ru: "Высокие i, u; низкие a, o. Растянутые a, i; округлые o, u.", uz: "Yuqori: i, u; quyi: a, o." },
              pairs: [{ left: "i", right: "高 · 展唇" }, { left: "u", right: "高 · 圆唇" }, { left: "a", right: "低 · 展唇" }, { left: "o", right: "低 · 圆唇" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              question: { zh: "哪一组全是圆唇元音？", ru: "В какой группе все гласные округлые?", uz: "Qaysi guruhda hamma unlilar lablangan?" },
              explanation: { zh: "圆唇元音：o, u, ö；展唇元音：a, i, e。", ru: "Округлые: o, u, ö; растянутые: a, i, e.", uz: "Lablangan: o, u, ö; lablanmagan: a, i, e." },
              options: [{ text: same("o, u, ö"), correct: true }, { text: same("a, i, e") }, { text: same("a, o, u") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              question: { zh: "哪一组全是前元音？", ru: "В какой группе все гласные передние?", uz: "Qaysi guruhda hamma unlilar old qator?" },
              explanation: { zh: "前元音：a, i, e；后元音：o, u, ö。", ru: "Передние: a, i, e; задние: o, u, ö.", uz: "Old qator: a, i, e; orqa qator: o, u, ö." },
              options: [{ text: same("a, i, e"), correct: true }, { text: same("o, u, ö") }, { text: same("i, u, e") }],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "写出这个元音：舌后、次高、圆唇", ru: "Напишите гласный: задний, средне-высокий, округлый", uz: "Unlini yozing: orqa qator, örta keng, lablangan" },
              explanation: { zh: "这是 ö（旧写法 oʻ）。用下面的 ö 键输入，也可以输入 oʻ 或 o'。", ru: "Это ö (по-старому oʻ). Есть кнопка ö; можно набрать и oʻ или o'.", uz: "Bu ö (eskiça oʻ). ö tugmasidan foydalaning yoki oʻ deb yozing." },
              acceptedAnswers: ["ö"], tiles: ["ö", "o", "u", "a"],
            },
          ],
        },
        // ── Lesson 3 ─────────────────────────────────────────────── 1-dars 1.6–1.7, 2-dars 2.7
        {
          type: "CONVERSATION", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "问候与告别", ru: "Приветствие и прощание", uz: "Salomlaşiş va xayrlaşiş", en: "Hello and goodbye" },
          description: { zh: "Assalomu alaykum! Xayr!", ru: "Assalomu alaykum! Xayr!", uz: "Assalomu alaykum! Xayr!", en: "Assalomu alaykum! Xayr!" },
          theory: {
            zh: "— Assalomu alaykum! 您好！源自阿拉伯语，意思是“愿您平安健康”。\n— Vaalaykum assalom! 您好！回答问候：“也祝您平安健康”。\n— Xayr! 再见！\n— Körişgunça xayr! 再见！（直到再见面）\n小龙 Olov 说：乌兹别克人很重视礼节。年轻人先向长者问候，骑马者先向步行者，步行者先向坐着的人，少数人先向多数人问候。",
            ru: "— Assalomu alaykum! Здравствуйте! Из арабского: «мир вам и здоровья».\n— Vaalaykum assalom! Здравствуйте! Ответ: «и вам мира и здоровья».\n— Xayr! До свидания!\n— Körişgunça xayr! До встречи!\nДракончик Olov: узбеки очень ценят этикет. Первым здоровается младший со старшим, всадник с пешим, идущий с сидящим, меньшая группа с большей.",
            uz: "— Assalomu alaykum! Arab tilidan: «sizga tinçlik va salomatlik tilayman».\n— Vaalaykum assalom! Javob: «sizga ham tinçlik tilayman».\n— Xayr!\n— Körişgunça xayr!\nOdob: kiçik kattaga, otliq piyodaga, yurgan ötirganga, oz köpçilikka birinçi salom beradi.",
            en: "— Assalomu alaykum! Hello! From Arabic: “peace and health be with you”.\n— Vaalaykum assalom! The reply: “and peace be with you too”.\n— Xayr! Goodbye!\n— Körişgunça xayr! See you!\nOlov the dragon says: Uzbeks value etiquette. The younger greet the elder first, a rider greets a walker, a walker greets someone sitting, a few greet the many.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Assalomu alaykum!", speak: "Assalomu alaykum!", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит эта фраза?", uz: "Bu ibora nimani anglatadi?" },
              explanation: { zh: "Assalomu alaykum 是见面时的问候语：“愿您平安健康”。", ru: "Assalomu alaykum — приветствие при встрече: «мир вам».", uz: "Assalomu alaykum — uçraşganda aytiladigan salom." },
              options: [word("您好！", "Здравствуйте!", "👋", true), word("再见！", "До свидания!", "🚶"), word("谢谢！", "Спасибо!", "🙏")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "别人对你说 “Assalomu alaykum!”，你应该回答：", ru: "Вам говорят «Assalomu alaykum!». Что ответить?", uz: "Sizga «Assalomu alaykum!» deyişdi. Nima deysiz?" },
              explanation: { zh: "接受问候的人回答 “Vaalaykum assalom!”。", ru: "Отвечают «Vaalaykum assalom!».", uz: "«Vaalaykum assalom!» deb javob beriladi." },
              options: [{ text: same("Vaalaykum assalom!"), correct: true }, { text: same("Assalomu alaykum!") }, { text: same("Xayr!") }],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "您好！（问候）", ru: "Здравствуйте! (приветствие)", uz: "Salom bering" },
              explanation: { zh: "问候：Assalomu alaykum!", ru: "Приветствие: Assalomu alaykum!", uz: "Salom: Assalomu alaykum!" },
              words: ["alaykum", "Xayr", "Assalomu", "assalom"], correctWords: ["Assalomu", "alaykum"],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "您好！（回答问候）", ru: "Здравствуйте! (ответ на приветствие)", uz: "Salomga javob bering" },
              explanation: { zh: "回答：Vaalaykum assalom!", ru: "Ответ: Vaalaykum assalom!", uz: "Javob: Vaalaykum assalom!" },
              words: ["assalom", "alaykum", "Vaalaykum", "xayr"], correctWords: ["Vaalaykum", "assalom"],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Xayr!", speak: "Xayr!", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит эта фраза?", uz: "Bu ibora nimani anglatadi?" },
              explanation: { zh: "Xayr! 是告别语：再见！", ru: "Xayr! — до свидания.", uz: "Xayr! — xayrlaşuv sözi." },
              options: [word("再见！", "До свидания!", "👋", true), word("您好！", "Здравствуйте!", "🙂"), word("谢谢！", "Спасибо!", "🙏")],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把乌兹别克语和中文配对", ru: "Соедините узбекские фразы с китайскими", uz: "Özbekça va xitoyça iboralarni moslang" },
              explanation: { zh: "两句问候，两句告别。", ru: "Два приветствия и два прощания.", uz: "Ikki salom va ikki xayrlaşuv." },
              pairs: [
                { left: "Assalomu alaykum!", right: "您好！（问候）" },
                { left: "Vaalaykum assalom!", right: "您好！（回答）" },
                { left: "Xayr!", right: "再见！" },
                { left: "Körişgunça xayr!", right: "回头见！" },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "按照乌兹别克礼节，谁应该先问候？", ru: "Кто, по узбекскому этикету, здоровается первым?", uz: "Odob böyiça kim birinçi salom beradi?" },
              explanation: { zh: "年轻人先向长者问候；骑马者先向步行者；步行者先向坐着的人；少数人先向多数人。", ru: "Младший — старшему, всадник — пешему, идущий — сидящему, меньшинство — большинству.", uz: "Kiçik kattaga, otliq piyodaga, yurgan ötirganga, oz köpçilikka." },
              options: [
                { text: { zh: "年轻人先向长者问候", ru: "младший старшему", uz: "kiçik kattaga" }, correct: true },
                { text: { zh: "长者先向年轻人问候", ru: "старший младшему", uz: "katta kiçikka" } },
                { text: { zh: "坐着的人先向步行者问候", ru: "сидящий идущему", uz: "ötirgan yurganga" } },
              ],
            },
            {
              type: "TRANSLATE", mascot: "tiger", prompt: "— Assalomu alaykum!\n— …", instruction: I.type,
              question: { zh: "回答问候", ru: "Ответьте на приветствие", uz: "Salomga javob bering" },
              explanation: { zh: "回答：Vaalaykum assalom!", ru: "Ответ: Vaalaykum assalom!", uz: "Javob: Vaalaykum assalom!" },
              acceptedAnswers: ["Vaalaykum assalom", "Va alaykum assalom"], tiles: ["assalom", "Vaalaykum", "Xayr", "rahmat"],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "再见！（直到再见面）", ru: "До встречи!", uz: "«Körişgunça» bilan xayrlaşing" },
              explanation: { zh: "Körişgunça xayr! 字面意思是“直到再见面，再见”。", ru: "Körişgunça xayr! — «до встречи, до свидания».", uz: "Körişgunça xayr!" },
              acceptedAnswers: ["Körişgunça xayr"], tiles: ["xayr", "Körişgunça", "Salom", "rahmat"],
            },
          ],
        },
        // ── Lesson 4 ─────────────────────────────────────────────── 2-dars 2.1–2.2
        {
          type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "辅音 B · P · D · T 与重音", ru: "Согласные B · P · D · T и ударение", uz: "B · P · D · T undoşlari va urğu", en: "Consonants B · P · D · T and stress" },
          description: { zh: "清浊辅音、音节和重音", ru: "Звонкие и глухие, слоги и ударение", uz: "Jarangli va jarangsiz undoşlar, böğin, urğu", en: "Voiced and voiceless, syllables and stress" },
          theory: {
            zh: "B b — 双唇浊塞音，声带振动：bola, kitob, Bobur。\nP p — 双唇清塞音，声带不振动：payt, opa, papka。\nD d — 舌前浊塞音：舌前部抵上齿背和上齿龈，声带振动：dada, döppi, davlat。T t — 舌前清塞音，部位相同，声带不振动：ota, talaba, taom。\n音节以元音为核心：一个词里有几个元音，就有几个音节。o-ta, bo-bo, ol-ma, ars-lon, so-at。\n重音一般落在最后一个音节：otá, bobó, dasturxón。外来词保持原来的重音：pápka。",
            ru: "B b — губно-губной звонкий: bola, kitob, Bobur.\nP p — губно-губной глухой: payt, opa, papka.\nD d — переднеязычный звонкий: кончик языка у верхних зубов и дёсен: dada, döppi, davlat. T t — то же место, но глухой: ota, talaba, taom.\nВ слове столько слогов, сколько гласных: o-ta, bo-bo, ol-ma, ars-lon, so-at.\nУдарение обычно на последнем слоге: otá, bobó, dasturxón. Заимствования сохраняют своё ударение: pápka.",
            uz: "B b — lab-lab jarangli undoş: bola, kitob, Bobur.\nP p — lab-lab jarangsiz undoş: payt, opa, papka.\nD d — jarangli, T t — jarangsiz: dada, ota, talaba.\nSözda neçta unli bölsa, şunça böğin bor: o-ta, bo-bo, ol-ma, ars-lon, so-at.\nUrğu odatda oxirgi böğinga tuşadi: otá, bobó.",
            en: "B b — voiced bilabial stop: bola, kitob, Bobur.\nP p — voiceless bilabial stop: payt, opa, papka.\nD d is voiced, T t is voiceless: dada, ota, talaba.\nA word has as many syllables as vowels: o-ta, bo-bo, ol-ma, ars-lon, so-at.\nStress usually falls on the last syllable: otá, bobó, dasturxón. Loanwords keep their stress: pápka.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "B 和 P 有什么区别？", ru: "Чем различаются B и P?", uz: "B va P ning farqi nimada?" },
              explanation: { zh: "两个都是双唇塞音：发 B 时声带振动，发 P 时声带不振动。", ru: "Оба губно-губные: B звонкий, P глухой.", uz: "B jarangli, P jarangsiz." },
              options: [
                { text: { zh: "B 声带振动，P 不振动", ru: "B звонкий, P глухой", uz: "B jarangli, P jarangsiz" }, correct: true },
                { text: { zh: "B 不振动，P 振动", ru: "B глухой, P звонкий", uz: "B jarangsiz, P jarangli" } },
                { text: { zh: "没有区别", ru: "ничем", uz: "farqi yöq" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "D 和 T，哪个是清辅音（声带不振动）？", ru: "Какой из звуков глухой — D или T?", uz: "D va T dan qaysi biri jarangsiz?" },
              explanation: { zh: "T 是清辅音，D 是浊辅音。", ru: "T глухой, D звонкий.", uz: "T jarangsiz, D jarangli." },
              options: [{ text: same("T"), correct: true }, { text: same("D") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "dada", speak: "dada", instruction: I.choose,
              question: { zh: "这个词有几个音节？", ru: "Сколько слогов в слове?", uz: "Bu sözda neçta böğin bor?" },
              explanation: { zh: "dada 有两个元音，所以有两个音节：da-da。", ru: "Две гласные — два слога: da-da.", uz: "Ikki unli — ikki böğin: da-da." },
              options: [{ text: same("2"), correct: true }, { text: same("1") }, { text: same("3") }, { text: same("4") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "talaba", speak: "talaba", instruction: I.choose,
              question: { zh: "这个词有几个音节？", ru: "Сколько слогов в слове?", uz: "Bu sözda neçta böğin bor?" },
              explanation: { zh: "ta-la-ba：三个元音，三个音节。", ru: "ta-la-ba: три гласные, три слога.", uz: "ta-la-ba: uç böğin." },
              options: [{ text: same("3"), correct: true }, { text: same("2") }, { text: same("4") }],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和音节划分配对", ru: "Соедините слово и его деление на слоги", uz: "Sözni böğinlari bilan moslang" },
              explanation: { zh: "一个辅音归后；两个辅音前后各一；三个辅音前二后一；两个元音相邻时分开。", ru: "Один согласный — к следующему слогу; два — делятся; из трёх два остаются в первом; соседние гласные разделяются.", uz: "Böğinga ajratiş qoidalari." },
              pairs: [{ left: "bobo", right: "bo-bo" }, { left: "olma", right: "ol-ma" }, { left: "arslon", right: "ars-lon" }, { left: "soat", right: "so-at" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "乌兹别克语的重音一般落在……", ru: "Ударение в узбекском обычно падает на…", uz: "Özbek tilida urğu odatda … tuşadi" },
              explanation: { zh: "重音一般落在最末一个音节：otá, bobó。", ru: "На последний слог: otá, bobó.", uz: "Oxirgi böğinga: otá, bobó." },
              options: [
                { text: { zh: "最后一个音节", ru: "последний слог", uz: "oxirgi böğinga" }, correct: true },
                { text: { zh: "第一个音节", ru: "первый слог", uz: "birinçi böğinga" } },
                { text: { zh: "倒数第二个音节", ru: "предпоследний слог", uz: "oxiridan ikkinçi böğinga" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "bobo", speak: "bobo", instruction: I.choose,
              question: { zh: "重音在哪里？", ru: "Где ударение?", uz: "Urğu qayerda?" },
              explanation: { zh: "bobó — 重音在最后一个音节。", ru: "bobó — ударение на последнем слоге.", uz: "bobó — urğu oxirgi böğinda." },
              options: [{ text: same("bobó"), correct: true }, { text: same("bóbo") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "papka", speak: "papka", instruction: I.choose,
              question: { zh: "papka 来自俄语。它的重音在哪里？", ru: "papka — заимствование из русского. Где ударение?", uz: "papka rus tilidan olingan. Urğu qayerda?" },
              explanation: { zh: "外来词保持原语言的重音：pápka。", ru: "Заимствования сохраняют ударение: pápka.", uz: "Özlaşma sözlar asl urğusini saqlaydi: pápka." },
              options: [{ text: same("pápka"), correct: true }, { text: same("papká") }],
            },
          ],
        },
        // ── Lesson 5 ─────────────────────────────────────────────── 2-dars 2.3–2.5 (family)
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "Bu kim? 家人", ru: "Bu kim? Семья", uz: "Bu kim? Oila", en: "Bu kim? Family" },
          description: { zh: "Bu … / U … 和第一批单词", ru: "Bu … / U … и первые слова", uz: "Bu … / U … va ilk sözlar", en: "Bu … / U … and first words" },
          theory: {
            zh: "Bu … — 这是……（近处的人或物）\nU … — 那是……；也表示“他／她／它”（远处）\n陈述句用降调：Bu bobo. U ota.\n新词：bobo 爷爷 · ota 父亲 · dada 爸爸 · opa 姐姐 · talaba 大学生",
            ru: "Bu … — это … (близко)\nU … — то …; а также «он / она / оно» (далеко)\nПовествовательное предложение произносится с понижением: Bu bobo. U ota.\nСлова: bobo дедушка · ota отец · dada папа · opa старшая сестра · talaba студент",
            uz: "Bu … — yaqindagi narsa yoki odam\nU … — uzoqdagi; şuningdek «u» olmoşi\nDarak gap pasayuvçi ohang bilan aytiladi: Bu bobo. U ota.\nSözlar: bobo · ota · dada · opa · talaba",
            en: "Bu … — this is … (near)\nU … — that is …; also “he / she / it” (far)\nStatements fall in pitch: Bu bobo. U ota.\nWords: bobo grandfather · ota father · dada dad · opa elder sister · talaba student",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "ota", speak: "ota", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "ota — 父亲。", ru: "ota — отец.", uz: "ota — otasi." },
              options: [word("父亲", "отец", "👨", true), word("姐姐", "старшая сестра", "👩"), word("爷爷", "дедушка", "👴"), word("大学生", "студент", "🧑‍🎓")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "opa", speak: "opa", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "opa — 姐姐。", ru: "opa — старшая сестра.", uz: "opa — opa." },
              options: [word("爷爷", "дедушка", "👴"), word("姐姐", "старшая сестра", "👩", true), word("父亲", "отец", "👨"), word("狗", "собака", "🐕")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "bobo", speak: "bobo", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "bobo — 爷爷、祖父，也指祖辈。", ru: "bobo — дедушка, предок.", uz: "bobo — buva, ajdod." },
              options: [word("大学生", "студент", "🧑‍🎓"), word("父亲", "отец", "👨"), word("爷爷", "дедушка", "👴", true), word("姐姐", "старшая сестра", "👩")],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Sözni maʼnosi bilan moslang" },
              explanation: { zh: "bobo 爷爷，dada 爸爸，opa 姐姐，talaba 大学生。", ru: "bobo дедушка, dada папа, opa сестра, talaba студент.", uz: "bobo, dada, opa, talaba." },
              pairs: [{ left: "bobo", right: "爷爷" }, { left: "dada", right: "爸爸" }, { left: "opa", right: "姐姐" }, { left: "talaba", right: "大学生" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
              question: { zh: "“这是爷爷。”用乌兹别克语怎么说？", ru: "Как сказать «Это дедушка»?", uz: "«Bu — bobo» qanday aytiladi?" },
              explanation: { zh: "近处用 Bu：Bu bobo.", ru: "Для близкого — Bu: Bu bobo.", uz: "Yaqin uçun Bu: Bu bobo." },
              options: [{ text: same("Bu bobo."), correct: true }, { text: same("U bobo.") }, { text: same("Bu ota.") }],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "那是姐姐。", ru: "То — старшая сестра.", uz: "Uzoqdagi opani körsating" },
              explanation: { zh: "远处用 U：U opa.", ru: "Для далёкого — U: U opa.", uz: "Uzoq uçun U: U opa." },
              words: ["opa", "Bu", "U", "ota"], correctWords: ["U", "opa"],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "这是大学生。", ru: "Это студент.", uz: "Yaqindagi talabani körsating" },
              explanation: { zh: "Bu talaba.", ru: "Bu talaba.", uz: "Bu talaba." },
              words: ["talaba", "U", "Bu", "bobo"], correctWords: ["Bu", "talaba"],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "这是爸爸。", ru: "Это папа.", uz: "«Bu» bilan dadani körsating" },
              explanation: { zh: "Bu dada. （父亲是 ota，爸爸是 dada）", ru: "Bu dada. (отец — ota, папа — dada)", uz: "Bu dada." },
              acceptedAnswers: ["Bu dada", "Bu ota"], tiles: ["dada", "Bu", "ona", "U"],
            },
          ],
        },
        // ── Lesson 6 ─────────────────────────────────────────────── 2-dars 2.5, 2.8 (things, Uzbekistan)
        {
          type: "VOCABULARY", xpReward: 25, estimatedMinutes: 6,
          title: { zh: "Bu nima? 物品与乌兹别克斯坦", ru: "Bu nima? Вещи и Узбекистан", uz: "Bu nima? Buyumlar va Özbekiston", en: "Bu nima? Things and Uzbekistan" },
          description: { zh: "it, pul, papka, döppi 和丝绸之路", ru: "it, pul, papka, döppi и Шёлковый путь", uz: "it, pul, papka, döppi va Ipak yöli", en: "it, pul, papka, döppi and the Silk Road" },
          theory: {
            zh: "新词：it 狗 · pul 钱 · papka 文件夹 · döppi（民族式）花帽 · odatda 通常\n小龙 Olov 讲背景知识：乌兹别克斯坦位于中亚中部，邻国也都没有出海口，所以被称为“双内陆国家”。\n它是著名的“丝绸之路”古国，自古就通过丝绸之路与中国有着悠久的联系。",
            ru: "Слова: it собака · pul деньги · papka папка · döppi тюбетейка · odatda обычно\nДракончик Olov: Узбекистан находится в центре Средней Азии. У его соседей тоже нет выхода к морю, поэтому его называют «дважды внутриконтинентальной страной».\nЭто древняя страна Шёлкового пути, издавна связанная с Китаем.",
            uz: "Sözlar: it · pul · papka · döppi · odatda\nÖzbekiston Markaziy Osiyoning markazida joylaşgan. Qöşnilarining ham dengizga çiqiş yöli yöq.\nÖzbekiston qadimiy Ipak yöli mamlakati bölib, Xitoy bilan azaldan boğlangan.",
            en: "Words: it dog · pul money · papka folder · döppi skullcap · odatda usually\nOlov the dragon: Uzbekistan lies in the heart of Central Asia, and its neighbours are landlocked too, so it is called “doubly landlocked”.\nIt is an ancient Silk Road country with long ties to China.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "it", speak: "it", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "it — 狗。", ru: "it — собака.", uz: "it — it." },
              options: [word("狗", "собака", "🐕", true), word("钱", "деньги", "💵"), word("文件夹", "папка", "📁")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "pul", speak: "pul", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "pul — 钱。", ru: "pul — деньги.", uz: "pul — pul." },
              options: [word("文件夹", "папка", "📁"), word("钱", "деньги", "💵", true), word("狗", "собака", "🐕")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "döppi", speak: "döppi", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "döppi 是乌兹别克的民族花帽，常绣有花纹。", ru: "döppi — узбекская тюбетейка с вышивкой.", uz: "döppi — milliy boş kiyim." },
              options: [word("花帽", "тюбетейка", undefined, true), word("钱", "деньги", "💵"), word("姐姐", "старшая сестра", "👩")],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Sözni maʼnosi bilan moslang" },
              explanation: { zh: "it 狗，pul 钱，papka 文件夹，döppi 花帽。", ru: "it собака, pul деньги, papka папка, döppi тюбетейка.", uz: "it, pul, papka, döppi." },
              pairs: [{ left: "it", right: "狗" }, { left: "pul", right: "钱" }, { left: "papka", right: "文件夹" }, { left: "döppi", right: "花帽" }],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "这是钱。", ru: "Это деньги.", uz: "Yaqindagi pulni körsating" },
              explanation: { zh: "Bu pul.", ru: "Bu pul.", uz: "Bu pul." },
              words: ["pul", "U", "Bu", "it"], correctWords: ["Bu", "pul"],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "那是文件夹。", ru: "То — папка.", uz: "Uzoqdagi papkani körsating" },
              explanation: { zh: "U papka.", ru: "U papka.", uz: "U papka." },
              words: ["Bu", "papka", "pul", "U"], correctWords: ["U", "papka"],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "乌兹别克斯坦被称为……", ru: "Узбекистан называют…", uz: "Özbekistonni … deb ataşadi" },
              explanation: { zh: "它和所有邻国都没有出海口，所以是“双内陆国家”。", ru: "Ни у него, ни у соседей нет выхода к морю.", uz: "Uning ham, qöşnilarining ham dengizga çiqişi yöq." },
              options: [
                { text: { zh: "双内陆国家", ru: "дважды внутриконтинентальной страной", uz: "ikki karra quruqlik bilan öralgan davlat" }, correct: true },
                { text: { zh: "岛国", ru: "островной страной", uz: "orol davlati" } },
                { text: { zh: "沿海国家", ru: "приморской страной", uz: "dengiz böyidagi davlat" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "乌兹别克斯坦通过哪条古道与中国有着悠久的联系？", ru: "Какой древний путь связывал Узбекистан с Китаем?", uz: "Özbekistonni Xitoy bilan qaysi qadimiy yöl boğlagan?" },
              explanation: { zh: "“丝绸之路”：乌兹别克斯坦曾是商队之路的重要汇合点。", ru: "Шёлковый путь: здесь сходились караванные дороги.", uz: "Ipak yöli: karvon yöllari şu yerda tutaşgan." },
              options: [
                { text: { zh: "丝绸之路", ru: "Шёлковый путь", uz: "Ipak yöli" }, correct: true },
                { text: { zh: "茶马古道", ru: "Чайно-лошадиный путь", uz: "Çoy-ot yöli" } },
                { text: { zh: "京杭大运河", ru: "Великий канал", uz: "Buyuk kanal" } },
              ],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "这是狗。", ru: "Это собака.", uz: "Yaqindagi itni körsating" },
              explanation: { zh: "Bu it.", ru: "Bu it.", uz: "Bu it." },
              acceptedAnswers: ["Bu it"], tiles: ["it", "Bu", "U", "ot"],
            },
          ],
        },
      ],
    },
    unit2,
  ],
};
