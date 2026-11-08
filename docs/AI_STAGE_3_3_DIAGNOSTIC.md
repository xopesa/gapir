# Stage 3.3 — pre-integration diagnostic

Date: 2026-08-04

Status: **blocked before implementation by missing real LLM credentials and provider selection**. No existing Gapir source file, `.env`, Prisma schema, research repository, or provider implementation was changed during this diagnostic pass.

## Why the current assistant is not real AI

- The working `.env` contains no `ENABLE_AI_*`, `AI_*`, `OPENAI_API_KEY`, or `AI_LLM_API_KEY` values.
- `getAiConfig()` defaults every provider to `mock`; AI feature flags default to disabled.
- The currently running development process was started with AI enabled and all three providers in mock mode. This is confirmed by the visible `Mock AI` badge and deterministic repeated responses in the active Tutor session.
- The current OpenAI-compatible implementation is registered under provider name `openai` and reads `OPENAI_API_KEY` / `OPENAI_BASE_URL`. The requested Stage 3.3 names (`openai_compatible`, `AI_LLM_API_KEY`, `AI_LLM_BASE_URL`) are not wired yet.
- Selecting `AI_LLM_PROVIDER=openai_compatible` in the current code would fail with `AI_PROVIDER_NOT_CONFIGURED`, because no provider with that registry name exists.
- No local STT or TTS worker directory exists yet.

## Current request path

- Text and multipart routes are present.
- Multipart accepts WAV, MP3, M4A/MP4, OGG/OGA, and WebM after MIME signature validation.
- Size and duration limits, per-user concurrency, request IDs, timeout handling, and temporary-file cleanup are already implemented.
- Provider Manager is used by the Conversation Engine for STT, LLM, and TTS.
- LLM output is parsed through a strict versioned Zod schema, with one repair attempt.
- Real-provider failure is not replaced by mock output.
- Optional TTS failure produces a valid text response without audio, as allowed by the Stage 3.3 fallback policy.

## Runtime observations

- `localhost:3000` is served by the current Next.js Node process.
- Unauthenticated GET requests to provider health, history, and memory correctly return HTTP 401.
- The authenticated Tutor UI restores an existing session and displays working mock turns.
- Browser console contains no errors or warnings.
- All current tests pass: 53/53.

## Local machine

- CPU: Intel Core i5-1235U, 10 cores / 12 logical processors.
- RAM: 7.7 GB total; approximately 0.6 GB free during the audit.
- Python: 3.14.6 only.
- FFmpeg command: not installed.
- `faster-whisper`, CTranslate2, PyAV, FastAPI, Uvicorn, Torch, FunASR, and ModelScope are not installed in the active Python environment.
- A separate Python 3.11 environment is recommended for the worker stack; no dependency was installed automatically.

## Research repository audit

The original directory `C:\Users\User\Desktop\Gapir_AI_Research` was read only.

| Component | Local source | Local model weights | License / suitability | Decision |
| --- | ---: | --- | --- | --- |
| faster-whisper | 22.73 MB | No Whisper checkpoint; only a 1.19 MB Silero VAD asset | MIT; supports CPU INT8 and multilingual Whisper | Primary STT candidate after model approval/configuration |
| Fun-ASR | 5.52 MB | None | Apache-2.0; Nano is suitable for Mandarin, not Uzbek | Keep as optional Chinese experimental adapter |
| TurkicTTS | 0.15 MB | None | Repository has no LICENSE file; Uzbek is described but redistribution/use terms for code and weights are not established | Do not integrate |
| CosyVoice | 2.93 MB | None | Apache-2.0 code; published language list does not include Uzbek | Do not integrate for Uzbek; Chinese remains blocked by model size/hardware |
| uzbek-asr | 58.50 MB | No released model | README explicitly says the trained model is not publicly released because of service-term concerns; no repository LICENSE | Do not copy or integrate |
| Virtual GPTeacher | 0.03 MB | Not applicable | MIT; legacy prototype only | Conceptual reference only; existing Conversation Engine remains authoritative |
| Pipecat | 38.20 MB | Small VAD/turn assets only | Out of Stage 3.3 scope | Not integrated |
| openWakeWord | 3.94 MB | No relevant production wake-word model | Out of Stage 3.3 scope | Not integrated |

## Model sizes and download gates

### faster-whisper

- `Systran/faster-whisper-base`: 148 MB repository total; 145 MB `model.bin`.
- `Systran/faster-whisper-small`: 486 MB repository total; 484 MB `model.bin`.
- The faster-whisper README reports approximately 1,477 MB RAM for `small` INT8 CPU transcription on its reference benchmark.
- Both base and small are under the explicit 500 MB single-download limit, but neither is present locally.
- Primary sources: [faster-whisper](https://github.com/SYSTRAN/faster-whisper), [base checkpoint](https://huggingface.co/Systran/faster-whisper-base/tree/main), [small checkpoint](https://huggingface.co/Systran/faster-whisper-small/tree/main).

### Fun-ASR Nano GGUF

- Mandarin CPU path requires at least the 470 MB encoder plus a decoder.
- Smallest documented decoder is Q4_K_M at 484 MB.
- Required pair is therefore approximately 954 MB before the VAD model and runtime.
- This exceeds 500 MB and requires explicit user approval before downloading.
- Primary source: [Fun-ASR Nano GGUF model card](https://huggingface.co/FunAudioLLM/Fun-ASR-Nano-GGUF).

### TurkicTTS

- Published vocoder archive: 14.89 MB by HTTP metadata.
- Published acoustic-model archive: 102.31 MB by HTTP metadata.
- Combined download: approximately 117.20 MB.
- The repository describes Uzbek and CPU execution, but contains no LICENSE file. Stage 3.3 therefore forbids integration despite the small size.

### CosyVoice

- `FunAudioLLM/CosyVoice-300M` repository is approximately 2.62 GB.
- The model exceeds the 500 MB approval threshold and is not suitable for this 8 GB RAM machine as the default local TTS path.
- Published language coverage includes Chinese but not Uzbek.
- Primary source: [CosyVoice-300M files](https://huggingface.co/FunAudioLLM/CosyVoice-300M/tree/main).

## Real LLM blocker

All of the following are currently unset:

- `AI_LLM_PROVIDER`
- `AI_LLM_BASE_URL`
- `AI_LLM_API_KEY`
- `AI_LLM_MODEL`
- legacy `OPENAI_API_KEY`
- legacy `OPENAI_BASE_URL`

A real Tutor response cannot be implemented and verified without selecting an OpenAI-compatible endpoint/model and configuring its API key. Mock E2E is not evidence of real integration.

## Required decision before implementation

Provide the intended provider, base URL, and model, and place the real secret in the local `.env` as `AI_LLM_API_KEY`. Do not commit or paste the secret into source files.

For the STT path, choose one:

1. `faster-whisper-base` — 148 MB, lighter CPU/RAM starting point.
2. `faster-whisper-small` — 486 MB, better accuracy but higher CPU/RAM cost.
3. Approve the Fun-ASR Mandarin package — at least approximately 954 MB, only if a dedicated Chinese CPU adapter is required now.

Implementation, backups, worker scaffolding, downloads, dependency installation, and real paid calls remain paused until this decision is supplied.
