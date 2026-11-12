# Gapir — о проекте (для продолжения работы на любом устройстве)

Обновлено: 12.11.2026, версия 1.1.0. Что менялось по версиям: [CHANGELOG.md](../CHANGELOG.md).

## Что это

Приложение для изучения языков в стиле Duolingo. Ученики — китайцы, живущие в Узбекистане.
- Курс **китайский → русский** (главный сейчас): 3 юнита по 6 уроков, по учебникам из папки `методички/`.
- Курс **китайский → узбекский**: 2 юнита.
- Интерфейс на 4 языках: китайский, русский, узбекский (новый алфавит: ö ğ ş ç), английский.

| Что | Где |
|---|---|
| Сайт | https://gapir.gapir-web.workers.dev (Cloudflare Workers + база D1 `gapir-db`) |
| Код | https://github.com/xopesa/gapir, ветка `feat/cloudflare-duo-lessons`, PR #1 |
| Приложение Android | оболочка Capacitor вокруг сайта; собирается в GitHub Actions (`.github/workflows/android-apk.yml`) |
| Версия | `package.json` → `version`; видна в профиле на сайте |

## Запуск на новом устройстве

Нужны Node.js 22.13+ и Python 3 (для озвучки).

```bash
git clone https://github.com/xopesa/gapir.git
cd gapir
git checkout feat/cloudflare-duo-lessons
npm install
```

Файл `.env` в git не хранится. Скопируйте `.env.example` в `.env` и заполните `DATABASE_URL` (например `file:./prisma/dev.db`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`. Провайдеры ИИ можно оставить `mock`.

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Сайт откроется на http://localhost:3000. Проверки перед сохранением: `npm test`, `npx tsc --noEmit`, `npm run lint`.

Для выкладки нужен вход в Cloudflare: `npx wrangler login` (аккаунт владельца проекта).

## Где что лежит

| Папка / файл | Что там |
|---|---|
| `prisma/content/` | Уроки. `zh-ru-unit1..3.ts` — русский курс, `zh-ru-voice.ts` — задания на слух и «скажи вслух», `zh-uz-unit1..2.ts` — узбекский курс, `common.ts` — типы заданий |
| `src/features/learning/components/` | Главная с маршрутом (`learning-screen.tsx`) и экран урока (`lesson-player.tsx`) |
| `src/features/practice/` | Страница «Повторение» |
| `src/lib/answer-check.ts` | Проверка ответов (общая для сервера и офлайн-режима) |
| `src/i18n/dictionaries/` | Тексты интерфейса на 4 языках |
| `app/duo.css`, `app/globals.css` | Стили. Цвета: `--color-primary #f07a2e`, фон `#fdf5ec`, `--gx-lilac`, `--gx-ink` |
| `public/audio/` | Озвучка: `ru/`, `uz/` — слова; `narration/` — объяснения; `question/` — вопросы заданий |
| `scripts/generate-audio.ts` | Озвучка слов и объяснений (Microsoft Edge) и список вопросов |
| `docs/VOICEOVER.md` | Как делается озвучка, голоса, лимиты Google AI Studio |
| `методички/` | Учебники (PDF), по которым пишутся уроки |

## Типы заданий

Хранятся в базе как 4 типа, варианты задаются полями:
- `MULTIPLE_CHOICE` — выбор ответа; с `listen: true` — задание на слух (виден только динамик).
- `MATCHING` — соединить пары.
- `ARRANGE_WORDS` — собрать фразу из слов.
- `TRANSLATE` — ответ из плиток (`tiles`); с `say: true` — «скажи вслух» (микрофон).
- У любого задания может быть `teach` — короткое объяснение перед ним.

Клавиатурного ввода в уроках нет и добавлять его не нужно: либо плитки, либо выбор, либо голос.

## Как выложить обновление

```bash
npm test
npm run db:seed
npx tsx scripts/generate-audio.ts
node scripts/export-content-sql.mjs > .open-next/content.sql
npx wrangler d1 execute gapir-db --remote --file .open-next/content.sql --yes
npm run cf:build
npx opennextjs-cloudflare deploy
```

Правила:
- Перед выкладкой поднять версию в `package.json` и дописать `CHANGELOG.md`.
- В базу сайта уроки только добавляются и обновляются. **Никогда не удалять уроки в D1**: вместе с уроком стирается прогресс учеников.
- Если менялись только код и дизайн, шаги с `db:seed`, `export-content-sql` и `d1 execute` не нужны.
- После выкладки записать в `CHANGELOG.md` номер «Current Version ID» из вывода deploy.

## Приложение Android

- Это оболочка: открывает сайт с адреса `/start` (гостевой вход без пароля). Уроки, дизайн и исправления приходят с сайта сами, пересобирать приложение для этого не нужно.
- Пересобирать нужно, когда меняется сама оболочка: иконка, разрешения (микрофон), версия.
- Сборка: GitHub → Actions → «Android APK» → Run workflow. Готовый файл `Gapir-v<версия>.apk` лежит в артефактах запуска.
- Версия приложения = версия сайта на момент сборки. Приложение сообщает её сайту, и она видна в профиле («приложение 1.1.0»). Сборка от 11.11.2026 показывает «приложение 1.0».

## Сейчас в работе (на 12.11.2026)

- Версия 1.1.0 готова локально, **не выложена** на сайт и не отправлена на GitHub.
- Дальше по плану: задания из учебника для юнитов 2–3, юнит 4, озвучка 89 узбекских вопросов, сборка приложения с микрофоном.
- Известные проблемы перечислены в `CHANGELOG.md`, раздел 1.1.0 → «Не проверено / не сделано».
