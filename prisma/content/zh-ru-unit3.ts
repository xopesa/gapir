// Course "Russian for Chinese speakers" (zh → ru), Unit 3 «Моя семья».
// The rest of the sound system a Chinese speaker struggles with — the trilled р
// and hard л, iotated я е ё ю with й, soft consonants and ь, the hissing ж ш ч щ
// and ц — then grammatical gender with мой / моя / моё, and introducing yourself
// (Как тебя зовут? Я из Китая. Я живу в Ташкенте.) plus names with patronymics.
// Uzbek texts use the new alphabet.
import { I, meaning, same, type ModuleContent } from "./common";

export const ruUnit3: ModuleContent = {
  title: { zh: "第三单元 · 我的家", ru: "Юнит 3 · Моя семья", uz: "3-bölim · Mening oilam", en: "Unit 3 · My family" },
  description: { zh: "р 和 л，я е ё ю，软辅音，ж ш ч щ ц，名词的性，自我介绍", ru: "Р и Л, я е ё ю, мягкие согласные, ж ш ч щ ц, род, знакомство", uz: "Р va Л, я е ё ю, yumşoq undoşlar, ж ш ч щ ц, rod, tanişuv", en: "Р and Л, я е ё ю, soft consonants, ж ш ч щ ц, gender, introductions" },
  lessons: [
    // ── Lesson 1 ─────────────────────────────────────────────── р л
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "辅音 Р · Л", ru: "Согласные Р · Л", uz: "Р · Л undoşlari", en: "Consonants Р · Л" },
      description: { zh: "大舌音 р 和硬的 л", ru: "Дрожащий р и твёрдый л", uz: "Titroq р va qattiq л", en: "Trilled р and hard л" },
      theory: {
        zh: "熊猫 Paxta：这两个音对中国学生最难，别着急，每天练一点。\n[р] — 颤音（大舌音）：舌尖轻轻抬起靠近上齿龈，气流冲过去让舌尖连续颤动。汉语里没有这个音，也不要读成拼音 l 或 r。练习方法：快速说 д-д-д，或者先练 тр、др：тра — тро — тру。\n[л] — 硬的 л：舌尖抵住上齿背，舌后部同时向软腭抬起，声音比汉语的 l 更“厚”、更低。\n跟读：ра — ро — ру，ла — ло — лу。\n新词：рот 嘴 · рука́ 手 · ла́мпа 灯 · стол 桌子 · брат 兄弟",
        ru: "Эти два звука труднее всего для китайцев — тренируйтесь понемногу каждый день.\n[р] — дрожащий: кончик языка поднят к альвеолам и вибрирует от потока воздуха. В китайском такого звука нет; не заменяйте его на l или r. Упражнение: быстро «д-д-д», затем тра — тро — тру.\n[л] — твёрдый: кончик языка у верхних зубов, задняя часть языка поднята; звук «темнее», чем китайское l.\nПовторяйте: ра — ро — ру, ла — ло — лу.\nНовые слова: рот, рука́, ла́мпа, стол, брат.",
        uz: "Bu ikki tovuş xitoyliklar uçun eng qiyin.\n[р] — titroq: til uçi tebranadi; özbekça р ga öxşaydi.\n[л] — qattiq: til orqasi kötariladi, özbekça л dan qalinroq.\nYangi sözlar: рот oğiz · рука́ qöl · ла́мпа çiroq · стол stol · брат aka-uka",
        en: "These two are the hardest for Chinese speakers — practise a little every day.\n[р] — trilled: the tongue tip near the gum ridge vibrates in the air stream. Chinese has no such sound; don't replace it with l or r. Drill: a fast «д-д-д», then тра — тро — тру.\n[л] — hard: tongue tip at the upper teeth, back of the tongue raised; darker than Chinese l.\nRepeat: ра — ро — ру, ла — ло — лу.\nNew words: рот mouth · рука́ hand · ла́мпа lamp · стол table · брат brother",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "р", speak: "ра", instruction: I.choose,
          question: { zh: "发 [р] 时，舌尖……", ru: "При [р] кончик языка…", uz: "[р] da til uçi …" },
          explanation: { zh: "[р] 是颤音：舌尖在气流中连续颤动。", ru: "Кончик языка вибрирует.", uz: "Til uçi tebranadi." },
          options: [
            { text: { zh: "连续颤动", ru: "вибрирует", uz: "tebranadi" }, correct: true },
            { text: { zh: "卷向上腭不动", ru: "загнут и неподвижен", uz: "bukilib turadi" } },
            { text: { zh: "放在下齿后面", ru: "лежит за нижними зубами", uz: "pastki tişlar ortida" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "练习 [р] 时，可以先快速说……", ru: "Чтобы научиться [р], быстро повторяйте…", uz: "[р] ni örganiş uçun tez takrorlang…" },
          explanation: { zh: "快速说 д-д-д，舌尖的位置和 [р] 一样，慢慢就能颤起来。", ru: "«д-д-д» — то же место, что у [р].", uz: "«д-д-д» — [р] bilan bir joyda." },
          options: [{ text: same("д-д-д"), correct: true }, { text: same("м-м-м") }, { text: same("а-а-а") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "л", speak: "ла", instruction: I.choose,
          question: { zh: "俄语硬的 [л] 和汉语的 l 相比……", ru: "Русское твёрдое [л] по сравнению с китайским l…", uz: "Ruscha qattiq [л] xitoyça l ga nisbatan…" },
          explanation: { zh: "发 [л] 时舌后部同时抬起，声音更“厚”、更低。", ru: "Задняя часть языка поднята — звук темнее.", uz: "Til orqasi kötariladi — tovuş qalinroq." },
          options: [
            { text: { zh: "更厚、更低", ru: "темнее и ниже", uz: "qalinroq va pastroq" }, correct: true },
            { text: { zh: "完全一样", ru: "точно такое же", uz: "xuddi şunday" } },
            { text: { zh: "更轻、更高", ru: "легче и выше", uz: "yengilroq va balandroq" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "рука́", speak: "рука́", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "рука́ — 手（重音在后面）。", ru: "рука́ — рука.", uz: "рука́ — qöl." },
          options: [meaning("手", "qöl", "✋", true), meaning("嘴", "oğiz", "👄"), meaning("灯", "çiroq", "💡")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "стол", speak: "стол", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "стол — 桌子。", ru: "стол — стол.", uz: "стол — stol." },
          options: [meaning("桌子", "stol", "🪑", true), meaning("房子", "uy", "🏠"), meaning("兄弟", "aka-uka", "👦")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слова с переводом", uz: "Sözni maʼnosi bilan moslang" },
          explanation: { zh: "рот 嘴 · ла́мпа 灯 · брат 兄弟 · рука́ 手。", ru: "рот, ла́мпа, брат, рука́.", uz: "рот oğiz · ла́мпа çiroq · брат aka-uka · рука́ qöl." },
          pairs: [{ left: "рот", right: "嘴" }, { left: "ла́мпа", right: "灯" }, { left: "брат", right: "兄弟" }, { left: "рука́", right: "手" }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "不，这是爸爸。", ru: "Составьте: «Нет, это папа.»", uz: "«Yöq, bu — dada» gapini tuzing" },
          explanation: { zh: "Нет, э́то па́па.", ru: "Нет, э́то па́па.", uz: "Нет, э́то па́па." },
          words: ["брат", "па́па.", "Нет,", "э́то", "да"], correctWords: ["Нет,", "э́то", "па́па."],
        },
      ],
    },
    // ── Lesson 2 ─────────────────────────────────────────────── я е ё ю й
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "字母 Я · Е · Ё · Ю 和 Й", ru: "Буквы Я · Е · Ё · Ю и Й", uz: "Я · Е · Ё · Ю va Й harflari", en: "Letters Я · Е · Ё · Ю and Й" },
      description: { zh: "一个字母两个音", ru: "Одна буква — два звука", uz: "Bitta harf — ikki tovuş", en: "One letter, two sounds" },
      theory: {
        zh: "[й] — 舌中部抬向硬腭，短促的半元音，接近汉语拼音 y：мой 我的，май 五月。\nя、е、ё、ю 在词首、元音后面时读两个音：я = [йа]，е = [йэ]，ё = [йо]，ю = [йу]。\n在辅音后面时，它们让前面的辅音变软（下一课学），自己读 [а]、[э]、[о]、[у]。\nё 永远重读，平时书写常写成 е：ёлка = елка。\n跟读：я — ю — ё — е，ай — ой — уй。\n新词：я 我 · мой 我的 · ю́бка 裙子 · ёлка 枞树 · е́сли 如果",
        ru: "[й] — короткий звук, средняя часть языка у нёба, похож на китайское y: мой, май.\nВ начале слова и после гласной я, е, ё, ю обозначают два звука: я = [йа], е = [йэ], ё = [йо], ю = [йу].\nПосле согласной они смягчают согласный (следующий урок) и звучат [а], [э], [о], [у].\nЁ всегда ударная; на письме её часто заменяют на е: ёлка = елка.\nПовторяйте: я — ю — ё — е, ай — ой — уй.\nНовые слова: я, мой, ю́бка, ёлка, е́сли.",
        uz: "[й] — özbekça y ga öxşaydi: мой, май.\nSöz boşida va unlidan keyin я, е, ё, ю ikki tovuş: я = [йа], е = [йэ], ё = [йо], ю = [йу].\nЁ doim urğuli.\nYangi sözlar: я men · мой mening · ю́бка yubka · ёлка arça",
        en: "[й] — a short sound, middle of the tongue at the palate, like pinyin y: мой, май.\nAt the start of a word and after a vowel я, е, ё, ю stand for two sounds: я = [йа], е = [йэ], ё = [йо], ю = [йу].\nAfter a consonant they soften it (next lesson) and sound [а], [э], [о], [у].\nЁ is always stressed and is often written as е: ёлка = елка.\nRepeat: я — ю — ё — е, ай — ой — уй.\nNew words: я I · мой my · ю́бка skirt · ёлка fir tree · е́сли if",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "я", speak: "я", instruction: I.choose,
          question: { zh: "在词首，я 读作……", ru: "В начале слова я звучит как…", uz: "Söz boşida я qanday eşitiladi?" },
          explanation: { zh: "在词首和元音后，я = [йа]。", ru: "я = [йа].", uz: "я = [йа]." },
          options: [{ text: same("[йа]"), correct: true }, { text: same("[а]") }, { text: same("[йу]") }],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把字母和它在词首的读音配对", ru: "Соедините букву и звуки в начале слова", uz: "Harfni söz boşidagi tovuşlari bilan moslang" },
          explanation: { zh: "я [йа] · е [йэ] · ё [йо] · ю [йу]。", ru: "я [йа], е [йэ], ё [йо], ю [йу].", uz: "я [йа] · е [йэ] · ё [йо] · ю [йу]." },
          pairs: [{ left: "я", right: "[йа]" }, { left: "е", right: "[йэ]" }, { left: "ё", right: "[йо]" }, { left: "ю", right: "[йу]" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "й", speak: "мой", instruction: I.choose,
          question: { zh: "[й] 接近汉语拼音的……", ru: "[й] похож на китайское…", uz: "[й] xitoyça qaysi tovuşga öxşaydi?" },
          explanation: { zh: "[й] 是短促的半元音，接近拼音 y。", ru: "Похож на y.", uz: "y ga öxşaydi." },
          options: [{ text: same("y"), correct: true }, { text: same("j") }, { text: same("r") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "哪个字母永远重读？", ru: "Какая буква всегда ударная?", uz: "Qaysi harf doim urğuli?" },
          explanation: { zh: "ё 永远重读，所以平时常写成 е，不会读错重音。", ru: "Ё всегда под ударением.", uz: "Ё doim urğuli." },
          options: [{ text: same("ё"), correct: true }, { text: same("е") }, { text: same("я") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "я", speak: "я", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "я — 我。一个字母就是一个词！", ru: "я — местоимение 1-го лица.", uz: "я — men." },
          options: [meaning("我", "men", "🙋", true), meaning("你", "sen", "👉"), meaning("他们", "ular", "👥")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "ёлка", speak: "ёлка", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "ёлка — 枞树，新年树。", ru: "ёлка — новогоднее дерево.", uz: "ёлка — arça." },
          options: [meaning("枞树", "arça", "🎄", true), meaning("裙子", "yubka", "👗"), meaning("桌子", "stol", "🪑")],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是我的房子。", ru: "Составьте: «Это мой дом.»", uz: "«Bu — mening uyim» gapini tuzing" },
          explanation: { zh: "Э́то мой дом.", ru: "Э́то мой дом.", uz: "Э́то мой дом." },
          words: ["дом.", "я", "мой", "Э́то"], correctWords: ["Э́то", "мой", "дом."],
        },
      ],
    },
    // ── Lesson 3 ─────────────────────────────────────────────── soft consonants, ь
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "软辅音和软音符号 Ь", ru: "Мягкие согласные и Ь", uz: "Yumşoq undoşlar va Ь", en: "Soft consonants and Ь" },
      description: { zh: "брат 和 брать 不一样", ru: "брат и брать — разные слова", uz: "брат va брать — boşqa sözlar", en: "брат and брать are different words" },
      theory: {
        zh: "俄语大多数辅音有硬、软两种。发软辅音时，舌中部同时抬向硬腭，好像在辅音里加了一点点 [й] 的色彩。\n辅音后面是 е、ё、и、ю、я 或者软音符号 ь 时，辅音变软：нет、дя́дя、день。\nь 本身不发音，只表示前面的辅音是软的：брат（兄弟）≠ брать（拿）。\n小老虎 Bars：软辅音不要读成两个音节！день 是一个音节，不是“杰尼”。\n新词：мать 母亲 · день 天，白天 · дя́дя 叔叔 · семья́ 家庭 · сестра́ 姐妹",
        ru: "У большинства согласных есть пара: твёрдый — мягкий. При мягком согласном средняя часть языка поднимается к нёбу.\nСогласный мягкий перед е, ё, и, ю, я и перед ь: нет, дя́дя, день.\nЬ не обозначает звука — только мягкость: брат ≠ брать.\nТигрёнок Bars: не превращайте мягкий согласный в лишний слог — день один слог.\nНовые слова: мать, день, дя́дя, семья́, сестра́.",
        uz: "Köp undoşlarning qattiq va yumşoq juftlari bor. Yumşoq undoşda til örtasi tanglayga kötariladi.\nе, ё, и, ю, я va ь dan oldin undoş yumşoq: нет, дя́дя, день.\nЬ tovuş bildirmaydi, faqat yumşoqlikni: брат ≠ брать.\nYangi sözlar: мать ona · день kun · дя́дя amaki · семья́ oila · сестра́ opa-singil",
        en: "Most consonants come hard and soft. For a soft one the middle of the tongue rises to the palate, adding a touch of [й].\nA consonant is soft before е, ё, и, ю, я and before ь: нет, дя́дя, день.\nЬ has no sound of its own — it only marks softness: брат (brother) ≠ брать (to take).\nBars the tiger cub: don't add a syllable — день is one syllable.\nNew words: мать mother · день day · дя́дя uncle · семья́ family · сестра́ sister",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "软音符号 ь 读什么音？", ru: "Какой звук обозначает ь?", uz: "ь qanday tovuşni bildiradi?" },
          explanation: { zh: "ь 不发音，只表示前面的辅音是软的。", ru: "Никакого — только мягкость.", uz: "Heç qanday — faqat yumşoqlik." },
          options: [
            { text: { zh: "不发音，表示前面的辅音软", ru: "никакого, только мягкость", uz: "heç qanday, faqat yumşoqlik" }, correct: true },
            { text: { zh: "[й]", ru: "[й]", uz: "[й]" } },
            { text: { zh: "[и]", ru: "[и]", uz: "[и]" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "哪个词里的 т 是软的？", ru: "В каком слове т мягкий?", uz: "Qaysi sözda т yumşoq?" },
          explanation: { zh: "брать：т 后面有 ь，所以是软的；брат 里的 т 是硬的。", ru: "брать — перед ь.", uz: "брать — ь dan oldin." },
          options: [{ text: same("брать"), correct: true }, { text: same("брат") }, { text: same("кот") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "день", speak: "день", instruction: I.choose,
          question: { zh: "день 有几个音节？", ru: "Сколько слогов в слове день?", uz: "день sözida neçta böğin?" },
          explanation: { zh: "一个元音，一个音节。软辅音不增加音节。", ru: "Один слог.", uz: "Bitta böğin." },
          options: [{ text: same("1"), correct: true }, { text: same("2") }, { text: same("3") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "мать", speak: "мать", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "мать — 母亲（ма́ма 是口语的“妈妈”）。", ru: "мать — то же, что ма́ма, но нейтрально.", uz: "мать — ona." },
          options: [meaning("母亲", "ona", "👩", true), meaning("兄弟", "aka-uka", "👦"), meaning("天", "kun", "☀️")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "семья́", speak: "семья́", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "семья́ — 家庭。", ru: "семья́ — семья.", uz: "семья́ — oila." },
          options: [meaning("家庭", "oila", "👨‍👩‍👧", true), meaning("姐妹", "opa-singil", "👧"), meaning("叔叔", "amaki", "👨")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把家庭成员和意思配对", ru: "Соедините членов семьи с переводом", uz: "Oila aʼzolarini maʼnosi bilan moslang" },
          explanation: { zh: "мать 母亲 · брат 兄弟 · сестра́ 姐妹 · дя́дя 叔叔。", ru: "мать, брат, сестра́, дя́дя.", uz: "мать ona · брат aka-uka · сестра́ opa-singil · дя́дя amaki." },
          pairs: [{ left: "мать", right: "母亲" }, { left: "брат", right: "兄弟" }, { left: "сестра́", right: "姐妹" }, { left: "дя́дя", right: "叔叔" }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是我的家庭。", ru: "Составьте: «Это моя семья.»", uz: "«Bu — mening oilam» gapini tuzing" },
          explanation: { zh: "Э́то моя́ семья́.（семья́ 是阴性，所以用 моя́，下一课学）", ru: "Э́то моя́ семья́.", uz: "Э́то моя́ семья́." },
          words: ["семья́.", "мой", "моя́", "Э́то"], correctWords: ["Э́то", "моя́", "семья́."],
        },
      ],
    },
    // ── Lesson 4 ─────────────────────────────────────────────── ж ш ч щ ц
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "辅音 Ж · Ш · Ч · Щ · Ц", ru: "Согласные Ж · Ш · Ч · Щ · Ц", uz: "Ж · Ш · Ч · Щ · Ц undoşlari", en: "Consonants Ж · Ш · Ч · Щ · Ц" },
      description: { zh: "永远硬的和永远软的", ru: "Всегда твёрдые и всегда мягкие", uz: "Doim qattiq va doim yumşoq", en: "Always hard and always soft" },
      theory: {
        zh: "[ш] — 舌尖抬向上齿龈后部，舌后部抬起，双唇稍圆，比拼音 sh 更“厚”。[ж] — 和 [ш] 部位一样，但声带振动。\nж、ш、ц 永远是硬的：жи、ши 虽然写 и，却读 [жы]、[шы]：жить、маши́на。\n[ч] — 永远软、不送气，接近拼音 j：чай。[щ] — 永远软的长音 [ш']：борщ。\n[ц] — 不送气，接近拼音 z：ули́ца。\n新词：чай 茶 · борщ 红菜汤 · маши́на 汽车 · шко́ла 学校 · ули́ца 街道 · жена́ 妻子",
        ru: "[ш] — кончик языка поднят за альвеолы, задняя часть языка поднята, губы слегка округлены; звук «толще» китайского sh. [ж] — то же, но звонкий.\nЖ, ш, ц всегда твёрдые: жи, ши пишутся с и, но звучат [жы], [шы]: жить, маши́на.\n[ч] — всегда мягкий: чай. [щ] — всегда мягкий долгий: борщ.\n[ц] — без придыхания, похоже на китайское z: ули́ца.\nНовые слова: чай, борщ, маши́на, шко́ла, ули́ца, жена́.",
        uz: "[ш] — özbekça ş ga yaqin, lekin qalinroq. [ж] — xuddi şu, jarangli.\nЖ, ш, ц doim qattiq: жи, ши [жы], [шы] deb öqiladi: маши́на.\n[ч] — doim yumşoq: чай. [щ] — uzun yumşoq ş: борщ. [ц] — ts: ули́ца.\nYangi sözlar: чай çoy · борщ borş · маши́на maşina · шко́ла maktab · ули́ца köça · жена́ xotin",
        en: "[ш] — tongue tip behind the gum ridge, back of the tongue raised, lips slightly rounded; thicker than pinyin sh. [ж] — the same, voiced.\nЖ, ш, ц are always hard: жи, ши are written with и but sound [жы], [шы]: жить, маши́на.\n[ч] — always soft and unaspirated, close to pinyin j: чай. [щ] — always soft and long: борщ.\n[ц] — unaspirated, like pinyin z: ули́ца.\nNew words: чай tea · борщ borscht · маши́на car · шко́ла school · ули́ца street · жена́ wife",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "маши́на", speak: "маши́на", instruction: I.choose,
          question: { zh: "маши́на 里的 ши 读作……", ru: "Как звучит ши в слове маши́на?", uz: "маши́на dagi ши qanday aytiladi?" },
          explanation: { zh: "ш 永远是硬的，所以 ши 读 [шы]。", ru: "Ш всегда твёрдый: [шы].", uz: "Ш doim qattiq: [шы]." },
          options: [{ text: same("[шы]"), correct: true }, { text: same("[ши]") }, { text: same("[ся]") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "哪一组辅音永远是硬的？", ru: "Какие согласные всегда твёрдые?", uz: "Qaysi undoşlar doim qattiq?" },
          explanation: { zh: "ж、ш、ц 永远硬；ч、щ、й 永远软。", ru: "ж, ш, ц — твёрдые; ч, щ, й — мягкие.", uz: "ж, ш, ц — qattiq." },
          options: [{ text: same("ж ш ц"), correct: true }, { text: same("ч щ й"), }, { text: same("п т к") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "ц", speak: "ца", instruction: I.choose,
          question: { zh: "[ц] 接近汉语拼音的……", ru: "[ц] похож на китайское…", uz: "[ц] xitoyça qaysi tovuşga öxşaydi?" },
          explanation: { zh: "俄语 [ц] 不送气，接近拼音 z；拼音 c 送气太强。", ru: "Без придыхания — как китайское z.", uz: "Xitoyça z ga öxşaydi." },
          options: [{ text: same("z"), correct: true }, { text: same("zh") }, { text: same("s") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "чай", speak: "чай", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "чай — 茶。这个词就是从汉语来的！", ru: "чай — слово пришло из китайского.", uz: "чай — çoy." },
          options: [meaning("茶", "çoy", "🍵", true), meaning("汤", "şörva", "🍲"), meaning("果汁", "şarbat", "🧃")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "шко́ла", speak: "шко́ла", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "шко́ла — 学校。", ru: "шко́ла — школа.", uz: "шко́ла — maktab." },
          options: [meaning("学校", "maktab", "🏫", true), meaning("街道", "köça", "🛣️"), meaning("汽车", "maşina", "🚗")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слова с переводом", uz: "Sözni maʼnosi bilan moslang" },
          explanation: { zh: "борщ 红菜汤 · ули́ца 街道 · маши́на 汽车 · жена́ 妻子。", ru: "борщ, ули́ца, маши́на, жена́.", uz: "борщ borş · ули́ца köça · маши́на maşina · жена́ xotin." },
          pairs: [{ left: "борщ", right: "红菜汤" }, { left: "ули́ца", right: "街道" }, { left: "маши́на", right: "汽车" }, { left: "жена́", right: "妻子" }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "是的，这是茶。", ru: "Составьте: «Да, это чай.»", uz: "«Ha, bu — çoy» gapini tuzing" },
          explanation: { zh: "Да, э́то чай.", ru: "Да, э́то чай.", uz: "Да, э́то чай." },
          words: ["чай.", "Да,", "борщ", "э́то", "нет"], correctWords: ["Да,", "э́то", "чай."],
        },
      ],
    },
    // ── Lesson 5 ─────────────────────────────────────────────── gender, мой моя моё
    {
      type: "GRAMMAR", xpReward: 25, estimatedMinutes: 5,
      title: { zh: "名词的性：мой · моя́ · моё", ru: "Род: мой · моя́ · моё", uz: "Rod: мой · моя́ · моё", en: "Gender: мой · моя́ · моё" },
      description: { zh: "阳性、阴性、中性", ru: "Мужской, женский, средний", uz: "Erkak, ayol va örta rod", en: "Masculine, feminine, neuter" },
      theory: {
        zh: "俄语名词有三种性，看词尾就能判断：\n阳性：以辅音或 й 结尾：дом、стол、чай → мой дом（我的房子）。\n阴性：以 -а、-я 结尾：ма́ма、шко́ла、семья́ → моя́ шко́ла。\n中性：以 -о、-е 结尾：окно́、мо́ре → моё окно́（我的窗户）。\n注意：表示男人的 па́па、дя́дя 虽然以 -а、-я 结尾，却是阳性：мой па́па！\n小龙 Olov：汉语说“我的”就够了，俄语的“我的”要跟着名词变！\n新词：окно́ 窗户 · мо́ре 海 · твой、твоя́、твоё 你的",
        ru: "У существительных три рода, его видно по окончанию:\nмужской — согласный или й: дом, стол, чай → мой дом;\nженский — -а, -я: ма́ма, шко́ла, семья́ → моя́ шко́ла;\nсредний — -о, -е: окно́, мо́ре → моё окно́.\nНо па́па, дя́дя — мужской род: мой па́па!\nДракончик Olov: по-китайски «我的» не меняется, а русское «мой» согласуется с существительным.\nНовые слова: окно́, мо́ре, твой / твоя́ / твоё.",
        uz: "Rus tilida otlarning uç rodi bor:\nerkak rodi — undoş yoki й bilan: дом → мой дом;\nayol rodi — -а, -я: шко́ла → моя́ шко́ла;\nörta rod — -о, -е: окно́ → моё окно́.\nLekin па́па, дя́дя — erkak rodi: мой па́па!\nYangi sözlar: окно́ deraza · мо́ре dengiz · твой / твоя́ / твоё sening",
        en: "Russian nouns have three genders, usually seen from the ending:\nmasculine — a consonant or й: дом, стол, чай → мой дом;\nfeminine — -а, -я: ма́ма, шко́ла, семья́ → моя́ шко́ла;\nneuter — -о, -е: окно́, мо́ре → моё окно́.\nBut па́па and дя́дя are masculine: мой па́па!\nOlov the little dragon: Chinese 我的 never changes, Russian «my» agrees with the noun.\nNew words: окно́ window · мо́ре sea · твой / твоя́ / твоё your",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "шко́ла", speak: "шко́ла", instruction: I.choose,
          question: { zh: "шко́ла 是什么性？", ru: "Какого рода шко́ла?", uz: "шко́ла qaysi rodda?" },
          explanation: { zh: "以 -а 结尾，阴性：моя́ шко́ла。", ru: "Женский: моя́ шко́ла.", uz: "Ayol rodi." },
          options: [
            { text: { zh: "阴性", ru: "женского", uz: "ayol rodi" }, correct: true },
            { text: { zh: "阳性", ru: "мужского", uz: "erkak rodi" } },
            { text: { zh: "中性", ru: "среднего", uz: "örta rod" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "окно́", speak: "окно́", instruction: I.choose,
          question: { zh: "окно́ 是什么性？", ru: "Какого рода окно́?", uz: "окно́ qaysi rodda?" },
          explanation: { zh: "以 -о 结尾，中性：моё окно́。", ru: "Средний: моё окно́.", uz: "Örta rod." },
          options: [
            { text: { zh: "中性", ru: "среднего", uz: "örta rod" }, correct: true },
            { text: { zh: "阴性", ru: "женского", uz: "ayol rodi" } },
            { text: { zh: "阳性", ru: "мужского", uz: "erkak rodi" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "“我的爸爸”怎么说？", ru: "Как сказать «мой папа»?", uz: "«Mening dadam» qanday?" },
          explanation: { zh: "па́па 是男人，所以是阳性：мой па́па。", ru: "Па́па — мужской род.", uz: "па́па — erkak rodi." },
          options: [{ text: same("мой па́па"), correct: true }, { text: same("моя́ па́па") }, { text: same("моё па́па") }],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把名词和合适的“我的”配对", ru: "Соедините существительное с нужной формой", uz: "Otni mos «mening» bilan moslang" },
          explanation: { zh: "мой дом · моя́ семья́ · моё мо́ре · мой брат。", ru: "мой дом, моя́ семья́, моё мо́ре, мой брат.", uz: "мой дом · моя́ семья́ · моё мо́ре." },
          pairs: [{ left: "дом", right: "мой" }, { left: "семья́", right: "моя́" }, { left: "мо́ре", right: "моё" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "мо́ре", speak: "мо́ре", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "мо́ре — 海（中性）。", ru: "мо́ре — море.", uz: "мо́ре — dengiz." },
          options: [meaning("海", "dengiz", "🌊", true), meaning("窗户", "deraza", "🪟"), meaning("街道", "köça", "🛣️")],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是你的汽车吗？（组成问句）", ru: "Составьте: «Это твоя машина?»", uz: "«Bu sening maşinangmi?» gapini tuzing" },
          explanation: { zh: "Э́то твоя́ маши́на? — маши́на 阴性，用 твоя́。", ru: "Э́то твоя́ маши́на?", uz: "Э́то твоя́ маши́на?" },
          words: ["маши́на?", "твой", "Э́то", "твоя́"], correctWords: ["Э́то", "твоя́", "маши́на?"],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "Э́то ___ окно́.", ru: "Э́то ___ окно́.", uz: "Э́то ___ окно́." },
          explanation: { zh: "окно́ 中性 → моё。", ru: "Средний род → моё.", uz: "Örta rod → моё." },
          options: [{ text: same("моё"), correct: true }, { text: same("мой") }, { text: same("моя́") }],
        },
      ],
    },
    // ── Lesson 6 ─────────────────────────────────────────────── introductions
    {
      type: "CONVERSATION", xpReward: 25, estimatedMinutes: 6,
      title: { zh: "认识一下：Как тебя́ зову́т?", ru: "Знакомство: Как тебя зовут?", uz: "Tanişuv: Как тебя зовут?", en: "Introductions: Как тебя зовут?" },
      description: { zh: "名字、从哪里来、住在哪里", ru: "Имя, откуда ты, где живёшь", uz: "Ism, qayerdan, qayerda yaşaysan", en: "Name, where you're from, where you live" },
      theory: {
        zh: "— Как тебя́ зову́т? 你叫什么名字？\n— Меня́ зову́т Ли. 我叫李。\n— О́чень прия́тно! 很高兴认识你！\n— Отку́да ты? 你从哪里来？\n— Я из Кита́я. 我来自中国。\n— Я живу́ в Ташке́нте. 我住在塔什干。\n对老师和长辈用 вы：Как вас зову́т?\n小龙 Olov 讲文化：俄罗斯人的全名有三部分：名字、父称、姓。在学校称呼老师要用“名字＋父称”，比如 А́нна Ива́новна（意思是“伊万的女儿安娜”）。",
        ru: "— Как тебя́ зову́т?\n— Меня́ зову́т Ли.\n— О́чень прия́тно!\n— Отку́да ты?\n— Я из Кита́я.\n— Я живу́ в Ташке́нте.\nСтаршим и преподавателям — на вы: Как вас зову́т?\nДракончик Olov: полное русское имя — имя, отчество, фамилия. К преподавателю обращаются по имени и отчеству: А́нна Ива́новна.",
        uz: "— Как тебя́ зову́т? Isming nima?\n— Меня́ зову́т Ли. Mening ismim Li.\n— О́чень прия́тно! Tanişganimdan xursandman!\n— Отку́да ты? Qayerdansan?\n— Я из Кита́я. Men Xitoydanman.\n— Я живу́ в Ташке́нте. Men Toşkentda yaşayman.\nAjdarça Olov: rus ismi uç qismdan iborat — ism, otasining ismi, familiya. Öqituvçiga ism va otasining ismi bilan murojaat qilinadi: А́нна Ива́новна.",
        en: "— Как тебя́ зову́т? What's your name?\n— Меня́ зову́т Ли. My name is Li.\n— О́чень прия́тно! Nice to meet you!\n— Отку́да ты? Where are you from?\n— Я из Кита́я. I'm from China.\n— Я живу́ в Ташке́нте. I live in Tashkent.\nTo teachers and elders use вы: Как вас зову́т?\nOlov the little dragon: a full Russian name has three parts — first name, patronymic, surname. Teachers are addressed by first name and patronymic: А́нна Ива́новна.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Как тебя́ зову́т?", speak: "Как тебя́ зову́т?", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu gap nimani anglatadi?" },
          explanation: { zh: "Как тебя́ зову́т? — 你叫什么名字？", ru: "Вопрос об имени.", uz: "Isming nima?" },
          options: [meaning("你叫什么名字？", "Isming nima?", "🙂", true), meaning("你从哪里来？", "Qayerdansan?", "🌍"), meaning("你好吗？", "Işlar qanday?", "👋")],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "我叫李。", ru: "Составьте: «Меня зовут Ли.»", uz: "«Mening ismim Li» gapini tuzing" },
          explanation: { zh: "Меня́ зову́т Ли.", ru: "Меня́ зову́т Ли.", uz: "Меня́ зову́т Ли." },
          words: ["зову́т", "Ли.", "тебя́", "Меня́"], correctWords: ["Меня́", "зову́т", "Ли."],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "О́чень прия́тно!", speak: "О́чень прия́тно!", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu gap nimani anglatadi?" },
          explanation: { zh: "О́чень прия́тно! — 很高兴认识你！", ru: "Говорят при знакомстве.", uz: "Tanişganimdan xursandman!" },
          options: [meaning("很高兴认识你！", "Tanişganimdan xursandman!", "🤝", true), meaning("非常感谢！", "Katta rahmat!", "🙏"), meaning("再见！", "Xayr!", "🚶")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Отку́да ты?", speak: "Отку́да ты?", instruction: I.choose,
          question: { zh: "怎么回答？（我来自中国）", ru: "Ответьте: я из Китая.", uz: "Javob bering: men Xitoydanman." },
          explanation: { zh: "Я из Кита́я. — 我来自中国。", ru: "Я из Кита́я.", uz: "Я из Кита́я." },
          options: [{ text: same("Я из Кита́я."), correct: true }, { text: same("Я живу́ в Кита́е.") }, { text: same("Меня́ зову́т Кита́й.") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "我住在塔什干。", ru: "Составьте: «Я живу в Ташкенте.»", uz: "«Men Toşkentda yaşayman» gapini tuzing" },
          explanation: { zh: "Я живу́ в Ташке́нте.", ru: "Я живу́ в Ташке́нте.", uz: "Я живу́ в Ташке́нте." },
          words: ["Ташке́нте.", "из", "в", "Я", "живу́"], correctWords: ["Я", "живу́", "в", "Ташке́нте."],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "问老师的名字，应该说：", ru: "Как спросить имя преподавателя?", uz: "Öqituvçining ismini qanday söraysiz?" },
          explanation: { zh: "对老师和长辈用 вы：Как вас зову́т?", ru: "Старшим — на вы.", uz: "Kattalarga — вы." },
          options: [{ text: same("Как вас зову́т?"), correct: true }, { text: same("Как тебя́ зову́т?") }, { text: same("Кто ты?") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
          question: { zh: "在学校怎么称呼老师 А́нна Ива́новна？", ru: "Как обратиться к преподавателю А́нне Ива́новне?", uz: "Öqituvçi А́нна Ива́новна ga qanday murojaat qilinadi?" },
          explanation: { zh: "用“名字＋父称”：А́нна Ива́новна。Ива́новна 是父称，意思是“伊万的女儿”。", ru: "По имени и отчеству.", uz: "Ism va otasining ismi bilan." },
          options: [
            { text: { zh: "А́нна Ива́новна（名字＋父称）", ru: "А́нна Ива́новна", uz: "А́нна Ива́новна" }, correct: true },
            { text: { zh: "А́нна（只说名字）", ru: "А́нна", uz: "А́нна" } },
            { text: { zh: "Ива́новна（只说父称）", ru: "Ива́новна", uz: "Ива́новна" } },
          ],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把俄语和中文配对", ru: "Соедините русские фразы с китайскими", uz: "Rusça va xitoyça iboralarni moslang" },
          explanation: { zh: "四句自我介绍。", ru: "Четыре фразы знакомства.", uz: "Tanişuvning tört iborasi." },
          pairs: [{ left: "Меня́ зову́т Ли.", right: "我叫李。" }, { left: "Я из Кита́я.", right: "我来自中国。" }, { left: "Я живу́ в Ташке́нте.", right: "我住在塔什干。" }, { left: "О́чень прия́тно!", right: "很高兴认识你！" }],
        },
      ],
    },
  ],
};
