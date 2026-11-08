# Local AI workers setup

## Current prerequisite status

This computer currently has Python 3.14, while the pinned worker path requires Python 3.11. No worker packages or model weights were installed by Stage 3.3.

Recommended STT model: `Systran/faster-whisper-small` from Hugging Face. The repository is about 486 MB and its main model file about 484 MB. Published CPU INT8 reference memory is about 1.48 GB. Do not start it while the machine has insufficient free memory. A smaller fallback is `Systran/faster-whisper-base` (about 148 MB repository / 145 MB model), with lower expected Uzbek accuracy.

## Install dependencies

1. Install 64-bit Python 3.11 and make it available through the Windows `py` launcher.
2. Open CMD in `C:\Users\User\Desktop\Gapir`.
3. Run `setup-ai-workers.bat`.
4. Read the warning and type `YES` only if package installation is intended.

The script creates only `services\ai-workers\.venv`. It does not download weights.

## Configure and start

In the same CMD window:

```bat
set AI_STT_MODEL_PATH=C:\absolute\path\to\faster-whisper-small
set AI_STT_UZ_PROVIDER=faster_whisper
set AI_STT_ZH_PROVIDER=faster_whisper
set AI_STT_UZ_MODEL=faster-whisper-small
set AI_STT_ZH_MODEL=faster-whisper-small
start-gapir-with-ai.bat
```

The launcher verifies Python and the virtual environment, starts STT on `127.0.0.1:8101`, waits up to 30 seconds for a healthy response, then starts Next.js. TTS is not started unless `AI_TTS_WORKER_ENABLED=true`.

Optional host/port variables are `AI_WORKER_HOST`, `AI_STT_WORKER_PORT`, and `AI_TTS_WORKER_PORT`. Keep the host at `127.0.0.1` unless a protected network deployment is deliberately configured.

## Endpoints

- `GET http://127.0.0.1:8101/health`
- `POST http://127.0.0.1:8101/transcribe` with multipart fields `audio`, `language`, `requestId`, `provider`, and `model`
- `GET http://127.0.0.1:8102/health`
- `POST http://127.0.0.1:8102/synthesize`

The STT worker accepts WAV, MP3, M4A, OGG, WebM, FLAC, and MP4 containers. Decoding/resampling is performed inside faster-whisper/PyAV. Upload size, concurrency, and inference time are bounded. Temporary files are removed in a `finally` block, including timeout/error paths. Silence returns an empty transcript instead of crashing the worker.

