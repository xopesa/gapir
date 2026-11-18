// Vibration feedback on phones. Works in Android browsers and in the Android
// app (the shell asks for the VIBRATE permission from version 1.3.0); iPhones
// have no web vibration, there the call does nothing.

export type HapticName = "tap" | "correct" | "wrong" | "complete" | "fail" | "listen";

// Milliseconds: buzz, pause, buzz…
const PATTERNS: Record<HapticName, number | number[]> = {
  tap: 8,
  listen: 12,
  correct: [14, 50, 22],
  wrong: [45, 60, 45],
  complete: [20, 60, 20, 60, 20, 90, 70],
  fail: [90, 80, 90],
};

let enabled = true;

/** Follows the "interface sounds" switch in the profile settings. */
export function setHapticsEnabled(value: boolean) { enabled = value; }

export function haptic(name: HapticName) {
  if (!enabled || typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try { navigator.vibrate(PATTERNS[name]); } catch { /* unsupported or blocked before the first tap */ }
}
