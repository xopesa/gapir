"""Synthesises audio jobs with Microsoft Edge neural voices (pip install edge-tts).

Input: a JSON file with [{"out": "path.mp3", "segments": [{"voice", "text", "rate"}]}].
Each job's segments are spoken one after another and written as one MP3
(the voices share one MP3 format, so the streams can be joined byte by byte).
Used by scripts/generate-audio.ts; not meant to be run on its own.
"""
import asyncio
import json
import os
import sys

import edge_tts


async def speak(segment):
    for attempt in range(4):
        try:
            chunks = []
            communicate = edge_tts.Communicate(segment["text"], segment["voice"], rate=segment.get("rate", "+0%"))
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    chunks.append(chunk["data"])
            if chunks:
                return b"".join(chunks)
        except edge_tts.exceptions.NoAudioReceived:
            # A lone symbol (e.g. IPA "ʌ") has nothing to say: skip it.
            print(f"skip segment {segment['text'][:20]!r}", flush=True)
            return b""
        except Exception as error:  # network hiccups: retry
            if attempt == 3:
                raise RuntimeError(f"{segment['voice']}: {segment['text'][:40]}: {error}")
        await asyncio.sleep(1 + attempt * 2)
    raise RuntimeError(f"no audio for {segment['text'][:40]}")


async def run(job, gate):
    async with gate:
        parts = [await speak(segment) for segment in job["segments"]]
        os.makedirs(os.path.dirname(job["out"]), exist_ok=True)
        with open(job["out"], "wb") as handle:
            handle.write(b"".join(parts))
        print(f"saved {job['out']}", flush=True)


async def main(path):
    with open(path, encoding="utf-8") as handle:
        jobs = json.load(handle)
    gate = asyncio.Semaphore(6)
    await asyncio.gather(*(run(job, gate) for job in jobs))


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
