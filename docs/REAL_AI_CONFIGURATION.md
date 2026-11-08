# Real AI configuration

## Gemini LLM

The Stage 3.3 adapter uses an OpenAI-compatible endpoint and strict JSON Schema output. For Gemini:

```env
AI_LLM_PROVIDER="gemini"
AI_LLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
AI_LLM_API_KEY="your-server-side-key"
AI_LLM_MODEL="gemini-3.6-flash"
```

Keep the key only in `.env`; never use a `NEXT_PUBLIC_` name. The provider key is non-enumerable, so serializing the provider object does not include it. A missing key returns `AI_PROVIDER_NOT_CONFIGURED`; a failed real provider never silently returns a mock answer.

The current local `.env` was not changed by Stage 3.3. Its configured `gemini-2.5-flash` returned HTTP 404 because that model is no longer available to new users. Update that one model value manually to `gemini-3.6-flash` before running Gapir with real Gemini.

## Speech routing

```env
AI_STT_UZ_PROVIDER="faster_whisper"
AI_STT_ZH_PROVIDER="faster_whisper"
AI_STT_UZ_MODEL="faster-whisper-small"
AI_STT_ZH_MODEL="faster-whisper-small"
AI_STT_WORKER_URL="http://127.0.0.1:8101"

AI_TTS_UZ_PROVIDER="disabled"
AI_TTS_ZH_PROVIDER="disabled"
AI_TTS_WORKER_URL="http://127.0.0.1:8102"
```

`AI_STT_ZH_PROVIDER=funasr` is available as an experimental route with an explicit faster-whisper fallback. FunASR is not reported as healthy until its own model is configured. `AI_TTS_ZH_PROVIDER=cosyvoice` has an explicit external-TTS fallback; when neither is configured, the conversation remains text-only.

For any external OpenAI-compatible TTS:

```env
AI_TTS_UZ_PROVIDER="external"
AI_TTS_ZH_PROVIDER="external"
AI_TTS_API_KEY="your-server-side-key"
AI_TTS_BASE_URL="https://provider.example/v1"
AI_TTS_MODEL="provider-model"
AI_TTS_VOICE="provider-voice"
```

## Paid integration test

Paid tests are skipped by default. To run them explicitly in PowerShell without editing `.env`:

```powershell
$env:RUN_PAID_AI_TESTS='true'
$env:AI_LLM_MODEL='gemini-3.6-flash'
node --env-file=.env node_modules/vitest/vitest.mjs run --config vitest.config.ts tests/ai-assistant-paid.integration.test.ts
```

