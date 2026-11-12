// Course "Russian for Chinese speakers" (zh → ru), Unit 4 «Мой город».
// From the textbook 《大学俄语 东方（新版）1》, Урок 2–3: city words (го́род,
// авто́бус, остано́вка, фонта́н, кафе́, заво́д), «Вот …», devoicing of voiced
// consonants at the end of a word (сад [сат]) and the plural of nouns
// (-ы / -и, and дома́, города́, друзья́, бра́тья).
// Every lesson teaches step by step (teach cards), then listens and speaks.
// Uzbek texts use the new alphabet.
import { I, hear, meaning, same, say, type ModuleContent, type Text } from "./common";

const MEANING: Text = { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" };
const WORD: Text = { zh: "你听到的是哪个词？", ru: "Какое слово вы услышали?", uz: "Qaysi sözni eşitdingiz?" };
const PLURAL_PAIRS: Text = { zh: "把单数和复数配对", ru: "Соедините единственное и множественное число", uz: "Birlik va köplikni moslang" };

export const ruUnit4: ModuleContent = {
  title: { zh: "第四单元 · 我的城市", ru: "Юнит 4 · Мой город", uz: "4-bölim · Mening şahrim", en: "Unit 4 · My city" },
  description: { zh: "城市里的词，词末浊辅音清化，名词复数", ru: "Слова о городе, оглушение на конце слова, множественное число", uz: "Şahar sözlari, söz oxirida jarangsizlaşiş, köplik", en: "City words, final devoicing, the plural" },
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
  ],
};
