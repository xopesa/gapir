"use client";

import { SpeakerHigh, SpeakerSlash, SlidersHorizontal } from "@phosphor-icons/react";
import { Button, Card } from "@/src/components/ui";
import { playSound } from "@/src/lib/sound/sound-manager";
import type { SoundSettings } from "@/src/lib/sound/sound-types";
import { useSoundSettings } from "@/src/lib/sound/use-sound-settings";

interface Labels { title: string; all: string; volume: string; effects: string; lessons: string; test: string }

export function SoundSettingsPanel({ initial, labels }: { initial: SoundSettings; labels: Labels }) {
  const { settings, update } = useSoundSettings(initial, true);
  const Icon = settings.soundEnabled ? SpeakerHigh : SpeakerSlash;
  return <Card className="settings-card sound-settings-card">
    <div className="settings-heading"><span className="settings-icon"><SlidersHorizontal weight="duotone" /></span><div><h3>{labels.title}</h3><p>{Math.round(settings.soundVolume * 100)}%</p></div></div>
    <div className="sound-settings-list">
      <label className="settings-toggle"><span><Icon weight="duotone" /><strong>{labels.all}</strong></span><input type="checkbox" checked={settings.soundEnabled} onChange={(event) => update({ soundEnabled: event.target.checked })} /><i aria-hidden="true" /></label>
      <label className="volume-setting"><span><SpeakerSlash /><strong>{labels.volume}</strong><SpeakerHigh /></span><input type="range" min="0" max="1" step="0.05" value={settings.soundVolume} disabled={!settings.soundEnabled} onChange={(event) => update({ soundVolume: Number(event.target.value) })} /></label>
      <label className="settings-toggle"><span><SpeakerHigh weight="duotone" /><strong>{labels.effects}</strong></span><input type="checkbox" checked={settings.effectsEnabled} disabled={!settings.soundEnabled} onChange={(event) => update({ effectsEnabled: event.target.checked })} /><i aria-hidden="true" /></label>
      <label className="settings-toggle"><span><SpeakerHigh weight="duotone" /><strong>{labels.lessons}</strong></span><input type="checkbox" checked={settings.lessonSoundsEnabled} disabled={!settings.soundEnabled} onChange={(event) => update({ lessonSoundsEnabled: event.target.checked })} /><i aria-hidden="true" /></label>
    </div>
    <Button variant="outline" disabled={!settings.soundEnabled} onClick={() => playSound("notification")}><SpeakerHigh weight="bold" /> {labels.test}</Button>
  </Card>;
}
