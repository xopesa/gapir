# Gapir AI Assistant — Stage 3.2 Report

Дата: 4 августа 2026 года

## Scope

Реализован только frontend Stage 3.2 и его интеграция с готовым backend Stage 3.1. Prisma schema, backend contracts, provider adapters и Stage 3.3 не изменялись. Во время разработки и E2E использовались только mock providers; внешние и платные API не вызывались.

## Frontend audit

- Routing: Next.js App Router в `app/`.
- Authorization: существующая httpOnly cookie session; страницы используют `requireUser`, API — `getApiUser`.
- Layout/navigation: `AppShell`, desktop sidebar, mobile header и fixed bottom navigation.
- Localization: типизированные словари `uz`, `ru`, `zh`, `en` через `getDictionary`.
- UI-kit: существующие `Card`, `Button`, `IconButton`, `Badge`, `NavigationItem`; новая design system не добавлялась.
- Icons: существующий `@phosphor-icons/react`.
- Theme: существующие CSS variables и `data-theme="dark"`.
- Forms: существующие controlled/React Hook Form patterns; setup использует нативные fieldset/radio semantics.
- Notifications: глобальной toast-системы нет; AI ошибки показываются inline через `role="alert"`.
- Responsive breakpoints: 1279 px, 767 px и 420 px; safe-area уже поддерживается shell и bottom nav.
- API client: до Stage 3.2 централизованного AI frontend client не было.

## `build:sites` fix

Точная причина: `src/components/ui/index.ts` является client boundary и содержал `ExportAllDeclaration` (`export *`). RSC client-proxy transformer Vinext/Vite не поддерживает этот AST node и останавливал сборку до анализа приложения.

Все публичные имена UI-kit сохранены явными named exports. После исправления проверены все импорты; `npm run build:sites` проходит и видит новые AI routes.

## Implemented routes

- `/ai-assistant` — landing, доступные/будущие функции, Tutor setup и краткая learning memory.
- `/ai-assistant/history` — последние сессии, статус, дата, параметры и последний ответ.
- `/ai-assistant/tutor/[sessionId]` — восстанавливаемый по URL разговор.

Все routes требуют авторизацию. При `ENABLE_AI_ASSISTANT=false` навигация скрыта, а прямой route показывает безопасное unavailable state. `ENABLE_AI_TUTOR=false` сохраняет landing, но отключает старт Tutor.

## AI Tutor frontend

- Два направления: `uz_to_zh`, `zh_to_uz`.
- Три уровня и шесть тем Stage 3.2.
- Защита create/send от двойного клика.
- Централизованный типизированный API client, `AbortController`, 35/50 sec frontend timeout.
- Text flow полностью интегрирован с Stage 3.1.
- MediaRecorder: permission только по действию пользователя, supported MIME selection, duration, stop, 60 sec/15 MiB limits, track cleanup, one-message multipart upload, без localStorage.
- UI states: ready, listening, recording, uploading, recognizing, thinking, speaking, error, finished.
- Chronological history, optimistic user text, auto-scroll и восстановление после reload.
- Условные response blocks: recognized/corrected/translation/explanation/teacher/next question/new words/pronunciation/score; пустые поля скрываются, одинаковая correction не показывается.
- Audio playback выполняется только после действия пользователя и очищается при unmount.
- Finish confirmation, persisted result и summary XP/coins/messages.
- History и learning memory empty/data states.
- Dev-only `Mock AI` marker, без имён внутренних providers.
- Локализованные сообщения backend errors для `uz`, `ru`, `zh`, `en`.

## Browser defect found during E2E

Первый реальный mock E2E выявил `TypeError: Illegal invocation`: native browser `fetch` был сохранён в поле client и вызывался с неверным receiver. Client теперь вызывает detached fetch function. Добавлен regression test, который требует `this === undefined`.

## Automated verification

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — 3 files, 51 tests passed; 26 новых Stage 3.2 tests.
- `npm run build` — passed.
- `npm run build:sites` — passed, включая три новых AI routes.

Новые tests покрывают flags, обе пары языков, setup values, double-submit guard, create/get/text/audio/finish/history/memory client contracts, unauthorized/timeout/retry, detached fetch regression, условные response fields, invalid stored JSON, error mapping, session summary, empty states, localization parity, audio limits и mobile safe-area CSS.

## Manual mock E2E and visual QA

Проверено в локальном `next dev` с существующим авторизованным test account и только mock STT/LLM/TTS:

1. Landing и dev-only `Mock AI`.
2. Setup controls и loading/disabled create state.
3. Session creation и переход на URL с `sessionId`.
4. Text `你好`, thinking/disabled composer и mock response.
5. Отсутствие correction block при равных recognized/corrected values.
6. Reload и восстановление полной истории по URL.
7. Finish confirmation, finished state и summary.
8. History с active/finished sessions и последним сообщением.
9. Desktop 1440×900: layout, right sidebar, history cards, actions, без horizontal overflow.
10. Mobile 390×844: landing/chat, bottom navigation, sticky composer, safe area, responsive one-column grids, без horizontal overflow.
11. Контраст secondary text на Quantum Blue карточках исправлен после visual QA.

Реальный microphone capture не запускался: это потребовало бы захвата пользовательского аудио. Permission-denied/unsupported/limits/cleanup logic покрыты кодом и автоматическими tests; permission запрашивается только после нажатия.

## Backups

Резервные копии существующих файлов и последующие fix checkpoints находятся в `.codex-runtime/backups/stage-3.2/2026-08-04/`; initial copies сверены по SHA-256.

## Deliberately not implemented

- Stage 3.3;
- свободный разговор как отдельный mode;
- grammar/translation/vocabulary/pronunciation features;
- local models, offline packs, mobile native bridge;
- production provider configuration или платные API;
- Prisma/backend redesign.
