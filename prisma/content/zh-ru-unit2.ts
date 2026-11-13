// Course "Russian for Chinese speakers" (zh → ru), Unit 2 «Кто это?».
// Builds on Unit 1 (а о у э, п м т, stress, ИК-1): vowels ы и, consonants
// н к г х and the voiced/voiceless pairs б-п в-ф д-т з-с г-к, intonation of
// questions (ИК-2, ИК-3), «Кто это? Что это?», да/нет, greetings among friends,
// and why Russian is useful in Tashkent. Uzbek texts use the new alphabet.
import { I, meaning, same, type ModuleContent } from "./common";

export const ruUnit2: ModuleContent = {
  title: { zh: "第二单元 · 这是谁？", ru: "Юнит 2 · Кто это?", uz: "2-bölim · Bu kim?", en: "Unit 2 · Who is it?" },
  description: { zh: "元音 ы、и，新辅音，疑问句，朋友间的问候", ru: "Гласные ы, и, новые согласные, вопросы, приветствия", uz: "ы, и unlilari, yangi undoşlar, savollar, salomlaşiş", en: "Vowels ы, и, new consonants, questions, greetings" },
  lessons: [
    // ── Lesson 1 ─────────────────────────────────────────────── ы и н
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 4,
      title: { zh: "元音 Ы · И 与辅音 Н", ru: "Гласные Ы · И и согласный Н", uz: "Ы · И unlilari va Н undoşi", en: "Vowels Ы · И and consonant Н" },
      description: { zh: "汉语里没有的 [ы]，人称代词", ru: "Звук [ы] и личные местоимения", uz: "[ы] tovuşi va kişilik olmoşlari", en: "The sound [ы] and personal pronouns" },
      theory: {
        zh: "小老虎 Bars 今天带你学两个新元音和一个新辅音。\n[ы] — 舌头整体后缩，舌中后部向上腭抬起，双唇不圆、略向两边舒展。汉语里没有这个音：可以先发 [и]，再把舌头往后拉。\n[и] — 舌前部抬向硬腭，双唇向两边舒展，接近汉语的“衣”，但更短、更紧。\n[н] — 鼻音：舌前部贴上齿背和齿龈，气流通过鼻腔，接近汉语拼音 n。\n跟读：мы — ми，ты — ти，ны — ни。\n新词：мы 我们 · ты 你 · он 他 · она́ 她 · они́ 他们 · Ни́на 尼娜（人名）",
        ru: "Сегодня тигрёнок Bars покажет две новые гласные и один согласный.\n[ы] — язык оттянут назад, средняя и задняя часть поднята к нёбу, губы не округлены. В китайском такого звука нет: скажите [и] и отодвиньте язык назад.\n[и] — передняя часть языка поднята, губы растянуты, похоже на китайское «衣», но короче.\n[н] — носовой: язык у верхних зубов, воздух идёт через нос.\nПовторяйте: мы — ми, ты — ти, ны — ни.\nНовые слова: мы, ты, он, она́, они́, Ни́на.",
        uz: "Bugun yolbars Bars ikkita yangi unli va bitta undoşni körsatadi.\n[ы] — til orqaga tortiladi, lablar dumaloqlanmaydi. Xitoy tilida bunday tovuş yöq: [и] deb, tilni orqaga suring.\n[и] — til oldi kötariladi, lablar yoyiq.\n[н] — burun undoşi.\nIlk sözlar: мы biz · ты sen · он u (erkak) · она́ u (ayol) · они́ ular · Ни́на (ism)",
        en: "Today Bars the tiger cub brings two new vowels and one consonant.\n[ы] — the whole tongue pulled back, its middle raised, lips not rounded. Chinese has no such sound: say [и] and pull the tongue back.\n[и] — front of the tongue raised, lips spread, like Chinese 衣 but shorter.\n[н] — nasal: tongue at the upper teeth, air through the nose.\nRepeat: мы — ми, ты — ти, ны — ни.\nNew words: мы we · ты you · он he · она́ she · они́ they · Ни́на Nina",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "哪个元音是汉语里没有的？", ru: "Какого гласного нет в китайском?", uz: "Qaysi unli xitoy tilida yöq?" },
          explanation: { zh: "[ы] 汉语里没有：先发 [и]，再把舌头往后拉。", ru: "[ы]: скажите [и] и отодвиньте язык назад.", uz: "[ы]: [и] deb, tilni orqaga suring." },
          options: [{ text: same("ы"), correct: true }, { text: same("и") }, { text: same("а") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "ы", speak: "мы", instruction: I.choose,
          question: { zh: "发 [ы] 时，舌头……", ru: "При [ы] язык…", uz: "[ы] da til …" },
          explanation: { zh: "[ы]：舌头整体后缩，舌中后部抬起，双唇不圆。", ru: "Язык оттянут назад, губы не округлены.", uz: "Til orqaga tortiladi." },
          options: [
            { text: { zh: "整体后缩", ru: "оттянут назад", uz: "orqaga tortiladi" }, correct: true },
            { text: { zh: "前部抬向硬腭", ru: "поднят вперёд", uz: "oldinga kötariladi" } },
            { text: { zh: "自然平放", ru: "лежит спокойно", uz: "tinç yotadi" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "и", speak: "и", instruction: I.choose,
          question: { zh: "发 [и] 时，双唇……", ru: "При [и] губы…", uz: "[и] da lablar …" },
          explanation: { zh: "[и]：双唇向两边舒展，接近汉语的“衣”。", ru: "Губы растянуты, похоже на «衣».", uz: "Lablar yoyiq." },
          options: [
            { text: { zh: "向两边舒展", ru: "растянуты", uz: "yoyiq" }, correct: true },
            { text: { zh: "圆撮成筒状", ru: "трубочкой", uz: "nayça" } },
            { text: { zh: "张大", ru: "широко открыты", uz: "keng oçiq" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "мы", speak: "мы", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "мы — 我们。", ru: "мы — мы.", uz: "мы — biz." },
          options: [meaning("我们", "biz", "👨‍👩‍👧", true), meaning("你", "sen", "👉"), meaning("他们", "ular", "👥")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "она́", speak: "она́", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "она́ — 她；он — 他。", ru: "она́ — она; он — он.", uz: "она́ — u (ayol); он — u (erkak)." },
          options: [meaning("她", "u (ayol)", "👩", true), meaning("他", "u (erkak)", "👨"), meaning("我们", "biz", "👨‍👩‍👧")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把代词和意思配对", ru: "Соедините местоимения с переводом", uz: "Olmoşlarni maʼnosi bilan moslang" },
          explanation: { zh: "мы 我们 · ты 你 · он 他 · она́ 她。", ru: "мы, ты, он, она́.", uz: "мы biz · ты sen · он u · она́ u (ayol)." },
          pairs: [{ left: "мы", right: "我们" }, { left: "ты", right: "你" }, { left: "он", right: "他" }, { left: "она́", right: "她" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "“他们”用俄语怎么说？", ru: "Как по-русски «他们»?", uz: "«Ular» rusça qanday?" },
          explanation: { zh: "они́ — 他们（重音在 и 上）。", ru: "они́.", uz: "они́ — ular." },
          options: [{ text: same("они́"), correct: true }, { text: same("она́") }, { text: same("он") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是尼娜。", ru: "Составьте: «Это Нина.»", uz: "«Bu — Nina» gapini tuzing" },
          explanation: { zh: "Э́то Ни́на.", ru: "Э́то Ни́на.", uz: "Э́то Ни́на." },
          words: ["мы", "Ни́на.", "он", "Э́то"], correctWords: ["Э́то", "Ни́на."],
        },
      ],
    },
    // ── Lesson 2 ─────────────────────────────────────────────── к г х
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 4,
      title: { zh: "辅音 К · Г · Х", ru: "Согласные К · Г · Х", uz: "К · Г · Х undoşlari", en: "Consonants К · Г · Х" },
      description: { zh: "舌后音，新词 кот、кто", ru: "Заднеязычные, слова кот и кто", uz: "Til orqa undoşlari, кот va кто", en: "Back consonants, кот and кто" },
      theory: {
        zh: "这三个辅音都在舌头后部发音。\n[к] — 舌后部抬起贴住软腭，气流冲破阻塞，清辅音、不送气，听起来接近汉语拼音 g。\n[г] — 部位和 [к] 一样，但声带振动（浊辅音）。汉语里没有，注意别读成拼音 k。\n[х] — 舌后部靠近软腭，留一条窄缝，气流摩擦成音，和汉语拼音 h 很接近。\n跟读：ка — ко — ку，га — го — гу，ха — хо — ху。\n新词：кот 猫 · кто 谁 · как 怎样 · ко́мната 房间 · у́хо 耳朵",
        ru: "Эти три согласных образуются задней частью языка.\n[к] — задняя часть языка смыкается с нёбом; глухой, без придыхания — похоже на китайское g.\n[г] — то же место, но с голосом (звонкий). Не превращайте его в китайское k.\n[х] — щель между языком и нёбом, похоже на китайское h.\nПовторяйте: ка — ко — ку, га — го — гу, ха — хо — ху.\nНовые слова: кот, кто, как, ко́мната, у́хо.",
        uz: "Bu uç undoş til orqasi bilan aytiladi.\n[к] — jarangsiz, xitoyça g ga yaqin.\n[г] — xuddi şu joyda, lekin jarangli.\n[х] — özbekça x ga yaqin.\nYangi sözlar: кот müşuk · кто kim · как qanday · ко́мната xona · у́хо quloq",
        en: "All three are made with the back of the tongue.\n[к] — back of the tongue against the soft palate; voiceless, unaspirated — close to pinyin g.\n[г] — same place, but voiced. Don't turn it into pinyin k.\n[х] — a narrow gap, the air rubs through — very close to pinyin h.\nRepeat: ка — ко — ку, га — го — гу, ха — хо — ху.\nNew words: кот cat · кто who · как how · ко́мната room · у́хо ear",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "к", speak: "ка", instruction: I.choose,
          question: { zh: "俄语 [к] 最接近汉语拼音的……", ru: "[к] ближе всего к китайскому…", uz: "[к] xitoyça qaysi tovuşga yaqin?" },
          explanation: { zh: "俄语 [к] 不送气，接近拼音 g；拼音 k 送气太强。", ru: "Русское [к] без придыхания — как китайское g.", uz: "[к] xitoyça g ga yaqin." },
          options: [{ text: same("g"), correct: true }, { text: same("k") }, { text: same("h") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "г", speak: "га", instruction: I.choose,
          question: { zh: "[г] 和 [к] 的区别是……", ru: "Чем [г] отличается от [к]?", uz: "[г] ning [к] dan farqi nimada?" },
          explanation: { zh: "部位相同，[г] 声带振动，是浊辅音。", ru: "Место то же, но [г] звонкий.", uz: "[г] jarangli." },
          options: [
            { text: { zh: "声带振动", ru: "звонкий (с голосом)", uz: "jarangli" }, correct: true },
            { text: { zh: "发音部位不同", ru: "другое место", uz: "boşqa joyda aytiladi" } },
            { text: { zh: "送气更强", ru: "сильное придыхание", uz: "kuçli nafas bilan" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "х", speak: "ха", instruction: I.choose,
          question: { zh: "[х] 和汉语拼音的哪个音很接近？", ru: "На какой китайский звук похож [х]?", uz: "[х] xitoyça qaysi tovuşga öxşaydi?" },
          explanation: { zh: "[х] 和拼音 h 很接近：舌后部和软腭之间摩擦成音。", ru: "Похож на китайское h.", uz: "Xitoyça h ga öxşaydi." },
          options: [{ text: same("h"), correct: true }, { text: same("k") }, { text: same("sh") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "кот", speak: "кот", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "кот — 猫。", ru: "кот — кот.", uz: "кот — müşuk." },
          options: [meaning("猫", "müşuk", "🐱", true), meaning("谁", "kim", "❓"), meaning("房间", "xona", "🚪")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "кто", speak: "кто", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "кто — 谁。注意 кто 和 кот 字母一样，顺序不同！", ru: "кто — вопрос о человеке. Не путайте с кот!", uz: "кто — kim. кот bilan adaştirmang!" },
          options: [meaning("谁", "kim", "❓", true), meaning("猫", "müşuk", "🐱"), meaning("怎样", "qanday")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "ко́мната", speak: "ко́мната", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "ко́мната — 房间（重音在第一个音节）。", ru: "ко́мната — комната.", uz: "ко́мната — xona." },
          options: [meaning("房间", "xona", "🚪", true), meaning("番茄", "pomidor", "🍅"), meaning("妈妈", "ona", "👩")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слова с переводом", uz: "Sözni maʼnosi bilan moslang" },
          explanation: { zh: "кот 猫 · кто 谁 · как 怎样 · у́хо 耳朵。", ru: "кот, кто, как, у́хо.", uz: "кот müşuk · кто kim · как qanday · у́хо quloq." },
          pairs: [{ left: "кот", right: "猫" }, { left: "кто", right: "谁" }, { left: "как", right: "怎样" }, { left: "у́хо", right: "耳朵" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "哪个是浊辅音（声带振动）？", ru: "Какой согласный звонкий?", uz: "Qaysi undoş jarangli?" },
          explanation: { zh: "[г] 是浊辅音；[к]、[х]、[т] 是清辅音。", ru: "[г] — звонкий; [к], [х], [т] — глухие.", uz: "[г] — jarangli." },
          options: [{ text: same("г"), correct: true }, { text: same("к") }, { text: same("х") }, { text: same("т") }],
        },
      ],
    },
    // ── Lesson 3 ─────────────────────────────────────────────── ИК-2, ИК-3, да / нет
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "疑问句：调型 2 和调型 3", ru: "Вопросы: ИК-2 и ИК-3", uz: "Savollar: 2- va 3-ohang", en: "Questions: ИК-2 and ИК-3" },
      description: { zh: "Кто э́то? Э́то кот? да 和 нет", ru: "Кто это? Это кот? да и нет", uz: "Кто это? Это кот? да va нет", en: "Кто это? Это кот? да and нет" },
      theory: {
        zh: "带疑问词的问句（кто 谁、как 怎样）用调型 2（ИК-2）：疑问词重读，语调平稳下降，比调型 1 更有力：Кто э́то?\n没有疑问词的一般疑问句用调型 3（ИК-3）：被提问那个词的重读音节语调急剧升高，然后下降：Э́то ма́ма?\n回答：Да, э́то ма́ма. 是的，这是妈妈。/ Нет, э́то Ни́на. 不，这是尼娜。\n注意：陈述句和一般疑问句的词序可以完全一样，区别只在语调！Э́то кот. ↘ / Э́то кот? ↗\n新词：да 是的 · нет 不，不是",
        ru: "Вопрос с вопросительным словом (кто, как) произносится с ИК-2: ударное вопросительное слово, понижение тона, энергичнее, чем ИК-1: Кто э́то?\nВопрос без вопросительного слова — ИК-3: резкий подъём тона на ударном слоге слова, о котором спрашивают, затем понижение: Э́то ма́ма?\nОтветы: Да, э́то ма́ма. / Нет, э́то Ни́на.\nПорядок слов в утверждении и в вопросе может совпадать — разница только в интонации: Э́то кот. ↘ / Э́то кот? ↗\nНовые слова: да, нет.",
        uz: "Söroq sözli savol (кто, как) 2-ohang bilan: söroq söz urğuli, ohang pasayadi: Кто э́то?\nSöroq sözsiz savol — 3-ohang: soralayotgan sözning urğuli böğinida ohang keskin kötariladi: Э́то ма́ма?\nJavob: Да, э́то ма́ма. (Ha) / Нет, э́то Ни́на. (Yöq)\nDarak gap va savolda söz tartibi bir xil bölişi mumkin — farq faqat ohangda: Э́то кот. ↘ / Э́то кот? ↗",
        en: "A question with a question word (кто, как) uses ИК-2: the question word is stressed, the tone falls, more energetic than ИК-1: Кто э́то?\nA yes/no question uses ИК-3: a sharp rise on the stressed syllable of the word in question, then a fall: Э́то ма́ма?\nAnswers: Да, э́то ма́ма. Yes, it's mum. / Нет, э́то Ни́на. No, it's Nina.\nA statement and a question can have the same word order — only the intonation differs: Э́то кот. ↘ / Э́то кот? ↗\nNew words: да yes · нет no",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Кто э́то?", speak: "Кто э́то?", instruction: I.choose,
          question: { zh: "这句话用哪种调型？", ru: "Какая здесь интонационная конструкция?", uz: "Bu gapda qaysi ohang?" },
          explanation: { zh: "有疑问词 кто，用调型 2：疑问词重读，语调下降。", ru: "Есть вопросительное слово — ИК-2.", uz: "Söroq söz bor — 2-ohang." },
          options: [{ text: same("ИК-2"), correct: true }, { text: same("ИК-1") }, { text: same("ИК-3") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Э́то кот?", speak: "Э́то кот?", instruction: I.choose,
          question: { zh: "这句话用哪种调型？", ru: "Какая здесь интонационная конструкция?", uz: "Bu gapda qaysi ohang?" },
          explanation: { zh: "没有疑问词的一般疑问句，用调型 3：在 кот 上语调急剧升高。", ru: "Вопрос без вопросительного слова — ИК-3.", uz: "Söroq sözsiz savol — 3-ohang." },
          options: [{ text: same("ИК-3"), correct: true }, { text: same("ИК-1") }, { text: same("ИК-2") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", instruction: I.choose,
          question: { zh: "调型 3 的语调……", ru: "В ИК-3 тон…", uz: "3-ohangda ovoz …" },
          explanation: { zh: "调型 3：被提问词的重读音节语调急剧升高，然后下降。", ru: "Резкий подъём на ударном слоге, затем понижение.", uz: "Urğuli böğinda keskin kötariladi." },
          options: [
            { text: { zh: "在重读音节急剧升高", ru: "резко поднимается на ударном слоге", uz: "urğuli böğinda keskin kötariladi" }, correct: true },
            { text: { zh: "平稳下降", ru: "плавно понижается", uz: "asta pasayadi" } },
            { text: { zh: "一直很低", ru: "всё время низкий", uz: "doim past" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "да", speak: "Да.", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "да — 是的。", ru: "да — согласие.", uz: "да — ha." },
          options: [meaning("是的", "ha", "👍", true), meaning("不，不是", "yöq", "👎"), meaning("谁", "kim", "❓")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "нет", speak: "Нет.", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "нет — 不，不是。", ru: "нет — отрицание.", uz: "нет — yöq." },
          options: [meaning("不，不是", "yöq", "👎", true), meaning("是的", "ha", "👍"), meaning("这里", "bu yerda", "👇")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Э́то ма́ма?", speak: "Э́то ма́ма?", instruction: I.choose,
          question: { zh: "回答：是的，这是妈妈。", ru: "Ответьте: да, это мама.", uz: "Javob bering: ha, bu — ona." },
          explanation: { zh: "Да, э́то ма́ма.", ru: "Да, э́то ма́ма.", uz: "Да, э́то ма́ма." },
          options: [{ text: same("Да, э́то ма́ма."), correct: true }, { text: same("Нет, э́то ма́ма.") }, { text: same("Кто э́то?") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是谁？", ru: "Составьте: «Кто это?»", uz: "«Bu kim?» gapini tuzing" },
          explanation: { zh: "Кто э́то? — 调型 2。", ru: "Кто э́то?", uz: "Кто э́то?" },
          words: ["э́то?", "как", "Кто", "там"], correctWords: ["Кто", "э́то?"],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "不，这是猫。", ru: "Составьте: «Нет, это кот.»", uz: "«Yöq, bu — müşuk» gapini tuzing" },
          explanation: { zh: "Нет, э́то кот.", ru: "Нет, э́то кот.", uz: "Нет, э́то кот." },
          words: ["кот.", "Да,", "Нет,", "э́то", "кто"], correctWords: ["Нет,", "э́то", "кот."],
        },
      ],
    },
    // ── Lesson 4 ─────────────────────────────────────────────── б-п в-ф д-т з-с г-к
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "浊辅音和清辅音", ru: "Звонкие и глухие согласные", uz: "Jarangli va jarangsiz undoşlar", en: "Voiced and voiceless consonants" },
      description: { zh: "б·п、в·ф、д·т、з·с、г·к", ru: "б·п, в·ф, д·т, з·с, г·к", uz: "б·п, в·ф, д·т, з·с, г·к", en: "б·п, в·ф, д·т, з·с, г·к" },
      theory: {
        zh: "俄语辅音很多成对出现：声带振动的浊辅音和不振动的清辅音：б — п，в — ф，д — т，з — с，г — к。\n熊猫 Paxta 的小贴士：汉语拼音 b、d、g 其实是不送气的清音，所以它们更接近俄语的 п、т、к！发 б、д、г 时一定要让声带振动——摸着喉咙能感到震动。\n[в] / [ф] — 上齿轻触下唇，气流摩擦成音；[в] 带声，[ф] 不带声。\n[з] / [с] — 舌尖靠近上齿背，气流摩擦；[з] 带声，[с] 不带声，[с] 接近拼音 s。\n词末的浊辅音要读成对应的清辅音：зуб [зуп] 牙齿。\n新词：вот 这就是 · дом 房子 · суп 汤 · сок 果汁 · зонт 雨伞 · банк 银行",
        ru: "Многие согласные образуют пары: звонкий (с голосом) — глухой (без голоса): б — п, в — ф, д — т, з — с, г — к.\nСовет: китайские b, d, g — глухие без придыхания, поэтому они ближе к русским п, т, к! Произнося б, д, г, обязательно включайте голос — гортань должна дрожать.\n[в] / [ф] — верхние зубы касаются нижней губы; [в] звонкий, [ф] глухой.\n[з] / [с] — кончик языка у верхних зубов; [з] звонкий, [с] глухой.\nНа конце слова звонкий согласный оглушается: зуб [зуп].\nНовые слова: вот, дом, суп, сок, зонт, банк.",
        uz: "Köp undoşlar juft: jarangli — jarangsiz: б — п, в — ф, д — т, з — с, г — к.\nMaslahat: xitoyça b, d, g aslida jarangsiz, şuning uçun ular ruscha п, т, к ga yaqin! б, д, г ni aytganda ovoz bölsin.\nSöz oxirida jarangli undoş jarangsizlaşadi: зуб [зуп] tiş.\nYangi sözlar: вот mana · дом uy · суп şörva · сок şarbat · зонт soyabon · банк bank",
        en: "Many consonants come in pairs: voiced — voiceless: б — п, в — ф, д — т, з — с, г — к.\nTip: pinyin b, d, g are actually voiceless and unaspirated, so they are closer to Russian п, т, к! For б, д, г switch your voice on — you should feel your throat vibrate.\n[в] / [ф] — upper teeth on the lower lip; [в] voiced, [ф] voiceless.\n[з] / [с] — tongue tip near the upper teeth; [з] voiced, [с] voiceless.\nAt the end of a word a voiced consonant becomes voiceless: зуб [зуп] tooth.\nNew words: вот here is · дом house · суп soup · сок juice · зонт umbrella · банк bank",
      },
      exercises: [
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把浊辅音和对应的清辅音配对", ru: "Соедините звонкий и глухой согласный", uz: "Jarangli va jarangsiz juftini toping" },
          explanation: { zh: "б—п，в—ф，д—т，з—с。", ru: "б—п, в—ф, д—т, з—с.", uz: "б—п, в—ф, д—т, з—с." },
          pairs: [{ left: "б", right: "п" }, { left: "в", right: "ф" }, { left: "д", right: "т" }, { left: "з", right: "с" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "汉语拼音 b 更接近俄语的……", ru: "Китайское b ближе к русскому…", uz: "Xitoyça b ruscha qaysi tovuşga yaqinroq?" },
          explanation: { zh: "拼音 b 不送气、声带不振动，所以更接近俄语的 [п]。俄语 [б] 必须带声。", ru: "Китайское b — глухое, поэтому ближе к [п].", uz: "Xitoyça b jarangsiz, şuning uçun [п] ga yaqin." },
          options: [{ text: same("п"), correct: true }, { text: same("б") }, { text: same("ф") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "б", speak: "ба", instruction: I.choose,
          question: { zh: "发 [б] 时，声带……", ru: "При [б] голосовые связки…", uz: "[б] da ovoz paylari …" },
          explanation: { zh: "[б] 是浊辅音，声带振动。", ru: "[б] звонкий — связки дрожат.", uz: "[б] jarangli — titraydi." },
          options: [
            { text: { zh: "振动", ru: "дрожат", uz: "titraydi" }, correct: true },
            { text: { zh: "不振动", ru: "не дрожат", uz: "titramaydi" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "дом", speak: "дом", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "дом — 房子。", ru: "дом — дом.", uz: "дом — uy." },
          options: [meaning("房子", "uy", "🏠", true), meaning("汤", "şörva", "🍲"), meaning("银行", "bank", "🏦")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "суп", speak: "суп", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "суп — 汤。", ru: "суп — суп.", uz: "суп — şörva." },
          options: [meaning("汤", "şörva", "🍲", true), meaning("果汁", "şarbat", "🧃"), meaning("雨伞", "soyabon", "☂️")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "зонт", speak: "зонт", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu söz nimani anglatadi?" },
          explanation: { zh: "зонт — 雨伞。", ru: "зонт — зонт.", uz: "зонт — soyabon." },
          options: [meaning("雨伞", "soyabon", "☂️", true), meaning("房子", "uy", "🏠"), meaning("猫", "müşuk", "🐱")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "зуб", speak: "зуб", instruction: I.choose,
          question: { zh: "词末的 б 读作……", ru: "Как звучит б на конце слова?", uz: "Söz oxiridagi б qanday aytiladi?" },
          explanation: { zh: "词末浊辅音清化：зуб 读作 [зуп]。", ru: "Оглушение: зуб [зуп].", uz: "Jarangsizlaşadi: зуб [зуп]." },
          options: [{ text: same("[п]"), correct: true }, { text: same("[б]") }, { text: same("[м]") }],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слова с переводом", uz: "Sözni maʼnosi bilan moslang" },
          explanation: { zh: "сок 果汁 · банк 银行 · вот 这就是 · дом 房子。", ru: "сок, банк, вот, дом.", uz: "сок şarbat · банк bank · вот mana · дом uy." },
          pairs: [{ left: "сок", right: "果汁" }, { left: "банк", right: "银行" }, { left: "вот", right: "这就是" }, { left: "дом", right: "房子" }],
        },
      ],
    },
    // ── Lesson 5 ─────────────────────────────────────────────── Кто это? Что это?
    {
      type: "CONVERSATION", xpReward: 25, estimatedMinutes: 5,
      title: { zh: "Кто э́то? Что э́то?", ru: "Кто это? Что это?", uz: "Кто это? Что это?", en: "Кто это? Что это?" },
      description: { zh: "问人用 кто，问东西用 что", ru: "Кто — о людях и животных, что — о вещах", uz: "кто — odam, что — narsa", en: "кто for people, что for things" },
      theory: {
        zh: "问人和动物用 кто（谁），问东西用 что（什么）：\n— Кто э́то? — Э́то ма́ма. / — Кто э́то? — Э́то кот.（俄语里动物也用 кто！）\n— Что э́то? — Э́то дом. / — Что э́то? — Э́то суп.\n注意：что 读作 [што]。\nвот 这就是（指着东西给人看）：Вот дом. Вот банк.\n回答一般疑问句：— Э́то суп? — Нет, э́то сок.",
        ru: "О людях и животных спрашивают кто, о вещах — что:\n— Кто э́то? — Э́то ма́ма. / — Кто э́то? — Э́то кот.\n— Что э́то? — Э́то дом. / — Что э́то? — Э́то суп.\nЧто произносится [што].\nВот — указание: Вот дом. Вот банк.\n— Э́то суп? — Нет, э́то сок.",
        uz: "Odam va hayvon haqida кто (kim), narsa haqida что (nima) deb söraladi:\n— Кто э́то? — Э́то кот. (rus tilida hayvon uçun ham кто!)\n— Что э́то? — Э́то дом.\nчто [што] deb öqiladi.\nвот — mana: Вот дом.",
        en: "Ask about people and animals with кто (who), about things with что (what):\n— Кто э́то? — Э́то ма́ма. / — Кто э́то? — Э́то кот. (animals take кто too!)\n— Что э́то? — Э́то дом. / — Что э́то? — Э́то суп.\nчто is pronounced [што].\nвот — here is: Вот дом. Вот банк.\n— Э́то суп? — Нет, э́то сок.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "问人用……", ru: "О человеке спрашивают…", uz: "Odam haqida qaysi söz bilan söraladi?" },
          explanation: { zh: "问人用 кто，问东西用 что。", ru: "кто — о человеке, что — о вещи.", uz: "кто — odam, что — narsa." },
          options: [{ text: same("кто"), correct: true }, { text: same("что") }, { text: same("как") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "问“这是什么？”应该说：", ru: "Как спросить о вещи?", uz: "Narsa haqida qanday söraladi?" },
          explanation: { zh: "Что э́то? — 这是什么？", ru: "Что э́то?", uz: "Что э́то? — Bu nima?" },
          options: [{ text: same("Что э́то?"), correct: true }, { text: same("Кто э́то?") }, { text: same("Как э́то?") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "кот", speak: "кот", instruction: I.choose,
          question: { zh: "指着猫问“这是谁？”，用……", ru: "Спрашиваем о коте:", uz: "Müşuk haqida söraymiz:" },
          explanation: { zh: "俄语里动物也用 кто：Кто э́то? — Э́то кот.", ru: "О животных — кто.", uz: "Hayvon uçun ham кто." },
          options: [{ text: same("Кто э́то?"), correct: true }, { text: same("Что э́то?") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "что", speak: "что", instruction: I.choose,
          question: { zh: "что 怎么读？", ru: "Как произносится что?", uz: "что qanday öqiladi?" },
          explanation: { zh: "что 读作 [што]。", ru: "[што].", uz: "[што]." },
          options: [{ text: same("[што]"), correct: true }, { text: same("[что]") }, { text: same("[шо]") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "这是什么？", ru: "Составьте: «Что это?»", uz: "«Bu nima?» gapini tuzing" },
          explanation: { zh: "Что э́то?", ru: "Что э́то?", uz: "Что э́то?" },
          words: ["Кто", "э́то?", "Что", "вот"], correctWords: ["Что", "э́то?"],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "回答：这是汤。", ru: "Ответьте: «Это суп.»", uz: "Javob bering: «Bu — şörva.»" },
          explanation: { zh: "Э́то суп.", ru: "Э́то суп.", uz: "Э́то суп." },
          words: ["сок", "суп.", "кто", "Э́то"], correctWords: ["Э́то", "суп."],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Кто э́то?", speak: "Кто э́то?", instruction: I.choose,
          question: { zh: "哪个回答是对的？", ru: "Какой ответ подходит?", uz: "Qaysi javob töğri?" },
          explanation: { zh: "问 кто 要回答人或动物：Э́то Ни́на.", ru: "На кто отвечаем о человеке: Э́то Ни́на.", uz: "кто ga odam haqida javob: Э́то Ни́на." },
          options: [{ text: same("Э́то Ни́на."), correct: true }, { text: same("Э́то дом.") }, { text: same("Э́то суп.") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Вот банк.", speak: "Вот банк.", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu gap nimani anglatadi?" },
          explanation: { zh: "Вот банк. — 这就是银行。", ru: "Указание на банк.", uz: "Mana bank." },
          options: [meaning("这就是银行。", "Mana bank.", "🏦", true), meaning("这是谁？", "Bu kim?", "❓"), meaning("银行在那里。", "Bank u yerda.", "👉")],
        },
      ],
    },
    // ── Lesson 6 ─────────────────────────────────────────────── Привет! Как дела?
    {
      type: "CONVERSATION", xpReward: 25, estimatedMinutes: 5,
      title: { zh: "Приве́т! Как дела́?", ru: "Привет! Как дела?", uz: "Привет! Как дела?", en: "Привет! Как дела?" },
      description: { zh: "朋友之间的问候；塔什干的俄语", ru: "Приветствия между друзьями; русский в Ташкенте", uz: "Döstlar orasida salomlaşiş; Toşkentda rus tili", en: "Greetings between friends; Russian in Tashkent" },
      theory: {
        zh: "见到朋友说 Приве́т!（你好！），比 Здра́вствуйте! 随便；对老师和陌生人还是说 Здра́вствуйте!\n分别时对朋友说 Пока́!（再见！回头见！）\n— Как дела́? 你好吗？（事情怎么样？）\n— Хорошо́, спаси́бо! А ты? 很好，谢谢！你呢？\n— То́же хорошо́. 也很好。\nхорошо́ 里只有重音上的最后一个 о 读得清楚，前两个 о 都弱化。р 是颤音，后面会专门学。\n小龙 Olov：在乌兹别克斯坦，特别是塔什干，俄语用得很广：商店、银行、出租车和很多学校里都能听到俄语。学会俄语，在当地生活会方便很多！",
        ru: "Друзьям говорят Приве́т! — это проще, чем Здра́вствуйте! Преподавателю и незнакомым — Здра́вствуйте!\nДрузьям при прощании — Пока́!\n— Как дела́?\n— Хорошо́, спаси́бо! А ты?\n— То́же хорошо́.\nВ слове хорошо́ чётко звучит только последнее, ударное о. Звук р (дрожащий) изучим позже.\nДракончик Olov: в Узбекистане, особенно в Ташкенте, русский язык слышен везде — в магазинах, банках, такси и многих школах.",
        uz: "Döstlarga Приве́т! deyiladi, öqituvçi va notaniş odamga — Здра́вствуйте!\nXayrlaşganda döstga — Пока́!\n— Как дела́? Işlar qanday?\n— Хорошо́, спаси́бо! А ты? Yaxşi, rahmat! Sen-çi?\n— То́же хорошо́. Men ham yaxşi.\nAjdarça Olov: Özbekistonda, ayniqsa Toşkentda rus tili keng qöllaniladi: dökon, bank, taksi va köp maktablarda.",
        en: "Friends say Приве́т! — more casual than Здра́вствуйте!, which you keep for teachers and strangers.\nTo friends at parting — Пока́! (bye, see you)\n— Как дела́? How are you?\n— Хорошо́, спаси́бо! А ты? Fine, thanks! And you?\n— То́же хорошо́. Fine too.\nIn хорошо́ only the last, stressed о is clear. The rolled р comes later.\nOlov the little dragon: in Uzbekistan, especially in Tashkent, Russian is everywhere — shops, banks, taxis and many schools.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Приве́т!", speak: "Приве́т!", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu ibora nimani anglatadi?" },
          explanation: { zh: "Приве́т! — 你好！（对朋友）", ru: "Приветствие для друзей.", uz: "Salom! (döstga)" },
          options: [meaning("你好！（对朋友）", "Salom! (döstga)", "👋", true), meaning("再见！", "Xayr!", "🚶"), meaning("谢谢！", "Rahmat!", "🙏")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Пока́!", speak: "Пока́!", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu ibora nimani anglatadi?" },
          explanation: { zh: "Пока́! — 再见！回头见！（对朋友）", ru: "Прощание с друзьями.", uz: "Xayr! (döstga)" },
          options: [meaning("再见！（对朋友）", "Xayr! (döstga)", "🚶", true), meaning("你好！", "Salom!", "👋"), meaning("很好。", "Yaxşi.", "👍")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "见到老师，应该说：", ru: "Вы встретили преподавателя. Что сказать?", uz: "Öqituvçini kördingiz. Nima deysiz?" },
          explanation: { zh: "对老师和陌生人说 Здра́вствуйте!，Приве́т! 只对朋友。", ru: "Преподавателю — Здра́вствуйте!", uz: "Öqituvçiga — Здра́вствуйте!" },
          options: [{ text: same("Здра́вствуйте!"), correct: true }, { text: same("Приве́т!") }, { text: same("Пока́!") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Как дела́?", speak: "Как дела́?", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит фраза?", uz: "Bu ibora nimani anglatadi?" },
          explanation: { zh: "Как дела́? — 你好吗？（事情怎么样？）", ru: "Вопрос о делах.", uz: "Işlar qanday?" },
          options: [meaning("你好吗？", "Işlar qanday?", "🙂", true), meaning("这是谁？", "Bu kim?", "❓"), meaning("你呢？", "Sen-çi?", "👉")],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", instruction: I.build,
          question: { zh: "很好，谢谢！", ru: "Составьте: «Хорошо, спасибо!»", uz: "«Yaxşi, rahmat!» gapini tuzing" },
          explanation: { zh: "Хорошо́, спаси́бо!", ru: "Хорошо́, спаси́бо!", uz: "Хорошо́, спаси́бо!" },
          words: ["пока́", "спаси́бо!", "как", "Хорошо́,"], correctWords: ["Хорошо́,", "спаси́бо!"],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "хорошо́", speak: "хорошо́", instruction: I.choose,
          question: { zh: "хорошо́ 里哪个 о 读得最清楚？", ru: "Какое о в слове хорошо́ звучит чётко?", uz: "хорошо́ dagi qaysi о aniq eşitiladi?" },
          explanation: { zh: "只有重音上的最后一个 о 读得清楚，前两个弱化。", ru: "Только последнее, ударное.", uz: "Faqat oxirgi, urğuli о." },
          options: [
            { text: { zh: "最后一个（重音）", ru: "последнее (ударное)", uz: "oxirgisi (urğuli)" }, correct: true },
            { text: { zh: "第一个", ru: "первое", uz: "birinçisi" } },
            { text: { zh: "第二个", ru: "второе", uz: "ikkinçisi" } },
          ],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把俄语和中文配对", ru: "Соедините русские фразы с китайскими", uz: "Rusça va xitoyça iboralarni moslang" },
          explanation: { zh: "Приве́т! 你好！· Пока́! 再见！· Спаси́бо! 谢谢！· А ты? 你呢？", ru: "Приве́т!, Пока́!, Спаси́бо!, А ты?", uz: "Salom! · Xayr! · Rahmat! · Sen-çi?" },
          pairs: [{ left: "Приве́т!", right: "你好！" }, { left: "Пока́!", right: "再见！" }, { left: "Спаси́бо!", right: "谢谢！" }, { left: "А ты?", right: "你呢？" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
          question: { zh: "在塔什干，俄语……", ru: "В Ташкенте русский язык…", uz: "Toşkentda rus tili …" },
          explanation: { zh: "在塔什干，商店、银行、出租车和很多学校里都用俄语。", ru: "Его слышно в магазинах, банках, такси и многих школах.", uz: "Dökon, bank, taksi va maktablarda qöllaniladi." },
          options: [
            { text: { zh: "在商店、银行等地方广泛使用", ru: "широко используется", uz: "keng qöllaniladi" }, correct: true },
            { text: { zh: "几乎没人说", ru: "почти не звучит", uz: "deyarli gapirilmaydi" } },
            { text: { zh: "只在大学里用", ru: "только в университетах", uz: "faqat universitetda" } },
          ],
        },
      ],
    },
  ],
};
