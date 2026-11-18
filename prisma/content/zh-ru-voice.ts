// Listening and speaking practice for the Russian course (zh → ru), added to
// the end of each lesson. In the textbooks these are 听录音 (listen and pick)
// and 跟读 (listen and repeat): here the learner taps what was heard, or says
// the word into the microphone. Words come from the lesson itself.
import { hear, say, type ExerciseContent, type Text } from "./common";

const SYLLABLE: Text = { zh: "你听到的是哪个音节？", ru: "Какой слог вы услышали?", uz: "Qaysi böğinni eşitdingiz?" };
const WORD: Text = { zh: "你听到的是哪个词？", ru: "Какое слово вы услышали?", uz: "Qaysi sözni eşitdingiz?" };
const PHRASE: Text = { zh: "你听到的是哪句话？", ru: "Какую фразу вы услышали?", uz: "Qaysi gapni eşitdingiz?" };

/** RU_VOICE[unit][lesson] — exercises appended to that lesson. */
export const RU_VOICE: ExerciseContent[][][] = [
  // ── Unit 1 · Привет, русский! ──────────────────────────────────────────
  [
    // Single vowels are too short for speech recognition: lesson 1 only listens.
    [],
    [say("ма́ма", "妈妈", "ona"), say("па́па", "爸爸", "ota", "tiger")],
    [say("тома́т", "番茄", "pomidor"), say("э́то", "这是", "bu", "dragon")],
    [say("Э́то ма́ма.", "这是妈妈。", "Bu ona."), say("Па́па там.", "爸爸在那里。", "Ota u yerda.", "tiger")],
    [say("поэ́т", "诗人", "şoir"), say("А э́то Э́мма.", "而这是艾玛。", "Bu esa Emma.", "dragon")],
    [say("Здра́вствуйте!", "您好！", "Assalomu alaykum!"), say("До свида́ния!", "再见！", "Xayr!", "tiger")],
  ],
  // ── Unit 2 · Кто это? ──────────────────────────────────────────────────
  [
    [
      hear("мы", ["ми", "му", "ма"], SYLLABLE, { zh: "мы：[ы] 舌头后缩，不要读成 [и]。", ru: "мы: при [ы] язык оттянут назад, это не [и].", uz: "мы: [ы] da til orqaga tortiladi, bu [и] emas." }),
      say("она́", "她", "u (ayol)"),
      say("Э́то Ни́на.", "这是尼娜。", "Bu Nina.", "tiger"),
    ],
    [
      hear("кот", ["кто", "как", "ко́мната"], WORD, { zh: "кот — 猫。", ru: "кот: [к] + [о] + [т].", uz: "кот — muşuk." }),
      say("кот", "猫", "muşuk"),
      say("ко́мната", "房间", "xona", "tiger"),
    ],
    [
      hear("Кто э́то?", ["Э́то кот?", "Э́то ма́ма?", "Нет."], PHRASE, { zh: "Кто э́то? — 这是谁？语调中心在 кто。", ru: "Кто э́то? Центр интонации на слове «кто».", uz: "Кто э́то? — Bu kim? Ohang markazi «кто» sözida." }),
      say("Кто э́то?", "这是谁？", "Bu kim?"),
      say("Нет, э́то кот.", "不，这是猫。", "Yöq, bu muşuk.", "tiger"),
    ],
    [
      hear("дом", ["том", "там", "зонт"], WORD, { zh: "дом：浊辅音 [д]，声带振动；том 是清辅音 [т]。", ru: "дом: звонкий [д], голос звучит; в «том» глухой [т].", uz: "дом: jarangli [д]; «том» da jarangsiz [т]." }),
      hear("зуб", ["суп", "зонт", "сок"], WORD, { zh: "зуб：开头是浊辅音 [з]；суп 开头是清辅音 [с]。", ru: "зуб: в начале звонкий [з]; в «суп» глухой [с].", uz: "зуб: boşida jarangli [з]; «суп» da jarangsiz [с]." }, "tiger"),
      say("дом", "房子", "uy"),
      say("суп", "汤", "şörva", "dragon"),
    ],
    [
      hear("что", ["кто", "кот", "вот"], WORD, { zh: "что 读作 [што] — 什么。", ru: "что читается [што].", uz: "что [што] deb öqiladi — nima." }),
      say("Что э́то?", "这是什么？", "Bu nima?"),
      say("Э́то суп.", "这是汤。", "Bu şörva.", "tiger"),
    ],
    [
      hear("Как дела́?", ["Приве́т!", "Пока́!", "Спаси́бо!"], PHRASE, { zh: "Как дела́? — 你好吗？", ru: "Как дела́? Так спрашивают друзей.", uz: "Как дела́? — İşlar qalay?" }),
      say("Приве́т!", "你好！", "Salom!"),
      say("Хорошо́, спаси́бо!", "很好，谢谢！", "Yaxşi, rahmat!", "tiger"),
    ],
  ],
  // ── Unit 3 · Моя семья ─────────────────────────────────────────────────
  [
    [
      hear("ла", ["ра", "на", "да"], SYLLABLE, { zh: "ла：[л] 舌尖抵上齿；ра 是颤音 [р]。", ru: "ла: при [л] кончик языка у верхних зубов; в «ра» язык дрожит.", uz: "ла: [л] da til uçi yuqori tişlarda; «ра» da til titraydi." }),
      say("рука́", "手", "qöl"),
      say("стол", "桌子", "stol", "tiger"),
    ],
    [
      hear("ёлка", ["я", "мой", "ю"], WORD, { zh: "ёлка：ё 在词首读 [йо]。", ru: "ёлка: ё в начале слова читается [йо].", uz: "ёлка: söz boşida ё [йо] deb öqiladi." }),
      say("мой", "我的", "mening"),
      say("Э́то мой дом.", "这是我的房子。", "Bu mening uyim.", "tiger"),
    ],
    [
      hear("мать", ["мат", "день", "дом"], WORD, { zh: "мать：ь 表示 [т'] 是软辅音。", ru: "мать: ь показывает мягкий [т'].", uz: "мать: ь yumşoq [т'] ni bildiradi." }),
      say("день", "白天，天", "kun"),
      say("семья́", "家庭", "oila", "tiger"),
    ],
    [
      hear("чай", ["шко́ла", "маши́на", "у́лица"], WORD, { zh: "чай — 茶；[ч] 永远是软辅音。", ru: "чай: [ч] всегда мягкий.", uz: "чай — çoy; [ч] doim yumşoq." }),
      say("чай", "茶", "çoy"),
      say("шко́ла", "学校", "maktab", "tiger"),
      say("маши́на", "汽车", "maşina", "dragon"),
    ],
    [
      hear("окно́", ["мо́ре", "шко́ла", "дом"], WORD, { zh: "окно́ — 窗户，中性名词：моё окно́。", ru: "окно́: средний род, «моё окно́».", uz: "окно́ — deraza, örta rod: «моё окно́»." }),
      say("мо́ре", "大海", "dengiz"),
      say("окно́", "窗户", "deraza", "tiger"),
    ],
    [
      hear("Отку́да ты?", ["Как тебя́ зову́т?", "О́чень прия́тно!", "Как дела́?"], PHRASE, { zh: "Отку́да ты? — 你来自哪里？", ru: "Отку́да ты? Так спрашивают, из какой вы страны.", uz: "Отку́да ты? — Qayerdansan?" }),
      say("Как тебя́ зову́т?", "你叫什么名字？", "İsming nima?"),
      say("О́чень прия́тно!", "很高兴认识你！", "Tanişganimdan xursandman!", "tiger"),
    ],
  ],
];
