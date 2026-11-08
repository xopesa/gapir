from __future__ import annotations

import os
from pathlib import Path


def required_local_model_path() -> Path:
    configured = os.getenv("AI_STT_MODEL_PATH", "").strip()
    if not configured:
        raise RuntimeError("AI_STT_MODEL_PATH is required; automatic model downloads are disabled.")
    path = Path(configured).expanduser().resolve()
    if not path.is_dir():
        raise RuntimeError(f"AI_STT_MODEL_PATH is not a local directory: {path}")
    return path


def env_int(name: str, default: int, minimum: int, maximum: int) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError:
        return default
    return value if minimum <= value <= maximum else default

