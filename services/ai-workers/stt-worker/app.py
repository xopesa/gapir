from __future__ import annotations

import asyncio
import os
import tempfile
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from shared.config import env_int, required_local_model_path  # noqa: E402

SUPPORTED_LANGUAGES = {"uz": "uz", "zh-CN": "zh"}
ALLOWED_SUFFIXES = {".wav", ".mp3", ".m4a", ".ogg", ".webm", ".flac", ".mp4"}
MAX_AUDIO_BYTES = env_int("AI_MAX_AUDIO_BYTES", 15 * 1024 * 1024, 1024, 50 * 1024 * 1024)
TRANSCRIBE_TIMEOUT_SECONDS = env_int("AI_STT_TIMEOUT_SECONDS", 120, 5, 300)
state: dict[str, Any] = {"model": None, "error": None, "model_path": None}
inference_lock = asyncio.Semaphore(env_int("AI_STT_MAX_CONCURRENCY", 1, 1, 2))


def load_model() -> None:
    try:
        from faster_whisper import WhisperModel

        model_path = required_local_model_path()
        state["model"] = WhisperModel(
            str(model_path),
            device=os.getenv("AI_STT_DEVICE", "cpu"),
            compute_type=os.getenv("AI_STT_COMPUTE_TYPE", "int8"),
            local_files_only=True,
            cpu_threads=env_int("AI_STT_CPU_THREADS", 4, 1, 16),
        )
        state["model_path"] = str(model_path)
    except Exception as error:  # Health exposes configuration failure, never secrets.
        state["error"] = str(error)[:500]


@asynccontextmanager
async def lifespan(_: FastAPI):
    await asyncio.to_thread(load_model)
    yield


app = FastAPI(title="Gapir STT Worker", version="1.0", lifespan=lifespan)


@app.get("/health")
async def health() -> dict[str, object]:
    ready = state["model"] is not None
    return {
        "healthy": ready,
        "configured": bool(os.getenv("AI_STT_MODEL_PATH", "").strip()),
        "provider": "faster_whisper",
        "model": Path(state["model_path"]).name if state["model_path"] else "",
        "message": "ready" if ready else state["error"] or "model is not loaded",
    }


def transcribe_file(path: str, language: str) -> tuple[str, float | None, float | None]:
    segments, info = state["model"].transcribe(
        path,
        language=SUPPORTED_LANGUAGES[language],
        beam_size=1,
        vad_filter=True,
        condition_on_previous_text=False,
    )
    text = " ".join(segment.text.strip() for segment in segments if segment.text.strip()).strip()
    confidence = getattr(info, "language_probability", None)
    duration = getattr(info, "duration", None)
    return text, confidence, duration


@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form(...),
    requestId: str = Form(""),
    provider: str = Form("faster_whisper"),
    model: str = Form(""),
) -> dict[str, object]:
    del model
    if provider not in {"faster_whisper", "funasr"}:
        raise HTTPException(status_code=400, detail="Unsupported STT provider.")
    if provider == "funasr":
        raise HTTPException(status_code=503, detail="FunASR is not configured; the Node adapter may use its explicit faster-whisper fallback.")
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported language.")
    if state["model"] is None:
        raise HTTPException(status_code=503, detail=state["error"] or "STT model is not loaded.")

    suffix = Path(audio.filename or "audio.bin").suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=415, detail="Unsupported audio file type.")
    payload = await audio.read(MAX_AUDIO_BYTES + 1)
    if not payload or len(payload) > MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Audio is empty or exceeds AI_MAX_AUDIO_BYTES.")

    temporary_path = ""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temporary:
            temporary.write(payload)
            temporary_path = temporary.name
        async with inference_lock:
            text, confidence, duration = await asyncio.wait_for(
                asyncio.to_thread(transcribe_file, temporary_path, language),
                timeout=TRANSCRIBE_TIMEOUT_SECONDS,
            )
        return {
            "text": text,
            "language": language,
            "durationMs": round((duration or 0) * 1000),
            "model": Path(state["model_path"]).name if state["model_path"] else "",
            "provider": "faster-whisper",
            "requestId": requestId,
            "confidence": confidence,
        }
    except TimeoutError as error:
        raise HTTPException(status_code=504, detail="STT inference timed out.") from error
    finally:
        if temporary_path:
            Path(temporary_path).unlink(missing_ok=True)
