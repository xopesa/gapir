# Stage 3.3 integration report

## Outcome

Real Gemini LLM integration is working for both tutor directions. The existing frontend, API routes, Conversation Engine, persistence, and mock providers were preserved. Real-to-mock fallback was not added.

The full voice pipeline is not claimed as complete: local STT cannot be executed until Python 3.11, sufficient free RAM, and local weights are present; local TTS remains disabled because no acceptable ready model was found.

## Why AI was not real before Stage 3.3

Provider selection defaulted to mock, the generic `openai_compatible`/Gemini registry route did not exist, language-specific STT/TTS routing did not exist, and the research directories contained source code rather than ready installed weights. The original diagnostic is in `docs/AI_STAGE_3_3_DIAGNOSTIC.md`.

## Gemini verification (2026-08-05)

- `AI_LLM_API_KEY` loaded from `.env` without printing or logging its value.
- Configured `gemini-2.5-flash`: HTTP 404 — `This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use a newer model for the latest features and improvements.`
- Control model `gemini-3.6-flash`: HTTP 200 and minimal response `OK`.
- Real structured tutor test, Uzbek native → Chinese target: passed; latest run about 7.2 seconds.
- Real structured tutor test, Chinese native → Uzbek target: passed; latest run about 7.4 seconds.
- The final responses passed the complete Zod/JSON response contract and language-role assertions (target language for the teacher reply, native language for the explanation). Gemini structured output required changing `version` from JSON Schema `const` to the equivalent string enum.

The real checks used a process-only model override. `.env` was not overwritten.

## Research audit

No research repository was copied or modified.

| Component | Finding | Decision |
| --- | --- | --- |
| faster-whisper | MIT source present; no weights. `base` ≈148 MB repo/145 MB model. `small` ≈486 MB repo/484 MB model; CPU INT8 reference RAM ≈1.48 GB. | Implemented isolated CPU worker; weights remain user-supplied and local-only. |
| FunASR | Apache-2.0 source present; no ready model. Examined CPU GGUF pair is roughly 954 MB total. | No download; experimental provider routes transparently to faster-whisper for Chinese. |
| TurkicTTS | Source present without an acceptable repository license; referenced weights are external (about 14.9 MB + 102.3 MB). | Not copied or integrated. Uzbek TTS disabled/external only. |
| CosyVoice | Apache-2.0 source present; no weights. Referenced repository is about 2.62 GB and does not list Uzbek among its nine languages. | No download; adapter prepared but disabled, with explicit external-TTS fallback. |
| uzbek-asr | No released model and no usable license path for copying. | Not integrated. |
| openWakeWord / Pipecat | Out of Stage 3.3 scope. | Not integrated. |
| Virtual GPTeacher | Reviewed only as a reference. | Existing versioned Gapir prompts retained and tightened for strict JSON. |

Machine audit: Intel i5-1235U, about 7.7 GB RAM, only about 0.6 GB free during the audit, Python 3.14.6, no Python 3.11 worker environment, and no system ffmpeg. Therefore no honest local STT latency/RAM result is available yet.

## Implemented components

- Language-aware Provider Manager routing through `AI_STT_UZ_PROVIDER`, `AI_STT_ZH_PROVIDER`, `AI_TTS_UZ_PROVIDER`, and `AI_TTS_ZH_PROVIDER`.
- Generic OpenAI-compatible LLM settings via `AI_LLM_BASE_URL`, `AI_LLM_API_KEY`, and `AI_LLM_MODEL`; named Gemini route included.
- Strict `json_schema` request format and existing one-attempt response repair path.
- FastAPI STT worker with one-time model loading, local-only weights, health, size/type limits, CPU INT8 defaults, timeout, concurrency bound, and cleanup.
- Honest unavailable TTS worker plus disabled/external/provider routing.
- Safe Windows setup/start scripts and opt-in paid tests.
- Inline TTS audio support capped at 2 MB; larger audio must be returned by URL.

## Known limitations

- The local `.env` model name must be manually changed from `gemini-2.5-flash` to `gemini-3.6-flash`.
- No local STT inference was run because prerequisites and weights are absent.
- No local TTS is available; the UI receives a valid text response without audio.
- No WebSocket streaming, wake word, Pipecat live call, avatar, phoneme analysis, animations, offline packs, or fine-tuning was added.
