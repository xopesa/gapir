import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, resolve, sep } from "node:path";
import { AiError } from "../errors/ai-error";

export const ALLOWED_AUDIO_TYPES = {
  "audio/wav": [".wav"],
  "audio/x-wav": [".wav"],
  "audio/webm": [".webm"],
  "audio/ogg": [".ogg", ".oga"],
  "audio/mpeg": [".mp3"],
  "audio/mp4": [".m4a", ".mp4"],
} as const;

export type AllowedAudioMime = keyof typeof ALLOWED_AUDIO_TYPES;

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

export function detectAudioMime(bytes: Uint8Array): AllowedAudioMime | null {
  if (bytes.length >= 12 && ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WAVE") return "audio/wav";
  if (bytes.length >= 4 && ascii(bytes, 0, 4) === "OggS") return "audio/ogg";
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return "audio/webm";
  if (bytes.length >= 3 && ascii(bytes, 0, 3) === "ID3") return "audio/mpeg";
  if (bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "audio/mpeg";
  if (bytes.length >= 12 && ascii(bytes, 4, 4) === "ftyp") return "audio/mp4";
  return null;
}

export function wavDurationMs(bytes: Uint8Array) {
  if (detectAudioMime(bytes) !== "audio/wav" || bytes.length < 44) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const byteRate = view.getUint32(28, true);
  if (!byteRate) return null;
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const chunk = ascii(bytes, offset, 4);
    const size = view.getUint32(offset + 4, true);
    if (chunk === "data") return Math.round(size / byteRate * 1000);
    offset += 8 + size + (size % 2);
  }
  return null;
}

export function validateAudio(input: {
  bytes: Uint8Array;
  fileName: string;
  declaredMimeType: string;
  declaredDurationMs?: number | null;
  maxBytes: number;
  maxDurationMs: number;
}) {
  if (input.bytes.byteLength > input.maxBytes) throw new AiError("AI_AUDIO_TOO_LARGE", "Audio file is too large.", { retryable: false });
  const declared = input.declaredMimeType.toLowerCase() as AllowedAudioMime;
  const extensions = ALLOWED_AUDIO_TYPES[declared];
  const extension = extname(input.fileName).toLowerCase();
  if (!extensions || !extensions.includes(extension as never)) throw new AiError("AI_AUDIO_UNSUPPORTED", "Audio file extension or declared MIME type is unsupported.", { retryable: false });
  const detected = detectAudioMime(input.bytes);
  const compatibleWav = detected === "audio/wav" && declared === "audio/x-wav";
  if (!detected || (detected !== declared && !compatibleWav)) throw new AiError("AI_AUDIO_UNSUPPORTED", "Audio content does not match its MIME type.", { retryable: false });
  const measuredDuration = wavDurationMs(input.bytes);
  const duration = measuredDuration ?? input.declaredDurationMs ?? null;
  if (duration !== null && (!Number.isFinite(duration) || duration <= 0)) throw new AiError("AI_AUDIO_UNSUPPORTED", "Audio duration is invalid.", { retryable: false });
  if (duration !== null && duration > input.maxDurationMs) throw new AiError("AI_AUDIO_TOO_LONG", "Audio recording is too long.", { retryable: false });
  return { mimeType: detected, extension, durationMs: duration, durationVerified: measuredDuration !== null };
}

export async function withTemporaryAudioFile<T>(input: { bytes: Uint8Array; extension: string }, action: (path: string) => Promise<T>) {
  const root = resolve(tmpdir(), "gapir-ai");
  await mkdir(root, { recursive: true, mode: 0o700 });
  const filePath = resolve(root, `${randomUUID()}${input.extension}`);
  if (!filePath.startsWith(`${root}${sep}`)) throw new AiError("AI_AUDIO_UNSUPPORTED", "Unsafe temporary audio path.", { retryable: false });
  await writeFile(filePath, input.bytes, { flag: "wx", mode: 0o600 });
  try {
    return await action(filePath);
  } finally {
    await rm(filePath, { force: true });
  }
}

const activeTurns = new Map<string, number>();

export async function withUserConcurrencyLimit<T>(userId: string, limit: number, action: () => Promise<T>) {
  const active = activeTurns.get(userId) ?? 0;
  if (active >= limit) throw new AiError("AI_RATE_LIMITED", "Another AI request is already running.");
  activeTurns.set(userId, active + 1);
  try {
    return await action();
  } finally {
    const remaining = (activeTurns.get(userId) ?? 1) - 1;
    if (remaining <= 0) activeTurns.delete(userId);
    else activeTurns.set(userId, remaining);
  }
}
