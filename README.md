# Gapir

Gapir — full-stack Web-приложение для изучения узбекского и китайского языков. Первая интегрированная версия включает credentials-авторизацию, четыре языка интерфейса, защищённую админ-панель, публикацию контента, прохождение урока и сохранение XP/прогресса в SQLite.

## Стек и архитектура

- Next.js 16 App Router, React 19, TypeScript strict
- Prisma ORM 7: SQLite локально, Cloudflare D1 в production (OpenNext)
- Собственная credentials-авторизация: bcryptjs, случайные серверные сессии, HttpOnly cookie
- Zod и React Hook Form
- Tailwind CSS 4, Framer Motion, Phosphor Icons
- Сервисный слой в `src/server/services`, Route Handlers в `app/api`
- Централизованный i18n в `src/i18n`

Данные аккаунтов, курсов, попыток, XP и стрика не сохраняются в браузере. `localStorage` используется только для языка интерфейса до входа.

## Языки

Интерфейс поддерживает `uz`, `ru`, `zh`, `en`. Это независимый параметр `interfaceLocale` (`User.locale`).

- `sourceLanguage` — язык объяснения материала.
- `targetLanguage` — изучаемый язык.

Например: интерфейс русский, объяснение на русском, изучаемый язык узбекский.

## Локальная настройка

Скопируйте `.env.example` в `.env` и задайте:

```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="owner@gapir.local"
ADMIN_PASSWORD="strong-password-123"
ADMIN_NAME="Gapir Owner"
SESSION_TTL_DAYS="30"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Затем выполните:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Откройте `http://localhost:3000`.

Полезные команды:

```bash
npm run db:studio
npm run typecheck
npm run lint
npm test
npm run build
```

Seed повторно запускается без дублей и создаёт OWNER из `.env`, демонстрационный курс «Русский → Узбекский», модуль, опубликованный урок «Приветствия» и четыре упражнения.

Локальный тестовый OWNER в текущем окружении:

- Email: `test@gapir.local`
- Пароль: задаётся только в локальном `.env`

## Деплой на Cloudflare (OpenNext + D1)

Локальная разработка не меняется: `npm run dev` работает на Node и SQLite-файле `prisma/dev.db`. Production-сборка для Cloudflare Workers делается через [OpenNext](https://opennext.js.org/cloudflare), база там — Cloudflare D1.

Как это устроено:

- `src/server/db.ts` выбирает адаптер Prisma по `GAPIR_RUNTIME`: `node` → better-sqlite3, `cloudflare` → D1 (binding `DB` из `wrangler.jsonc`, клиент создаётся в контексте запроса).
- `npm run cf:build` (`scripts/cf-build.mjs`) на время сборки генерирует Prisma-клиент с `runtime = "cloudflare"`, запускает `opennextjs-cloudflare build` с `GAPIR_RUNTIME=cloudflare` и затем возвращает Node-клиент.
- Миграции остаются в `prisma/migrations`; `npm run cf:migrations` конвертирует их в плоский формат `migrations/000N_*.sql` для `wrangler d1 migrations apply` (без неподдерживаемых в D1 PRAGMA).
- Промпты AI-тьютора встраиваются в `src/server/ai/prompts/templates.generated.ts` (`npm run prompts:build`), потому что в Worker нет файлов проекта. Тест проверяет, что они совпадают с `ai/prompts/*.md`.
- `cloudflare-env.d.ts` — типы bindings и runtime, пересоздаются `npm run cf:typegen` после изменения `wrangler.jsonc`.

Первый деплой:

```bash
npx wrangler login
npx wrangler d1 create gapir-db          # id вставить в wrangler.jsonc → d1_databases[0].database_id
npm run cf:migrations
npm run db:migrate:d1:remote
npx wrangler secret put AI_LLM_API_KEY   # и другие секреты, если нужны реальные AI-провайдеры
npm run cf:build
npm run cf:deploy
```

Seed в удалённую D1: `npm run db:seed:d1:remote` с переменными `CLOUDFLARE_D1_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID` и `ADMIN_*`. Локальная проверка Worker: `npm run db:migrate:d1:local`, `npm run db:seed:d1:local`, `npm run cf:build`, `npm run cf:preview`; секреты для неё — в `.dev.vars`.

Важно:

- **Windows:** `opennextjs-cloudflare build` создаёт симлинки, поэтому нужен включённый «Режим разработчика» Windows или сборка в WSL/Linux (например, Cloudflare Workers Builds или GitHub Actions).
- **`NEXT_PUBLIC_SITE_URL`** подставляется при сборке — задайте production-адрес перед `cf:build`.
- **CPU:** хеширование паролей bcrypt (12 раундов) занимает сотни миллисекунд CPU, а бесплатный план Workers даёт 10 мс на запрос. Для входа и регистрации нужен Workers Paid или переход на более лёгкий алгоритм.
- **Транзакции:** в Worker адаптер D1 бросает ошибку на интерактивных транзакциях `prisma.$transaction(async (tx) => …)`, хотя локальный SQLite их принимает. Используйте только пакетную форму `prisma.$transaction([...])` или последовательные запросы — это проверяет тест `tests/cloudflare-compat.test.ts`. Пакеты на D1 не дают гарантий ACID: начисление XP за урок защищено атомарным условным обновлением, остальные многошаговые записи (настройки, память тьютора, телеметрия) при сбое могут сохраниться частично.
- **Rate limiting** хранится в памяти процесса и на Workers действует только в пределах одного изолята. Для production нужен общий счётчик (Rate Limiting binding, KV или D1).
- Локальные STT/TTS-воркеры (Python) на Cloudflare не запускаются — их нужно хостить отдельно и указать `AI_STT_WORKER_URL` / `AI_TTS_WORKER_URL`.

## Уроки и контент

Уроки сделаны в игровом стиле, mobile-first: путь из узлов-уроков, плеер на весь экран с сердечками, повтором ошибок в конце урока, нижней панелью проверки и тремя маскотами — панда **Paxta** (объясняет теорию), дракончик **Olov** (культура, сборка фраз) и тигрёнок **Bars** (повторение). Маскоты — собственные SVG в `src/components/mascots/mascot.tsx`.

- Курс «乌兹别克语入门» (zh → uz, slug `zh-uz-a1`) собирается в `prisma/content/zh-uz-unit1.ts` (сам курс и юнит 1 — уроки 1–2 методички «乌兹别克语教程(1)»); каждый следующий юнит — отдельный файл (`zh-uz-unit2.ts` — урок 3), общие типы и хелперы — в `prisma/content/common.ts`. По 6 уроков в юните.
- Курс «俄语入门» (zh → ru, slug `zh-ru-a1`) — `prisma/content/zh-ru-unit1.ts`, юнит 1 по УРОК 1 учебника «大学俄语（东方·新版）1». Знаки ударения показываются как в учебнике, в ответах не требуются; `ё` = `е`. Заданий на ввод нет (на телефонах в Китае часто нет кириллической клавиатуры). Озвучка — системным русским голосом устройства. Тексты на китайском, русском и узбекском (en — для заголовков), недостающие языки берутся из языка курса.
- `npm run db:seed` загружает его через `prisma/content/seed-course.ts` (идемпотентно). Тест `tests/course-content.test.ts` проверяет, что каждое упражнение корректно.
- Типы заданий: выбор (с эмодзи-карточками), сборка фразы из плиток, сопоставление пар касанием, ввод ответа с кнопками `ö ğ ş ç ʼ`. Варианты и пары перемешиваются на сервере. Регистр и знаки препинания не важны.
- Узбекский написан **новым латинским алфавитом** (закон от 21.10.2026, действует с 22.04.2027): `Ö Ğ Ş Ç` вместо `Oʻ Gʻ Sh Ch`, `Ng` больше не отдельная буква, знак тутуқ — `ʼ`. Урок 1 объясняет это ученикам. Ответы, набранные по-старому (`oʻ o' o‘ sh ch`), засчитываются: `src/lib/uzbek-latin.ts` переводит старое написание в новое и при проверке, и при поиске аудио. Тест не даёт вернуть в контент `oʻ / gʻ`.
- Озвучка: `npm run audio:generate` (Yandex SpeechKit, голос `nigora`, или `AUDIO_TTS_PROVIDER=gemini`) кладёт файлы в `public/audio/uz/` и обновляет `src/content/audio-manifest.generated.ts`; кнопка динамика появляется только у фраз с аудио. `--dry-run` показывает список фраз, `--manifest-only` пересобирает манифест по уже лежащим файлам. Имена файлов ASCII: `ö→oe`, `ğ→gh`, `ş→sh`, `ç→ch`. Сейчас озвучены уроки 1–3 (гласные, «Assalomu alaykum!», «Xayr!») — Gemini TTS из Google AI Studio.
- Для телефона: `viewport-fit=cover` и safe-area, `100dvh`, поля ввода ≥16px (без зума на iOS), вибрация при ответе, PWA-манифест (`app/manifest.ts`) для установки на домашний экран.

## Маршруты

- `/register` — регистрация
- `/login` — вход
- `/forgot-password` — информационный экран восстановления в тестовой версии
- `/onboarding` — выбор направления и дневной цели
- `/` — опубликованный учебный маршрут из базы
- `/learn/[lessonId]` — прохождение урока с серверной проверкой ответов
- `/profile` — профиль, XP, стрик и настройки
- `/admin` — защищённый dashboard
- `/admin/courses` — курсы
- `/admin/courses/new` — создание курса
- `/admin/courses/[courseId]` — модули и уроки курса
- `/admin/lessons/[lessonId]` — редактор и публикация урока
- `/admin/users` — пользователи

Маршруты `/admin` проверяют роль на сервере. Доступ разрешён `CONTENT_EDITOR`, `ADMIN`, `OWNER`; ссылка скрыта для `USER`.

## База данных

Основные модели: `User`, `UserPreference`, `Session`, `Course`, переводы курса, `Module`, переводы модуля, `Lesson`, переводы урока, `Exercise`, переводы и варианты упражнений, `UserCourse`, `UserLessonProgress`, `UserExerciseAttempt`.

Файловая SQLite предназначена для локальной тестовой версии. Для production замените `provider = "sqlite"` на `postgresql`, настройте PostgreSQL URL и создайте новую миграцию. Логику сервисов и Route Handlers менять не требуется.

## Сценарий проверки

1. Откройте `/register`, выберите русский интерфейс и создайте пользователя.
2. На `/onboarding` выберите Русский → Узбекский.
3. Войдите под OWNER и откройте `/admin`.
4. Откройте демонстрационный урок, измените название, сохраните и опубликуйте.
5. Вернитесь под обычным пользователем и увидите урок на главном экране.
6. Пройдите четыре упражнения и получите 20 XP.
7. Обновите страницу: XP и прогресс останутся в SQLite; повторное прохождение не начислит полную награду второй раз.

## Следующий этап

- Production PostgreSQL и управляемое хранилище
- Email-провайдер для реального сброса пароля
- Более удобный визуальный конструктор новых упражнений
- Аудит действий администраторов и production rate limiting
- E2E-тесты полного браузерного сценария

OAuth, AI, распознавание речи, реальные платежи, большие видео, сложный магазин, лиги и друзья в этот этап не входят.

## Тема, звуки и переключатель языка

- Тема переключается между `light`, `dark` и `system`. Для гостя выбор хранится в `localStorage` и cookie, для авторизованного пользователя дополнительно сохраняется в `UserPreference`.
- Настройки темы и звука находятся в `/profile`; компактный переключатель темы также доступен на экранах входа, onboarding и в верхней панели администратора.
- Звуковой менеджер находится в `src/lib/sound`. Он не воспроизводит звук до первого взаимодействия пользователя и использует безопасный Web Audio fallback, если MP3 отсутствует.
- Production MP3-файлы нужно положить в `public/sounds` с именами, перечисленными в `public/sounds/README.md`.
- Переключатель языка использует desktop popover и mobile bottom sheet; нативный `select` для языка интерфейса больше не используется.

## Приложение для Android, гостевой вход и офлайн

- **Production:** https://gapir.gapir-web.workers.dev (Cloudflare Workers + D1 `gapir-db`). Контент в D1 переносится из локальной базы без пользователей: `node scripts/export-content-sql.mjs > .open-next/content.sql` и `npx wrangler d1 execute gapir-db --remote --file .open-next/content.sql`.
- **Без логина и пароля:** неавторизованный ученик попадает на `/start`, где сразу создаётся гостевой аккаунт с сессией (`POST /api/auth/guest`). У гостя нет пароля: в `passwordHash` лежит не bcrypt-хеш, поэтому вход по паролю невозможен. Админка по-прежнему требует `/login`.
- **Офлайн:** приложение скачивает пакет курса с ответами (`GET /api/offline/pack`) в `localStorage`. Без сети плеер проверяет ответы на устройстве (`src/lib/answer-check.ts` — тот же код, что на сервере), а пройденные уроки ставит в очередь. При появлении сети очередь уходит в `POST /api/offline/sync`: сервер заново проверяет ответы и сам начисляет XP. Service worker (`public/sw.js`, только в production) кэширует статику и аудио и показывает `/offline`, если страница не загрузилась.
- **APK:** Capacitor-обёртка (`capacitor.config.ts`, `mobile/www`) открывает production-сайт с `/start`. Сборка — GitHub Actions `.github/workflows/android-apk.yml` (артефакт `gapir-apk`, debug-подпись). Адрес можно переопределить переменной репозитория `GAPIR_APP_URL`.

## Документы для продолжения работы

- [docs/PROJECT.md](docs/PROJECT.md) — что это за проект, запуск на новом устройстве, выкладка, что сейчас в работе.
- [CHANGELOG.md](CHANGELOG.md) — версии сайта и приложения: что изменилось и что где выложено.
- [docs/VOICEOVER.md](docs/VOICEOVER.md) — озвучка уроков.
