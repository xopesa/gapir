# Gapir AI Tutor — Stage 3.1 + Stage 3.2 Testing

## 1. Безопасный test mode

Автоматические tests используют только mock providers. Они не читают реальный AI key и не вызывают платные API.

## 2. Команды

В CMD:

```bat
cd /d C:\Users\User\Desktop\Gapir
npm run db:generate
npm run typecheck
npm run lint
npm test
npm run build
npm run build:sites
```

В PowerShell при запрете script execution используйте `npm.cmd`.

## 3. Автоматическое покрытие

`tests/ai-assistant.test.ts` проверяет:

- safe feature flags и malformed env;
- provider selection;
- оба versioned prompt направления;
- direction validation;
- strict response parsing и JSON Schema;
- JSON внутри markdown fence;
- malformed LLM JSON;
- normalized unauthorized response;
- ownership и чужой session user ID;
- audio size и MIME/magic bytes;
- missing external API key;
- provider timeout;
- mock STT, LLM и TTS;
- cost calculation и unknown usage;
- content-free telemetry record;
- temp audio cleanup после ошибки.

Существующие domain tests продолжают выполняться без изменений.

`tests/ai-assistant-frontend.test.ts` дополнительно проверяет public flags, обе пары языков, параметры старта, защиту от двойной отправки, типизированный API client, detached browser `fetch`, timeout/retry, multipart audio, восстановление session, условные блоки ответа, локализованные ошибки, итог session, пустые history/memory, voice limits и критические mobile CSS rules.

## 4. Ручная frontend mock-проверка

1. Включите `ENABLE_AI_ASSISTANT`, `ENABLE_AI_TUTOR`, `ENABLE_AI_VOICE_INPUT` и три mock provider.
2. Запустите `npm.cmd run dev` и войдите в существующий Gapir account.
3. Откройте `/ai-assistant`, проверьте метку `Mock AI`, карточки функций и выбор direction/level/topic.
4. Создайте session, отправьте текст, обновите страницу и убедитесь, что URL `/ai-assistant/tutor/{id}` восстанавливает историю.
5. Завершите session через confirmation modal, проверьте summary, `/ai-assistant/history` и learning memory.
6. Проверьте desktop и ширины 390–420 px: горизонтального overflow быть не должно, composer остаётся над bottom navigation.
7. Разрешение на микрофон запрашивается только по нажатию. Не выполняйте audio smoke test в окружении, где захват реального микрофона не был явно разрешён.

## 5. Ручная mock-проверка API

1. Включите Assistant/Tutor и mock providers в `.env`.
2. Выполните migrations и запустите server.
3. Войдите через существующий `/login`, чтобы browser получил `gapir_session`.
4. Создайте session через browser DevTools/Postman с cookie.
5. Сохраните returned session `id`.
6. Отправьте text message на `/api/ai-assistant/sessions/{id}/messages`.
7. Проверьте response fields, history, memory и finish endpoint.

Ожидаемый response имеет `version: "1"`, server-owned XP/coins/latency/provider/model и `audioUrl: null` в mock mode.

## 6. Authorization cases

- без cookie каждый endpoint возвращает HTTP 401 и normalized error envelope;
- несуществующий ID возвращает `AI_SESSION_NOT_FOUND`;
- session другого user возвращает `AI_SESSION_FORBIDDEN`;
- повторный одинаковый `clientMessageId` возвращает сохранённый result и не начисляет XP повторно.

## 7. Audio cases

Проверьте:

- корректный WAV до limit;
- extension, не совпадающий с MIME;
- подменённый content/header;
- файл больше `AI_MAX_AUDIO_BYTES`;
- WAV длиннее `AI_MAX_AUDIO_DURATION_MS`;
- provider error и отсутствие temp-файла после ответа.

Raw audio не должен появляться в `public/`, Prisma tables или permanent project directories.

## 8. Database verification

Migration должна создать:

- `AiAssistantSession`;
- `AiAssistantMessage`;
- `AiTutorMemory`;
- `AiLearnedWord`;
- `AiProviderLog`;
- `AiUsageCost`.

Повторный `npm run db:migrate` должен сообщить, что migration уже applied, а не повторять DDL.

## 9. External provider smoke test

Выполнять только при явно предоставленном локальном key и разрешённом бюджете:

1. Настройте provider/model/key в `.env`.
2. Сначала вызовите authenticated health endpoint.
3. Отправьте одно короткое text message.
4. Проверьте provider logs/usage без prompt/audio content.
5. Удалите key из shell/history после теста при необходимости.

Никогда не запускайте external smoke test в обычном automated suite.
