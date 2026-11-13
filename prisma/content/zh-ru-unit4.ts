// Course "Russian for Chinese speakers" (zh → ru), Unit 4 «Мой город».
// From the textbook 《大学俄语 东方（新版）1》, Урок 2–3: city words (го́род,
// авто́бус, остано́вка, фонта́н, кафе́, заво́д), «Вот …», devoicing of voiced
// consonants at the end of a word (сад [сат]) and the plural of nouns
// (-ы / -и, and дома́, города́, друзья́, бра́тья).
// Урок 4: мои́ / твои́ and yes/no questions («Э́то твой дом? — Да, мой.»),
// adjectives но́вый / ста́рый (-ый, -ая, -ое, -ые), voicing (вокза́л [вагза́л]).
// Every lesson teaches step by step (teach cards), then listens and speaks.
// Uzbek texts use the new alphabet.
import { I, hear, meaning, same, say, type ModuleContent, type Text } from "./common";

const MEANING: Text = { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" };
const WORD: Text = { zh: "你听到的是哪个词？", ru: "Какое слово вы услышали?", uz: "Qaysi sözni eşitdingiz?" };
const PLURAL_PAIRS: Text = { zh: "把单数和复数配对", ru: "Соедините единственное и множественное число", uz: "Birlik va köplikni moslang" };

export const ruUnit4: ModuleContent = {
  title: { zh: "第四单元 · 我的城市", ru: "Юнит 4 · Мой город", uz: "4-bölim · Mening şahrim", en: "Unit 4 · My city" },
  description: { zh: "城市里的词，名词复数，我的、你的，新的、旧的", ru: "Слова о городе, множественное число, мой и твой, новый и старый", uz: "Şahar sözlari, köplik, мой va твой, но́вый va ста́рый", en: "City words, the plural, my and your, new and old" },
  lessons: [
    // ── Lesson 1 ─────────────────────────────────────────────── город
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "在城市里", ru: "В городе", uz: "Şaharda", en: "In the city" },
      description: { zh: "6 个新词和 Вот …", ru: "6 новых слов и «Вот …»", uz: "6 ta yangi söz va «Вот …»", en: "6 new words and «Вот …»" },
      theory: {
        zh: "小龙 Olov 带你逛城市。\n今天学 6 个城市里的词，再学会说“这就是……”。",
        ru: "Дракончик Olov ведёт вас по городу.\nСегодня 6 слов о городе и фраза «Вот …».",
        uz: "Ajdarço Olov sizni şahar böylab olib yuradi.\nBugun şahar haqida 6 ta söz va «Вот …» iborasi.",
        en: "Olov the dragon shows you the city.\nToday: 6 city words and the phrase «Вот …».",
      },
      exercises: [
        {
          teach: { zh: "го́род — 城市\nавто́бус — 公共汽车\nостано́вка — 车站", ru: "го́род\nавто́бус\nостано́вка", uz: "го́род — şahar\nавто́бус — avtobus\nостано́вка — bekat" },
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "го́род", speak: "го́род", instruction: I.meaning, question: MEANING,
          explanation: { zh: "го́род — 城市，重音在第一个音节。", ru: "го́род: ударение на первом слоге.", uz: "го́род — şahar, urğu birinçi böğinda." },
          options: [meaning("城市", "şahar", "🏙️", true), meaning("房子", "uy", "🏠"), meaning("银行", "bank", "🏦")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "авто́бус", speak: "авто́бус", instruction: I.meaning, question: MEANING,
          explanation: { zh: "авто́бус — 公共汽车。", ru: "авто́бус.", uz: "авто́бус — avtobus." },
          options: [meaning("公共汽车", "avtobus", "🚌", true), meaning("汽车", "maşina", "🚗"), meaning("车站", "bekat", "🚏")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "остано́вка", speak: "остано́вка", instruction: I.meaning, question: MEANING,
          explanation: { zh: "остано́вка — 车站。остано́вка авто́буса — 公共汽车站。", ru: "остано́вка; остано́вка авто́буса.", uz: "остано́вка — bekat." },
          options: [meaning("车站", "bekat", "🚏", true), meaning("城市", "şahar", "🏙️"), meaning("公共汽车", "avtobus", "🚌")],
        },
        {
          teach: { zh: "фонта́н — 喷泉\nкафе́ — 咖啡馆，е 读作 [э]\nзаво́д — 工厂", ru: "фонта́н\nкафе́ — читается [кафэ́]\nзаво́д", uz: "фонта́н — favvora\nкафе́ — kafe, е [э] deb öqiladi\nзаво́д — zavod" },
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "фонта́н", speak: "фонта́н", instruction: I.meaning, question: MEANING,
          explanation: { zh: "фонта́н — 喷泉。", ru: "фонта́н.", uz: "фонта́н — favvora." },
          options: [meaning("喷泉", "favvora", "⛲", true), meaning("工厂", "zavod", "🏭"), meaning("咖啡馆", "kafe", "☕")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "кафе́", speak: "кафе́", instruction: I.choose,
          question: { zh: "кафе́ 里的 е 读作……", ru: "Как читается е в слове кафе́?", uz: "кафе́ sözida е qanday öqiladi?" },
          explanation: { zh: "кафе́ 是外来词，е 读作 [э]：[кафэ́]。", ru: "кафе́ — заимствованное слово: [кафэ́].", uz: "кафе́ — özlaşgan söz: [кафэ́]." },
          options: [{ text: same("[э]"), correct: true }, { text: same("[йэ]") }, { text: same("[и]") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "заво́д", speak: "заво́д", instruction: I.meaning, question: MEANING,
          explanation: { zh: "заво́д — 工厂。", ru: "заво́д.", uz: "заво́д — zavod." },
          options: [meaning("工厂", "zavod", "🏭", true), meaning("喷泉", "favvora", "⛲"), meaning("城市", "şahar", "🏙️")],
        },
        {
          type: "MATCHING", mascot: "dragon", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слова с переводом", uz: "Sözni maʼnosi bilan moslang" },
          explanation: { zh: "го́род 城市 · авто́бус 公共汽车 · кафе́ 咖啡馆 · заво́д 工厂。", ru: "го́род, авто́бус, кафе́, заво́д.", uz: "го́род şahar · авто́бус avtobus · кафе́ kafe · заво́д zavod." },
          pairs: [{ left: "го́род", right: "城市" }, { left: "авто́бус", right: "公共汽车" }, { left: "кафе́", right: "咖啡馆" }, { left: "заво́д", right: "工厂" }],
        },
        {
          teach: { zh: "Вот … — 这就是……（指给别人看）\nВот авто́бус. А там кафе́.", ru: "Вот … — так показывают на то, что рядом.\nВот авто́бус. А там кафе́.", uz: "Вот … — mana … (körsatib aytiladi)\nВот авто́бус. А там кафе́." },
          type: "ARRANGE_WORDS", mascot: "panda", instruction: I.build,
          question: { zh: "这就是公共汽车。", ru: "Составьте: «Вот автобус.»", uz: "«Mana avtobus» gapini tuzing" },
          explanation: { zh: "Вот авто́бус.", ru: "Вот авто́бус.", uz: "Вот авто́бус." },
          words: ["там", "авто́бус.", "Вот", "кафе́"], correctWords: ["Вот", "авто́бус."],
        },
        {
          type: "ARRANGE_WORDS", mascot: "tiger", instruction: I.build,
          question: { zh: "而那里是咖啡馆。", ru: "Составьте: «А там кафе.»", uz: "«U yerda esa kafe» gapini tuzing" },
          explanation: { zh: "А там кафе́. а 表示对比：而……", ru: "А там кафе́.", uz: "А там кафе́." },
          words: ["кафе́.", "Вот", "А", "го́род", "там"], correctWords: ["А", "там", "кафе́."],
        },
        hear("остано́вка", ["авто́бус", "фонта́н", "заво́д"], WORD, { zh: "остано́вка — 车站。", ru: "остано́вка.", uz: "остано́вка — bekat." }),
        say("го́род", "城市", "şahar"),
        say("Вот авто́бус.", "这就是公共汽车。", "Mana avtobus.", "tiger"),
      ],
    },
    // ── Lesson 2 ─────────────────────────────────────────────── сад [сат]
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "词末的浊辅音：сад [сат]", ru: "Оглушение: сад [сат]", uz: "Jarangsizlaşiş: сад [сат]", en: "Final devoicing: сад [сат]" },
      description: { zh: "写 д，读 [т]", ru: "Пишем д, читаем [т]", uz: "д yoziladi, [т] öqiladi", en: "Written д, read [т]" },
      theory: {
        zh: "小老虎 Bars：俄语的浊辅音在词末会“变哑”。\n今天学这条规则，读对 сад、заво́д、друг。",
        ru: "Тигрёнок Bars: на конце слова звонкие согласные «глохнут».\nСегодня учимся правильно читать сад, заво́д, друг.",
        uz: "Yolbars Bars: söz oxirida jarangli undoşlar jarangsizlaşadi.\nBugun сад, заво́д, друг sözlarini töğri öqişni örganamiz.",
        en: "Bars the tiger: voiced consonants go voiceless at the end of a word.\nToday: reading сад, заво́д, друг correctly.",
      },
      exercises: [
        {
          teach: { zh: "浊辅音在词末要读成对应的清辅音。\nб → [п]，в → [ф]，д → [т]，з → [с]，г → [к]", ru: "На конце слова звонкий согласный читается как парный глухой.\nб → [п], в → [ф], д → [т], з → [с], г → [к]", uz: "Söz oxirida jarangli undoş jarangsiz juftidek öqiladi.\nб → [п], в → [ф], д → [т], з → [с], г → [к]" },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "сад", speak: "сад", instruction: I.choose,
          question: { zh: "词末的 д 读作……", ru: "На конце слова д читается как…", uz: "Söz oxirida д qanday öqiladi?" },
          explanation: { zh: "词末的 д 读作 [т]：сад [сат]。", ru: "сад [сат].", uz: "сад [сат]." },
          options: [{ text: same("[т]"), correct: true }, { text: same("[д]") }, { text: same("[н]") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "заво́д", speak: "заво́д", instruction: I.choose,
          question: { zh: "заво́д 实际读作……", ru: "Как на самом деле читается заво́д?", uz: "заво́д aslida qanday öqiladi?" },
          explanation: { zh: "词首的 з 不变，词末的 д 读作 [т]：[заво́т]。", ru: "В начале з остаётся, на конце д → [т]: [заво́т].", uz: "Boşidagi з özgarmaydi, oxiridagi д → [т]: [заво́т]." },
          options: [{ text: same("[заво́т]"), correct: true }, { text: same("[заво́д]") }, { text: same("[саво́т]") }],
        },
        {
          teach: { zh: "сад — 花园，读 [сат]\nдруг — 朋友，读 [друк]\nИвано́в — 伊万诺夫，读 [ивано́ф]", ru: "сад [сат]\nдруг [друк]\nИвано́в [ивано́ф]", uz: "сад — boğ, [сат]\nдруг — döst, [друк]\nИвано́в — Ivanov, [ивано́ф]" },
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "сад", speak: "сад", instruction: I.meaning, question: MEANING,
          explanation: { zh: "сад — 花园。", ru: "сад.", uz: "сад — boğ." },
          options: [meaning("花园", "boğ", "🌳", true), meaning("工厂", "zavod", "🏭"), meaning("喷泉", "favvora", "⛲")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "друг", speak: "друг", instruction: I.meaning, question: MEANING,
          explanation: { zh: "друг — 朋友。", ru: "друг.", uz: "друг — döst." },
          options: [meaning("朋友", "döst", "🤝", true), meaning("兄弟", "aka-uka", "👦"), meaning("诗人", "şoir", "✍️")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "друг", speak: "друг", instruction: I.choose,
          question: { zh: "друг 词末的 г 读作……", ru: "Как читается г на конце слова друг?", uz: "друг sözi oxiridagi г qanday öqiladi?" },
          explanation: { zh: "г 的清辅音是 [к]：друг [друк]。", ru: "Парный глухой для г — [к]: [друк].", uz: "г ning jarangsiz jufti — [к]: [друк]." },
          options: [{ text: same("[к]"), correct: true }, { text: same("[г]") }, { text: same("[х]") }],
        },
        {
          type: "MATCHING", mascot: "dragon", instruction: I.match,
          question: { zh: "把单词和实际读音配对", ru: "Соедините слово и его произношение", uz: "Sözni talaffuzi bilan moslang" },
          explanation: { zh: "сад [сат] · друг [друк] · заво́д [заво́т] · зуб [зуп]。", ru: "сад [сат], друг [друк], заво́д [заво́т], зуб [зуп].", uz: "сад [сат] · друг [друк] · заво́д [заво́т] · зуб [зуп]." },
          pairs: [{ left: "сад", right: "[сат]" }, { left: "друг", right: "[друк]" }, { left: "заво́д", right: "[заво́т]" }, { left: "зуб", right: "[зуп]" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "哪个词的词末辅音读音不变？", ru: "В каком слове согласный на конце не меняется?", uz: "Qaysi sözda oxirgi undoş özgarmaydi?" },
          explanation: { zh: "м 没有对应的清辅音，所以 дом 的词末不变。", ru: "У м нет парного глухого: дом читается [дом].", uz: "м ning jarangsiz jufti yöq: дом [дом] deb öqiladi." },
          options: [{ text: same("дом"), correct: true }, { text: same("сад") }, { text: same("зуб") }],
        },
        {
          teach: { zh: "写的时候不变：写 сад，读 [сат]。\n后面有元音时，浊音又回来了：сады́ [сады́]。", ru: "Пишем как раньше: сад, читаем [сат].\nПеред гласной звонкий звук возвращается: сады́ [сады́].", uz: "Yozuvda özgarmaydi: сад yoziladi, [сат] öqiladi.\nUnli oldidan jarangli tovuş qaytadi: сады́ [сады́]." },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "сады́", speak: "сады́", instruction: I.choose,
          question: { zh: "сады́ 里的 д 读作……", ru: "Как читается д в слове сады́?", uz: "сады́ sözida д qanday öqiladi?" },
          explanation: { zh: "д 不在词末，后面是元音，所以读 [д]。", ru: "д не на конце слова, после неё гласная: [д].", uz: "д söz oxirida emas, undan keyin unli: [д]." },
          options: [{ text: same("[д]"), correct: true }, { text: same("[т]") }, { text: same("[з]") }],
        },
        hear("сад", ["сам", "суп", "сок"], WORD, { zh: "сад [сат] — 花园。", ru: "сад [сат].", uz: "сад [сат] — boğ." }),
        say("друг", "朋友", "döst"),
        say("Э́то сад.", "这是花园。", "Bu boğ.", "tiger"),
      ],
    },
    // ── Lesson 3 ─────────────────────────────────────────────── банк → банки
    {
      type: "GRAMMAR", xpReward: 25, estimatedMinutes: 6,
      title: { zh: "名词复数：банк → ба́нки", ru: "Множественное число: банк → ба́нки", uz: "Köplik: банк → ба́нки", en: "The plural: банк → ба́нки" },
      description: { zh: "-ы、-и 和 4 个特殊的词", ru: "-ы, -и и 4 особых слова", uz: "-ы, -и va 4 ta maxsus söz", en: "-ы, -и and 4 special words" },
      theory: {
        zh: "熊猫 Paxta：一个是 банк，很多个是 ба́нки。\n今天学名词复数：-ы、-и，还有 4 个特殊的词。",
        ru: "Панда Paxta: один — банк, много — ба́нки.\nСегодня множественное число: -ы, -и и 4 особых слова.",
        uz: "Panda Paxta: bitta — банк, köp — ба́нки.\nBugun köplik: -ы, -и va 4 ta maxsus söz.",
        en: "Paxta the panda: one is банк, many are ба́нки.\nToday: the plural with -ы, -и and 4 special words.",
      },
      exercises: [
        {
          teach: { zh: "复数一般加 -ы：\nфонта́н → фонта́ны\nавто́бус → авто́бусы\nсад → сады́", ru: "Обычно добавляем -ы:\nфонта́н → фонта́ны\nавто́бус → авто́бусы\nсад → сады́", uz: "Odatda -ы qöşiladi:\nфонта́н → фонта́ны\nавто́бус → авто́бусы\nсад → сады́" },
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "фонта́н", speak: "фонта́н", instruction: I.choose,
          question: { zh: "фонта́н 的复数是……", ru: "Множественное число слова фонта́н…", uz: "фонта́н sözining köpligi…" },
          explanation: { zh: "фонта́н + ы = фонта́ны。", ru: "фонта́н + ы = фонта́ны.", uz: "фонта́н + ы = фонта́ны." },
          options: [{ text: same("фонта́ны"), correct: true }, { text: same("фонта́ни") }, { text: same("фонта́на") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "авто́бус", speak: "авто́бус", instruction: I.choose,
          question: { zh: "авто́бус 的复数是……", ru: "Множественное число слова авто́бус…", uz: "авто́бус sözining köpligi…" },
          explanation: { zh: "авто́бус + ы = авто́бусы。", ru: "авто́бус + ы = авто́бусы.", uz: "авто́бус + ы = авто́бусы." },
          options: [{ text: same("авто́бусы"), correct: true }, { text: same("авто́буси") }, { text: same("авто́буса") }],
        },
        {
          teach: { zh: "к、г、х 和 ж、ш、ч、щ 后面不写 ы，要写 -и：\nбанк → ба́нки\nуро́к 课 → уро́ки", ru: "После к, г, х и ж, ш, ч, щ пишем не ы, а -и:\nбанк → ба́нки\nуро́к → уро́ки", uz: "к, г, х va ж, ш, ч, щ dan keyin ы emas, -и yoziladi:\nбанк → ба́нки\nуро́к dars → уро́ки" },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "банк", speak: "банк", instruction: I.choose,
          question: { zh: "банк 的复数是……", ru: "Множественное число слова банк…", uz: "банк sözining köpligi…" },
          explanation: { zh: "к 后面写 -и：ба́нки。", ru: "После к пишем -и: ба́нки.", uz: "к dan keyin -и yoziladi: ба́нки." },
          options: [{ text: same("ба́нки"), correct: true }, { text: same("ба́нкы") }, { text: same("ба́нка") }],
        },
        {
          teach: { zh: "阴性名词：词尾 -а 变成 -ы 或 -и：\nва́за 花瓶 → ва́зы\nсу́мка 包 → су́мки\nсоба́ка 狗 → соба́ки", ru: "Женский род: -а меняется на -ы или -и:\nва́за → ва́зы\nсу́мка → су́мки\nсоба́ка → соба́ки", uz: "Jenskiy rod: -а örniga -ы yoki -и:\nва́за guldon → ва́зы\nсу́мка sumka → су́мки\nсоба́ка it → соба́ки" },
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "су́мка", speak: "су́мка", instruction: I.choose,
          question: { zh: "су́мка 的复数是……", ru: "Множественное число слова су́мка…", uz: "су́мка sözining köpligi…" },
          explanation: { zh: "к 后面写 -и：су́мки。", ru: "После к пишем -и: су́мки.", uz: "к dan keyin -и yoziladi: су́мки." },
          options: [{ text: same("су́мки"), correct: true }, { text: same("су́мкы") }, { text: same("су́мка") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "ва́за", speak: "ва́за", instruction: I.choose,
          question: { zh: "ва́за 的复数是……", ru: "Множественное число слова ва́за…", uz: "ва́за sözining köpligi…" },
          explanation: { zh: "-а 变成 -ы：ва́зы。", ru: "-а меняется на -ы: ва́зы.", uz: "-а örniga -ы: ва́зы." },
          options: [{ text: same("ва́зы"), correct: true }, { text: same("ва́зи") }, { text: same("ва́заы") }],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match, question: PLURAL_PAIRS,
          explanation: { zh: "фонта́н → фонта́ны · банк → ба́нки · соба́ка → соба́ки · ва́за → ва́зы。", ru: "фонта́ны, ба́нки, соба́ки, ва́зы.", uz: "фонта́ны · ба́нки · соба́ки · ва́зы." },
          pairs: [{ left: "фонта́н", right: "фонта́ны" }, { left: "банк", right: "ба́нки" }, { left: "соба́ка", right: "соба́ки" }, { left: "ва́за", right: "ва́зы" }],
        },
        {
          teach: { zh: "有 4 个词的复数很特殊，要记住：\nдом → дома́\nго́род → города́\nдруг → друзья́\nбрат → бра́тья", ru: "У 4 слов множественное число особое, их надо запомнить:\nдом → дома́\nго́род → города́\nдруг → друзья́\nбрат → бра́тья", uz: "4 ta sözning köpligi maxsus, yodlab oling:\nдом → дома́\nго́род → города́\nдруг → друзья́\nбрат → бра́тья" },
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "дом", speak: "дом", instruction: I.choose,
          question: { zh: "дом 的复数是……", ru: "Множественное число слова дом…", uz: "дом sözining köpligi…" },
          explanation: { zh: "дом → дома́，重音在最后。", ru: "дом → дома́, ударение на конце.", uz: "дом → дома́, urğu oxirida." },
          options: [{ text: same("дома́"), correct: true }, { text: same("до́мы") }, { text: same("до́ми") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "друг", speak: "друг", instruction: I.choose,
          question: { zh: "друг 的复数是……", ru: "Множественное число слова друг…", uz: "друг sözining köpligi…" },
          explanation: { zh: "друг → друзья́：г 变成 з，要单独记。", ru: "друг → друзья́: г меняется на з.", uz: "друг → друзья́: г örniga з." },
          options: [{ text: same("друзья́"), correct: true }, { text: same("дру́ги") }, { text: same("дру́гы") }],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match, question: PLURAL_PAIRS,
          explanation: { zh: "дом → дома́ · го́род → города́ · друг → друзья́ · брат → бра́тья。", ru: "дома́, города́, друзья́, бра́тья.", uz: "дома́ · города́ · друзья́ · бра́тья." },
          pairs: [{ left: "дом", right: "дома́" }, { left: "го́род", right: "города́" }, { left: "друг", right: "друзья́" }, { left: "брат", right: "бра́тья" }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "panda", instruction: I.build,
          question: { zh: "这就是银行和喷泉。（都是复数）", ru: "Составьте: «Вот банки и фонтаны.»", uz: "«Mana banklar va favvoralar» gapini tuzing" },
          explanation: { zh: "Вот ба́нки и фонта́ны.", ru: "Вот ба́нки и фонта́ны.", uz: "Вот ба́нки и фонта́ны." },
          words: ["фонта́н", "ба́нки", "и", "Вот", "банк", "фонта́ны."], correctWords: ["Вот", "ба́нки", "и", "фонта́ны."],
        },
        hear("друзья́", ["друг", "бра́тья", "дома́"], WORD, { zh: "друзья́ — 朋友们（друг 的复数）。", ru: "друзья́ — множественное число слова друг.", uz: "друзья́ — döstlar (друг ning köpligi)." }),
        say("друзья́", "朋友们", "döstlar"),
        say("Э́то города́.", "这些是城市。", "Bular şaharlar.", "tiger"),
      ],
    },
    // ── Lesson 4 ─────────────────────────────────────────────── твой? мои́!
    {
      type: "GRAMMAR", xpReward: 25, estimatedMinutes: 6,
      title: { zh: "你的吗？我的！мои́ · твои́", ru: "Твой? Мой! мои́ · твои́", uz: "Senikimi? Meniki! мои́ · твои́", en: "Yours? Mine! мои́ · твои́" },
      description: { zh: "复数的“我的、你的”和一般疑问句", ru: "«Мой, твой» во множественном числе и вопрос без вопросительного слова", uz: "Köplikda «мой, твой» va soroq sözisiz savol", en: "Plural “my, your” and yes/no questions" },
      theory: {
        zh: "小龙 Olov：你已经会说 мой дом、моя́ су́мка、моё окно́。\n今天学复数 мои́、твои́，再学会问“这是你的……吗？”。",
        ru: "Дракончик Olov: вы уже говорите мой дом, моя́ су́мка, моё окно́.\nСегодня мои́, твои́ и вопрос «Э́то твой …?».",
        uz: "Ajdarço Olov: siz мой дом, моя́ су́мка, моё окно́ deyişni bilasiz.\nBugun мои́, твои́ va «Э́то твой …?» savoli.",
        en: "Olov the dragon: you can already say мой дом, моя́ су́мка, моё окно́.\nToday: мои́, твои́ and the question «Э́то твой …?».",
      },
      exercises: [
        {
          teach: { zh: "复习：“你的”跟着名词的性变化。\nтвой дом（阳性）\nтвоя́ су́мка（阴性）\nтвоё окно́（中性）", ru: "Повторим: «твой» меняется по роду.\nтвой дом\nтвоя́ су́мка\nтвоё окно́", uz: "Takrorlaymiz: «твой» rodga qarab özgaradi.\nтвой дом\nтвоя́ су́мка\nтвоё окно́" },
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "… су́мка", speak: "су́мка", instruction: I.choose,
          question: { zh: "“你的包”怎么说？", ru: "Какое слово подходит к слову су́мка?", uz: "су́мка söziga qaysi söz mos?" },
          explanation: { zh: "су́мка 以 -а 结尾，是阴性：твоя́ су́мка。", ru: "су́мка — женский род: твоя́ су́мка.", uz: "су́мка -а bilan tugaydi, jenskiy rod: твоя́ су́мка." },
          options: [{ text: same("твоя́"), correct: true }, { text: same("твой") }, { text: same("твоё") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "… окно́", speak: "окно́", instruction: I.choose,
          question: { zh: "“你的窗户”怎么说？", ru: "Какое слово подходит к слову окно́?", uz: "окно́ söziga qaysi söz mos?" },
          explanation: { zh: "окно́ 以 -о 结尾，是中性：твоё окно́。", ru: "окно́ — средний род: твоё окно́.", uz: "окно́ -о bilan tugaydi, sredniy rod: твоё окно́." },
          options: [{ text: same("твоё"), correct: true }, { text: same("твоя́") }, { text: same("твой") }],
        },
        {
          teach: { zh: "复数不分性，只有一个形式：\nмои́ — 我的（很多个）\nтвои́ — 你的（很多个）\nмои́ друзья́ · твои́ су́мки", ru: "Во множественном числе форма одна для всех родов:\nмои́, твои́\nмои́ друзья́ · твои́ су́мки", uz: "Köplikda hamma rod uçun bitta şakl:\nмои́ — mening (köp)\nтвои́ — sening (köp)\nмои́ друзья́ · твои́ су́мки" },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "… друзья́", speak: "друзья́", instruction: I.choose,
          question: { zh: "“我的朋友们”怎么说？", ru: "Какое слово подходит к слову друзья́?", uz: "друзья́ söziga qaysi söz mos?" },
          explanation: { zh: "друзья́ 是复数，所以用 мои́：мои́ друзья́。", ru: "друзья́ — множественное число: мои́ друзья́.", uz: "друзья́ — köplik: мои́ друзья́." },
          options: [{ text: same("мои́"), correct: true }, { text: same("мой") }, { text: same("моя́") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "… ко́мнаты", speak: "ко́мнаты", instruction: I.choose,
          question: { zh: "“你的房间（复数）”怎么说？", ru: "Какое слово подходит к слову ко́мнаты?", uz: "ко́мнаты söziga qaysi söz mos?" },
          explanation: { zh: "ко́мната → ко́мнаты 是复数：твои́ ко́мнаты。", ru: "ко́мнаты — множественное число: твои́ ко́мнаты.", uz: "ко́мнаты — köplik: твои́ ко́мнаты." },
          options: [{ text: same("твои́"), correct: true }, { text: same("твоя́") }, { text: same("твой") }],
        },
        {
          type: "MATCHING", mascot: "panda", instruction: I.match,
          question: { zh: "把“你的”和名词配对", ru: "Соедините «твой» с подходящим словом", uz: "«твой» ni mos sözi bilan birlaştiring" },
          explanation: { zh: "твой друг · твоя́ маши́на · твоё окно́ · твои́ города́。", ru: "твой друг, твоя́ маши́на, твоё окно́, твои́ города́.", uz: "твой друг · твоя́ маши́на · твоё окно́ · твои́ города́." },
          pairs: [{ left: "твой", right: "друг" }, { left: "твоя́", right: "маши́на" }, { left: "твоё", right: "окно́" }, { left: "твои́", right: "города́" }],
        },
        {
          teach: { zh: "没有疑问词的问句，词序不变，只变语调：\nЭ́то твой дом.（陈述）\nЭ́то твой дом?（提问，твой 上语调升高）", ru: "Вопрос без вопросительного слова: порядок слов тот же, меняется только интонация.\nЭ́то твой дом.\nЭ́то твой дом? — голос поднимается на слове твой.", uz: "Soroq sözisiz savol: sözlar tartibi özgarmaydi, faqat ohang özgaradi.\nЭ́то твой дом.\nЭ́то твой дом? — ovoz твой sözida kötariladi." },
          type: "ARRANGE_WORDS", mascot: "tiger", instruction: I.build,
          question: { zh: "这是你的房子吗？", ru: "Составьте: «Это твой дом?»", uz: "«Bu sening uyingmi?» gapini tuzing" },
          explanation: { zh: "Э́то твой дом? дом 是阳性，用 твой。", ru: "Э́то твой дом?", uz: "Э́то твой дом? дом — mujskoy rod, твой." },
          words: ["дом?", "твоя́", "Э́то", "мои́", "твой"], correctWords: ["Э́то", "твой", "дом?"],
        },
        {
          teach: { zh: "回答可以很短：\n— Э́то твой дом?\n— Да, мой.（是的，是我的。）\n— Нет, не мой.（不，不是我的。）", ru: "Отвечать можно коротко:\n— Э́то твой дом?\n— Да, мой.\n— Нет, не мой.", uz: "Qisqa javob berish mumkin:\n— Э́то твой дом?\n— Да, мой. (Ha, meniki.)\n— Нет, не мой. (Yöq, meniki emas.)" },
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "— Э́то твоя́ су́мка?\n— Да, …", speak: "Э́то твоя́ су́мка?", instruction: I.choose,
          question: { zh: "选出正确的回答", ru: "Выберите правильный ответ", uz: "Töğri javobni tanlang" },
          explanation: { zh: "су́мка 是阴性，回答也用阴性：Да, моя́.", ru: "су́мка — женский род: Да, моя́.", uz: "су́мка — jenskiy rod: Да, моя́." },
          options: [{ text: same("моя́"), correct: true }, { text: same("мой") }, { text: same("мои́") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "— Э́то твои́ друзья́?\n— Да, …", speak: "Э́то твои́ друзья́?", instruction: I.choose,
          question: { zh: "选出正确的回答", ru: "Выберите правильный ответ", uz: "Töğri javobni tanlang" },
          explanation: { zh: "друзья́ 是复数：Да, мои́.", ru: "друзья́ — множественное число: Да, мои́.", uz: "друзья́ — köplik: Да, мои́." },
          options: [{ text: same("мои́"), correct: true }, { text: same("мой") }, { text: same("моё") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "tiger", instruction: I.build,
          question: { zh: "不，这不是我的车。", ru: "Составьте: «Нет, это не моя машина.»", uz: "«Yöq, bu mening maşinam emas» gapini tuzing" },
          explanation: { zh: "Нет, э́то не моя́ маши́на. не 放在 моя́ 前面。", ru: "Нет, э́то не моя́ маши́на.", uz: "Нет, э́то не моя́ маши́на. не — моя́ dan oldin." },
          words: ["моя́", "Нет,", "мой", "не", "маши́на.", "э́то"], correctWords: ["Нет,", "э́то", "не", "моя́", "маши́на."],
        },
        hear("твои́", ["твой", "твоя́", "твоё"], WORD, { zh: "твои́ — 你的（复数）。", ru: "твои́ — множественное число.", uz: "твои́ — sening (köplik)." }),
        say("Э́то твой дом?", "这是你的房子吗？", "Bu sening uyingmi?"),
        say("Да, мой.", "是的，是我的。", "Ha, meniki.", "tiger"),
      ],
    },
    // ── Lesson 5 ─────────────────────────────────────────────── новый · старый
    {
      type: "GRAMMAR", xpReward: 25, estimatedMinutes: 6,
      title: { zh: "新的和旧的：но́вый · ста́рый", ru: "Но́вый и ста́рый", uz: "Yangi va eski: но́вый · ста́рый", en: "New and old: но́вый · ста́рый" },
      description: { zh: "形容词词尾 -ый、-ая、-ое、-ые", ru: "Окончания прилагательных -ый, -ая, -ое, -ые", uz: "Sifat qöşimçalari -ый, -ая, -ое, -ые", en: "Adjective endings -ый, -ая, -ое, -ые" },
      theory: {
        zh: "熊猫 Paxta：汉语说“新的”就够了，俄语的形容词要跟着名词变。\n今天学两个形容词：но́вый 新的，ста́рый 旧的。",
        ru: "Панда Paxta: прилагательное в русском языке меняется вместе с существительным.\nСегодня два слова: но́вый и ста́рый.",
        uz: "Panda Paxta: rus tilida sifat ot bilan birga özgaradi.\nBugun ikkita söz: но́вый — yangi, ста́рый — eski.",
        en: "Paxta the panda: a Russian adjective changes together with its noun.\nToday: но́вый (new) and ста́рый (old).",
      },
      exercises: [
        {
          teach: { zh: "но́вый — 新的\nста́рый — 旧的，老的\nно́вый дом — 新房子\nста́рый го́род — 老城", ru: "но́вый\nста́рый\nно́вый дом\nста́рый го́род", uz: "но́вый — yangi\nста́рый — eski, qari\nно́вый дом — yangi uy\nста́рый го́род — eski şahar" },
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "но́вый", speak: "но́вый", instruction: I.meaning, question: MEANING,
          explanation: { zh: "но́вый — 新的。", ru: "но́вый.", uz: "но́вый — yangi." },
          options: [meaning("新的", "yangi", "✨", true), meaning("旧的", "eski", "🕰️"), meaning("我的", "mening", "🙋")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "ста́рый", speak: "ста́рый", instruction: I.meaning, question: MEANING,
          explanation: { zh: "ста́рый — 旧的，老的。", ru: "ста́рый.", uz: "ста́рый — eski, qari." },
          options: [meaning("旧的", "eski", "🕰️", true), meaning("新的", "yangi", "✨"), meaning("你的", "sening", "👉")],
        },
        {
          teach: { zh: "形容词的词尾跟着名词的性变化：\n阳性 -ый：но́вый дом\n阴性 -ая：но́вая су́мка\n中性 -ое：но́вое окно́", ru: "Окончание прилагательного зависит от рода:\nмужской -ый: но́вый дом\nженский -ая: но́вая су́мка\nсредний -ое: но́вое окно́", uz: "Sifat qöşimçasi otning rodiga bağliq:\nmujskoy -ый: но́вый дом\njenskiy -ая: но́вая су́мка\nsredniy -ое: но́вое окно́" },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "… су́мка", speak: "су́мка", instruction: I.choose,
          question: { zh: "“新包”怎么说？", ru: "Какая форма подходит к слову су́мка?", uz: "су́мка söziga qaysi şakl mos?" },
          explanation: { zh: "су́мка 是阴性，词尾 -ая：но́вая су́мка。", ru: "су́мка — женский род: но́вая су́мка.", uz: "су́мка — jenskiy rod, -ая: но́вая су́мка." },
          options: [{ text: same("но́вая"), correct: true }, { text: same("но́вый") }, { text: same("но́вое") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "… окно́", speak: "окно́", instruction: I.choose,
          question: { zh: "“旧窗户”怎么说？", ru: "Какая форма подходит к слову окно́?", uz: "окно́ söziga qaysi şakl mos?" },
          explanation: { zh: "окно́ 是中性，词尾 -ое：ста́рое окно́。", ru: "окно́ — средний род: ста́рое окно́.", uz: "окно́ — sredniy rod, -ое: ста́рое окно́." },
          options: [{ text: same("ста́рое"), correct: true }, { text: same("ста́рая") }, { text: same("ста́рый") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "… авто́бус", speak: "авто́бус", instruction: I.choose,
          question: { zh: "“旧公共汽车”怎么说？", ru: "Какая форма подходит к слову авто́бус?", uz: "авто́бус söziga qaysi şakl mos?" },
          explanation: { zh: "авто́бус 是阳性，词尾 -ый：ста́рый авто́бус。", ru: "авто́бус — мужской род: ста́рый авто́бус.", uz: "авто́бус — mujskoy rod, -ый: ста́рый авто́бус." },
          options: [{ text: same("ста́рый"), correct: true }, { text: same("ста́рая") }, { text: same("ста́рое") }],
        },
        {
          teach: { zh: "复数不分性，词尾都是 -ые：\nно́вые дома́\nно́вые су́мки\nста́рые города́", ru: "Во множественном числе окончание одно — -ые:\nно́вые дома́\nно́вые су́мки\nста́рые города́", uz: "Köplikda qöşimça bitta — -ые:\nно́вые дома́\nно́вые су́мки\nста́рые города́" },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "… дома́", speak: "дома́", instruction: I.choose,
          question: { zh: "“新房子（复数）”怎么说？", ru: "Какая форма подходит к слову дома́?", uz: "дома́ söziga qaysi şakl mos?" },
          explanation: { zh: "дома́ 是复数，词尾 -ые：но́вые дома́。", ru: "дома́ — множественное число: но́вые дома́.", uz: "дома́ — köplik, -ые: но́вые дома́." },
          options: [{ text: same("но́вые"), correct: true }, { text: same("но́вый") }, { text: same("но́вая") }],
        },
        {
          type: "MATCHING", mascot: "panda", instruction: I.match,
          question: { zh: "把形容词和名词配对", ru: "Соедините прилагательное с подходящим словом", uz: "Sifatni mos ot bilan birlaştiring" },
          explanation: { zh: "ста́рый заво́д · ста́рая ва́за · ста́рое окно́ · ста́рые друзья́。", ru: "ста́рый заво́д, ста́рая ва́за, ста́рое окно́, ста́рые друзья́.", uz: "ста́рый заво́д · ста́рая ва́за · ста́рое окно́ · ста́рые друзья́." },
          pairs: [{ left: "ста́рый", right: "заво́д" }, { left: "ста́рая", right: "ва́за" }, { left: "ста́рое", right: "окно́" }, { left: "ста́рые", right: "друзья́" }],
        },
        {
          teach: { zh: "词序和汉语一样：我的 + 新 + 房子\nмой но́вый дом\nмоя́ но́вая су́мка\n三个词的性要一致。", ru: "Порядок слов: мой + но́вый + дом.\nмой но́вый дом\nмоя́ но́вая су́мка\nВсе три слова одного рода.", uz: "Sözlar tartibi: мой + но́вый + дом.\nмой но́вый дом\nмоя́ но́вая су́мка\nUçala söz bir xil rodda." },
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是我的新房子。", ru: "Составьте: «Это мой новый дом.»", uz: "«Bu mening yangi uyim» gapini tuzing" },
          explanation: { zh: "Э́то мой но́вый дом.", ru: "Э́то мой но́вый дом.", uz: "Э́то мой но́вый дом." },
          words: ["но́вый", "моя́", "Э́то", "дом.", "но́вая", "мой"], correctWords: ["Э́то", "мой", "но́вый", "дом."],
        },
        {
          type: "ARRANGE_WORDS", mascot: "tiger", instruction: I.build,
          question: { zh: "这是你的旧包吗？", ru: "Составьте: «Это твоя старая сумка?»", uz: "«Bu sening eski sumkangmi?» gapini tuzing" },
          explanation: { zh: "Э́то твоя́ ста́рая су́мка? су́мка 是阴性：твоя́、ста́рая。", ru: "Э́то твоя́ ста́рая су́мка?", uz: "Э́то твоя́ ста́рая су́мка? су́мка — jenskiy rod: твоя́, ста́рая." },
          words: ["ста́рая", "твой", "су́мка?", "Э́то", "ста́рый", "твоя́"], correctWords: ["Э́то", "твоя́", "ста́рая", "су́мка?"],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "— Э́то но́вый дом?\n— Нет, …", speak: "Э́то но́вый дом?", instruction: I.choose,
          question: { zh: "选出正确的回答", ru: "Выберите правильный ответ", uz: "Töğri javobni tanlang" },
          explanation: { zh: "дом 是阳性：Нет, ста́рый.", ru: "дом — мужской род: Нет, ста́рый.", uz: "дом — mujskoy rod: Нет, ста́рый." },
          options: [{ text: same("ста́рый"), correct: true }, { text: same("ста́рая") }, { text: same("ста́рые") }],
        },
        hear("но́вая", ["но́вый", "но́вое", "но́вые"], WORD, { zh: "но́вая — 新的（阴性）。", ru: "но́вая — женский род.", uz: "но́вая — yangi (jenskiy rod)." }),
        say("но́вый дом", "新房子", "yangi uy"),
        say("Э́то моя́ но́вая су́мка.", "这是我的新包。", "Bu mening yangi sumkam.", "tiger"),
      ],
    },
    // ── Lesson 6 ─────────────────────────────────────────────── вокзал в центре
    {
      type: "CONVERSATION", xpReward: 30, estimatedMinutes: 6,
      title: { zh: "这是我的城市", ru: "Вот мой го́род", uz: "Mana mening şahrim", en: "Here is my city" },
      description: { zh: "вокза́л [вагза́л]：清辅音浊化，介绍自己的城市", ru: "вокза́л [вагза́л]: озвончение и рассказ о своём городе", uz: "вокза́л [вагза́л]: jaranglilaşiş va öz şahri haqida hikoya", en: "вокза́л [вагза́л]: voicing, and showing your city" },
      theory: {
        zh: "小老虎 Bars 带朋友看自己的城市。\n今天学 3 个新词和一条读音规则，然后用学过的词介绍城市。",
        ru: "Тигрёнок Bars показывает другу свой город.\nСегодня 3 новых слова, одно правило чтения и рассказ о городе.",
        uz: "Yolbars Bars döstiga öz şahrini körsatadi.\nBugun 3 ta yangi söz, bitta öqiş qoidasi va şahar haqida hikoya.",
        en: "Bars the tiger shows a friend his city.\nToday: 3 new words, one reading rule and a short city tour.",
      },
      exercises: [
        {
          teach: { zh: "вокза́л — 火车站\nфутбо́л — 足球\nцентр — 中心；в це́нтре — 在市中心", ru: "вокза́л\nфутбо́л\nцентр; в це́нтре", uz: "вокза́л — vokzal\nфутбо́л — futbol\nцентр — markaz; в це́нтре — markazda" },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "вокза́л", speak: "вокза́л", instruction: I.meaning, question: MEANING,
          explanation: { zh: "вокза́л — 火车站。", ru: "вокза́л.", uz: "вокза́л — vokzal." },
          options: [meaning("火车站", "vokzal", "🚉", true), meaning("公共汽车站", "bekat", "🚏"), meaning("工厂", "zavod", "🏭")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "футбо́л", speak: "футбо́л", instruction: I.meaning, question: MEANING,
          explanation: { zh: "футбо́л — 足球。", ru: "футбо́л.", uz: "футбо́л — futbol." },
          options: [meaning("足球", "futbol", "⚽", true), meaning("喷泉", "favvora", "⛲"), meaning("花园", "boğ", "🌳")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "в це́нтре", speak: "в це́нтре", instruction: I.meaning, question: MEANING,
          explanation: { zh: "в це́нтре — 在市中心。", ru: "в це́нтре.", uz: "в це́нтре — markazda." },
          options: [meaning("在市中心", "markazda", "📍", true), meaning("在那里", "u yerda", "👉"), meaning("在家", "uyda", "🏠")],
        },
        {
          teach: { zh: "清辅音在浊辅音前面要读成浊音：\nк → [г]：вокза́л [вагза́л]\nт → [д]：футбо́л [фудбо́л]\n写法不变。", ru: "Глухой согласный перед звонким читается звонко:\nк → [г]: вокза́л [вагза́л]\nт → [д]: футбо́л [фудбо́л]\nПишем по-прежнему.", uz: "Jarangsiz undoş jarangli undoş oldidan jarangli öqiladi:\nк → [г]: вокза́л [вагза́л]\nт → [д]: футбо́л [фудбо́л]\nYozuv özgarmaydi." },
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "вокза́л", speak: "вокза́л", instruction: I.choose,
          question: { zh: "вокза́л 实际读作……", ru: "Как на самом деле читается вокза́л?", uz: "вокза́л aslida qanday öqiladi?" },
          explanation: { zh: "к 在浊辅音 з 前面读 [г]：[вагза́л]。", ru: "к перед звонким з читается [г]: [вагза́л].", uz: "к jarangli з oldidan [г] öqiladi: [вагза́л]." },
          options: [{ text: same("[вагза́л]"), correct: true }, { text: same("[вакза́л]") }, { text: same("[вахза́л]") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "футбо́л", speak: "футбо́л", instruction: I.choose,
          question: { zh: "футбо́л 里的 т 读作……", ru: "Как читается т в слове футбо́л?", uz: "футбо́л sözida т qanday öqiladi?" },
          explanation: { zh: "т 在浊辅音 б 前面读 [д]：[фудбо́л]。", ru: "т перед звонким б читается [д]: [фудбо́л].", uz: "т jarangli б oldidan [д] öqiladi: [фудбо́л]." },
          options: [{ text: same("[д]"), correct: true }, { text: same("[т]") }, { text: same("[б]") }],
        },
        {
          type: "MATCHING", mascot: "dragon", instruction: I.match,
          question: { zh: "把单词和实际读音配对", ru: "Соедините слово и его произношение", uz: "Sözni talaffuzi bilan moslang" },
          explanation: { zh: "вокза́л [вагза́л] · футбо́л [фудбо́л] · сад [сат] · друг [друк]。", ru: "вокза́л [вагза́л], футбо́л [фудбо́л], сад [сат], друг [друк].", uz: "вокза́л [вагза́л] · футбо́л [фудбо́л] · сад [сат] · друг [друк]." },
          pairs: [{ left: "вокза́л", right: "[вагза́л]" }, { left: "футбо́л", right: "[фудбо́л]" }, { left: "сад", right: "[сат]" }, { left: "друг", right: "[друк]" }],
        },
        {
          teach: { zh: "Bars 介绍城市：\nВот мой го́род.\nВокза́л в це́нтре.\nЭ́то но́вый вокза́л, а там ста́рый сад.", ru: "Bars рассказывает о городе:\nВот мой го́род.\nВокза́л в це́нтре.\nЭ́то но́вый вокза́л, а там ста́рый сад.", uz: "Bars şahar haqida aytadi:\nВот мой го́род.\nВокза́л в це́нтре.\nЭ́то но́вый вокза́л, а там ста́рый сад." },
          type: "ARRANGE_WORDS", mascot: "tiger", instruction: I.build,
          question: { zh: "火车站在市中心。", ru: "Составьте: «Вокзал в центре.»", uz: "«Vokzal markazda» gapini tuzing" },
          explanation: { zh: "Вокза́л в це́нтре.", ru: "Вокза́л в це́нтре.", uz: "Вокза́л в це́нтре." },
          words: ["це́нтре.", "там", "Вокза́л", "в", "Вот"], correctWords: ["Вокза́л", "в", "це́нтре."],
        },
        {
          type: "ARRANGE_WORDS", mascot: "panda", instruction: I.build,
          question: { zh: "这是新火车站。", ru: "Составьте: «Это новый вокзал.»", uz: "«Bu yangi vokzal» gapini tuzing" },
          explanation: { zh: "Э́то но́вый вокза́л. вокза́л 是阳性：но́вый。", ru: "Э́то но́вый вокза́л.", uz: "Э́то но́вый вокза́л. вокза́л — mujskoy rod: но́вый." },
          words: ["но́вая", "вокза́л.", "Э́то", "но́вый", "но́вые"], correctWords: ["Э́то", "но́вый", "вокза́л."],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "— Э́то твой го́род?\n— Да, …", speak: "Э́то твой го́род?", instruction: I.choose,
          question: { zh: "选出正确的回答", ru: "Выберите правильный ответ", uz: "Töğri javobni tanlang" },
          explanation: { zh: "го́род 是阳性：Да, мой.", ru: "го́род — мужской род: Да, мой.", uz: "го́род — mujskoy rod: Да, мой." },
          options: [{ text: same("мой"), correct: true }, { text: same("моя́") }, { text: same("мои́") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "tiger", instruction: I.build,
          question: { zh: "而那里是老花园。", ru: "Составьте: «А там старый сад.»", uz: "«U yerda esa eski boğ» gapini tuzing" },
          explanation: { zh: "А там ста́рый сад. сад 是阳性：ста́рый。", ru: "А там ста́рый сад.", uz: "А там ста́рый сад. сад — mujskoy rod: ста́рый." },
          words: ["сад.", "ста́рая", "А", "ста́рый", "там", "Вот"], correctWords: ["А", "там", "ста́рый", "сад."],
        },
        hear("вокза́л", ["футбо́л", "фонта́н", "заво́д"], WORD, { zh: "вокза́л [вагза́л] — 火车站。", ru: "вокза́л [вагза́л].", uz: "вокза́л [вагза́л] — vokzal." }),
        say("Вокза́л в це́нтре.", "火车站在市中心。", "Vokzal markazda."),
        say("Вот мой го́род.", "这就是我的城市。", "Mana mening şahrim.", "tiger"),
      ],
    },
  ],
};
