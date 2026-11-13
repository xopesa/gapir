"use client";

import { motion, useReducedMotion } from "framer-motion";

// Gapir's own characters: Paxta the panda (teacher), Olov the little dragon
// (culture & practice) and Bars the tiger cub (review & encouragement).
export type MascotKind = "panda" | "dragon" | "tiger";
export type MascotMood = "idle" | "happy" | "sad" | "cheer";

export const mascotNames: Record<MascotKind, { name: string; zh: string }> = {
  panda: { name: "Paxta", zh: "熊猫" },
  dragon: { name: "Olov", zh: "小龙" },
  tiger: { name: "Bars", zh: "小老虎" },
};

const INK = "#1f2433";

function Eyes({ mood, y = 57, dx = 17, cx = 60, white = false }: { mood: MascotMood; y?: number; dx?: number; cx?: number; white?: boolean }) {
  const color = white ? "#fff" : INK;
  if (mood === "happy" || mood === "cheer") {
    // Closed smiling eyes.
    return <g fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round">
      <path d={`M${cx - dx - 5} ${y + 1} q5 -6 10 0`} />
      <path d={`M${cx + dx - 5} ${y + 1} q5 -6 10 0`} />
    </g>;
  }
  return <g>
    <circle cx={cx - dx} cy={y} r="5.2" fill={color} />
    <circle cx={cx + dx} cy={y} r="5.2" fill={color} />
    <circle cx={cx - dx + 1.8} cy={y - 1.8} r="1.7" fill={white ? INK : "#fff"} />
    <circle cx={cx + dx + 1.8} cy={y - 1.8} r="1.7" fill={white ? INK : "#fff"} />
    {/* Worried brows: inner ends raised (not angry). */}
    {mood === "sad" && <g stroke={color} strokeWidth="2.6" strokeLinecap="round"><path d={`M${cx - dx - 6} ${y - 7} l9 -4`} /><path d={`M${cx + dx + 6} ${y - 7} l-9 -4`} /></g>}
  </g>;
}

function Mouth({ mood, x = 60, y = 79, color = INK }: { mood: MascotMood; x?: number; y?: number; color?: string }) {
  if (mood === "sad") return <path d={`M${x - 6} ${y + 4} q6 -6 12 0`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
  if (mood === "cheer") return <path d={`M${x - 8} ${y - 1} q8 12 16 0 z`} fill="#e8505b" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />;
  return <path d={`M${x - 7} ${y} q7 7 14 0`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />;
}

function Panda({ mood }: { mood: MascotMood }) {
  return <g>
    <path d="M86 16 q10 -6 14 4 q-8 2 -14 -4z" fill="#3dbe6e" />
    <path d="M93 13 q4 -6 9 -3" fill="none" stroke="#2e9d58" strokeWidth="2" strokeLinecap="round" />
    <circle cx="30" cy="30" r="15" fill={INK} />
    <circle cx="90" cy="30" r="15" fill={INK} />
    <ellipse cx="60" cy="62" rx="45" ry="41" fill="#fff" stroke={INK} strokeWidth="3" />
    <ellipse cx="43" cy="57" rx="12" ry="15" transform="rotate(-25 43 57)" fill={INK} />
    <ellipse cx="77" cy="57" rx="12" ry="15" transform="rotate(25 77 57)" fill={INK} />
    <Eyes mood={mood} white />
    <ellipse cx="60" cy="71" rx="6" ry="4.2" fill={INK} />
    <Mouth mood={mood} y={80} />
    <ellipse cx="30" cy="76" rx="7" ry="4.5" fill="#ff9fb2" opacity=".55" />
    <ellipse cx="90" cy="76" rx="7" ry="4.5" fill="#ff9fb2" opacity=".55" />
  </g>;
}

function Dragon({ mood }: { mood: MascotMood }) {
  return <g>
    <path d="M38 30 q-10 -18 -2 -26 q2 12 12 18z" fill="#ffb800" stroke="#e09a00" strokeWidth="2" strokeLinejoin="round" />
    <path d="M82 30 q10 -18 2 -26 q-2 12 -12 18z" fill="#ffb800" stroke="#e09a00" strokeWidth="2" strokeLinejoin="round" />
    <path d="M50 24 l5 -10 l5 9 l5 -9 l5 10z" fill="#ffd34d" />
    <ellipse cx="60" cy="62" rx="44" ry="39" fill="#ff6b4a" stroke="#d94a2c" strokeWidth="3" />
    <ellipse cx="60" cy="80" rx="25" ry="16" fill="#ffe0b8" />
    <ellipse cx="53" cy="74" rx="2.4" ry="1.8" fill="#b6452d" />
    <ellipse cx="67" cy="74" rx="2.4" ry="1.8" fill="#b6452d" />
    <path d="M35 80 q-14 -2 -18 8 q-2 6 4 6" fill="none" stroke="#ffb800" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M85 80 q14 -2 18 8 q2 6 -4 6" fill="none" stroke="#ffb800" strokeWidth="2.6" strokeLinecap="round" />
    <ellipse cx="42" cy="55" rx="9.5" ry="10.5" fill="#fff" />
    <ellipse cx="78" cy="55" rx="9.5" ry="10.5" fill="#fff" />
    <Eyes mood={mood} y={56} dx={18} />
    <Mouth mood={mood} y={85} color="#8a2f1c" />
  </g>;
}

function Tiger({ mood }: { mood: MascotMood }) {
  return <g>
    <circle cx="29" cy="30" r="15" fill="#ff9f2e" stroke="#e07f10" strokeWidth="2.5" />
    <circle cx="91" cy="30" r="15" fill="#ff9f2e" stroke="#e07f10" strokeWidth="2.5" />
    <circle cx="29" cy="31" r="7" fill="#fff1dc" />
    <circle cx="91" cy="31" r="7" fill="#fff1dc" />
    <ellipse cx="60" cy="62" rx="45" ry="40" fill="#ff9f2e" stroke="#e07f10" strokeWidth="3" />
    {/* 王 on the forehead, as on Chinese tigers */}
    <g stroke="#3b220f" strokeWidth="3.2" strokeLinecap="round">
      <path d="M52 30 h16" /><path d="M53 36 h14" /><path d="M51 42 h18" /><path d="M60 30 v12" />
      <path d="M17 55 h9" /><path d="M18 64 h8" /><path d="M94 55 h9" /><path d="M94 64 h8" />
    </g>
    <ellipse cx="49" cy="79" rx="14" ry="11" fill="#fff8ee" />
    <ellipse cx="71" cy="79" rx="14" ry="11" fill="#fff8ee" />
    <path d="M54 70 h12 l-6 7z" fill="#ff7a90" stroke="#d65f74" strokeWidth="1.5" strokeLinejoin="round" />
    <Eyes mood={mood} y={56} />
    <Mouth mood={mood} y={83} />
  </g>;
}

export function Mascot({ kind, mood = "idle", size = 96, className }: { kind: MascotKind; mood?: MascotMood; size?: number; className?: string }) {
  const reduced = useReducedMotion();
  const animate = reduced
    ? undefined
    : mood === "cheer" ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] }
      : mood === "sad" ? { rotate: [0, -3, 3, 0] }
        : { y: [0, -4, 0] };
  const transition = mood === "cheer"
    ? { duration: 0.7, repeat: 1 }
    : mood === "sad" ? { duration: 0.6 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const };
  return <motion.svg
    key={`${kind}-${mood}`}
    viewBox="0 0 120 120"
    width={size}
    height={size}
    className={className}
    role="img"
    aria-label={`${mascotNames[kind].name} ${mascotNames[kind].zh}`}
    animate={animate}
    transition={transition}
  >
    <ellipse cx="60" cy="112" rx="30" ry="5" fill="#000" opacity=".08" />
    {kind === "panda" ? <Panda mood={mood} /> : kind === "dragon" ? <Dragon mood={mood} /> : <Tiger mood={mood} />}
  </motion.svg>;
}
