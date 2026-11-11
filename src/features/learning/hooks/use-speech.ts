"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioManifest } from "@/src/content/audio-manifest.generated";

function normalizeKey(text: string) {
  return text.normalize("NFC").replace(/[ʻ‘’`']/g, "ʻ").trim();
}

function findVoice(lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(lang)) ?? null;
}

// Plays pre-generated audio for a phrase when it exists (public/audio/...),
// otherwise a system voice for the language if the device has one.
// `available` is false when neither exists, so the UI can hide the button.
export function useSpeech(text: string | undefined, lang = "uz") {
  const url = text ? audioManifest[normalizeKey(text)] : undefined;
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (url || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const update = () => setVoice(findVoice(lang));
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, [lang, url]);

  const play = useCallback((slow = false) => {
    if (!text) return;
    if (url) {
      audioRef.current?.pause();
      const audio = new Audio(url);
      audio.playbackRate = slow ? 0.7 : 1;
      audioRef.current = audio;
      setPlaying(true);
      audio.onended = () => setPlaying(false);
      audio.onerror = () => setPlaying(false);
      void audio.play().catch(() => setPlaying(false));
      return;
    }
    if (voice) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = slow ? 0.6 : 0.9;
      utterance.onend = () => setPlaying(false);
      setPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [text, url, voice]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return { available: Boolean(text && (url || voice)), playing, play };
}
