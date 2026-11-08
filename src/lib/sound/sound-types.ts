export const soundNames = ["buttonTap", "correctAnswer", "wrongAnswer", "lessonComplete", "xpReward", "streakReward", "purchase", "notification"] as const;
export type SoundName = (typeof soundNames)[number];

export interface SoundSettings {
  soundEnabled: boolean;
  soundVolume: number;
  effectsEnabled: boolean;
  lessonSoundsEnabled: boolean;
}

export const defaultSoundSettings: SoundSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  effectsEnabled: true,
  lessonSoundsEnabled: true,
};
