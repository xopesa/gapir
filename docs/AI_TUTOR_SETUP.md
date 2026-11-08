# Gapir AI Tutor — Stage 3.1 + Stage 3.2 Setup

Дата: 4 августа 2026 года. Инструкция охватывает backend Stage 3.1 и frontend Stage 3.2.

## 1. Требования

- Node.js `>=22.13.0`;
- существующий проект `C:\Users\User\Desktop\Gapir`;
- SQLite для локальной разработки;
- выполненные migrations;
- существующий Gapir account и cookie-session для вызова API.

Frontend AI Assistant доступен авторизованным пользователям на `/ai-assistant`.

## 2. Установка и база данных

В CMD:

```bat
cd /d C:\Users\User\Desktop\Gapir
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Если PowerShell запрещает `npm.ps1`, используйте `npm.cmd`:

```powershell
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run dev
```

Не используйте `prisma db push`. Stage 3.1 использует migration `20260804000000_ai_assistant_stage_3_1`.

## 3. Feature flags

Без явной настройки AI Assistant безопасно выключен. Для локального mock mode добавьте в `.env`:

```dotenv
ENABLE_AI_ASSISTANT="true"
ENABLE_AI_TUTOR="true"
ENABLE_AI_VOICE_INPUT="true"
ENABLE_AI_TRANSLATION="false"
ENABLE_AI_GRAMMAR="false"
ENABLE_AI_PRONUNCIATION="false"
ENABLE_AI_VOCABULARY="false"
ENABLE_AI_OFFLINE="false"
ENABLE_AI_LOCAL_STT="false"
ENABLE_AI_LOCAL_TTS="false"
```

Неверные boolean-значения не останавливают приложение: backend применяет безопасный default.

## 4. Mock mode

Mock mode не вызывает внешние или платные API:

```dotenv
AI_STT_PROVIDER="mock"
AI_STT_MODEL="mock-stt-v1"
AI_LLM_PROVIDER="mock"
AI_LLM_MODEL="mock-llm-v1"
AI_TTS_PROVIDER="mock"
AI_TTS_MODEL="mock-tts-v1"
AI_TRANSLATION_PROVIDER="mock"
```

Это рекомендуемый режим для разработки, tests и проверки API contracts.

## 5. OpenAI-compatible provider

Stage 3.1 содержит один внешний adapter family для STT, LLM и TTS. Он использует OpenAI-compatible endpoints:

- `POST /audio/transcriptions`;
- `POST /chat/completions` с JSON response mode;
- `POST /audio/speech`.

Настройка выполняется только в `.env`:

```dotenv
AI_STT_PROVIDER="openai"
AI_STT_MODEL="replace-with-supported-stt-model"
AI_LLM_PROVIDER="openai"
AI_LLM_MODEL="replace-with-supported-llm-model"
AI_TTS_PROVIDER="openai"
AI_TTS_MODEL="replace-with-supported-tts-model"
OPENAI_API_KEY="replace-locally-never-commit"
OPENAI_BASE_URL="https://api.openai.com/v1"
AI_TTS_VOICE="alloy"
```

В `.env.example` нет реального ключа. Если key или выбранная model отсутствуют, health показывает `configured: false`, а вызов возвращает `AI_PROVIDER_NOT_CONFIGURED`. Health endpoint не выполняет платный probe.

## 6. Limits и resilience

```dotenv
AI_PROVIDER_TIMEOUT_MS="20000"
AI_PROVIDER_MAX_RETRIES="1"
AI_MAX_AUDIO_BYTES="15728640"
AI_MAX_AUDIO_DURATION_MS="60000"
AI_MAX_MESSAGES_PER_SESSION="40"
AI_RATE_LIMIT_PER_MINUTE="20"
AI_MAX_CONCURRENT_TURNS_PER_USER="1"
```

Допустимые форматы: WAV, WebM, Ogg, MP3 и MP4/M4A. Backend сверяет extension, declared MIME и magic bytes. WAV duration измеряется по header. Для compressed formats Stage 3.1 дополнительно проверяет переданный `durationMs`; полноценный decode/FFprobe планируется позже.

Raw audio помещается под случайным именем в `${os.tmpdir()}/gapir-ai`, никогда не попадает в `public/` и удаляется в `finally` при успехе и ошибке.

## 7. Cost configuration

Цены не зашиты в business logic. Формат:

```dotenv
AI_PRICING_JSON="{\"openai:replace-with-model\":{\"inputPerMillion\":0,\"outputPerMillion\":0,\"currency\":\"USD\"}}"
```

Замените нулевые значения только актуальными утверждёнными тарифами. Если provider не возвращает usage или цены нет, `estimatedCost` записывается как `null`.

## 8. API

Все routes требуют текущую Gapir cookie-session:

- `POST /api/ai-assistant/sessions`;
- `GET /api/ai-assistant/sessions/{id}`;
- `POST /api/ai-assistant/sessions/{id}/messages`;
- `POST /api/ai-assistant/sessions/{id}/finish`;
- `GET /api/ai-assistant/history`;
- `GET /api/ai-assistant/memory`;
- `GET /api/ai-assistant/providers/health`.

Создание session:

```json
{
  "feature": "tutor",
  "direction": "uz_to_zh",
  "level": "beginner",
  "topic": "greeting"
}
```

Text message:

```json
{
  "clientMessageId": "8b518fd0-ea45-4f4a-a3c9-cd89d756b2cf",
  "text": "你好"
}
```

Для multipart используйте fields `audio`, `clientMessageId`, optional `text`, `direction`, `level`, `topic`, `durationMs`, `declaredMimeType`.

## 9. Troubleshooting

| Ошибка | Причина/действие |
|---|---|
| `AI_FEATURE_DISABLED` | Добавьте два enabled flags и перезапустите server |
| `AI_PROVIDER_NOT_CONFIGURED` | Проверьте provider, model и локальный API key |
| `UNAUTHORIZED` | Сначала войдите в существующий Gapir account |
| `AI_SESSION_FORBIDDEN` | Session принадлежит другому user |
| `AI_AUDIO_UNSUPPORTED` | Проверьте extension/MIME и реальный header |
| `AI_AUDIO_TOO_LARGE` / `AI_AUDIO_TOO_LONG` | Уменьшите файл или длительность |
| `AI_TIMEOUT` | Проверьте provider/network или увеличьте timeout в безопасных пределах |
| `AI_INVALID_RESPONSE` | LLM не прошёл strict schema и один repair attempt |

`npm run build` и `npm run build:sites` проходят после замены неподдерживаемых `export *` на явные UI-экспорты. Prisma/SQLite и raw audio processing по-прежнему требуют отдельного hosted storage/runtime решения до реального Sites deployment.

## 10. Ограничения Stage 3.1

- только Uzbek ↔ Simplified Chinese;
- только AI Tutor;
- frontend Stage 3.2 реализует AI Assistant, AI Tutor, историю и память; остальные карточки остаются помечены «Скоро»;
- нет local STT/TTS, offline packs или mobile bridge;
- generated TTS bytes пока не публикуются: без object storage `audioUrl` остаётся `null`;
- rate limit/concurrency guard работают в памяти одного Node process;
- SQLite предназначен для локального режима, не для горизонтального production scaling.
