// Course "Russian for Chinese speakers" (zh → ru).
// Unit 1 source: 大学俄语（东方·新版）学生用书 1, УРОК 1 第一课: the alphabet,
// vowels а о у э, consonants п м т, syllables & stress, reduction of а/о,
// intonation type 1, first words, "Здравствуйте! До свидания!", about Russia.
// Stress marks (U+0301) are shown as in the textbook; answers never require them.
// No typing exercises yet: many phones in China have no Cyrillic keyboard.
import { I, meaning, same, type CourseContent } from "./common";
import { ruUnit2 } from "./zh-ru-unit2";
import { ruUnit3 } from "./zh-ru-unit3";

export const zhRuCourse: CourseContent = {
  slug: "zh-ru-a1",
  sourceLanguage: "zh",
  targetLanguage: "ru",
  level: "A1",
  order: 3,
  title: { zh: "俄语入门", ru: "Русский для китайцев", uz: "Xitoyliklar uçun rus tili", en: "Russian for Chinese speakers" },
  description: {
    zh: "和熊猫、小龙、小老虎一起，从字母和发音开始学俄语。",
    ru: "Русский с нуля для носителей китайского: алфавит, звуки и первые фразы.",
    uz: "Xitoy tilida sözlaşuvçilar uçun rus tili: alifbo, tovuşlar va ilk iboralar.",
    en: "Russian from zero for Chinese speakers: alphabet, sounds and first phrases.",
  },
  modules: [
    {
      title: { zh: "第一单元 · 你好，俄语！", ru: "Юнит 1 · Привет, русский!", uz: "1-bölim · Salom, rus tili!", en: "Unit 1 · Hello, Russian!" },
      description: { zh: "字母、元音、辅音、重音和第一批单词", ru: "Алфавит, гласные, согласные, ударение и первые слова", uz: "Alifbo, unlilar, undoşlar, urğu va ilk sözlar", en: "Alphabet, vowels, consonants, stress and first words" },
      lessons: [
        // ── Lesson 1 ─────────────────────────────────────────────── 字母，元音 а о у э
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 4,
          title: { zh: "俄语字母与元音 А · О · У · Э", ru: "Алфавит и гласные А · О · У · Э", uz: "Alifbo va А · О · У · Э unlilari", en: "Alphabet and vowels А · О · У · Э" },
          description: { zh: "33 个字母、10 个元音、21 个辅音", ru: "33 буквы, 10 гласных, 21 согласная", uz: "33 harf, 10 unli, 21 undoş", en: "33 letters, 10 vowels, 21 consonants" },
          // Short intro: the facts come one by one, each right before its exercise (`teach`).
          theory: {
            zh: "你好！我是熊猫 Paxta，这次陪你学俄语。\n今天一步一步记住三个数字：有几个字母，几个元音，几个辅音。然后学 [а], [у], [о], [э] 四个音。",
            ru: "Привет! Я панда Paxta и помогу выучить русский.\nСегодня по шагам запомним три числа: сколько букв, сколько гласных и сколько согласных. Потом звуки [а], [у], [о], [э].",
            uz: "Salom! Men panda Paxtaman, rus tilini birga örganamiz.\nBugun qadamma-qadam uçta sonni eslab qolamiz: neçta harf, neçta unli, neçta undoş. Keyin [а], [у], [о], [э] tovuşlari.",
            en: "Hi! I'm Paxta the panda and I'll learn Russian with you.\nToday, step by step, we remember three numbers: how many letters, vowels and consonants. Then the sounds [а], [у], [о], [э].",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              teach: { zh: "俄语用西里尔字母书写。\n一共有 33 个字母。", ru: "Русский пишется кириллицей.\nВ алфавите 33 буквы.", uz: "Rus tili kirill yozuvida.\nAlifboda 33 ta harf bor.", en: "Russian is written in Cyrillic.\nThe alphabet has 33 letters." },
              question: { zh: "俄语共有多少个字母？", ru: "Сколько букв в русском алфавите?", uz: "Rus alifbosida neçta harf bor?" },
              explanation: { zh: "俄语共有 33 个字母。（乌兹别克语是 28 个）", ru: "33 буквы.", uz: "33 ta harf (özbek tilida 28 ta)." },
              options: [{ text: same("33"), correct: true }, { text: same("26") }, { text: same("28") }, { text: same("30") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
              teach: { zh: "33 个字母里，元音字母有 10 个：\nа, э, ы, о, у, я, е, ё, ю, и", ru: "Из 33 букв гласных 10:\nа, э, ы, о, у, я, е, ё, ю, и", uz: "33 ta harfdan 10 tasi unli:\nа, э, ы, о, у, я, е, ё, ю, и", en: "Of the 33 letters, 10 are vowels:\nа, э, ы, о, у, я, е, ё, ю, и" },
              question: { zh: "俄语有几个元音字母？", ru: "Сколько в русском алфавите гласных букв?", uz: "Rus alifbosida neçta unli harf bor?" },
              explanation: { zh: "10 个元音字母：а, э, ы, о, у, я, е, ё, ю, и。", ru: "10 гласных букв: а, э, ы, о, у, я, е, ё, ю, и.", uz: "10 ta unli harf: а, э, ы, о, у, я, е, ё, ю, и." },
              options: [{ text: same("10"), correct: true }, { text: same("6") }, { text: same("5") }, { text: same("21") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              teach: { zh: "辅音字母有 21 个，比如 п, м, т。\n还有 2 个符号 ъ 和 ь，它们自己不发音。", ru: "Согласных букв 21, например п, м, т.\nЕщё 2 знака, ъ и ь: сами они звука не дают.", uz: "Undoş harflar 21 ta, masalan п, м, т.\nYana 2 belgi bor, ъ va ь: ular tovuş bildirmaydi.", en: "There are 21 consonants, like п, м, т.\nPlus 2 signs, ъ and ь, which have no sound of their own." },
              question: { zh: "俄语有几个辅音字母？", ru: "Сколько в русском алфавите согласных букв?", uz: "Rus alifbosida neçta undoş harf bor?" },
              explanation: { zh: "10 个元音 + 21 个辅音 + ъ, ь = 33 个字母。", ru: "10 гласных + 21 согласная + ъ, ь = 33 буквы.", uz: "10 unli + 21 undoş + ъ, ь = 33 harf." },
              options: [{ text: same("21"), correct: true }, { text: same("22") }, { text: same("10") }, { text: same("33") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "а", speak: "а", instruction: I.choose,
              teach: { zh: "[а]：口张大，舌头自然平放。", ru: "[а]: рот широко открыт, язык лежит спокойно.", uz: "[а]: oğiz keng oçiq, til tinç yotadi.", en: "[а]: mouth wide open, tongue relaxed." },
              question: { zh: "发 [а] 时……", ru: "Как произносится [а]?", uz: "[а] qanday aytiladi?" },
              explanation: { zh: "[а]：口张大，舌自然平放。", ru: "Рот широко открыт, язык лежит спокойно.", uz: "Oğiz keng oçiq." },
              options: [
                { text: { zh: "口张大，舌自然平放", ru: "рот широко открыт", uz: "oğiz keng oçiq" }, correct: true },
                { text: { zh: "双唇用力向前伸成小筒", ru: "губы трубочкой", uz: "lablar nayça" } },
                { text: { zh: "双唇向两边舒展", ru: "губы растянуты", uz: "lablar yoyiq" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "у", speak: "у", instruction: I.choose,
              teach: { zh: "[у]：双唇用力向前伸，\n像一根小管子。", ru: "[у]: губы сильно вытянуты вперёд,\nмаленькой трубочкой.", uz: "[у]: lablar kuçli oldinga çöziladi,\nkiçik nayça kabi.", en: "[у]: lips pushed strongly forward\ninto a small tube." },
              question: { zh: "发 [у] 时……", ru: "Как произносится [у]?", uz: "[у] qanday aytiladi?" },
              explanation: { zh: "[у]：双唇用力向前伸，圆撮成筒状，开口度小。", ru: "Губы сильно вытянуты трубочкой, раствор маленький.", uz: "Lablar kuçli çöziladi, teşik kiçik." },
              options: [
                { text: { zh: "双唇用力向前伸，开口小", ru: "губы трубочкой, раствор маленький", uz: "lablar çözilgan, teşik kiçik" }, correct: true },
                { text: { zh: "口张大，舌自然平放", ru: "рот широко открыт", uz: "oğiz keng oçiq" } },
                { text: { zh: "双唇向两边舒展", ru: "губы растянуты", uz: "lablar yoyiq" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "о", speak: "о", instruction: I.choose,
              teach: { zh: "[о]：双唇也撮圆，\n但嘴张得比 [у] 大。", ru: "[о]: губы тоже округлены,\nно рот открыт шире, чем при [у].", uz: "[о]: lablar ham dömboq,\nlekin oğiz [у] dan kengroq oçiladi.", en: "[о]: lips rounded too,\nbut the mouth is opened wider than for [у]." },
              question: { zh: "和 [у] 相比，发 [о] 时开口……", ru: "По сравнению с [у] при [о] рот…", uz: "[у] ga nisbatan [о] da oğiz …" },
              explanation: { zh: "[о] 的开口度比 [у] 大，伸出度比 [у] 小。", ru: "При [о] рот раскрыт шире, губы вытянуты меньше.", uz: "[о] da oğiz kengroq oçiladi." },
              options: [
                { text: { zh: "更大", ru: "открыт шире", uz: "kengroq" }, correct: true },
                { text: { zh: "更小", ru: "открыт уже", uz: "torroq" } },
                { text: { zh: "一样", ru: "так же", uz: "bir xil" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "э", speak: "э", instruction: I.choose,
              teach: { zh: "[э]：双唇向两边舒展。\n它是一个音，不像汉语“哎”那样滑动。", ru: "[э]: губы растянуты.\nЭто один звук, он не скользит, как китайское «哎».", uz: "[э]: lablar yoyiq.\nBu bitta tovuş, diftong emas.", en: "[э]: lips spread.\nIt is one sound; it doesn't glide like Chinese 哎." },
              question: { zh: "和汉语的“哎”相比，俄语的 [э] 是……", ru: "В отличие от китайского «哎», [э] —", uz: "Xitoyça «哎» dan farqli, [э] —" },
              explanation: { zh: "俄语的 [э] 是单元音，发音时舌位和唇形不变。", ru: "[э] — монофтонг: положение языка и губ не меняется.", uz: "[э] — bitta unli." },
              options: [
                { text: { zh: "单元音", ru: "один гласный звук", uz: "bitta unli" }, correct: true },
                { text: { zh: "双元音", ru: "дифтонг", uz: "diftong" } },
                { text: { zh: "辅音", ru: "согласный", uz: "undoş" } },
              ],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把大写字母和小写字母配对", ru: "Соедините заглавные и строчные буквы", uz: "Katta va kiçik harflarni moslang" },
              explanation: { zh: "А а，О о，У у，Э э。", ru: "А а, О о, У у, Э э.", uz: "А а, О о, У у, Э э." },
              pairs: [{ left: "А", right: "а" }, { left: "О", right: "о" }, { left: "У", right: "у" }, { left: "Э", right: "э" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              question: { zh: "哪一组全是元音？", ru: "В какой группе только гласные?", uz: "Qaysi guruhda faqat unlilar bor?" },
              explanation: { zh: "а, о, у, э 是元音；п, м, т 是辅音。", ru: "а, о, у, э — гласные; п, м, т — согласные.", uz: "а, о, у, э — unlilar." },
              options: [{ text: same("а, о, у, э"), correct: true }, { text: same("п, м, т") }, { text: same("а, м, у") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", listen: true, speak: "у", instruction: I.listen,
              question: { zh: "你听到的是哪个元音？", ru: "Какой гласный вы услышали?", uz: "Qaysi unlini eşitdingiz?" },
              explanation: { zh: "[у]：双唇用力向前伸，像小管子。", ru: "[у]: губы сильно вытянуты трубочкой.", uz: "[у]: lablar kuçli oldinga çöziladi." },
              options: [{ text: same("у"), correct: true }, { text: same("о") }, { text: same("а") }, { text: same("э") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", listen: true, speak: "о", instruction: I.listen,
              question: { zh: "你听到的是哪个元音？", ru: "Какой гласный вы услышали?", uz: "Qaysi unlini eşitdingiz?" },
              explanation: { zh: "[о]：双唇撮圆，开口比 [у] 大。", ru: "[о]: губы округлены, рот шире, чем при [у].", uz: "[о]: lablar dömboq, oğiz [у] dan kengroq." },
              options: [{ text: same("о"), correct: true }, { text: same("у") }, { text: same("а") }, { text: same("э") }],
            },
          ],
        },
        // ── Lesson 2 ─────────────────────────────────────────────── 辅音 п м т
        {
          type: "GRAMMAR", xpReward: 20, estimatedMinutes: 4,
          title: { zh: "辅音 П · М · Т", ru: "Согласные П · М · Т", uz: "П · М · Т undoşlari", en: "Consonants П · М · Т" },
          description: { zh: "清辅音和鼻音，第一批单词", ru: "Глухие и носовой, первые слова", uz: "Jarangsiz va burun undoşlari", en: "Voiceless and nasal, first words" },
          theory: {
            zh: "辅音发音时，气流通过口腔受到各种阻碍。声带不振动的叫清辅音，声带振动的叫浊辅音。\n[п] — 清辅音：双唇闭拢，气流冲破阻塞成音。\n[м] — 鼻音：双唇闭拢，气流通过鼻腔成音。\n[т] — 清辅音：前舌部贴上齿背及齿龈，气流冲破阻塞成音。\n跟读：па — по — пу — пэ，ма — мо — му — мэ，та — то — ту — тэ。\n第一批单词：па́па 爸爸 · ма́ма 妈妈 · там 那里 · тут 这里",
            ru: "Согласные образуются с преградой. Без голоса — глухие, с голосом — звонкие.\n[п] — глухой: губы сомкнуты, воздух прорывает преграду.\n[м] — носовой: губы сомкнуты, воздух идёт через нос.\n[т] — глухой: передняя часть языка у верхних зубов и дёсен.\nПовторяйте: па — по — пу — пэ, ма — мо — му — мэ, та — то — ту — тэ.\nПервые слова: па́па, ма́ма, там, тут.",
            uz: "Undoşlarda havo tösiqqa uçraydi. Ovozsiz — jarangsiz, ovozli — jarangli.\n[п] — jarangsiz, lablar yumiladi.\n[м] — burun undoşi.\n[т] — jarangsiz, til oldi yuqori tişlarga tegadi.\nIlk sözlar: па́па, ма́ма, там, тут.",
            en: "Consonants are made with an obstacle. Without voice — voiceless, with voice — voiced.\n[п] — voiceless: lips closed, the air bursts through.\n[м] — nasal: lips closed, air goes through the nose.\n[т] — voiceless: front of the tongue against the upper teeth and gums.\nRepeat: па — по — пу — пэ, ма — мо — му — мэ, та — то — ту — тэ.\nFirst words: па́па dad · ма́ма mum · там there · тут here",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "发音时声带不振动的辅音叫……", ru: "Согласный без участия голоса называется…", uz: "Ovozsiz aytiladigan undoş …" },
              explanation: { zh: "清辅音声带不振动，浊辅音声带振动。", ru: "Глухие — без голоса, звонкие — с голосом.", uz: "Jarangsiz — ovozsiz, jarangli — ovozli." },
              options: [
                { text: { zh: "清辅音", ru: "глухим", uz: "jarangsiz" }, correct: true },
                { text: { zh: "浊辅音", ru: "звонким", uz: "jarangli" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "п", speak: "па", instruction: I.choose,
              question: { zh: "[п] 是……", ru: "[п] — это…", uz: "[п] — …" },
              explanation: { zh: "[п]：清辅音，双唇闭拢，气流冲破阻塞成音。", ru: "Глухой, губы сомкнуты.", uz: "Jarangsiz, lablar yumiladi." },
              options: [
                { text: { zh: "清辅音，双唇闭拢", ru: "глухой, губы сомкнуты", uz: "jarangsiz, lablar yumiq" }, correct: true },
                { text: { zh: "鼻音", ru: "носовой", uz: "burun undoşi" } },
                { text: { zh: "元音", ru: "гласный", uz: "unli" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "м", speak: "ма", instruction: I.choose,
              question: { zh: "发 [м] 时，气流……", ru: "При [м] воздух…", uz: "[м] da havo …" },
              explanation: { zh: "[м] 是鼻音：双唇闭拢，气流通过鼻腔。", ru: "[м] — носовой: воздух идёт через нос.", uz: "[м] — burun undoşi." },
              options: [
                { text: { zh: "通过鼻腔", ru: "идёт через нос", uz: "burundan çiqadi" }, correct: true },
                { text: { zh: "冲破双唇", ru: "прорывает губы", uz: "lablarni yorib çiqadi" } },
                { text: { zh: "不受任何阻碍", ru: "проходит свободно", uz: "erkin çiqadi" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "т", speak: "та", instruction: I.choose,
              question: { zh: "发 [т] 时……", ru: "При [т]…", uz: "[т] aytilganda …" },
              explanation: { zh: "[т]：前舌部贴上齿背及齿龈，气流冲破阻塞成音。", ru: "Передняя часть языка у верхних зубов и дёсен.", uz: "Til oldi yuqori tişlarga tegadi." },
              options: [
                { text: { zh: "前舌部贴上齿背及齿龈", ru: "язык у верхних зубов", uz: "til yuqori tişlarda" }, correct: true },
                { text: { zh: "双唇闭拢", ru: "губы сомкнуты", uz: "lablar yumiq" } },
                { text: { zh: "舌后部抬起", ru: "поднята задняя часть языка", uz: "til orqasi kötariladi" } },
              ],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把音和它的特点配对", ru: "Соедините звук и его признак", uz: "Tovuşni belgisi bilan moslang" },
              explanation: { zh: "п 双唇清辅音，м 鼻音，т 舌前清辅音，а 元音。", ru: "п — губной глухой, м — носовой, т — переднеязычный глухой, а — гласный.", uz: "п, м, т, а." },
              pairs: [{ left: "п", right: "清辅音 · 双唇" }, { left: "м", right: "鼻音" }, { left: "т", right: "清辅音 · 舌前" }, { left: "а", right: "元音" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "ма́ма", speak: "ма́ма", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "ма́ма — 妈妈。", ru: "ма́ма — мама.", uz: "ма́ма — ona." },
              options: [meaning("妈妈", "ona", "👩", true), meaning("爸爸", "ota", "👨"), meaning("诗人", "şoir", "✍️")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "па́па", speak: "па́па", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "па́па — 爸爸。", ru: "па́па — папа.", uz: "па́па — dada." },
              options: [meaning("妈妈", "ona", "👩"), meaning("爸爸", "dada", "👨", true), meaning("番茄", "pomidor", "🍅")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "там", speak: "там", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "там — 那里；тут — 这里。", ru: "там — там (далеко); тут — здесь.", uz: "там — u yerda; тут — bu yerda." },
              options: [meaning("那里", "u yerda", "👉", true), meaning("这里", "bu yerda", "👇"), meaning("然后", "keyin")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", listen: true, speak: "пу", instruction: I.listen,
              question: { zh: "你听到的是哪个音节？", ru: "Какой слог вы услышали?", uz: "Qaysi böğinni eşitdingiz?" },
              explanation: { zh: "пу：[п] + [у]。", ru: "пу: [п] + [у].", uz: "пу: [п] + [у]." },
              options: [{ text: same("пу"), correct: true }, { text: same("па") }, { text: same("по") }, { text: same("пэ") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", listen: true, speak: "ом", instruction: I.listen,
              question: { zh: "你听到的是哪个音节？", ru: "Какой слог вы услышали?", uz: "Qaysi böğinni eşitdingiz?" },
              explanation: { zh: "ом：先元音 [о]，后闭唇 [м]。", ru: "ом: сначала [о], потом губы смыкаются на [м].", uz: "ом: avval [о], keyin [м]." },
              options: [{ text: same("ом"), correct: true }, { text: same("ам") }, { text: same("ум") }, { text: same("эм") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", listen: true, speak: "том", instruction: I.listen,
              question: { zh: "你听到的是哪个词？", ru: "Какое слово вы услышали?", uz: "Qaysi sözni eşitdingiz?" },
              explanation: { zh: "том 和 мот：辅音的顺序不同。", ru: "том и мот: согласные в другом порядке.", uz: "том va мот: undoşlar tartibi boşqa." },
              options: [{ text: same("том"), correct: true }, { text: same("мот") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", listen: true, speak: "пут", instruction: I.listen,
              question: { zh: "你听到的是哪个词？", ru: "Какое слово вы услышали?", uz: "Qaysi sözni eşitdingiz?" },
              explanation: { zh: "пут 以 [п] 开头，туп 以 [т] 开头。", ru: "пут начинается с [п], туп с [т].", uz: "пут [п] bilan, туп [т] bilan boşlanadi." },
              options: [{ text: same("пут"), correct: true }, { text: same("туп") }],
            },
          ],
        },
        // ── Lesson 3 ─────────────────────────────────────────────── 音节，重音，а/о 弱化
        {
          type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "音节、重音与 а、о 的弱化", ru: "Слог, ударение и редукция а, о", uz: "Böğin, urğu va а, о qisqarişi", en: "Syllables, stress and reduction of а, о" },
          description: { zh: "为什么 э́то 读 [этъ]", ru: "Почему э́то звучит как [этъ]", uz: "Nega э́то [этъ] deb öqiladi", en: "Why э́то sounds like [этъ]" },
          theory: {
            zh: "元音是音节的基础：一个词里有几个元音，就有几个音节：ма́-ма。\n由两个或两个以上音节构成的词，其中一个音节读得更长、更清楚，这叫重音，用 ́ 标出：па́па, тома́т, поэ́т。带重音的音节叫重读音节。\n非重读音节里元音会弱化，[а]、[о] 弱化得最厉害：\n词首或重音前第一个音节：读成短而弱的 [ʌ]（一级弱化）：тома́т [тʌмат], пото́м [пʌтом], поэ́т [пʌэт]。\n词末、重音后，或重音前第二个及以前的音节：读成短促含糊的 [ъ]（二级弱化）：э́то [этъ], ма́ма [мамъ], потому́ [пътʌму]。",
            ru: "Сколько в слове гласных, столько и слогов: ма́-ма.\nОдин слог в слове произносится длиннее и чётче — это ударение (знак ́): па́па, тома́т, поэ́т.\nБезударные а и о сокращаются (редуцируются):\nв начале слова и в первом предударном слоге — краткий [ʌ]: тома́т [тʌмат], пото́м [пʌтом], поэ́т [пʌэт];\nна конце слова, после ударения и во втором предударном слоге — неясный [ъ]: э́то [этъ], ма́ма [мамъ], потому́ [пътʌму].",
            uz: "Sözda neçta unli bölsa, şunça böğin bor: ма́-ма.\nUrğuli böğin uzunroq va aniqroq aytiladi: па́па, тома́т, поэ́т.\nUrğusiz а va о qisqaradi: тома́т [тʌмат]; э́то [этъ], ма́ма [мамъ].",
            en: "A word has as many syllables as vowels: ма́-ма.\nOne syllable is longer and clearer — the stress (mark ́): па́па, тома́т, поэ́т.\nUnstressed а and о are reduced:\nat the start of a word and right before the stress — a short [ʌ]: тома́т [тʌмат], пото́м [пʌтом], поэ́т [пʌэт];\nat the end of a word, after the stress, or two+ syllables before it — a vague [ъ]: э́то [этъ], ма́ма [мамъ], потому́ [пътʌму].",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "тома́т", speak: "тома́т", instruction: I.choose,
              question: { zh: "这个词有几个音节？", ru: "Сколько слогов в слове?", uz: "Bu sözda neçta böğin bor?" },
              explanation: { zh: "两个元音 о、а，所以有两个音节：то-ма́т。", ru: "Две гласные — два слога: то-ма́т.", uz: "Ikki böğin: то-ма́т." },
              options: [{ text: same("2"), correct: true }, { text: same("1") }, { text: same("3") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "потому́", speak: "потому́", instruction: I.choose,
              question: { zh: "这个词有几个音节？", ru: "Сколько слогов в слове?", uz: "Bu sözda neçta böğin bor?" },
              explanation: { zh: "по-то-му́：三个音节。", ru: "по-то-му́ — три слога.", uz: "по-то-му́ — uç böğin." },
              options: [{ text: same("3"), correct: true }, { text: same("2") }, { text: same("4") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "тома́т", speak: "тома́т", instruction: I.choose,
              question: { zh: "重音在哪个音节？", ru: "Какой слог ударный?", uz: "Qaysi böğin urğuli?" },
              explanation: { zh: "тома́т — 重音在第二个音节。", ru: "Ударение на втором слоге.", uz: "Urğu ikkinçi böğinda." },
              options: [
                { text: { zh: "第二个（-ма́т）", ru: "второй (-ма́т)", uz: "ikkinçi (-ма́т)" }, correct: true },
                { text: { zh: "第一个（то́-）", ru: "первый (то́-)", uz: "birinçi (то́-)" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "э́то", speak: "э́то", instruction: I.choose,
              question: { zh: "词末的 о 读作……", ru: "Как звучит о на конце слова?", uz: "Söz oxiridagi о qanday aytiladi?" },
              explanation: { zh: "词末的 о 二级弱化，读成含糊的 [ъ]：[этъ]。", ru: "На конце — неясный [ъ]: [этъ].", uz: "Oxirida noaniq [ъ]: [этъ]." },
              options: [
                { text: { zh: "短促含糊的 [ъ]", ru: "неясный [ъ]", uz: "noaniq [ъ]" }, correct: true },
                { text: { zh: "清楚的 [о]", ru: "чёткий [о]", uz: "aniq [о]" } },
                { text: { zh: "[у]", ru: "[у]", uz: "[у]" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "поэ́т", speak: "поэ́т", instruction: I.choose,
              question: { zh: "重音前第一个音节的 о 读作……", ru: "Как звучит о в первом предударном слоге?", uz: "Urğudan oldingi böğindagi о qanday aytiladi?" },
              explanation: { zh: "一级弱化，读成短而弱的 [ʌ]：[пʌэт]。", ru: "Краткий [ʌ]: [пʌэт].", uz: "Qisqa [ʌ]: [пʌэт]." },
              options: [
                { text: { zh: "短而弱的 [ʌ]", ru: "краткий [ʌ]", uz: "qisqa [ʌ]" }, correct: true },
                { text: { zh: "清楚的 [о]", ru: "чёткий [о]", uz: "aniq [о]" } },
                { text: { zh: "不发音", ru: "не произносится", uz: "aytilmaydi" } },
              ],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和实际读音配对", ru: "Соедините слово и его произношение", uz: "Sözni talaffuzi bilan moslang" },
              explanation: { zh: "非重读的 а、о 弱化成 [ʌ] 或 [ъ]。", ru: "Безударные а, о звучат как [ʌ] или [ъ].", uz: "Urğusiz а, о qisqaradi." },
              pairs: [{ left: "э́то", right: "[этъ]" }, { left: "ма́ма", right: "[мамъ]" }, { left: "тома́т", right: "[тʌмат]" }, { left: "пото́м", right: "[пʌтом]" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
              question: { zh: "带重音的音节叫……", ru: "Слог с ударением называется…", uz: "Urğuli böğin …" },
              explanation: { zh: "重读音节；其余的叫非重读音节。", ru: "Ударный; остальные — безударные.", uz: "Urğuli böğin." },
              options: [
                { text: { zh: "重读音节", ru: "ударным", uz: "urğuli" }, correct: true },
                { text: { zh: "非重读音节", ru: "безударным", uz: "urğusiz" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
              question: { zh: "哪个词的重音标得对？", ru: "Где ударение поставлено верно?", uz: "Qaysi sözda urğu töğri?" },
              explanation: { zh: "поэ́т — 重音在 э 上。", ru: "поэ́т.", uz: "поэ́т." },
              options: [{ text: same("поэ́т"), correct: true }, { text: same("по́эт") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "т_мат", speak: "тома́т", instruction: I.gap,
              question: { zh: "番茄 т_мат：缺的是哪个字母？", ru: "т_мат (помидор): какая буква пропущена?", uz: "т_мат (pomidor): qaysi harf tuşib qolgan?" },
              explanation: { zh: "写 о，但在重音前读得像 а：томáт。", ru: "Пишется о, но перед ударением звучит как а: тома́т.", uz: "о yoziladi, lekin urğudan oldin а kabi eşitiladi: тома́т." },
              options: [{ text: same("о"), correct: true }, { text: same("а") }, { text: same("у") }, { text: same("э") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "п_эт", speak: "поэ́т", instruction: I.gap,
              question: { zh: "诗人 п_эт：缺的是哪个字母？", ru: "п_эт (поэт): какая буква пропущена?", uz: "п_эт (şoir): qaysi harf tuşib qolgan?" },
              explanation: { zh: "поэ́т：写 о，读得短而弱。", ru: "поэ́т: пишется о, звучит слабо и коротко.", uz: "поэ́т: о yoziladi, qisqa eşitiladi." },
              options: [{ text: same("о"), correct: true }, { text: same("а") }, { text: same("у") }, { text: same("э") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Эмм_", speak: "Э́мма", instruction: I.gap,
              question: { zh: "爱玛 Эмм_：缺的是哪个字母？", ru: "Эмм_ (имя): какая буква пропущена?", uz: "Эмм_ (ism): qaysi harf tuşib qolgan?" },
              explanation: { zh: "Э́мма：词末是 а，读成含糊的 [ъ]。", ru: "Э́мма: на конце а, звучит неясно.", uz: "Э́мма: oxirida а." },
              options: [{ text: same("а"), correct: true }, { text: same("о") }, { text: same("у") }, { text: same("э") }],
            },
          ],
        },
        // ── Lesson 4 ─────────────────────────────────────────────── 调型1，句型
        {
          type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "调型1：Э́то ма́ма.", ru: "ИК-1: Э́то ма́ма.", uz: "1-ohang: Э́то ма́ма.", en: "Intonation 1: Э́то ма́ма." },
          description: { zh: "这是……；这里、那里", ru: "Это …; тут и там", uz: "Bu …; bu yerda, u yerda", en: "This is …; here and there" },
          theory: {
            zh: "调型1（ИК-1）用于陈述句，表示一句话结束：Э́то ма́ма. Э́то поэ́т. Э́то Э́мма.\n调心前部用说话人的中调，调心（重读元音）用低于前部的降调，调心后部也低于前部。\n句型：① Э́то ма́ма. 这是妈妈。\n② Тут ма́ма. Там па́па. 妈妈在这里，爸爸在那里。\n新词：э́то 这是 · тут 这里 · там 那里 · а 而 · у 在……旁边、在……那里",
            ru: "ИК-1 — повествовательное предложение, законченная мысль: Э́то ма́ма. Э́то поэ́т. Э́то Э́мма.\nДо центра — средний тон, на ударном гласном центра — понижение, после центра — низкий тон.\nОбразцы: ① Э́то ма́ма. ② Тут ма́ма. Там па́па.\nСлова: э́то · тут · там · а · у",
            uz: "1-ohang darak gaplar uçun: Э́то ма́ма. Э́то поэ́т.\nOhang markazida ovoz pasayadi.\nNamuna: ① Э́то ма́ма. — Bu ona. ② Тут ма́ма. Там па́па. — Ona bu yerda, dada u yerda.\nSözlar: э́то bu · тут bu yerda · там u yerda · а esa · у yonida",
            en: "Intonation type 1 is for statements, a finished thought: Э́то ма́ма. Э́то поэ́т. Э́то Э́мма.\nMid tone before the centre, a fall on the stressed vowel of the centre, low after it.\nPatterns: ① Э́то ма́ма. This is mum. ② Тут ма́ма. Там па́па. Mum is here, dad is there.\nWords: э́то this is · тут here · там there · а and/but · у at, near",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "调型1用于……", ru: "ИК-1 используется в…", uz: "1-ohang … uçun" },
              explanation: { zh: "调型1用于陈述句，表示一句话结束。", ru: "В повествовательном предложении.", uz: "Darak gap uçun." },
              options: [
                { text: { zh: "陈述句，表示一句话结束", ru: "повествовательном предложении", uz: "darak gap" }, correct: true },
                { text: { zh: "一般疑问句", ru: "общем вопросе", uz: "umumiy söroq" } },
                { text: { zh: "感叹句", ru: "восклицании", uz: "undov gap" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "调型1的调心用……", ru: "На центре ИК-1 тон…", uz: "1-ohang markazida ovoz …" },
              explanation: { zh: "调心的元音用降调。", ru: "Понижается.", uz: "Pasayadi." },
              options: [
                { text: { zh: "降调", ru: "понижается", uz: "pasayadi" }, correct: true },
                { text: { zh: "升调", ru: "повышается", uz: "kötariladi" } },
                { text: { zh: "平调", ru: "ровный", uz: "tekis" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Э́то ма́ма.", speak: "Э́то ма́ма.", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu gap nimani anglatadi?" },
              explanation: { zh: "Э́то ма́ма. — 这是妈妈。", ru: "Это мама.", uz: "Bu — ona." },
              options: [meaning("这是妈妈。", "Bu — ona.", undefined, true), meaning("妈妈在那里。", "Ona u yerda."), meaning("这是爸爸。", "Bu — dada.")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Па́па там.", speak: "Па́па там.", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu gap nimani anglatadi?" },
              explanation: { zh: "там — 那里：爸爸在那里。", ru: "Папа там.", uz: "Dada u yerda." },
              options: [meaning("爸爸在那里。", "Dada u yerda.", undefined, true), meaning("爸爸在这里。", "Dada bu yerda."), meaning("这是爸爸。", "Bu — dada.")],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "这是诗人。", ru: "Составьте: «Это поэт.»", uz: "«Bu — şoir» gapini tuzing" },
              explanation: { zh: "Э́то поэ́т.", ru: "Э́то поэ́т.", uz: "Э́то поэ́т." },
              words: ["поэ́т", "там", "Э́то", "тут"], correctWords: ["Э́то", "поэ́т"],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "妈妈在这里。", ru: "Составьте: «Мама тут.»", uz: "«Ona bu yerda» gapini tuzing" },
              explanation: { zh: "Ма́ма тут. — тут 这里，там 那里。", ru: "Ма́ма тут.", uz: "Ма́ма тут." },
              words: ["там", "Ма́ма", "э́то", "тут"], correctWords: ["Ма́ма", "тут"],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Sözni maʼnosi bilan moslang" },
              explanation: { zh: "тут 这里，там 那里，э́то 这是，а 而。", ru: "тут, там, э́то, а.", uz: "тут, там, э́то, а." },
              pairs: [{ left: "тут", right: "这里" }, { left: "там", right: "那里" }, { left: "э́то", right: "这是" }, { left: "а", right: "而" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
              question: { zh: "“爸爸在那里。”用俄语怎么说？", ru: "Как сказать «Папа там»?", uz: "«Dada u yerda» qanday aytiladi?" },
              explanation: { zh: "Па́па там.", ru: "Па́па там.", uz: "Па́па там." },
              options: [{ text: same("Па́па там."), correct: true }, { text: same("Па́па тут.") }, { text: same("Э́то па́па.") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Э́то ма́ма.", speak: "Э́то ма́ма.", instruction: I.choose,
              question: { zh: "调型1的调心在哪个词上？", ru: "На каком слове центр ИК-1?", uz: "1-ohang markazi qaysi sözda?" },
              explanation: { zh: "调心在 ма́ма 的重读音节上，声音在这里下降。", ru: "Центр на ма́ма: на ударном слоге голос понижается.", uz: "Markaz ма́ма sözida: ovoz pasayadi." },
              options: [{ text: same("ма́ма"), correct: true }, { text: same("э́то") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", listen: true, speak: "Па́па тут.", instruction: I.listen,
              question: { zh: "你听到的是哪句话？", ru: "Какую фразу вы услышали?", uz: "Qaysi gapni eşitdingiz?" },
              explanation: { zh: "Па́па тут. 爸爸在这里。", ru: "Па́па тут. — Папа здесь.", uz: "Па́па тут. — Dada bu yerda." },
              options: [{ text: same("Па́па тут."), correct: true }, { text: same("Па́па там.") }, { text: same("Ма́ма тут.") }],
            },
          ],
        },
        // ── Lesson 5 ─────────────────────────────────────────────── 对话、课文、生词
        {
          type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
          title: { zh: "Э́то па́па. А э́то ма́ма.", ru: "Э́то па́па. А э́то ма́ма.", uz: "Э́то па́па. А э́то ма́ма.", en: "Э́то па́па. А э́то ма́ма." },
          description: { zh: "对话、课文和生词", ru: "Диалог, текст и новые слова", uz: "Dialog, matn va yangi sözlar", en: "Dialogue, text and new words" },
          theory: {
            zh: "对话：— Э́то па́па. — А э́то ма́ма. — Э́то поэ́т. — А э́то Э́мма.\n课文：Э́то ма́ма. Ма́ма там. А э́то па́па. Па́па тут. Па́па у поэ́та.\n新词：па́па 爸爸 · ма́ма 妈妈 · тома́т 番茄 · поэ́т 诗人 · тот 那个 · от 从……，由…… · ум 智慧，智力 · пото́м 然后 · потому́ 因此，所以 · Э́мма 爱玛（人名）\nа 是连词“而”，用来对比：Э́то па́па, а э́то ма́ма. 这是爸爸，而这是妈妈。",
            ru: "Диалог: — Э́то па́па. — А э́то ма́ма. — Э́то поэ́т. — А э́то Э́мма.\nТекст: Э́то ма́ма. Ма́ма там. А э́то па́па. Па́па тут. Па́па у поэ́та.\nСлова: па́па · ма́ма · тома́т · поэ́т · тот · от · ум · пото́м · потому́ · Э́мма\nСоюз «а» сопоставляет: Э́то па́па, а э́то ма́ма.",
            uz: "Dialog: — Э́то па́па. — А э́то ма́ма. — Э́то поэ́т. — А э́то Э́мма.\nMatn: Э́то ма́ма. Ма́ма там. А э́то па́па. Па́па тут. Па́па у поэ́та.\nSözlar: па́па dada · ма́ма ona · тома́т pomidor · поэ́т şoir · пото́м keyin · потому́ şuning uçun · ум aql\n«а» — «esa»: Э́то па́па, а э́то ма́ма.",
            en: "Dialogue: — Э́то па́па. — А э́то ма́ма. — Э́то поэ́т. — А э́то Э́мма.\nText: Э́то ма́ма. Ма́ма там. А э́то па́па. Па́па тут. Па́па у поэ́та.\nWords: па́па dad · ма́ма mum · тома́т tomato · поэ́т poet · тот that · от from · ум mind · пото́м then · потому́ therefore · Э́мма Emma\n«а» contrasts: Э́то па́па, а э́то ма́ма. This is dad, and this is mum.",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "поэ́т", speak: "поэ́т", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "поэ́т — 诗人。", ru: "поэ́т — поэт.", uz: "поэ́т — şoir." },
              options: [meaning("诗人", "şoir", "✍️", true), meaning("番茄", "pomidor", "🍅"), meaning("爸爸", "dada", "👨")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "тома́т", speak: "тома́т", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "тома́т — 番茄。", ru: "тома́т — помидор.", uz: "тома́т — pomidor." },
              options: [meaning("诗人", "şoir", "✍️"), meaning("妈妈", "ona", "👩"), meaning("番茄", "pomidor", "🍅", true)],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Sözni maʼnosi bilan moslang" },
              explanation: { zh: "па́па 爸爸，ма́ма 妈妈，поэ́т 诗人，тома́т 番茄。", ru: "па́па, ма́ма, поэ́т, тома́т.", uz: "па́па, ма́ма, поэ́т, тома́т." },
              pairs: [{ left: "па́па", right: "爸爸" }, { left: "ма́ма", right: "妈妈" }, { left: "поэ́т", right: "诗人" }, { left: "тома́т", right: "番茄" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "пото́м", speak: "пото́м", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "пото́м — 然后；потому́ — 因此，所以。", ru: "пото́м — затем; потому́ — поэтому.", uz: "пото́м — keyin." },
              options: [meaning("然后", "keyin", undefined, true), meaning("因此，所以", "şuning uçun"), meaning("那里", "u yerda")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Э́то па́па, а э́то ма́ма.", speak: "Это папа, а это мама.", instruction: I.choose,
              question: { zh: "句中的 а 是什么意思？", ru: "Что значит «а» в этой фразе?", uz: "Bu gapda «а» nimani bildiradi?" },
              explanation: { zh: "а 是连词“而”，表示对比。", ru: "Союз сопоставления.", uz: "«esa» — qiyoslaş." },
              options: [meaning("而（对比）", "esa (qiyos)", undefined, true), meaning("和", "va"), meaning("不", "yöq")],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", prompt: "— Э́то поэ́т.", instruction: I.build,
              question: { zh: "回答：而这是爱玛。", ru: "Ответьте: «А это Эмма.»", uz: "Javob: «А это Эмма.»" },
              explanation: { zh: "А э́то Э́мма.", ru: "А э́то Э́мма.", uz: "А э́то Э́мма." },
              words: ["Э́мма", "А", "там", "э́то"], correctWords: ["А", "э́то", "Э́мма"],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Па́па у поэ́та.", speak: "Па́па у поэ́та.", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu gap nimani anglatadi?" },
              explanation: { zh: "у — 在……那里：爸爸在诗人那里。", ru: "Папа у поэта (в гостях).", uz: "Dada şoirnikida." },
              options: [meaning("爸爸在诗人那里。", "Dada şoirnikida.", undefined, true), meaning("爸爸是诗人。", "Dada — şoir."), meaning("诗人在这里。", "Şoir bu yerda.")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "ум", speak: "ум", instruction: I.meaning,
              question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
              explanation: { zh: "ум — 智慧，智力。", ru: "ум — разум.", uz: "ум — aql." },
              options: [meaning("智慧", "aql", "🧠", true), meaning("番茄", "pomidor", "🍅"), meaning("从……", "…dan")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", listen: true, speak: "А э́то Э́мма.", instruction: I.listen,
              question: { zh: "你听到的是哪句话？", ru: "Какую фразу вы услышали?", uz: "Qaysi gapni eşitdingiz?" },
              explanation: { zh: "А э́то Э́мма. 而这是爱玛。", ru: "А э́то Э́мма. — А это Эмма.", uz: "А э́то Э́мма. — Bu esa Emma." },
              options: [{ text: same("А э́то Э́мма."), correct: true }, { text: same("Э́то Э́мма.") }, { text: same("А э́то ма́ма.") }],
            },
          ],
        },
        // ── Lesson 6 ─────────────────────────────────────────────── 礼貌用语，文化国情
        {
          type: "CONVERSATION", xpReward: 25, estimatedMinutes: 5,
          title: { zh: "Здра́вствуйте! 俄罗斯概况", ru: "Здра́вствуйте! О России", uz: "Здра́вствуйте! Rossiya haqida", en: "Здра́вствуйте! About Russia" },
          description: { zh: "问候、告别和俄罗斯国情", ru: "Приветствие, прощание и страна", uz: "Salomlaşiş, xayrlaşiş va mamlakat", en: "Hello, goodbye and the country" },
          theory: {
            zh: "Здра́вствуйте! 您好！你们好！\nДо свида́ния! 再见！\n小龙 Olov 讲文化国情：俄罗斯是世界上面积最大的国家，领土面积约 1707.5 万平方公里，位于欧亚大陆的北部。\n按地理位置，俄罗斯分为 8 个传统地理区域：欧洲北部、西北、中央、北高加索、伏尔加河沿岸、乌拉尔、西伯利亚和远东地区。\n俄罗斯国土辽阔，横跨 11 个时区（东二区至东十二区），标准时间以莫斯科（东三区）时间为准。",
            ru: "Здра́вствуйте! — приветствие (вежливо или многим).\nДо свида́ния! — прощание.\nДракончик Olov: Россия — самая большая страна мира, около 17,075 млн км², на севере Евразии.\n8 традиционных регионов: Европейский Север, Северо-Запад, Центр, Северный Кавказ, Поволжье, Урал, Сибирь и Дальний Восток.\n11 часовых поясов (UTC+2…UTC+12), стандартное время — московское (UTC+3).",
            uz: "Здра́вствуйте! — Assalomu alaykum!\nДо свида́ния! — Xayr!\nRossiya — dunyodagi eng katta davlat, maydoni taxminan 17,075 mln km², Yevrosiyoning şimolida.\n8 ta anʼanaviy hudud va 11 ta vaqt mintaqasi; standart vaqt — Moskva vaqti.",
            en: "Здра́вствуйте! — Hello (polite or to several people).\nДо свида́ния! — Goodbye.\nOlov the dragon: Russia is the largest country in the world, about 17.075 million km², in the north of Eurasia.\n8 traditional regions: European North, North-West, Centre, North Caucasus, Volga, Urals, Siberia and the Far East.\n11 time zones (UTC+2 to UTC+12); standard time is Moscow time (UTC+3).",
          },
          exercises: [
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Здра́вствуйте!", speak: "Здра́вствуйте!", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu ibora nimani anglatadi?" },
              explanation: { zh: "Здра́вствуйте! — 您好！你们好！", ru: "Приветствие.", uz: "Assalomu alaykum!" },
              options: [meaning("您好！", "Assalomu alaykum!", "👋", true), meaning("再见！", "Xayr!", "🚶"), meaning("谢谢！", "Rahmat!", "🙏")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "До свида́ния!", speak: "До свида́ния!", instruction: I.meaning,
              question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu ibora nimani anglatadi?" },
              explanation: { zh: "До свида́ния! — 再见！", ru: "Прощание.", uz: "Xayr!" },
              options: [meaning("您好！", "Assalomu alaykum!", "👋"), meaning("再见！", "Xayr!", "🚶", true), meaning("这是妈妈。", "Bu — ona.", "👩")],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
              question: { zh: "早上见到老师，应该说：", ru: "Утром вы встретили преподавателя. Что сказать?", uz: "Ertalab öqituvçini kördingiz. Nima deysiz?" },
              explanation: { zh: "见面问候用 Здра́вствуйте!", ru: "Здра́вствуйте!", uz: "Здра́вствуйте!" },
              options: [{ text: same("Здра́вствуйте!"), correct: true }, { text: same("До свида́ния!") }, { text: same("Па́па там.") }],
            },
            {
              type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
              question: { zh: "再见！", ru: "Составьте: «До свидания!»", uz: "«Xayr!» ni rusça tuzing" },
              explanation: { zh: "До свида́ния!", ru: "До свида́ния!", uz: "До свида́ния!" },
              words: ["свида́ния!", "Здра́вствуйте!", "До", "э́то"], correctWords: ["До", "свида́ния!"],
            },
            {
              type: "MATCHING", mascot: "tiger", instruction: I.match,
              question: { zh: "把俄语和中文配对", ru: "Соедините русские фразы с китайскими", uz: "Rusça va xitoyça iboralarni moslang" },
              explanation: { zh: "两句礼貌用语，两个陈述句。", ru: "Две формулы этикета и два утверждения.", uz: "Ikki odob iborasi va ikki darak gap." },
              pairs: [{ left: "Здра́вствуйте!", right: "您好！" }, { left: "До свида́ния!", right: "再见！" }, { left: "Э́то ма́ма.", right: "这是妈妈。" }, { left: "Па́па там.", right: "爸爸在那里。" }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "俄罗斯的领土面积约为……", ru: "Площадь России — около…", uz: "Rossiya maydoni taxminan …" },
              explanation: { zh: "约 1707.5 万平方公里，是世界上面积最大的国家。", ru: "Около 17,075 млн км² — самая большая страна мира.", uz: "Taxminan 17,075 mln km²." },
              options: [
                { text: { zh: "1707.5 万平方公里", ru: "17,075 млн км²", uz: "17,075 mln km²" }, correct: true },
                { text: { zh: "960 万平方公里", ru: "9,6 млн км²", uz: "9,6 mln km²" } },
                { text: { zh: "44.7 万平方公里", ru: "447 тыс. км²", uz: "447 ming km²" } },
              ],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "俄罗斯横跨多少个时区？", ru: "Сколько часовых поясов в России?", uz: "Rossiyada neçta vaqt mintaqasi bor?" },
              explanation: { zh: "11 个时区：东二区至东十二区。", ru: "11: от UTC+2 до UTC+12.", uz: "11 ta." },
              options: [{ text: same("11"), correct: true }, { text: same("5") }, { text: same("8") }],
            },
            {
              type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
              question: { zh: "俄罗斯的标准时间以哪座城市为准？", ru: "По какому городу считается стандартное время?", uz: "Standart vaqt qaysi şahar böyiça?" },
              explanation: { zh: "以莫斯科（东三区）时间为准。", ru: "По московскому (UTC+3).", uz: "Moskva vaqti (UTC+3)." },
              options: [
                { text: { zh: "莫斯科", ru: "Москва", uz: "Moskva" }, correct: true },
                { text: { zh: "圣彼得堡", ru: "Санкт-Петербург", uz: "Sankt-Peterburg" } },
                { text: { zh: "新西伯利亚", ru: "Новосибирск", uz: "Novosibirsk" } },
              ],
            },
          ],
        },
      ],
    },
    ruUnit2,
    ruUnit3,
  ],
};
