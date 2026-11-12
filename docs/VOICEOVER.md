# Gapir — озвучка уроков: где, как и какими голосами

Обновлено: 12.11.2026.

## Сводка на 12.11.2026

| Что | Сколько | Голос |
|---|---|---|
| Вопросы заданий, китайский | 171 из 171 | Google AI Studio |
| Вопросы заданий, узбекский | 84 из 173 (89 ещё без звука) | Google AI Studio |
| Объяснения уроков и карточки-объяснения перед заданиями | все | Google AI Studio (часть китайских), остальное Microsoft Edge |
| Русские и узбекские слова в заданиях | 137 | Edge + 8 из AI Studio |

12.11.2026 лимиты обновились: Gemini 3.8 Flash TTS дала 49 генераций, потом «quota»; остальные 22 сделаны на Flash Lite (у неё осталось примерно 30 на тот же день).
В тексте для озвучки пропуски заменяются словами: «番茄 т_мат：缺的是哪个字母？» читается как «番茄，缺的是哪个字母？», «Это ___ окно.» как «Это … окно.».

**Новые типы заданий (12.11.2026):** «скажи вслух» (микрофон, распознавание речи браузера; в приложении Android пока «повтори и нажми кнопку») и задания на слух во всех уроках русского курса. Ввода с клавиатуры в уроках больше нет: ответ собирается из плиток. У всех заданий «скажи вслух» один вопрос («点击麦克风，跟着读»), поэтому он озвучен один раз.

Вопросы лежат в `public/audio/question/zh|uz/<ключ>.mp3` (ключ = хэш текста вопроса), в приложении панда читает вопрос сам при открытии задания, по нажатию на вопрос — повтор.
Список всех вопросов с ключами: `npx tsx scripts/generate-audio.ts --list-questions questions.json`.

### Лимиты Google AI Studio (аккаунт с подпиской PRO)
У каждой TTS-модели свой **дневной** лимит («Failed to generate content, quota exceeded: daily limit … select a different model»). Когда одна кончилась — переключить модель через адрес:

| Модель | Адрес | Голос | Сколько дала за день |
|---|---|---|---|
| Gemini 3.8 Flash TTS | `generate-speech` (по умолчанию) | Fola | ~28 |
| Gemini 3.8 Flash Lite TTS | `generate-speech?model=gemini-3.8-flash-lite-tts` | Fola | ~53 |
| Gemini 3.1 Flash TTS Preview | `?model=gemini-3.1-flash-tts-preview` | **Sulafat** (Fola там нет) | ~49 |
| Gemini 2.5 Pro Preview TTS | `?model=gemini-2.5-pro-preview-tts` | Sulafat | ~45 (медленная) |
| Gemini 2.5 Flash Preview TTS | `?model=gemini-2.5-flash-preview-tts` | Sulafat | ~46 |

В моделях 3.1 / 2.5 стиль задаётся в «Speaker settings → Audio Profile», голос — там же поиском.
Для узбекских вопросов Audio Profile:

```
A warm, patient Uzbek teacher speaking clear literary Uzbek (Tashkent pronunciation) to a beginner, slightly slow. Chinese words are pronounced in Mandarin, Russian (Cyrillic) words in native Russian.
```

Короткие фразы иногда не генерируются («Salom bering», «再见！», фразы с « — »): помогает точка в конце или замена тире на запятую.
**Русский курс, юнит 2 (добавлен 12.11.2026):** 6 уроков. Слова и объяснения пока озвучены голосами Edge; вопросы заданий (48 китайских + 48 узбекских) ещё без звука — сделать через Google AI Studio. Список: `npx tsx scripts/generate-audio.ts --list-questions q.json`, взять те, которых нет в `public/audio/question/`.

**Как выложить новые уроки на сайт (без потери прогресса учеников):**
```bash
npm run db:seed
npx tsx scripts/generate-audio.ts
node scripts/export-content-sql.mjs > .open-next/content.sql
npx wrangler d1 execute gapir-db --remote --file .open-next/content.sql --yes
npm run cf:build
npx opennextjs-cloudflare deploy
```
Экспорт делает только INSERT … ON CONFLICT DO UPDATE (без DELETE: удаление урока каскадом стирает прогресс).

**Осталось 17 узбекских вопросов** — с тире «Javob bering: bu — maktab.» и последние в курсе русского; доделать на следующий день.

### Промо-видео
`C:\Users\II166\Desktop\Gapir-promo.mp4` — 9:16, 40 с, реальные экраны сайта, голос панды из уроков, звуки интерфейса без басов. Склейки каждые 2 с (сетка 120 BPM). Трек «八方来财» в видео не вшит (права) — его ставят в Douyin/TikTok/Instagram из их библиотеки. Проект: `C:\Users\II166\Desktop\Gapir`, репозиторий https://github.com/xopesa/gapir (ветка `feat/cloudflare-duo-lessons`, PR #1).

## Что озвучено

| Что | Язык | Чем сделано | Где лежит |
|---|---|---|---|
| Объяснения (теория) уроков | китайский | **Google AI Studio** (11 из 18), Microsoft Edge (7 из 18) | `public/audio/narration/zh/<ключ>.mp3` |
| Объяснения (теория) уроков | узбекский | Microsoft Edge | `public/audio/narration/uz/<ключ>.mp3` |
| Слова и фразы в заданиях | русский | Microsoft Edge | `public/audio/ru/<слово>.mp3` |
| Слова и фразы в заданиях | узбекский | Google AI Studio (8 шт.) + Microsoft Edge (остальные) | `public/audio/uz/` (`.wav` = AI Studio, `.mp3` = Edge) |

Какой файл к какому тексту относится, записано в `src/content/audio-manifest.generated.ts` (генерируется, руками не править).
Ключ объяснения — хэш текста теории (`narrationKey` в `src/lib/audio-keys.ts`). **Если поменять текст теории — ключ изменится, и урок нужно озвучить заново.**

---

## 1. Google AI Studio (лучшее качество, китайский)

- Сайт: https://aistudio.google.com/generate-speech
- Аккаунт: тот, под которым вы вошли в Chrome (бесплатный план).
- Модель: **Gemini 3.8 Flash TTS** (`gemini-3.8-flash-tts`)
- Режим: «Create new dialog», один спикер.
- Голос: **Fola** («Clear and friendly, Medium pitch»)
- Style (кнопка «Style» → своё описание):

  ```
  A warm, patient Mandarin Chinese teacher speaking standard Putonghua to a beginner, clear and slightly slow. Russian (Cyrillic) words are pronounced in native Russian, Uzbek (Latin) words in native Uzbek.
  ```

- Текст: китайская теория урока как есть, но
  - знаки ударения (◌́) убраны;
  - узбекские слова — в **старом** написании (Ö→Oʻ, Ğ→Gʻ, Ş→Sh, Ç→Ch), иначе голос их не узнаёт (кроме строки урока 1, где сравниваются алфавиты);
  - фонетический знак ʌ заменён на русскую «а».
- Результат: WAV 24 кГц → переводится в MP3 48 кбит/с моно (Python, библиотека `lameenc`) и кладётся в `public/audio/narration/zh/<ключ>.mp3` под тем же именем, что был у Edge-файла.
- Узбекские гласные и фразы (a, o, u, ö, i, e, «Assalomu alaykum!», «Xayr!») тоже из AI Studio, текст вида `a... a... a.`

**Ограничения:**
- Бесплатный лимит AI Studio кончается примерно после 25–30 генераций в день («Quota limit reached»), восстанавливается на следующий день.
- Chrome блокирует много скачиваний подряд — скачивать по одному или одним общим файлом.
- Полный WAV появляется только после того, как страница проиграет озвучку целиком (≈1 мин на объяснение).

**Ещё не озвучены через Google (сейчас голос Edge) — 7 китайских объяснений узбекского курса:**
`07e01faf78` (Bu… / U…), `12b1bfac8c` (it, pul, papka…), `c53262e4c6` (G g, K k), `88b21540b2` (M m, N n), `710572a1f1` (слоги, гармония гласных), `ea745beff5` (Bu nima?), `1311c7dbe5` (Bu kim?).

Альтернатива без браузера: API-ключ с https://aistudio.google.com/apikey → в `.env` строку `GEMINI_API_KEY=...` (тогда озвучку можно делать скриптом).

## 2. Microsoft Edge neural TTS (бесплатно, без ключа, всё остальное)

- Программа: Python-пакет **edge-tts** (`python -m pip install --user edge-tts`).
- Голоса:
  - китайский: **zh-CN-XiaoxiaoNeural**, скорость −5%
  - русский: **ru-RU-SvetlanaNeural**, скорость −15% (для учеников медленнее)
  - узбекский: **uz-UZ-MadinaNeural**, скорость −5% (слова в заданиях −15%)
- В объяснениях текст режется по алфавитам: иероглифы читает китайский голос, кириллицу — русский, латиницу — узбекский (в узбекском курсе и узбекском интерфейсе). Куски склеиваются в один MP3.

### Команды (из папки проекта)

```bash
npx tsx scripts/generate-audio.ts --dry-run        # что будет озвучено и чего не хватает
npx tsx scripts/generate-audio.ts                  # озвучить недостающее (существующие файлы не трогает)
npx tsx scripts/generate-audio.ts --force          # переозвучить всё Edge-голосами (ЗАТРЁТ файлы из AI Studio!)
npx tsx scripts/generate-audio.ts --manifest-only  # только обновить манифест после ручного добавления файлов
```

Скрипты: `scripts/generate-audio.ts` (что озвучивать, имена файлов, манифест), `scripts/edge-tts-batch.py` (сам синтез).

## 3. Как это работает в приложении

- Экран начала урока: панда сама читает объяснение, кнопка «听讲解 / Слушать объяснение» — пауза/повтор.
- Задание: русское/узбекское слово звучит сразу при открытии, кнопка динамика повторяет.
- Офлайн: приложение заранее сохраняет озвучку своего курса. После замены файлов поднять версию кэша `gapir-offline-vN` в `public/sw.js` и `src/features/offline/offline-agent.tsx`, иначе телефоны оставят старую озвучку.

## 4. Как выложить новую озвучку

```bash
npm run cf:build
npx opennextjs-cloudflare deploy
```

Сайт: https://gapir.gapir-web.workers.dev — APK пересобирать не нужно, приложение грузит сайт.
