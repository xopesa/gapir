# AI Assistant — Stage 3.2 UI Polish

## Scope

This pass changes only the Tutor dialog presentation. Backend services, API contracts, Prisma schema, AI providers, prompt handling, business logic, routes, and existing interaction behavior remain unchanged. Stage 3.3 is not included.

## What changed

- Replaced the large report-style heading with a compact chat header containing the topic, language direction, level, live status, back navigation, and finish action.
- Grouped each user message with the assistant response that evaluates it, so the conversation reads as a continuous dialog.
- Moved a correction directly below its user message and hide it when the recognized and corrected text are equal.
- Promoted the teacher reply to the primary, readable assistant message.
- Rendered the next question as a new assistant message instead of an administrative field.
- Reduced translation, explanation, pronunciation, and vocabulary sections to compact supporting blocks; empty sections stay hidden.
- Reduced score, XP, and coins to a small reward row. Coins and XP are hidden when their values are zero.
- Kept the composer visible at the bottom of the chat area with text, microphone, and send controls.
- Kept the existing instant scroll-to-latest behavior without adding motion or typing effects.

## Component changes

- `AiTutorSessionScreen`
  - Uses compact header and message-stream markup.
  - Groups chronological messages into user/assistant turns.
  - Places correction feedback below the associated user bubble.
  - Preserves session loading, submission gating, voice recording, playback, errors, finishing, and summary behavior.
- `AiResponseCard`
  - Presents the teacher reply and next question as chat messages.
  - Presents translation, explanation, new words, and pronunciation as optional supporting content.
  - Presents score, XP, coins, and playback as compact secondary controls.
- `groupChatTurns`
  - Frontend-only view helper that associates an assistant response with the preceding user message without changing message data.

## Compactness and responsive behavior

- Desktop uses a bounded chat viewport with an independently scrolling message stream and a persistent composer.
- Mobile uses a shorter header, icon-only secondary actions, wider message bubbles, and a compact icon send control.
- The chat height accounts for the mobile app header, bottom navigation, and safe-area insets.
- Supporting information uses soft backgrounds and spacing instead of multiple bordered cards.
- Existing Gapir Quantum Blue, Ice Glass, typography, radii, and Phosphor icons are retained.

## Deferred to animation stage

No new animation, sound, typing indicator, microphone waveform, AI avatar, scene, or gamified effect was added. Those items remain intentionally deferred to the future animation stage.
