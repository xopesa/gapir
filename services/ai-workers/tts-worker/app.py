from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Gapir TTS Worker", version="1.0")


class SynthesisRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    language: str
    voice: str = "default"
    provider: str
    model: str
    requestId: str = ""


@app.get("/health")
async def health() -> dict[str, object]:
    return {
        "healthy": False,
        "configured": False,
        "provider": "disabled",
        "model": "",
        "message": "No license-cleared Uzbek/Chinese TTS weights are installed. Text-only mode remains available.",
    }


@app.post("/synthesize")
async def synthesize(_: SynthesisRequest) -> None:
    raise HTTPException(status_code=503, detail="TTS model is not configured; no mock audio fallback is used.")

