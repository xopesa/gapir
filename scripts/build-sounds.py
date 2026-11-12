# Builds the interface sounds in public/sounds from Kenney's "Interface Sounds"
# pack (CC0, https://kenney.nl/assets/interface-sounds) and a short fanfare
# synthesised here for the end of a lesson.
#
#   python scripts/build-sounds.py path/to/kenney_interfaceSounds.zip
#
# Needs: pip install --user soundfile numpy lameenc
import io
import os
import sys
import zipfile

import lameenc
import numpy as np
import soundfile as sf

RATE = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "sounds")

# Which pack file becomes which sound, and how loud (peak) it is.
PICKS = {
    "button-tap": ("select_002.ogg", 0.35),
    "correct-answer": ("confirmation_001.ogg", 0.8),   # two notes going up an octave
    "wrong-answer": ("question_004.ogg", 0.7),         # two notes going down
    "xp-reward": ("confirmation_003.ogg", 0.6),
    "streak-reward": ("confirmation_004.ogg", 0.7),
    "purchase": ("confirmation_002.ogg", 0.7),
    "notification": ("question_003.ogg", 0.6),
}


def save(name, samples, peak):
    samples = np.asarray(samples, dtype=np.float64)
    samples = samples / max(np.abs(samples).max(), 1e-9) * peak
    # A few milliseconds of fade so nothing clicks.
    edge = int(RATE * 0.004)
    samples[:edge] *= np.linspace(0, 1, edge)
    samples[-edge:] *= np.linspace(1, 0, edge)
    pcm = (samples * 32767).astype("<i2").tobytes()
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(96)
    encoder.set_in_sample_rate(RATE)
    encoder.set_channels(1)
    encoder.set_quality(2)
    data = encoder.encode(pcm) + encoder.flush()
    with open(os.path.join(OUT, name + ".mp3"), "wb") as file:
        file.write(data)
    print(f"{name}.mp3  {len(samples) / RATE:.2f} s  {len(data)} bytes")


def from_pack(pack, member):
    path = next(item for item in pack.namelist() if item.endswith("/" + member) or item == member)
    data, rate = sf.read(io.BytesIO(pack.read(path)))
    if data.ndim > 1:
        data = data.mean(axis=1)
    if rate != RATE:
        positions = np.linspace(0, len(data) - 1, int(len(data) * RATE / rate))
        data = np.interp(positions, np.arange(len(data)), data)
    return data


def bell(frequency, seconds):
    """A soft bell: the note, two quiet overtones, a quick attack and a long tail."""
    time = np.arange(int(RATE * seconds)) / RATE
    tone = np.sin(2 * np.pi * frequency * time) + 0.35 * np.sin(2 * np.pi * frequency * 2 * time) + 0.12 * np.sin(2 * np.pi * frequency * 3 * time)
    envelope = np.minimum(time / 0.008, 1) * np.exp(-time * 4.2)
    return tone * envelope


def fanfare():
    """Lesson finished: C–E–G rising, then a brighter C major chord on top."""
    notes = [(523.25, 0.0), (659.25, 0.13), (783.99, 0.26), (1046.5, 0.42), (1318.5, 0.42), (1568.0, 0.42)]
    total = np.zeros(int(RATE * 1.6))
    for frequency, start in notes:
        sound = bell(frequency, 1.1) * (0.7 if start >= 0.42 else 1.0)
        at = int(RATE * start)
        total[at:at + len(sound)] += sound[: len(total) - at]
    return total


def main():
    os.makedirs(OUT, exist_ok=True)
    with zipfile.ZipFile(sys.argv[1]) as pack:
        for name, (member, peak) in PICKS.items():
            save(name, from_pack(pack, member), peak)
    save("lesson-complete", fanfare(), 0.75)


main()
