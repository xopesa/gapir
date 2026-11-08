# Gapir AI Assistant — Stage 3.1 Report

Дата: 4 августа 2026 года.  
Статус: backend Stage 3.1 реализован; Stage 3.2 не начат.

## 1. Результат

В существующий Gapir добавлен расширяемый backend AI Assistant с первой feature `AI Tutor` для `uz_to_zh` и `zh_to_uz`. Frontend, дизайн, маршруты frontend, анимации, звуки и mobile integration не изменялись.

## 2. Изменённые существующие файлы

- `.env.example` — flags, provider, limits и pricing placeholders;
- `prisma/schema.prisma` — AI relations/models/indexes;
- `src/server/db.ts` — schema version для обновлённого generated Prisma client.

Generated Prisma client и локальная `prisma/dev.db` обновлены штатными командами после backup.

## 3. Новые основные файлы

- `ai/prompts/uz_to_zh/tutor/v1.md`;
- `ai/prompts/zh_to_uz/tutor/v1.md`;
- `ai/schemas/ai-tutor-response.v1.schema.json`;
- `prisma/migrations/20260804000000_ai_assistant_stage_3_1/migration.sql`;
- `src/server/ai/config/*`;
- `src/server/ai/errors/*`;
- `src/server/ai/languages/*`;
- `src/server/ai/schemas/*`;
- `src/server/ai/providers/*`;
- `src/server/ai/prompts/*`;
- `src/server/ai/speech/*`;
- `src/server/ai/memory/*`;
- `src/server/ai/telemetry/*`;
- `src/server/ai/cost/*`;
- `src/server/ai/tutor/*`;
- `src/server/ai/assistant/*`;
- `src/server/ai/http/*`;
- `app/api/ai-assistant/**`;
- `tests/ai-assistant.test.ts`;
- три документа Stage 3.1.

## 4. Backups

Основной backup root:

`C:\Users\User\Desktop\Gapir\.codex-runtime\backups\stage-3.1\2026-08-04`

До первоначального изменения сохранены:

- `.env.example`;
- `prisma/schema.prisma`;
- `src/server/db.ts`;
- `generated/prisma/`;
- `prisma/dev.db`.

Перед каждой последующей корректировкой создан снимок `fix-1` … `fix-8`. Исходные backup-файлы проверены контрольными SHA-256/наличием. `.codex-runtime` уже исключён из Git.

## 5. Prisma model changes

Добавлены:

- `AiAssistantSession`;
- `AiAssistantMessage`;
- `AiTutorMemory`;
- `AiLearnedWord`;
- `AiProviderLog`;
- `AiUsageCost`.

Не дублировались существующие progress fields: `User.xp`, `User.streak`, `User.longestStreak` и `User.lastActivityDate` остаются canonical. AI-specific coins хранятся в `AiTutorMemory`. Финализация messages, XP/streak, coins, memory summary и learned words выполняется одной Prisma transaction.

Migration применена через `npm run db:migrate`, без `db push`. Все шесть таблиц и предусмотренные indexes проверены в SQLite.

## 6. API endpoints

- `POST /api/ai-assistant/sessions`;
- `GET /api/ai-assistant/sessions/:id`;
- `POST /api/ai-assistant/sessions/:id/messages`;
- `POST /api/ai-assistant/sessions/:id/finish`;
- `GET /api/ai-assistant/history`;
- `GET /api/ai-assistant/memory`;
- `GET /api/ai-assistant/providers/health`.

Все используют существующую Gapir cookie-auth и server-side ownership check.

## 7. Providers

Реализованы единые contracts `SpeechToTextProvider`, `TutorLLMProvider`, `TextToSpeechProvider`, Provider Manager, health, timeout, retry и normalized errors.

Adapters:

- mock STT/LLM/TTS — default для разработки и tests;
- OpenAI-compatible STT/LLM/TTS — активируется только через env и key;
- real keys/model IDs не добавлены;
- health не выполняет платный external request.

Malformed LLM JSON извлекается из optional markdown fence, строго проверяется Zod/JSON Schema и получает ровно один controlled repair attempt.

## 8. Audio, telemetry and cost

- MIME allowlist, extension и magic-byte matching;
- size limit и WAV duration measurement;
- random temp filename вне `public`;
- cleanup в `finally`;
- per-user rate/concurrency limits;
- telemetry: provider/model/stage latency/success/error/request/session/user/usage;
- system prompts, API keys и raw audio не логируются;
- pricing читается из `AI_PRICING_JSON`;
- неизвестные usage/cost сохраняются как `null`.

## 9. Validation results

- `npm run db:generate` — passed;
- `npm run db:migrate` — passed, migration applied;
- `npm run typecheck` — passed;
- `npm run lint` — passed;
- `npm test` — passed: 2 files, 25 tests, включая 15 AI tests;
- `npm run build` — passed, все семь AI routes включены в production route map.
- local mock end-to-end smoke — passed: temporary user → session → text turn → memory → finish; test user удалён каскадом, остаточных записей нет.

Дополнительный `npm run build:sites` блокируется существующим frontend-файлом `src/components/ui/index.ts`: RSC plugin не поддерживает его `ExportAllDeclaration`. Stage 3.1 этот файл не менял, потому что пользователь запретил frontend changes. Кроме этого, production Sites deployment потребует решения для durable DB/object storage вместо local Prisma SQLite/temp audio. Публикация не выполнялась.

## 10. Известные ограничения

- feature flags по умолчанию выключены; `.env.example` показывает enabled mock setup;
- external family сейчас только OpenAI-compatible;
- TTS bytes проверяются, но без object storage не сохраняются и `audioUrl` остаётся `null`;
- точная duration для compressed audio требует future decoder/FFprobe; Stage 3.1 точно измеряет WAV и ограничивает остальные metadata/size;
- rate limit и concurrency map локальны одному Node process;
- telemetry best-effort и не ломает tutor response;
- SQLite предназначен для local/single-node режима;
- prompts пока имеют одну опубликованную версию `v1` на направление;
- реализованы только AI Tutor, шесть topics и три levels.

## 11. Остаётся для Stage 3.2

Без отдельного подтверждения ничего из списка не реализовано:

- AI Assistant frontend и microphone UI;
- private object storage + signed TTL audio URL;
- distributed rate limits/locks;
- production durable database/Sites bindings;
- admin prompt/provider configuration;
- дополнительные provider adapters;
- local STT/TTS и model downloads;
- offline packs;
- mobile bridge;
- translation, grammar, vocabulary, pronunciation и другие AI modules;
- Russian/English directions;
- continuous/realtime voice.

Stage 3.1 завершён. Переход к Stage 3.2 требует отдельного подтверждения.
