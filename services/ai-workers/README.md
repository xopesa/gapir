# Gapir AI workers

Workers are isolated from Next.js and bind to localhost by default.

- `stt-worker`: FastAPI + faster-whisper, one model load at process startup, bounded upload, one CPU inference at a time, timeout, temporary-file cleanup, and `/health`.
- `tts-worker`: an honest unavailable endpoint until license-cleared weights are configured. It never returns browser or mock speech as a real model result.

No model is downloaded automatically. `AI_STT_MODEL_PATH` must point to an existing local faster-whisper/CTranslate2 model directory. See `docs/LOCAL_AI_WORKERS_SETUP.md`.

