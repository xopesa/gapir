import { setHapticsEnabled } from "../haptics";
import { defaultSoundSettings, type SoundName, type SoundSettings } from "./sound-types";

const sources: Record<SoundName, string> = {
  buttonTap: "/sounds/button-tap.mp3",
  correctAnswer: "/sounds/correct-answer.mp3",
  wrongAnswer: "/sounds/wrong-answer.mp3",
  lessonComplete: "/sounds/lesson-complete.mp3",
  xpReward: "/sounds/xp-reward.mp3",
  streakReward: "/sounds/streak-reward.mp3",
  purchase: "/sounds/purchase.mp3",
  notification: "/sounds/notification.mp3",
};

const lessonSounds = new Set<SoundName>(["correctAnswer", "wrongAnswer", "lessonComplete", "xpReward", "streakReward"]);
const interfaceSounds = new Set<SoundName>(["buttonTap", "purchase", "notification"]);
const fallbackFrequency: Record<SoundName, number> = { buttonTap: 440, correctAnswer: 720, wrongAnswer: 220, lessonComplete: 880, xpReward: 1040, streakReward: 660, purchase: 780, notification: 520 };

let settings: SoundSettings = { ...defaultSoundSettings };
let unlocked = false;
let audioContext: AudioContext | null = null;
const cache = new Map<SoundName, HTMLAudioElement>();
const active = new Set<SoundName>();

function canPlay(name: SoundName) {
  if (!settings.soundEnabled || settings.soundVolume <= 0) return false;
  if (interfaceSounds.has(name) && !settings.effectsEnabled) return false;
  if (lessonSounds.has(name) && !settings.lessonSoundsEnabled) return false;
  return unlocked;
}

function audioFor(name: SoundName) {
  if (typeof Audio === "undefined") return null;
  const cached = cache.get(name);
  if (cached) return cached;
  const audio = new Audio(sources[name]);
  audio.preload = ["buttonTap", "correctAnswer", "wrongAnswer"].includes(name) ? "auto" : "metadata";
  cache.set(name, audio);
  return audio;
}

function playFallback(name: SoundName) {
  try {
    audioContext ??= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.frequency.setValueAtTime(fallbackFrequency[name], now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, settings.soundVolume * 0.075), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (name === "streakReward" ? 0.28 : 0.12));
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + (name === "streakReward" ? 0.3 : 0.14));
  } catch { /* Sound is an enhancement; unsupported browsers remain functional. */ }
}

export function unlockSound() {
  if (unlocked || typeof window === "undefined") return;
  unlocked = true;
  for (const name of ["buttonTap", "correctAnswer", "wrongAnswer"] as const) audioFor(name)?.load();
  try { audioContext ??= new AudioContext(); void audioContext.resume(); } catch { /* no-op */ }
}

export function setSoundSettings(next: Partial<SoundSettings>) {
  settings = { ...settings, ...next, soundVolume: Math.min(1, Math.max(0, next.soundVolume ?? settings.soundVolume)) };
  for (const audio of cache.values()) audio.volume = settings.soundVolume;
  // Vibration follows the "interface sounds" switch: one place to make the app quiet.
  setHapticsEnabled(settings.effectsEnabled);
}

export function setSoundVolume(soundVolume: number) { setSoundSettings({ soundVolume }); }
export function setSoundEnabled(soundEnabled: boolean) { setSoundSettings({ soundEnabled }); }
export function getSoundSettings() { return { ...settings }; }

export function playSound(name: SoundName) {
  if (!canPlay(name) || active.has(name)) return;
  const audio = audioFor(name);
  if (!audio) { playFallback(name); return; }
  audio.volume = settings.soundVolume;
  audio.currentTime = 0;
  active.add(name);
  const release = () => active.delete(name);
  audio.addEventListener("ended", release, { once: true });
  void audio.play().catch(() => { release(); playFallback(name); });
}
