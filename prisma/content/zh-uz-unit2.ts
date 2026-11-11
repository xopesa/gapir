// Unit 2 of the zh→uz course.
// Source: 乌兹别克语教程(1), 3-dars: consonants G, K, M, N; open and closed
// syllables; vowel harmony; "Bu nima? / Bu kim? / Mana bu …"; 21 new words;
// "Salom, yaxshimisiz?"; geography of Uzbekistan.
import { I, same, word, type ModuleContent } from "./common";

export const unit2: ModuleContent = {
  title: { zh: "第二单元 · Bu nima? Bu kim?", ru: "Юнит 2 · Bu nima? Bu kim?", uz: "2-boʻlim · Bu nima? Bu kim?", en: "Unit 2 · Bu nima? Bu kim?" },
  description: { zh: "G、K、M、N，音节与元音和谐，问“这是什么／谁”", ru: "G, K, M, N, слоги и гармония гласных, вопросы «что это / кто это»", uz: "G, K, M, N, boʻgʻinlar va unlilar uygʻunligi, «bu nima / bu kim»", en: "G, K, M, N, syllables and vowel harmony, asking “what / who is this”" },
  lessons: [
    // ── Lesson 1 ─────────────────────────────────────────────── 3-dars 3.1 (G, K)
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 4,
      title: { zh: "辅音 G · K", ru: "Согласные G · K", uz: "G · K undoshlari", en: "Consonants G · K" },
      description: { zh: "舌根塞音：一个浊，一个清", ru: "Заднеязычные: звонкий и глухой", uz: "Til orqa undoshlari: jarangli va jarangsiz", en: "Back stops: one voiced, one voiceless" },
      theory: {
        zh: "G g — 舌根浊塞音：整个舌头向后缩，舌后部抬起紧贴软腭，声带振动：gul, gap, goʻzal, dialog。\nK k — 舌根清塞音：发音部位和 G 一样，但声带不振动：kitob, kim, aka, katta。\nG 和 K 在词首、词中、词尾都可以出现。\n熊猫 Paxta 的小贴士：a 和 k、g 在一起时发音向舌前倾斜、较弱，接近英语 cat 中的 a：aka, katta。",
        ru: "G g — заднеязычный звонкий: язык оттянут назад, задняя часть прижата к мягкому нёбу, связки работают: gul, gap, goʻzal, dialog.\nK k — заднеязычный глухой: то же место, но без голоса: kitob, kim, aka, katta.\nG и K встречаются в начале, середине и конце слова.\nПодсказка панды Paxta: рядом с k и g звук a смещается вперёд и звучит слабее — почти как a в английском cat: aka, katta.",
        uz: "G g — til orqa, jarangli portlovchi undosh: gul, gap, goʻzal, dialog.\nK k — til orqa, jarangsiz portlovchi undosh: kitob, kim, aka, katta.\nG va K soʻz boshida, oʻrtasida va oxirida keladi.\nk va g yonida a old qatorga suriladi: aka, katta.",
        en: "G g — voiced back stop: the back of the tongue presses the soft palate, the voice is on: gul, gap, goʻzal, dialog.\nK k — voiceless back stop: same place, no voice: kitob, kim, aka, katta.\nBoth can start, sit inside or end a word.\nPaxta's tip: next to k and g, a moves forward and sounds lighter — close to the a in English cat: aka, katta.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "发 G 和 K 时，阻碍在哪里形成？", ru: "Где образуется преграда при G и K?", uz: "G va K aytilganda toʻsiq qayerda hosil boʻladi?" },
          explanation: { zh: "舌后部抬起紧贴软腭：G、K 都是舌根音。", ru: "Задняя часть языка прижимается к мягкому нёбу.", uz: "Til orqasi yumshoq tanglayga tegadi." },
          options: [
            { text: { zh: "舌后部贴住软腭", ru: "задняя часть языка у мягкого нёба", uz: "til orqasi yumshoq tanglayda" }, correct: true },
            { text: { zh: "双唇紧闭", ru: "сомкнутые губы", uz: "lablar yumiq" } },
            { text: { zh: "舌前部抵上齿背", ru: "кончик языка у верхних зубов", uz: "til oldi yuqori tishlarda" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "G 和 K，哪个是清辅音（声带不振动）？", ru: "Какой из звуков глухой — G или K?", uz: "G va K dan qaysi biri jarangsiz?" },
          explanation: { zh: "K 是清辅音，G 是浊辅音。", ru: "K глухой, G звонкий.", uz: "K jarangsiz, G jarangli." },
          options: [{ text: same("K"), correct: true }, { text: same("G") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "gul", speak: "gul", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "gul — 花。", ru: "gul — цветок.", uz: "gul — gul." },
          options: [word("花", "цветок", "🌸", true), word("书", "книга", "📖"), word("人", "человек", "🧍")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "kitob", speak: "kitob", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "kitob — 书。", ru: "kitob — книга.", uz: "kitob — kitob." },
          options: [word("学校", "школа", "🏫"), word("书", "книга", "📖", true), word("花", "цветок", "🌸")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "katta", speak: "katta", instruction: I.choose,
          question: { zh: "在 katta、aka 中，a 的发音接近……", ru: "В словах katta, aka звук a похож на…", uz: "katta, aka soʻzlarida a qanday eshitiladi?" },
          explanation: { zh: "a 与 k、g 一起发音时向舌前倾斜，接近英语 cat 中的 a。", ru: "Рядом с k и g a звучит как в английском cat.", uz: "k va g yonida a inglizcha cat dagi a ga yaqin." },
          options: [
            { text: { zh: "英语 cat 中的 a", ru: "a в английском cat", uz: "inglizcha cat dagi a" }, correct: true },
            { text: { zh: "英语 arm 中的 a", ru: "a в английском arm", uz: "inglizcha arm dagi a" } },
            { text: { zh: "汉语的 o", ru: "китайское o", uz: "xitoycha o" } },
          ],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Soʻzni maʼnosi bilan moslang" },
          explanation: { zh: "gul 花，gap 话，kim 谁，katta 大的。", ru: "gul цветок, gap речь, kim кто, katta большой.", uz: "gul, gap, kim, katta." },
          pairs: [{ left: "gul", right: "花" }, { left: "gap", right: "话，言" }, { left: "kim", right: "谁" }, { left: "katta", right: "大的" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "kim", speak: "kim", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "kim — 谁。问人用 kim。", ru: "kim — кто. О людях спрашивают kim.", uz: "kim — odam haqida soʻroq." },
          options: [word("谁", "кто", undefined, true), word("什么", "что"), word("我", "я")],
        },
        {
          type: "TRANSLATE", mascot: "tiger", instruction: I.type,
          question: { zh: "书", ru: "книга", uz: "«Kitob» soʻzini yozing" },
          explanation: { zh: "书 — kitob。", ru: "Книга — kitob.", uz: "kitob." },
          acceptedAnswers: ["kitob"],
        },
      ],
    },
    // ── Lesson 2 ─────────────────────────────────────────────── 3-dars 3.1 (M, N)
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 4,
      title: { zh: "辅音 M · N", ru: "Согласные M · N", uz: "M · N undoshlari", en: "Consonants M · N" },
      description: { zh: "两个鼻音", ru: "Два носовых звука", uz: "Ikki burun undoshi", en: "Two nasal sounds" },
      theory: {
        zh: "M m — 双唇浊鼻音：双唇紧闭，声带振动，气流通过鼻腔：maktab, mana, men, osmon, tamom。\nN n — 舌前浊鼻音：舌前部抬起紧贴上齿背和上齿龈，气流通过鼻腔：non, nima, ona, unum, vatan。\n小贴士：元音 i 在 n、l、m、r、z 前发音极短促，并向后元音倾斜：nima, kim, Pekin。",
        ru: "M m — губно-губной носовой: губы сомкнуты, воздух идёт через нос: maktab, mana, men, osmon, tamom.\nN n — переднеязычный носовой: язык прижат к верхним зубам и дёснам: non, nima, ona, unum, vatan.\nПодсказка: перед n, l, m, r, z гласный i очень короткий и звучит глубже: nima, kim, Pekin.",
        uz: "M m — lab-lab, burun undoshi: maktab, mana, men, osmon, tamom.\nN n — til oldi, burun undoshi: non, nima, ona, unum, vatan.\nn, l, m, r, z oldida i juda qisqa talaffuz qilinadi: nima, kim, Pekin.",
        en: "M m — bilabial nasal: lips closed, air goes through the nose: maktab, mana, men, osmon, tamom.\nN n — front nasal: tongue against the upper teeth and gums: non, nima, ona, unum, vatan.\nTip: before n, l, m, r, z the vowel i is very short and sounds further back: nima, kim, Pekin.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "M 和 N 都是……", ru: "M и N — это…", uz: "M va N — …" },
          explanation: { zh: "M、N 都是浊鼻音：发音时气流通过鼻腔。", ru: "Оба — звонкие носовые: воздух проходит через нос.", uz: "Ikkalasi ham burun undoshi." },
          options: [
            { text: { zh: "鼻音（气流通过鼻腔）", ru: "носовые звуки", uz: "burun undoshlari" }, correct: true },
            { text: { zh: "清塞音", ru: "глухие смычные", uz: "jarangsiz portlovchilar" } },
            { text: { zh: "元音", ru: "гласные", uz: "unlilar" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "m", speak: "ma", instruction: I.choose,
          question: { zh: "发 M 时……", ru: "При звуке M…", uz: "M aytilganda…" },
          explanation: { zh: "M 是双唇鼻音：双唇紧闭形成阻碍。", ru: "M — губно-губной: губы плотно сомкнуты.", uz: "M — lab-lab undosh: lablar yumiladi." },
          options: [
            { text: { zh: "双唇紧闭", ru: "губы сомкнуты", uz: "lablar yumiq" }, correct: true },
            { text: { zh: "舌前部贴上齿背", ru: "язык у верхних зубов", uz: "til oldi yuqori tishlarda" } },
            { text: { zh: "舌后部贴软腭", ru: "задняя часть языка у нёба", uz: "til orqasi tanglayda" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "non", speak: "non", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "non — 馕，乌兹别克人每天都吃的圆面包。", ru: "non — лепёшка, узбекский хлеб.", uz: "non — non." },
          options: [word("馕", "лепёшка", "🫓", true), word("梨", "груша", "🍐"), word("西红柿", "помидор", "🍅")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "nima", speak: "nima", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "nima — 什么。问东西用 nima。", ru: "nima — что. О предметах спрашивают nima.", uz: "nima — narsa haqida soʻroq." },
          options: [word("谁", "кто"), word("什么", "что", undefined, true), word("这是", "это")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "men", speak: "men", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "men — 我。", ru: "men — я.", uz: "men — men." },
          options: [word("我", "я", "🙋", true), word("母亲", "мама", "👩"), word("人", "человек", "🧍")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Soʻzni maʼnosi bilan moslang" },
          explanation: { zh: "maktab 学校，non 馕，ona 母亲，men 我。", ru: "maktab школа, non лепёшка, ona мама, men я.", uz: "maktab, non, ona, men." },
          pairs: [{ left: "maktab", right: "学校" }, { left: "non", right: "馕" }, { left: "ona", right: "母亲" }, { left: "men", right: "我" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "nima", speak: "nima", instruction: I.choose,
          question: { zh: "在 nima 中，n 后面的 i 发音……", ru: "Как звучит i после n в слове nima?", uz: "nima soʻzida i qanday talaffuz qilinadi?" },
          explanation: { zh: "i 在 n、l、m、r、z 前发音极短促，并向后元音倾斜。", ru: "Перед n, l, m, r, z i очень короткий.", uz: "n, l, m, r, z oldida i juda qisqa." },
          options: [
            { text: { zh: "极短促", ru: "очень коротко", uz: "juda qisqa" }, correct: true },
            { text: { zh: "拉得很长", ru: "протяжно", uz: "choʻzib" } },
            { text: { zh: "完全不发音", ru: "не произносится", uz: "aytilmaydi" } },
          ],
        },
        {
          type: "TRANSLATE", mascot: "tiger", instruction: I.type,
          question: { zh: "我", ru: "я", uz: "«Men» soʻzini yozing" },
          explanation: { zh: "我 — men。", ru: "Я — men.", uz: "men." },
          acceptedAnswers: ["men"],
        },
      ],
    },
    // ── Lesson 3 ─────────────────────────────────────────────── 3-dars 3.2–3.3
    {
      type: "GRAMMAR", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "开音节、闭音节与元音和谐", ru: "Открытые и закрытые слоги, гармония гласных", uz: "Ochiq va yopiq boʻgʻinlar, unlilar uygʻunligi", en: "Open and closed syllables, vowel harmony" },
      description: { zh: "音节怎么分类，元音怎么搭配", ru: "Какие бывают слоги и как сочетаются гласные", uz: "Boʻgʻin turlari va unlilar uygʻunligi", en: "Kinds of syllables and how vowels go together" },
      theory: {
        zh: "以元音结尾的音节叫开音节：o-na, do-i-ra, ma-li-ka。\n以辅音结尾的音节叫闭音节：mak-tab, daf-tar, Tosh-kent。\n元音和谐：词干中相邻的元音往往同是前元音或同是后元音（部位和谐）：maktab, kerak, bilan, uzoq, obroʻ, oʻquv。\n唇状和谐（同圆唇或同展唇）并不严谨，部位和谐才是基础：erta, tuproq。\n小龙 Olov：现代标准语里词干和词尾之间的元音和谐基本消失了，只在克普恰克和乌古斯方言里还有。",
        ru: "Слог, который кончается на гласный, — открытый: o-na, do-i-ra, ma-li-ka.\nСлог, который кончается на согласный, — закрытый: mak-tab, daf-tar, Tosh-kent.\nГармония гласных: соседние гласные в корне обычно все передние или все задние: maktab, kerak, bilan, uzoq, obroʻ, oʻquv.\nГармония по губам (округлые/растянутые) нестрогая, основа — гармония по ряду: erta, tuproq.\nДракончик Olov: между корнем и окончанием в литературном языке гармония почти исчезла — она осталась в кыпчакских и огузских говорах.",
        uz: "Unli bilan tugagan boʻgʻin — ochiq boʻgʻin: o-na, do-i-ra, ma-li-ka.\nUndosh bilan tugagan boʻgʻin — yopiq boʻgʻin: mak-tab, daf-tar, Tosh-kent.\nUnlilar uygʻunligi: oʻzakdagi qoʻshni unlilar koʻpincha bir qatorda boʻladi: maktab, kerak, bilan, uzoq, obroʻ, oʻquv.\nLab uygʻunligi qatʼiy emas: erta, tuproq.",
        en: "A syllable ending in a vowel is open: o-na, do-i-ra, ma-li-ka.\nA syllable ending in a consonant is closed: mak-tab, daf-tar, Tosh-kent.\nVowel harmony: neighbouring vowels in a stem are usually all front or all back: maktab, kerak, bilan, uzoq, obroʻ, oʻquv.\nLip harmony (rounded/unrounded) is loose; front/back harmony is the basis: erta, tuproq.\nOlov the dragon: in the modern standard language harmony between stem and ending has mostly gone; it survives in Kipchak and Oghuz dialects.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", instruction: I.choose,
          question: { zh: "以元音结尾的音节叫……", ru: "Слог, который кончается на гласный, называется…", uz: "Unli bilan tugagan boʻgʻin …" },
          explanation: { zh: "开音节以元音结尾；闭音节以辅音结尾。", ru: "Открытый — на гласный, закрытый — на согласный.", uz: "Ochiq — unli bilan, yopiq — undosh bilan tugaydi." },
          options: [
            { text: { zh: "开音节", ru: "открытым", uz: "ochiq boʻgʻin" }, correct: true },
            { text: { zh: "闭音节", ru: "закрытым", uz: "yopiq boʻgʻin" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "mak-tab", speak: "maktab", instruction: I.choose,
          question: { zh: "这两个音节都是……", ru: "Оба слога здесь…", uz: "Ikkala boʻgʻin ham …" },
          explanation: { zh: "mak 和 tab 都以辅音结尾，都是闭音节。", ru: "mak и tab кончаются на согласный — оба закрытые.", uz: "mak va tab undosh bilan tugaydi — yopiq." },
          options: [
            { text: { zh: "闭音节", ru: "закрытые", uz: "yopiq" }, correct: true },
            { text: { zh: "开音节", ru: "открытые", uz: "ochiq" } },
            { text: { zh: "一开一闭", ru: "один открытый, один закрытый", uz: "biri ochiq, biri yopiq" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "o-na", speak: "ona", instruction: I.choose,
          question: { zh: "ona 的两个音节是……", ru: "Какие слоги в слове ona?", uz: "ona soʻzidagi boʻgʻinlar qanday?" },
          explanation: { zh: "o 和 na 都以元音结尾，都是开音节。", ru: "o и na кончаются на гласный — оба открытые.", uz: "o va na — ochiq boʻgʻinlar." },
          options: [
            { text: { zh: "都是开音节", ru: "оба открытые", uz: "ikkalasi ham ochiq" }, correct: true },
            { text: { zh: "都是闭音节", ru: "оба закрытые", uz: "ikkalasi ham yopiq" } },
            { text: { zh: "一开一闭", ru: "один открытый, один закрытый", uz: "biri ochiq, biri yopiq" } },
          ],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和音节划分配对", ru: "Соедините слово и его слоги", uz: "Soʻzni boʻgʻinlari bilan moslang" },
          explanation: { zh: "o-na, mak-tab, do-i-ra, Tosh-kent。", ru: "o-na, mak-tab, do-i-ra, Tosh-kent.", uz: "o-na, mak-tab, do-i-ra, Tosh-kent." },
          pairs: [{ left: "ona", right: "o-na" }, { left: "maktab", right: "mak-tab" }, { left: "doira", right: "do-i-ra" }, { left: "Toshkent", right: "Tosh-kent" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
          question: { zh: "元音和谐是指词干中相邻的元音往往……", ru: "Гармония гласных — это когда соседние гласные корня…", uz: "Unlilar uygʻunligi — oʻzakdagi qoʻshni unlilar …" },
          explanation: { zh: "同是前元音或同是后元音（部位和谐）。", ru: "Обычно все передние или все задние.", uz: "Bir xil qatorda boʻladi." },
          options: [
            { text: { zh: "同是前元音或同是后元音", ru: "все передние или все задние", uz: "hammasi old yoki orqa qatorda" }, correct: true },
            { text: { zh: "一个前元音，一个后元音", ru: "один передний, другой задний", uz: "biri old, biri orqa qatorda" } },
            { text: { zh: "都必须是 a", ru: "все только a", uz: "hammasi faqat a" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
          question: { zh: "哪个词的元音都是后元音？", ru: "В каком слове все гласные задние?", uz: "Qaysi soʻzda hamma unlilar orqa qatorda?" },
          explanation: { zh: "uzoq：u 和 o 都是后元音。kerak、bilan 是前元音。", ru: "uzoq: u и o задние; kerak и bilan — передние.", uz: "uzoq: u va o orqa qator unlilari." },
          options: [{ text: same("uzoq"), correct: true }, { text: same("kerak") }, { text: same("bilan") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
          question: { zh: "哪个词的元音都是前元音？", ru: "В каком слове все гласные передние?", uz: "Qaysi soʻzda hamma unlilar old qatorda?" },
          explanation: { zh: "kerak：e 和 a 都是前元音。", ru: "kerak: e и a передние.", uz: "kerak: e va a old qator unlilari." },
          options: [{ text: same("kerak"), correct: true }, { text: same("uzoq") }, { text: same("oʻquv") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "non", speak: "non", instruction: I.choose,
          question: { zh: "non 有几个音节？是开音节还是闭音节？", ru: "Сколько слогов в non и какой он?", uz: "non soʻzida nechta boʻgʻin, qanday?" },
          explanation: { zh: "一个元音，一个音节；以 n 结尾，是闭音节。", ru: "Одна гласная — один слог; кончается на n — закрытый.", uz: "Bitta boʻgʻin, yopiq." },
          options: [
            { text: { zh: "1 个闭音节", ru: "1 закрытый слог", uz: "1 ta yopiq boʻgʻin" }, correct: true },
            { text: { zh: "1 个开音节", ru: "1 открытый слог", uz: "1 ta ochiq boʻgʻin" } },
            { text: { zh: "2 个音节", ru: "2 слога", uz: "2 ta boʻgʻin" } },
          ],
        },
      ],
    },
    // ── Lesson 4 ─────────────────────────────────────────────── 3-dars 3.4–3.5 (things)
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "Bu nima? 这是什么？", ru: "Bu nima? Что это?", uz: "Bu nima?", en: "Bu nima? What is this?" },
      description: { zh: "书、馕、饭菜、学校、商店……", ru: "Книга, лепёшка, еда, школа, магазин…", uz: "Kitob, non, taom, maktab, doʻkon…", en: "Book, bread, food, school, shop…" },
      theory: {
        zh: "— Bu nima? 这是什么？\n— Bu kitob. 这是书。 — Bu taom. 这是饭菜。 — Bu maktab. 这是学校。\nMana bu … 这就是……：— Bu nima? — Mana bu papka.\n新词：kitob 书 · non 馕 · taom 饭菜 · maktab 学校 · nok 梨 · pomidor 西红柿 · gamburger 汉堡包 · doʻkon 商店 · bank 银行 · matn 文章 · katta 大的 · band 繁忙的",
        ru: "— Bu nima? Что это?\n— Bu kitob. Это книга. — Bu taom. Это еда. — Bu maktab. Это школа.\nMana bu … — вот это …: — Bu nima? — Mana bu papka.\nСлова: kitob книга · non лепёшка · taom еда · maktab школа · nok груша · pomidor помидор · gamburger гамбургер · doʻkon магазин · bank банк · matn текст · katta большой · band занятой",
        uz: "— Bu nima?\n— Bu kitob. — Bu taom. — Bu maktab.\nMana bu …: — Bu nima? — Mana bu papka.\nSoʻzlar: kitob · non · taom · maktab · nok · pomidor · gamburger · doʻkon · bank · matn · katta · band",
        en: "— Bu nima? What is this?\n— Bu kitob. It's a book. — Bu taom. It's food. — Bu maktab. It's a school.\nMana bu … — here is …: — Bu nima? — Mana bu papka.\nWords: kitob book · non flatbread · taom food · maktab school · nok pear · pomidor tomato · gamburger hamburger · doʻkon shop · bank bank · matn text · katta big · band busy",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "taom", speak: "taom", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "taom — 饭菜。", ru: "taom — еда, блюдо.", uz: "taom — ovqat." },
          options: [word("饭菜", "еда", "🍲", true), word("学校", "школа", "🏫"), word("梨", "груша", "🍐")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "nok", speak: "nok", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "nok — 梨。", ru: "nok — груша.", uz: "nok — nok." },
          options: [word("西红柿", "помидор", "🍅"), word("梨", "груша", "🍐", true), word("馕", "лепёшка", "🫓")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "doʻkon", speak: "doʻkon", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "doʻkon — 商店。", ru: "doʻkon — магазин.", uz: "doʻkon — doʻkon." },
          options: [word("银行", "банк", "🏦"), word("学校", "школа", "🏫"), word("商店", "магазин", "🏪", true)],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Soʻzni maʼnosi bilan moslang" },
          explanation: { zh: "pomidor 西红柿，gamburger 汉堡包，bank 银行，maktab 学校。", ru: "pomidor помидор, gamburger гамбургер, bank банк, maktab школа.", uz: "pomidor, gamburger, bank, maktab." },
          pairs: [{ left: "pomidor", right: "西红柿" }, { left: "gamburger", right: "汉堡包" }, { left: "bank", right: "银行" }, { left: "maktab", right: "学校" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
          question: { zh: "问“这是什么？”应该说：", ru: "Как спросить «Что это?»", uz: "«Bu nima?» degan savolni tanlang" },
          explanation: { zh: "问东西用 nima：Bu nima?", ru: "О предметах — nima: Bu nima?", uz: "Narsa haqida — nima." },
          options: [{ text: same("Bu nima?"), correct: true }, { text: same("Bu kim?") }, { text: same("U kim?") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", prompt: "— Bu nima?", instruction: I.build,
          question: { zh: "回答：这是学校。", ru: "Ответьте: это школа.", uz: "Javob bering: bu — maktab." },
          explanation: { zh: "Bu maktab.", ru: "Bu maktab.", uz: "Bu maktab." },
          words: ["maktab", "kim", "Bu", "nima"], correctWords: ["Bu", "maktab"],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", prompt: "— Bu nima?", instruction: I.build,
          question: { zh: "回答：这就是文件夹。", ru: "Ответьте: вот это папка.", uz: "Javob bering: mana bu — papka." },
          explanation: { zh: "Mana bu papka. 这就是文件夹。", ru: "Mana bu papka. — Вот папка.", uz: "Mana bu papka." },
          words: ["bu", "papka", "Mana", "nima"], correctWords: ["Mana", "bu", "papka"],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "katta", speak: "katta", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "katta — 大的。band 是“繁忙的”。", ru: "katta — большой; band — занятой.", uz: "katta — katta." },
          options: [word("大的", "большой", undefined, true), word("繁忙的", "занятой"), word("文章", "текст")],
        },
        {
          type: "TRANSLATE", mascot: "tiger", prompt: "— Bu nima?", instruction: I.type,
          question: { zh: "回答：这是馕。", ru: "Ответьте: это лепёшка.", uz: "Javob bering: bu — non." },
          explanation: { zh: "Bu non.", ru: "Bu non.", uz: "Bu non." },
          acceptedAnswers: ["Bu non", "Mana bu non"],
        },
      ],
    },
    // ── Lesson 5 ─────────────────────────────────────────────── 3-dars 3.4–3.5 (people)
    {
      type: "VOCABULARY", xpReward: 20, estimatedMinutes: 5,
      title: { zh: "Bu kim? 这是谁？", ru: "Bu kim? Кто это?", uz: "Bu kim?", en: "Bu kim? Who is this?" },
      description: { zh: "哥哥、弟弟、母亲和 Mana bu men", ru: "Брат, мама и «Mana bu men»", uz: "aka, uka, ona va «Mana bu men»", en: "Brothers, mother and “Mana bu men”" },
      theory: {
        zh: "— Bu kim? 这是谁？\n— Bu ona. 这是母亲。 — Bu ota. 这是父亲。 — Bu Naim. 这是纳伊穆。\n— Mana bu men. 这就是我。\nmana 这是（近处） · ana 那是（远处）：Mana opa. Ana aka.\n新词：aka 哥哥 · uka 弟弟 · ona 母亲 · odam 人 · men 我 · Naim 纳伊穆（男性名） · Pekin 北京\n小老虎 Bars：问人用 kim，问东西用 nima！",
        ru: "— Bu kim? Кто это?\n— Bu ona. Это мама. — Bu ota. Это отец. — Bu Naim. Это Наим.\n— Mana bu men. Вот это я.\nmana — вот (близко) · ana — вон (далеко): Mana opa. Ana aka.\nСлова: aka старший брат · uka младший брат · ona мама · odam человек · men я · Naim Наим (мужское имя) · Pekin Пекин\nТигрёнок Bars: о людях — kim, о предметах — nima!",
        uz: "— Bu kim?\n— Bu ona. — Bu ota. — Bu Naim.\n— Mana bu men.\nmana — yaqin · ana — uzoq: Mana opa. Ana aka.\nSoʻzlar: aka · uka · ona · odam · men · Naim · Pekin\nOdam haqida — kim, narsa haqida — nima.",
        en: "— Bu kim? Who is this?\n— Bu ona. This is mother. — Bu ota. This is father. — Bu Naim. This is Naim.\n— Mana bu men. Here I am.\nmana — here (near) · ana — there (far): Mana opa. Ana aka.\nWords: aka elder brother · uka younger brother · ona mother · odam person · men I · Naim (male name) · Pekin Beijing\nBars the tiger: kim for people, nima for things!",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "aka", speak: "aka", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "aka — 哥哥。", ru: "aka — старший брат.", uz: "aka — aka." },
          options: [word("哥哥", "старший брат", "🧑", true), word("弟弟", "младший брат", "👦"), word("母亲", "мама", "👩")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "uka", speak: "uka", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "uka — 弟弟。", ru: "uka — младший брат.", uz: "uka — uka." },
          options: [word("爷爷", "дедушка", "👴"), word("哥哥", "старший брат", "🧑"), word("弟弟", "младший брат", "👦", true)],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "ona", speak: "ona", instruction: I.meaning,
          question: { zh: "这个词是什么意思？", ru: "Что значит это слово?", uz: "Bu soʻz nimani anglatadi?" },
          explanation: { zh: "ona — 母亲。（opa 是姐姐，ota 是父亲）", ru: "ona — мама (opa — сестра, ota — отец).", uz: "ona — ona." },
          options: [word("姐姐", "старшая сестра", "👧"), word("母亲", "мама", "👩", true), word("父亲", "отец", "👨")],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把单词和意思配对", ru: "Соедините слово и значение", uz: "Soʻzni maʼnosi bilan moslang" },
          explanation: { zh: "aka 哥哥，uka 弟弟，ona 母亲，odam 人。", ru: "aka брат, uka младший брат, ona мама, odam человек.", uz: "aka, uka, ona, odam." },
          pairs: [{ left: "aka", right: "哥哥" }, { left: "uka", right: "弟弟" }, { left: "ona", right: "母亲" }, { left: "odam", right: "人" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.choose,
          question: { zh: "问“这是谁？”应该说：", ru: "Как спросить «Кто это?»", uz: "«Bu kim?» degan savolni tanlang" },
          explanation: { zh: "问人用 kim：Bu kim?", ru: "О людях — kim: Bu kim?", uz: "Odam haqida — kim." },
          options: [{ text: same("Bu kim?"), correct: true }, { text: same("Bu nima?") }, { text: same("Mana bu men.") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "— Bu ___?\n— Bu kitob.", instruction: I.choose,
          question: { zh: "根据回答填问句", ru: "Восстановите вопрос по ответу", uz: "Javobga qarab savolni tiklang" },
          explanation: { zh: "kitob 是东西，所以问 Bu nima?", ru: "kitob — предмет, значит Bu nima?", uz: "kitob — narsa: Bu nima?" },
          options: [{ text: same("nima"), correct: true }, { text: same("kim") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "tiger", prompt: "— Bu ___?\n— Bu uka.", instruction: I.choose,
          question: { zh: "根据回答填问句", ru: "Восстановите вопрос по ответу", uz: "Javobga qarab savolni tiklang" },
          explanation: { zh: "uka 是人，所以问 Bu kim?", ru: "uka — человек, значит Bu kim?", uz: "uka — odam: Bu kim?" },
          options: [{ text: same("kim"), correct: true }, { text: same("nima") }],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", prompt: "— Bu kim?", instruction: I.build,
          question: { zh: "回答：这就是我。", ru: "Ответьте: вот это я.", uz: "Javob bering: mana bu — men." },
          explanation: { zh: "Mana bu men.", ru: "Mana bu men.", uz: "Mana bu men." },
          words: ["men", "bu", "kim", "Mana"], correctWords: ["Mana", "bu", "men"],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", prompt: "Ana opa.", speak: "Ana opa.", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит эта фраза?", uz: "Bu gap nimani anglatadi?" },
          explanation: { zh: "ana 指远处：那是姐姐。", ru: "ana — далеко: вон там сестра.", uz: "ana — uzoqdagi narsa." },
          options: [word("那是姐姐。", "Вон там сестра.", undefined, true), word("这是姐姐。", "Вот сестра."), word("姐姐是谁？", "Кто сестра?")],
        },
        {
          type: "TRANSLATE", mascot: "tiger", prompt: "— Bu kim?", instruction: I.type,
          question: { zh: "回答：这是纳伊穆。", ru: "Ответьте: это Наим.", uz: "Javob bering: bu — Naim." },
          explanation: { zh: "Bu Naim. 人名首字母大写。", ru: "Bu Naim. Имя пишется с заглавной.", uz: "Bu Naim." },
          acceptedAnswers: ["Bu Naim", "Mana bu Naim"],
        },
      ],
    },
    // ── Lesson 6 ─────────────────────────────────────────────── 3-dars 3.7–3.8
    {
      type: "CONVERSATION", xpReward: 25, estimatedMinutes: 6,
      title: { zh: "Salom, yaxshimisiz? 乌兹别克斯坦地理", ru: "Salom, yaxshimisiz? География Узбекистана", uz: "Salom, yaxshimisiz? Oʻzbekiston geografiyasi", en: "Salom, yaxshimisiz? Geography of Uzbekistan" },
      description: { zh: "问好、道谢和国家概况", ru: "Как дела, спасибо и страна в цифрах", uz: "Hol-ahvol soʻrash va mamlakat haqida", en: "How are you, thanks, and the country in numbers" },
      theory: {
        zh: "— Salom, yaxshimisiz? 您好吗？\n— Rahmat. Yaxshi. Siz-chi? 谢谢，很好。您呢？\n— Rahmat. Yaxshi. 谢谢，很好。\n小龙 Olov 讲背景知识：乌兹别克斯坦总面积约 44.74 万平方千米，东西长 1425 千米，南北宽 930 千米。\n地势东高西低，80% 的国土为平原低地，还有高山和沙漠。主要河流有阿姆河、锡尔河和泽拉夫尚河。\n全国分为 1 个自治共和国（卡拉卡尔帕克斯坦）和 12 个州，首都是塔什干。",
        ru: "— Salom, yaxshimisiz? Здравствуйте, как вы?\n— Rahmat. Yaxshi. Siz-chi? Спасибо, хорошо. А вы?\n— Rahmat. Yaxshi. Спасибо, хорошо.\nДракончик Olov: площадь Узбекистана — около 447,4 тыс. км², 1425 км с запада на восток и 930 км с севера на юг.\nНа востоке выше, на западе ниже; 80% территории — равнины, есть горы и пустыни. Главные реки — Амударья, Сырдарья и Зеравшан.\n1 автономная республика (Каракалпакстан) и 12 областей; столица — Ташкент.",
        uz: "— Salom, yaxshimisiz?\n— Rahmat. Yaxshi. Siz-chi?\n— Rahmat. Yaxshi.\nOʻzbekiston maydoni taxminan 447,4 ming km², gʻarbdan sharqqa 1425 km, shimoldan janubga 930 km.\nHududning 80% tekislik; asosiy daryolar — Amudaryo, Sirdaryo va Zarafshon.\n1 avtonom respublika (Qoraqalpogʻiston) va 12 viloyat; poytaxt — Toshkent.",
        en: "— Salom, yaxshimisiz? Hello, how are you?\n— Rahmat. Yaxshi. Siz-chi? Thanks, fine. And you?\n— Rahmat. Yaxshi. Thanks, fine.\nOlov the dragon: Uzbekistan covers about 447,400 km², 1,425 km west to east and 930 km north to south.\nIt is higher in the east and lower in the west; 80% is plains, plus mountains and deserts. Main rivers: Amu Darya, Syr Darya and Zarafshan.\n1 autonomous republic (Karakalpakstan) and 12 regions; the capital is Tashkent.",
      },
      exercises: [
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Salom, yaxshimisiz?", speak: "Salom, yaxshimisiz?", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит эта фраза?", uz: "Bu ibora nimani anglatadi?" },
          explanation: { zh: "Salom, yaxshimisiz? — 您好吗？", ru: "«Здравствуйте, как вы?»", uz: "Hol-ahvol soʻrash." },
          options: [word("您好吗？", "Здравствуйте, как вы?", "🙂", true), word("再见！", "До свидания!", "👋"), word("谢谢！", "Спасибо!", "🙏")],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "— Salom, yaxshimisiz?\n— …", instruction: I.choose,
          question: { zh: "你可以怎么回答？", ru: "Что можно ответить?", uz: "Qanday javob berasiz?" },
          explanation: { zh: "Rahmat. Yaxshi. — 谢谢，很好。", ru: "Rahmat. Yaxshi. — Спасибо, хорошо.", uz: "Rahmat. Yaxshi." },
          options: [{ text: same("Rahmat. Yaxshi."), correct: true }, { text: same("Assalomu alaykum!") }, { text: same("Xayr!") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "panda", prompt: "Siz-chi?", speak: "Siz-chi?", instruction: I.meaning,
          question: { zh: "这句话是什么意思？", ru: "Что значит эта фраза?", uz: "Bu ibora nimani anglatadi?" },
          explanation: { zh: "Siz-chi? — 您呢？用来反问对方。", ru: "Siz-chi? — А вы?", uz: "Siz-chi? — qarshi savol." },
          options: [word("很好", "хорошо"), word("您呢？", "А вы?", undefined, true), word("谢谢", "спасибо")],
        },
        {
          type: "ARRANGE_WORDS", mascot: "dragon", prompt: "— Salom, yaxshimisiz?", instruction: I.build,
          question: { zh: "回答：谢谢，很好。您呢？", ru: "Ответьте: Спасибо, хорошо. А вы?", uz: "Javob bering va qarshi savol bering" },
          explanation: { zh: "Rahmat. Yaxshi. Siz-chi?", ru: "Rahmat. Yaxshi. Siz-chi?", uz: "Rahmat. Yaxshi. Siz-chi?" },
          words: ["Yaxshi.", "Siz-chi?", "Xayr!", "Rahmat."], correctWords: ["Rahmat.", "Yaxshi.", "Siz-chi?"],
        },
        {
          type: "MATCHING", mascot: "tiger", instruction: I.match,
          question: { zh: "把乌兹别克语和中文配对", ru: "Соедините узбекские и китайские слова", uz: "Oʻzbekcha va xitoycha soʻzlarni moslang" },
          explanation: { zh: "Salom 你好，Rahmat 谢谢，Yaxshi 很好，Siz-chi? 您呢？", ru: "Salom привет, Rahmat спасибо, Yaxshi хорошо, Siz-chi? а вы?", uz: "Salom, Rahmat, Yaxshi, Siz-chi?" },
          pairs: [{ left: "Salom", right: "你好" }, { left: "Rahmat", right: "谢谢" }, { left: "Yaxshi", right: "很好" }, { left: "Siz-chi?", right: "您呢？" }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
          question: { zh: "乌兹别克斯坦的首都是……", ru: "Столица Узбекистана —", uz: "Oʻzbekiston poytaxti —" },
          explanation: { zh: "首都是塔什干（Toshkent）。", ru: "Ташкент (Toshkent).", uz: "Toshkent." },
          options: [
            { text: { zh: "塔什干", ru: "Ташкент", uz: "Toshkent" }, correct: true },
            { text: { zh: "撒马尔罕", ru: "Самарканд", uz: "Samarqand" } },
            { text: { zh: "布哈拉", ru: "Бухара", uz: "Buxoro" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
          question: { zh: "乌兹别克斯坦大约多少国土是平原低地？", ru: "Какая часть Узбекистана — равнины?", uz: "Oʻzbekiston hududining qancha qismi tekislik?" },
          explanation: { zh: "约 80% 是平原低地，地势东高西低。", ru: "Около 80%; на востоке выше, на западе ниже.", uz: "Taxminan 80%." },
          options: [{ text: same("80%"), correct: true }, { text: same("30%") }, { text: same("50%") }],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
          question: { zh: "下面哪一组是乌兹别克斯坦的主要河流？", ru: "Какие реки — главные в Узбекистане?", uz: "Oʻzbekistonning asosiy daryolari qaysilar?" },
          explanation: { zh: "阿姆河、锡尔河和泽拉夫尚河。", ru: "Амударья, Сырдарья и Зеравшан.", uz: "Amudaryo, Sirdaryo va Zarafshon." },
          options: [
            { text: { zh: "阿姆河、锡尔河、泽拉夫尚河", ru: "Амударья, Сырдарья, Зеравшан", uz: "Amudaryo, Sirdaryo, Zarafshon" }, correct: true },
            { text: { zh: "长江、黄河、珠江", ru: "Янцзы, Хуанхэ, Чжуцзян", uz: "Yanszi, Xuanxe, Chjuszyan" } },
            { text: { zh: "伏尔加河、顿河、第聂伯河", ru: "Волга, Дон, Днепр", uz: "Volga, Don, Dnepr" } },
          ],
        },
        {
          type: "MULTIPLE_CHOICE", mascot: "dragon", instruction: I.culture,
          question: { zh: "乌兹别克斯坦的行政区划是……", ru: "Как устроен Узбекистан административно?", uz: "Oʻzbekistonning maʼmuriy boʻlinishi qanday?" },
          explanation: { zh: "1 个自治共和国（卡拉卡尔帕克斯坦）和 12 个州。", ru: "1 автономная республика (Каракалпакстан) и 12 областей.", uz: "1 avtonom respublika va 12 viloyat." },
          options: [
            { text: { zh: "1 个自治共和国和 12 个州", ru: "1 автономная республика и 12 областей", uz: "1 avtonom respublika va 12 viloyat" }, correct: true },
            { text: { zh: "10 个州", ru: "10 областей", uz: "10 ta viloyat" } },
            { text: { zh: "2 个自治共和国和 15 个州", ru: "2 республики и 15 областей", uz: "2 respublika va 15 viloyat" } },
          ],
        },
        {
          type: "TRANSLATE", mascot: "tiger", instruction: I.type,
          question: { zh: "谢谢，很好。", ru: "Спасибо, хорошо.", uz: "«Rahmat. Yaxshi.» deb javob bering" },
          explanation: { zh: "Rahmat. Yaxshi.", ru: "Rahmat. Yaxshi.", uz: "Rahmat. Yaxshi." },
          acceptedAnswers: ["Rahmat. Yaxshi."],
        },
      ],
    },
  ],
};
