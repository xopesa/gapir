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
  title: { zh: "乌兹别克语入门", ru: "Узбекский для китайцев", uz: "Xitoyliklar uchun oʻzbek tili", en: "Uzbek for Chinese speakers" },
  description: {
    zh: "和熊猫、小龙、小老虎一起，从字母和问候开始学乌兹别克语。",
    ru: "Узбекский с нуля для носителей китайского: буквы, звуки и первые фразы вместе с пандой, дракончиком и тигрёнком.",
    uz: "Xitoy tilida soʻzlashuvchilar uchun oʻzbek tili: harflar, tovushlar va ilk iboralar.",
    en: "Uzbek from zero for Chinese speakers: letters, sounds and first phrases with Panda, Dragon and Tiger.",
  },
  modules: [
    {
      title: { zh: "第一单元 · 你好，乌兹别克语！", ru: "Юнит 1 · Привет, узбекский!", uz: "1-boʻlim · Salom, oʻzbek tili!", en: "Unit 1 · Hello, Uzbek!" },
      description: { zh: "字母、元音、问候语和第一批单词", ru: "Буквы, гласные, приветствия и первые слова", uz: "Harflar, unlilar, salomlashish va ilk soʻzlar", en: "Letters, vowels, greetings and first words" },
      lessons: [
        // ── Lesson 1 ─────────────────────────────────────────────── 1-dars 1.1–1.3
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 4,
          title: { zh: "字母与元音 A · O · U", ru: "Алфавит и гласные A · O · U", uz: "Alifbo va A · O · U unlilari", en: "Alphabet and vowels A · O · U" },
          description: { zh: "29 个字母和前三个元音", ru: "29 букв и первые три гласные", uz: "29 harf va dastlabki uchta unli", en: "29 letters and the first three vowels" },
          theory: {
            zh: "你好！我是熊猫 Paxta，陪你学乌兹别克语。\n乌兹别克语用拉丁字母书写，共有 29 个字母、30 个音（辅音 J 有两个发音）。\n其中 6 个是元音：a, o, u, oʻ, i, e，其余 24 个音是辅音。\nA a — 舌前、低、展唇，和汉语的 a 很接近。\nO o — 舌后、低、圆唇，介于英语 arm 和 bought 之间。\nU u — 舌后、高、圆唇，像汉语的 u，但双唇更向前伸。",
            ru: "Привет! Я панда Paxta и буду учить узбекский вместе с тобой.\nУзбекский пишется латиницей: 29 букв и 30 звуков (у J два произношения).\nГласных 6: a, o, u, oʻ, i, e — остальные 24 звука согласные.\nA a — передний, низкий, губы растянуты; почти как китайское a.\nO o — задний, низкий, губы округлены; между английскими arm и bought.\nU u — задний, высокий, губы округлены и вытянуты вперёд сильнее, чем в китайском u.",
            uz: "Salom! Men panda Paxtaman, oʻzbek tilini birga oʻrganamiz.\nOʻzbek tili lotin yozuvida: 29 harf va 30 tovush (J ikki xil talaffuz qilinadi).\nUnlilar 6 ta: a, o, u, oʻ, i, e, qolgan 24 tovush undosh.\nA a — old qator, quyi keng, lablanmagan unli.\nO o — orqa qator, quyi keng, lablangan unli.\nU u — orqa qator, yuqori tor, lablangan unli.",
            en: "Hi! I'm Paxta the panda and I'll learn Uzbek with you.\nUzbek uses the Latin alphabet: 29 letters and 30 sounds (J has two pronunciations).\nThere are 6 vowels: a, o, u, oʻ, i, e; the other 24 sounds are consonants.\nA a — front, low, unrounded; close to Chinese a.\nO o — back, low, rounded; between English arm and bought.\nU u — back, high, rounded; like Chinese u but with lips pushed further forward.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "乌兹别克语共有多少个字母？", ru: "Сколько букв в узбекском алфавите?", uz: "Oʻzbek alifbosida nechta harf bor?" },
              explanation: { zh: "共有 29 个字母、30 个音：辅音 J 有两个发音（joʻja, jurnal）。", ru: "29 букв и 30 звуков: у J два произношения (joʻja, jurnal).", uz: "29 ta harf va 30 ta tovush: J ikki xil oʻqiladi (joʻja, jurnal)." },
              options: [{ text: same("29"), correct: true }, { text: same("26") }, { text: same("33") }, { text: same("24") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "乌兹别克语有几个元音？", ru: "Сколько в узбекском гласных?", uz: "Oʻzbek tilida nechta unli bor?" },
              explanation: { zh: "6 个元音：a, o, u, oʻ, i, e。", ru: "6 гласных: a, o, u, oʻ, i, e.", uz: "6 ta unli: a, o, u, oʻ, i, e." },
              options: [{ text: same("6"), correct: true }, { text: same("5") }, { text: same("7") }, { text: same("24") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "哪一组全是元音？", ru: "В какой группе только гласные?", uz: "Qaysi guruhda faqat unlilar bor?" },
              explanation: { zh: "a, o, u 都是元音；b, d, t 是辅音。", ru: "a, o, u — гласные; b, d, t — согласные.", uz: "a, o, u — unlilar; b, d, t — undoshlar." },
              options: [{ text: same("a, o, u"), correct: true }, { text: same("b, d, t") }, { text: same("a, b, u") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "a", speak: "a", instruction: I.choose,
              question: { zh: "发元音 A 时，嘴唇……", ru: "Как работают губы при звуке A?", uz: "A tovushida lablar qanday boʻladi?" },
              explanation: { zh: "A 是舌前、低、展唇元音，和汉语单韵母 a 比较接近。", ru: "A — передний низкий нелабиализованный гласный, близок к китайскому a.", uz: "A — old qator, quyi keng, lablanmagan unli." },
              options: [
                { text: { zh: "舒展（展唇）", ru: "растянуты", uz: "yoyiq" }, correct: true },
                { text: { zh: "撮圆（圆唇）", ru: "округлены", uz: "doʻmboq (lablangan)" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "o", speak: "o", instruction: I.choose,
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
              question: { zh: "关于 U，哪个说法正确？", ru: "Что верно про звук U?", uz: "U haqida qaysi gap toʻgʻri?" },
              explanation: { zh: "U 和汉语的 u 相似，但双唇要更向前伸出。", ru: "U похож на китайское u, но губы вытянуты вперёд сильнее.", uz: "U xitoycha u ga oʻxshaydi, lekin lablar oldinga koʻproq choʻziladi." },
              options: [
                { text: { zh: "像汉语 u，但双唇更向前伸", ru: "как китайское u, но губы сильнее вперёд", uz: "xitoycha u kabi, lablar oldinroq" }, correct: true },
                { text: { zh: "像汉语 i，嘴唇展开", ru: "как китайское i, губы растянуты", uz: "xitoycha i kabi, lablar yoyiq" } },
                { text: { zh: "发音时声带不振动", ru: "голосовые связки не работают", uz: "ovoz paychalari titramaydi" } },
              ],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把大写字母和小写字母配对", ru: "Соедините заглавные и строчные буквы", uz: "Katta va kichik harflarni moslang" },
              explanation: { zh: "katta harf 大写体，kichik harf 小写体。", ru: "katta harf — заглавная, kichik harf — строчная.", uz: "Katta harf va kichik harf juftlari." },
              pairs: [{ left: "A", right: "a" }, { left: "O", right: "o" }, { left: "U", right: "u" }, { left: "Oʻ", right: "oʻ" }],
            },
          ],
        },
        // ── Lesson 2 ─────────────────────────────────────────────── 1-dars 1.3–1.5
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "元音 Oʻ · I · E", ru: "Гласные Oʻ · I · E", uz: "Oʻ · I · E unlilari", en: "Vowels Oʻ · I · E" },
          description: { zh: "后三个元音和元音的分类", ru: "Ещё три гласные и их классификация", uz: "Qolgan uchta unli va ularning tasnifi", en: "Three more vowels and how vowels are classified" },
          theory: {
            zh: "Oʻ oʻ — 舌后、次高、圆唇，接近汉语的 o。它总在词的第一个音节出现：boʻz, doʻppi, koʻzgu。\nI i — 舌前、高、展唇，接近汉语的 i，发得短促。\nE e — 舌前、次高、展唇，介于英语 let 和 sit 之间。\n小老虎 Bars 的记忆法：圆唇 o, u, oʻ；展唇 a, i, e。\n前元音 a, i, e；后元音 o, u, oʻ。高元音 i, u；次高 e, oʻ；低元音 a, o。",
            ru: "Oʻ oʻ — задний, средне-высокий, округлый; близок к китайскому o. Встречается только в первом слоге: boʻz, doʻppi, koʻzgu.\nI i — передний, высокий, губы растянуты; как китайское i, но короче.\nE e — передний, средне-высокий, растянутый; между английскими let и sit.\nПодсказка тигрёнка Bars: округлые o, u, oʻ; растянутые a, i, e.\nПередние a, i, e; задние o, u, oʻ. Высокие i, u; средние e, oʻ; низкие a, o.",
            uz: "Oʻ oʻ — orqa qator, oʻrta keng, lablangan. Faqat birinchi boʻgʻinda keladi: boʻz, doʻppi, koʻzgu.\nI i — old qator, yuqori tor, lablanmagan.\nE e — old qator, oʻrta keng, lablanmagan.\nLablangan: o, u, oʻ; lablanmagan: a, i, e.\nOld qator: a, i, e; orqa qator: o, u, oʻ.",
            en: "Oʻ oʻ — back, mid-high, rounded; close to Chinese o. It only appears in the first syllable: boʻz, doʻppi, koʻzgu.\nI i — front, high, unrounded; like Chinese i, but short.\nE e — front, mid-high, unrounded; between English let and sit.\nBars the tiger's tip: rounded o, u, oʻ; unrounded a, i, e.\nFront a, i, e; back o, u, oʻ. High i, u; mid e, oʻ; low a, o.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "oʻ", speak: "oʻ", instruction: I.choose,
              question: { zh: "Oʻ 最接近汉语的哪个单韵母？", ru: "К какому китайскому гласному ближе всего Oʻ?", uz: "Oʻ xitoy tilidagi qaysi unliga yaqin?" },
              explanation: { zh: "Oʻ 接近汉语单韵母 o，但舌面比发 u 时略低，口开得大些。", ru: "Oʻ близок к китайскому o.", uz: "Oʻ xitoycha o ga yaqin." },
              options: [{ text: same("o"), correct: true }, { text: same("a") }, { text: same("i") }, { text: same("e") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "Oʻ 总出现在词的哪个音节？", ru: "В каком слоге встречается Oʻ?", uz: "Oʻ soʻzning qaysi boʻgʻinida keladi?" },
              explanation: { zh: "Oʻ 总在第一个音节：boʻz, doʻppi, koʻzgu。", ru: "Всегда в первом слоге: boʻz, doʻppi, koʻzgu.", uz: "Doim birinchi boʻgʻinda: boʻz, doʻppi, koʻzgu." },
              options: [
                { text: { zh: "第一个音节", ru: "в первом", uz: "birinchi boʻgʻinda" }, correct: true },
                { text: { zh: "最后一个音节", ru: "в последнем", uz: "oxirgi boʻgʻinda" } },
                { text: { zh: "任何音节", ru: "в любом", uz: "istalgan boʻgʻinda" } },
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
              question: { zh: "E 的发音介于……", ru: "Звук E находится между…", uz: "E tovushi … oraligʻida" },
              explanation: { zh: "E 介于英语 let 中的 e 和 sit 中的 i 之间。", ru: "Между e в let и i в sit.", uz: "Inglizcha let va sit oraligʻida." },
              options: [
                { text: { zh: "英语 let 和 sit 之间", ru: "английскими let и sit", uz: "inglizcha let va sit" }, correct: true },
                { text: { zh: "英语 arm 和 bought 之间", ru: "английскими arm и bought", uz: "inglizcha arm va bought" } },
                { text: { zh: "汉语 a 和 o 之间", ru: "китайскими a и o", uz: "xitoycha a va o" } },
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
              explanation: { zh: "圆唇元音：o, u, oʻ；展唇元音：a, i, e。", ru: "Округлые: o, u, oʻ; растянутые: a, i, e.", uz: "Lablangan: o, u, oʻ; lablanmagan: a, i, e." },
              options: [{ text: same("o, u, oʻ"), correct: true }, { text: same("a, i, e") }, { text: same("a, o, u") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              question: { zh: "哪一组全是前元音？", ru: "В какой группе все гласные передние?", uz: "Qaysi guruhda hamma unlilar old qator?" },
              explanation: { zh: "前元音：a, i, e；后元音：o, u, oʻ。", ru: "Передние: a, i, e; задние: o, u, oʻ.", uz: "Old qator: a, i, e; orqa qator: o, u, oʻ." },
              options: [{ text: same("a, i, e"), correct: true }, { text: same("o, u, oʻ") }, { text: same("i, u, e") }],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "写出这个元音：舌后、次高、圆唇", ru: "Напишите гласный: задний, средне-высокий, округлый", uz: "Unlini yozing: orqa qator, oʻrta keng, lablangan" },
              explanation: { zh: "这是 oʻ。手机上可以输入 oʻ、o' 或 o‘。", ru: "Это oʻ. Можно набрать oʻ, o' или o‘.", uz: "Bu oʻ. oʻ, o' yoki o‘ deb yozish mumkin." },
              acceptedAnswers: ["oʻ"],
            },
          ],
        },
        // ── Lesson 3 ─────────────────────────────────────────────── 1-dars 1.6–1.7, 2-dars 2.7
        {
          type: "CONVERSATION", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "问候与告别", ru: "Приветствие и прощание", uz: "Salomlashish va xayrlashish", en: "Hello and goodbye" },
          description: { zh: "Assalomu alaykum! Xayr!", ru: "Assalomu alaykum! Xayr!", uz: "Assalomu alaykum! Xayr!", en: "Assalomu alaykum! Xayr!" },
          theory: {
            zh: "— Assalomu alaykum! 您好！源自阿拉伯语，意思是“愿您平安健康”。\n— Vaalaykum assalom! 您好！回答问候：“也祝您平安健康”。\n— Xayr! 再见！\n— Koʻrishguncha xayr! 再见！（直到再见面）\n小龙 Olov 说：乌兹别克人很重视礼节。年轻人先向长者问候，骑马者先向步行者，步行者先向坐着的人，少数人先向多数人问候。",
            ru: "— Assalomu alaykum! Здравствуйте! Из арабского: «мир вам и здоровья».\n— Vaalaykum assalom! Здравствуйте! Ответ: «и вам мира и здоровья».\n— Xayr! До свидания!\n— Koʻrishguncha xayr! До встречи!\nДракончик Olov: узбеки очень ценят этикет. Первым здоровается младший со старшим, всадник с пешим, идущий с сидящим, меньшая группа с большей.",
            uz: "— Assalomu alaykum! Arab tilidan: «sizga tinchlik va salomatlik tilayman».\n— Vaalaykum assalom! Javob: «sizga ham tinchlik tilayman».\n— Xayr!\n— Koʻrishguncha xayr!\nOdob: kichik kattaga, otliq piyodaga, yurgan oʻtirganga, oz koʻpchilikka birinchi salom beradi.",
            en: "— Assalomu alaykum! Hello! From Arabic: “peace and health be with you”.\n— Vaalaykum assalom! The reply: “and peace be with you too”.\n— Xayr! Goodbye!\n— Koʻrishguncha xayr! See you!\nOlov the dragon says: Uzbeks value etiquette. The younger greet the elder first, a rider greets a walker, a walker greets someone sitting, a few greet the many.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Assalomu alaykum!", speak: "Assalomu alaykum!", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит эта фраза?", uz: "Bu ibora nimani anglatadi?" },
              explanation: { zh: "Assalomu alaykum 是见面时的问候语：“愿您平安健康”。", ru: "Assalomu alaykum — приветствие при встрече: «мир вам».", uz: "Assalomu alaykum — uchrashganda aytiladigan salom." },
              options: [word("您好！", "Здравствуйте!", "👋", true), word("再见！", "До свидания!", "🚶"), word("谢谢！", "Спасибо!", "🙏")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "别人对你说 “Assalomu alaykum!”，你应该回答：", ru: "Вам говорят «Assalomu alaykum!». Что ответить?", uz: "Sizga «Assalomu alaykum!» deyishdi. Nima deysiz?" },
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
              explanation: { zh: "Xayr! 是告别语：再见！", ru: "Xayr! — до свидания.", uz: "Xayr! — xayrlashuv soʻzi." },
              options: [word("再见！", "До свидания!", "👋", true), word("您好！", "Здравствуйте!", "🙂"), word("谢谢！", "Спасибо!", "🙏")],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把乌兹别克语和中文配对", ru: "Соедините узбекские фразы с китайскими", uz: "Oʻzbekcha va xitoycha iboralarni moslang" },
              explanation: { zh: "两句问候，两句告别。", ru: "Два приветствия и два прощания.", uz: "Ikki salom va ikki xayrlashuv." },
              pairs: [
                { left: "Assalomu alaykum!", right: "您好！（问候）" },
                { left: "Vaalaykum assalom!", right: "您好！（回答）" },
                { left: "Xayr!", right: "再见！" },
                { left: "Koʻrishguncha xayr!", right: "回头见！" },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "按照乌兹别克礼节，谁应该先问候？", ru: "Кто, по узбекскому этикету, здоровается первым?", uz: "Odob boʻyicha kim birinchi salom beradi?" },
              explanation: { zh: "年轻人先向长者问候；骑马者先向步行者；步行者先向坐着的人；少数人先向多数人。", ru: "Младший — старшему, всадник — пешему, идущий — сидящему, меньшинство — большинству.", uz: "Kichik kattaga, otliq piyodaga, yurgan oʻtirganga, oz koʻpchilikka." },
              options: [
                { text: { zh: "年轻人先向长者问候", ru: "младший старшему", uz: "kichik kattaga" }, correct: true },
                { text: { zh: "长者先向年轻人问候", ru: "старший младшему", uz: "katta kichikka" } },
                { text: { zh: "坐着的人先向步行者问候", ru: "сидящий идущему", uz: "oʻtirgan yurganga" } },
              ],
            },
            {
              type: "TRANSLATE", mascot: "tiger", prompt: "— Assalomu alaykum!\n— …", instruction: I.type,
              question: { zh: "回答问候", ru: "Ответьте на приветствие", uz: "Salomga javob bering" },
              explanation: { zh: "回答：Vaalaykum assalom!", ru: "Ответ: Vaalaykum assalom!", uz: "Javob: Vaalaykum assalom!" },
              acceptedAnswers: ["Vaalaykum assalom", "Va alaykum assalom"],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "再见！（直到再见面）", ru: "До встречи!", uz: "«Koʻrishguncha» bilan xayrlashing" },
              explanation: { zh: "Koʻrishguncha xayr! 字面意思是“直到再见面，再见”。", ru: "Koʻrishguncha xayr! — «до встречи, до свидания».", uz: "Koʻrishguncha xayr!" },
              acceptedAnswers: ["Koʻrishguncha xayr"],
            },
          ],
        },
        // ── Lesson 4 ─────────────────────────────────────────────── 2-dars 2.1–2.2
        {
          type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "辅音 B · P · D · T 与重音", ru: "Согласные B · P · D · T и ударение", uz: "B · P · D · T undoshlari va urgʻu", en: "Consonants B · P · D · T and stress" },
          description: { zh: "清浊辅音、音节和重音", ru: "Звонкие и глухие, слоги и ударение", uz: "Jarangli va jarangsiz undoshlar, boʻgʻin, urgʻu", en: "Voiced and voiceless, syllables and stress" },
          theory: {
            zh: "B b — 双唇浊塞音，声带振动：bola, kitob, Bobur。\nP p — 双唇清塞音，声带不振动：payt, opa, papka。\nD d — 舌前浊塞音：舌前部抵上齿背和上齿龈，声带振动：dada, doʻppi, davlat。T t — 舌前清塞音，部位相同，声带不振动：ota, talaba, taom。\n音节以元音为核心：一个词里有几个元音，就有几个音节。o-ta, bo-bo, ol-ma, ars-lon, so-at。\n重音一般落在最后一个音节：otá, bobó, dasturxón。外来词保持原来的重音：pápka。",
            ru: "B b — губно-губной звонкий: bola, kitob, Bobur.\nP p — губно-губной глухой: payt, opa, papka.\nD d — переднеязычный звонкий: кончик языка у верхних зубов и дёсен: dada, doʻppi, davlat. T t — то же место, но глухой: ota, talaba, taom.\nВ слове столько слогов, сколько гласных: o-ta, bo-bo, ol-ma, ars-lon, so-at.\nУдарение обычно на последнем слоге: otá, bobó, dasturxón. Заимствования сохраняют своё ударение: pápka.",
            uz: "B b — lab-lab jarangli undosh: bola, kitob, Bobur.\nP p — lab-lab jarangsiz undosh: payt, opa, papka.\nD d — jarangli, T t — jarangsiz: dada, ota, talaba.\nSoʻzda nechta unli boʻlsa, shuncha boʻgʻin bor: o-ta, bo-bo, ol-ma, ars-lon, so-at.\nUrgʻu odatda oxirgi boʻgʻinga tushadi: otá, bobó.",
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
                { text: { zh: "没有区别", ru: "ничем", uz: "farqi yoʻq" } },
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
              question: { zh: "这个词有几个音节？", ru: "Сколько слогов в слове?", uz: "Bu soʻzda nechta boʻgʻin bor?" },
              explanation: { zh: "dada 有两个元音，所以有两个音节：da-da。", ru: "Две гласные — два слога: da-da.", uz: "Ikki unli — ikki boʻgʻin: da-da." },
              options: [{ text: same("2"), correct: true }, { text: same("1") }, { text: same("3") }, { text: same("4") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "talaba", speak: "talaba", instruction: I.choose,
              question: { zh: "这个词有几个音节？", ru: "Сколько слогов в слове?", uz: "Bu soʻzda nechta boʻgʻin bor?" },
              explanation: { zh: "ta-la-ba：三个元音，三个音节。", ru: "ta-la-ba: три гласные, три слога.", uz: "ta-la-ba: uch boʻgʻin." },
              options: [{ text: same("3"), correct: true }, { text: same("2") }, { text: same("4") }],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和音节划分配对", ru: "Соедините слово и его деление на слоги", uz: "Soʻzni boʻgʻinlari bilan moslang" },
              explanation: { zh: "一个辅音归后；两个辅音前后各一；三个辅音前二后一；两个元音相邻时分开。", ru: "Один согласный — к следующему слогу; два — делятся; из трёх два остаются в первом; соседние гласные разделяются.", uz: "Boʻgʻinga ajratish qoidalari." },
              pairs: [{ left: "bobo", right: "bo-bo" }, { left: "olma", right: "ol-ma" }, { left: "arslon", right: "ars-lon" }, { left: "soat", right: "so-at" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "乌兹别克语的重音一般落在……", ru: "Ударение в узбекском обычно падает на…", uz: "Oʻzbek tilida urgʻu odatda … tushadi" },
              explanation: { zh: "重音一般落在最末一个音节：otá, bobó。", ru: "На последний слог: otá, bobó.", uz: "Oxirgi boʻgʻinga: otá, bobó." },
              options: [
                { text: { zh: "最后一个音节", ru: "последний слог", uz: "oxirgi boʻgʻinga" }, correct: true },
                { text: { zh: "第一个音节", ru: "первый слог", uz: "birinchi boʻgʻinga" } },
                { text: { zh: "倒数第二个音节", ru: "предпоследний слог", uz: "oxiridan ikkinchi boʻgʻinga" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "bobo", speak: "bobo", instruction: I.choose,
              question: { zh: "重音在哪里？", ru: "Где ударение?", uz: "Urgʻu qayerda?" },
              explanation: { zh: "bobó — 重音在最后一个音节。", ru: "bobó — ударение на последнем слоге.", uz: "bobó — urgʻu oxirgi boʻgʻinda." },
              options: [{ text: same("bobó"), correct: true }, { text: same("bóbo") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "papka", speak: "papka", instruction: I.choose,
              question: { zh: "papka 来自俄语。它的重音在哪里？", ru: "papka — заимствование из русского. Где ударение?", uz: "papka rus tilidan olingan. Urgʻu qayerda?" },
              explanation: { zh: "外来词保持原语言的重音：pápka。", ru: "Заимствования сохраняют ударение: pápka.", uz: "Oʻzlashma soʻzlar asl urgʻusini saqlaydi: pápka." },
              options: [{ text: same("pápka"), correct: true }, { text: same("papká") }],
            },
          ],
        },
        // ── Lesson 5 ─────────────────────────────────────────────── 2-dars 2.3–2.5 (family)
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "Bu kim? 家人", ru: "Bu kim? Семья", uz: "Bu kim? Oila", en: "Bu kim? Family" },
          description: { zh: "Bu … / U … 和第一批单词", ru: "Bu … / U … и первые слова", uz: "Bu … / U … va ilk soʻzlar", en: "Bu … / U … and first words" },
          theory: {
            zh: "Bu … — 这是……（近处的人或物）\nU … — 那是……；也表示“他／她／它”（远处）\n陈述句用降调：Bu bobo. U ota.\n新词：bobo 爷爷 · ota 父亲 · dada 爸爸 · opa 姐姐 · talaba 大学生",
            ru: "Bu … — это … (близко)\nU … — то …; а также «он / она / оно» (далеко)\nПовествовательное предложение произносится с понижением: Bu bobo. U ota.\nСлова: bobo дедушка · ota отец · dada папа · opa старшая сестра · talaba студент",
            uz: "Bu … — yaqindagi narsa yoki odam\nU … — uzoqdagi; shuningdek «u» olmoshi\nDarak gap pasayuvchi ohang bilan aytiladi: Bu bobo. U ota.\nSoʻzlar: bobo · ota · dada · opa · talaba",
            en: "Bu … — this is … (near)\nU … — that is …; also “he / she / it” (far)\nStatements fall in pitch: Bu bobo. U ota.\nWords: bobo grandfather · ota father · dada dad · opa elder sister · talaba student",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "ota", speak: "ota", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
              explanation: { zh: "ota — 父亲。", ru: "ota — отец.", uz: "ota — otasi." },
              options: [word("父亲", "отец", "👨", true), word("姐姐", "старшая сестра", "👩"), word("爷爷", "дедушка", "👴"), word("大学生", "студент", "🧑‍🎓")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "opa", speak: "opa", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
              explanation: { zh: "opa — 姐姐。", ru: "opa — старшая сестра.", uz: "opa — opa." },
              options: [word("爷爷", "дедушка", "👴"), word("姐姐", "старшая сестра", "👩", true), word("父亲", "отец", "👨"), word("狗", "собака", "🐕")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "bobo", speak: "bobo", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
              explanation: { zh: "bobo — 爷爷、祖父，也指祖辈。", ru: "bobo — дедушка, предок.", uz: "bobo — buva, ajdod." },
              options: [word("大学生", "студент", "🧑‍🎓"), word("父亲", "отец", "👨"), word("爷爷", "дедушка", "👴", true), word("姐姐", "старшая сестра", "👩")],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Soʻzni maʼnosi bilan moslang" },
              explanation: { zh: "bobo 爷爷，dada 爸爸，opa 姐姐，talaba 大学生。", ru: "bobo дедушка, dada папа, opa сестра, talaba студент.", uz: "bobo, dada, opa, talaba." },
              pairs: [{ left: "bobo", right: "爷爷" }, { left: "dada", right: "爸爸" }, { left: "opa", right: "姐姐" }, { left: "talaba", right: "大学生" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
              question: { zh: "“这是爷爷。”用乌兹别克语怎么说？", ru: "Как сказать «Это дедушка»?", uz: "«Bu — bobo» qanday aytiladi?" },
              explanation: { zh: "近处用 Bu：Bu bobo.", ru: "Для близкого — Bu: Bu bobo.", uz: "Yaqin uchun Bu: Bu bobo." },
              options: [{ text: same("Bu bobo."), correct: true }, { text: same("U bobo.") }, { text: same("Bu ota.") }],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "那是姐姐。", ru: "То — старшая сестра.", uz: "Uzoqdagi opani koʻrsating" },
              explanation: { zh: "远处用 U：U opa.", ru: "Для далёкого — U: U opa.", uz: "Uzoq uchun U: U opa." },
              words: ["opa", "Bu", "U", "ota"], correctWords: ["U", "opa"],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "这是大学生。", ru: "Это студент.", uz: "Yaqindagi talabani koʻrsating" },
              explanation: { zh: "Bu talaba.", ru: "Bu talaba.", uz: "Bu talaba." },
              words: ["talaba", "U", "Bu", "bobo"], correctWords: ["Bu", "talaba"],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "这是爸爸。", ru: "Это папа.", uz: "«Bu» bilan dadani koʻrsating" },
              explanation: { zh: "Bu dada. （父亲是 ota，爸爸是 dada）", ru: "Bu dada. (отец — ota, папа — dada)", uz: "Bu dada." },
              acceptedAnswers: ["Bu dada", "Bu ota"],
            },
          ],
        },
        // ── Lesson 6 ─────────────────────────────────────────────── 2-dars 2.5, 2.8 (things, Uzbekistan)
        {
          type: "VOCABULARY", xpReward: 25, estimatedMinutes: 6,
          title: { zh: "Bu nima? 物品与乌兹别克斯坦", ru: "Bu nima? Вещи и Узбекистан", uz: "Bu nima? Buyumlar va Oʻzbekiston", en: "Bu nima? Things and Uzbekistan" },
          description: { zh: "it, pul, papka, doʻppi 和丝绸之路", ru: "it, pul, papka, doʻppi и Шёлковый путь", uz: "it, pul, papka, doʻppi va Ipak yoʻli", en: "it, pul, papka, doʻppi and the Silk Road" },
          theory: {
            zh: "新词：it 狗 · pul 钱 · papka 文件夹 · doʻppi（民族式）花帽 · odatda 通常\n小龙 Olov 讲背景知识：乌兹别克斯坦位于中亚中部，邻国也都没有出海口，所以被称为“双内陆国家”。\n它是著名的“丝绸之路”古国，自古就通过丝绸之路与中国有着悠久的联系。",
            ru: "Слова: it собака · pul деньги · papka папка · doʻppi тюбетейка · odatda обычно\nДракончик Olov: Узбекистан находится в центре Средней Азии. У его соседей тоже нет выхода к морю, поэтому его называют «дважды внутриконтинентальной страной».\nЭто древняя страна Шёлкового пути, издавна связанная с Китаем.",
            uz: "Soʻzlar: it · pul · papka · doʻppi · odatda\nOʻzbekiston Markaziy Osiyoning markazida joylashgan. Qoʻshnilarining ham dengizga chiqish yoʻli yoʻq.\nOʻzbekiston qadimiy Ipak yoʻli mamlakati boʻlib, Xitoy bilan azaldan bogʻlangan.",
            en: "Words: it dog · pul money · papka folder · doʻppi skullcap · odatda usually\nOlov the dragon: Uzbekistan lies in the heart of Central Asia, and its neighbours are landlocked too, so it is called “doubly landlocked”.\nIt is an ancient Silk Road country with long ties to China.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "it", speak: "it", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
              explanation: { zh: "it — 狗。", ru: "it — собака.", uz: "it — it." },
              options: [word("狗", "собака", "🐕", true), word("钱", "деньги", "💵"), word("文件夹", "папка", "📁")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "pul", speak: "pul", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
              explanation: { zh: "pul — 钱。", ru: "pul — деньги.", uz: "pul — pul." },
              options: [word("文件夹", "папка", "📁"), word("钱", "деньги", "💵", true), word("狗", "собака", "🐕")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "doʻppi", speak: "doʻppi", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
              explanation: { zh: "doʻppi 是乌兹别克的民族花帽，常绣有花纹。", ru: "doʻppi — узбекская тюбетейка с вышивкой.", uz: "doʻppi — milliy bosh kiyim." },
              options: [word("花帽", "тюбетейка", undefined, true), word("钱", "деньги", "💵"), word("姐姐", "старшая сестра", "👩")],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Soʻzni maʼnosi bilan moslang" },
              explanation: { zh: "it 狗，pul 钱，papka 文件夹，doʻppi 花帽。", ru: "it собака, pul деньги, papka папка, doʻppi тюбетейка.", uz: "it, pul, papka, doʻppi." },
              pairs: [{ left: "it", right: "狗" }, { left: "pul", right: "钱" }, { left: "papka", right: "文件夹" }, { left: "doʻppi", right: "花帽" }],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "这是钱。", ru: "Это деньги.", uz: "Yaqindagi pulni koʻrsating" },
              explanation: { zh: "Bu pul.", ru: "Bu pul.", uz: "Bu pul." },
              words: ["pul", "U", "Bu", "it"], correctWords: ["Bu", "pul"],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "那是文件夹。", ru: "То — папка.", uz: "Uzoqdagi papkani koʻrsating" },
              explanation: { zh: "U papka.", ru: "U papka.", uz: "U papka." },
              words: ["Bu", "papka", "pul", "U"], correctWords: ["U", "papka"],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "乌兹别克斯坦被称为……", ru: "Узбекистан называют…", uz: "Oʻzbekistonni … deb atashadi" },
              explanation: { zh: "它和所有邻国都没有出海口，所以是“双内陆国家”。", ru: "Ни у него, ни у соседей нет выхода к морю.", uz: "Uning ham, qoʻshnilarining ham dengizga chiqishi yoʻq." },
              options: [
                { text: { zh: "双内陆国家", ru: "дважды внутриконтинентальной страной", uz: "ikki karra quruqlik bilan oʻralgan davlat" }, correct: true },
                { text: { zh: "岛国", ru: "островной страной", uz: "orol davlati" } },
                { text: { zh: "沿海国家", ru: "приморской страной", uz: "dengiz boʻyidagi davlat" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "乌兹别克斯坦通过哪条古道与中国有着悠久的联系？", ru: "Какой древний путь связывал Узбекистан с Китаем?", uz: "Oʻzbekistonni Xitoy bilan qaysi qadimiy yoʻl bogʻlagan?" },
              explanation: { zh: "“丝绸之路”：乌兹别克斯坦曾是商队之路的重要汇合点。", ru: "Шёлковый путь: здесь сходились караванные дороги.", uz: "Ipak yoʻli: karvon yoʻllari shu yerda tutashgan." },
              options: [
                { text: { zh: "丝绸之路", ru: "Шёлковый путь", uz: "Ipak yoʻli" }, correct: true },
                { text: { zh: "茶马古道", ru: "Чайно-лошадиный путь", uz: "Choy-ot yoʻli" } },
                { text: { zh: "京杭大运河", ru: "Великий канал", uz: "Buyuk kanal" } },
              ],
            },
            {
              type: "TRANSLATE", mascot: "tiger", instruction: I.type,
              question: { zh: "这是狗。", ru: "Это собака.", uz: "Yaqindagi itni koʻrsating" },
              explanation: { zh: "Bu it.", ru: "Bu it.", uz: "Bu it." },
              acceptedAnswers: ["Bu it"],
            },
          ],
        },
      ],
    },
    unit2,
  ],
};
