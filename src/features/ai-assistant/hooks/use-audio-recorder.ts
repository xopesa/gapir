"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_AUDIO_DURATION_MS } from "../utils";

const MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];

export type RecordedAudio = { blob: Blob; mimeType: string; durationMs: number; fileName: string };

export function selectRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  return MIME_TYPES.find((value) => MediaRecorder.isTypeSupported(value)) ?? "";
}

export function useAudioRecorder(onRecorded: (audio: RecordedAudio) => void, onError: (error: unknown) => void) {
  const [recording, setRecording] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (recording || typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const selected = selectRecorderMimeType();
      const recorder = selected ? new MediaRecorder(stream, { mimeType: selected }) : new MediaRecorder(stream);
      const declaredMimeType = recorder.mimeType.split(";")[0] || "audio/webm";
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      startedRef.current = Date.now();
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onerror = (event) => { cleanup(); onError(event); };
      recorder.onstop = () => {
        const elapsed = Math.min(Date.now() - startedRef.current, MAX_AUDIO_DURATION_MS);
        const blob = new Blob(chunksRef.current, { type: declaredMimeType });
        const extension = declaredMimeType.includes("ogg") ? "ogg" : declaredMimeType.includes("mp4") ? "m4a" : "webm";
        cleanup();
        if (blob.size) onRecorded({ blob, mimeType: declaredMimeType, durationMs: elapsed, fileName: `voice-message.${extension}` });
      };
      recorder.start(250);
      setRecording(true);
      setDurationMs(0);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startedRef.current;
        setDurationMs(Math.min(elapsed, MAX_AUDIO_DURATION_MS));
        if (elapsed >= MAX_AUDIO_DURATION_MS && recorder.state === "recording") recorder.stop();
      }, 250);
      return true;
    } catch (error) {
      cleanup();
      onError(error);
      return false;
    }
  }, [cleanup, onError, onRecorded, recording]);

  useEffect(() => cleanup, [cleanup]);
  return { supported: typeof MediaRecorder !== "undefined" && Boolean(globalThis.navigator?.mediaDevices?.getUserMedia), recording, durationMs, start, stop };
}
