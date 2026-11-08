# Gapir AI Tutor - анализ этапа 1

Дата анализа: 4 августа 2026 года.

Статус: исследование завершено, интеграция не начиналась. Ни одна модель не скачивалась, обучение не запускалось, существующий код Gapir и схема базы данных не изменялись.

## 1. Границы первой версии

AI-преподаватель поддерживает только два направления:

- носитель узбекского изучает китайский: пользователь говорит по-китайски, объяснения получает по-узбекски;
- носитель китайского изучает узбекский: пользователь говорит по-узбекски, объяснения получает по-китайски.

Первая версия работает по схеме «одно нажатие - одно голосовое сообщение - один ответ». Непрерывный звонок, wake word, анализ губ, экзамены и аватар не входят в MVP.

## 2. Текущее состояние Gapir

Gapir уже является полноценным приложением, поэтому новый проект не нужен.

| Область | Текущее решение | Вывод для AI Tutor |
|---|---|---|
| Web | Next.js 16 App Router, React 19, TypeScript strict | Новый раздел добавляется как feature и App Router route |
| UI | Tailwind CSS 4, Framer Motion, Phosphor Icons | AI-экран должен продолжать существующую дизайн-систему |
| Данные | Prisma 7 + `better-sqlite3`, локальная SQLite | Новые сущности добавляются миграцией только на этапе MVP |
| Авторизация | Собственные email/password, bcrypt, HttpOnly cookie-сессии | Все AI API обязаны использовать `getApiUser()`/`requireUser()` |
| Валидация | Zod 4 и общий `jsonError()` | Контракты AI, ответы LLM и multipart-метаданные валидируются сервером |
| Серверный слой | `src/server/services`, `src/server/validation`, route handlers | Оркестратор AI следует тем же слоям, не размещает бизнес-логику в React |
| Локализация | `uz`, `ru`, `zh`, `en` | В AI-разделе активны только `uz` и `zh`; остальные локали приложения не удаляются |
| Состояние клиента | TanStack Query, Zustand | Серверное состояние - Query, короткая state machine записи - локальный reducer/hook |
| Лимиты | In-memory limiter используется для auth | Для AI нужен отдельный user+IP limiter; в production - общее хранилище/Redis |
| Hosting | В проекте есть `.openai/hosting.json`, D1/R2 не настроены | Edge-host не должен выполнять локальные ML-модели; speech service размещается отдельно |

Текущая схема Prisma уже содержит пользователей, настройки, сессии, курсы, уроки, упражнения и прогресс. Сущностей AI пока нет, что правильно для текущего этапа.

### Технические замечания по существующему проекту

- Репозиторий Gapir содержит незавершённые пользовательские изменения. Они не затрагивались.
- SQLite подходит для локальной разработки и одного экземпляра MVP, но не для горизонтально масштабируемого production.
- Текущий rate limiter хранится в памяти процесса и не синхронизируется между экземплярами.
- Серверные cookie-сессии уже дают подходящую границу авторизации для AI API.
- Секреты должны оставаться только в `.env` серверных процессов; браузер никогда не обращается к STT/TTS/LLM-провайдерам напрямую.

## 3. Аппаратная конфигурация текущего компьютера

Проверенная конфигурация:

| Ресурс | Значение |
|---|---|
| CPU | Intel Core i5-1235U, 10 ядер / 12 потоков |
| RAM | 7.7 GB |
| GPU | Intel Iris Xe, общая память; CUDA отсутствует |
| Свободное место на C: | около 158 GB |

Этот компьютер подходит для разработки, API-оркестрации и CPU-smoke-тестов небольшого STT. Он не подходит для комфортного одновременного запуска CosyVoice и тяжёлого Whisper/Fun-ASR GPU-стека. Для первого пользовательского MVP на этом компьютере разумнее вынести LLM и TTS во внешние API.

## 4. Важное ограничение исследовательских копий

Все восемь каталогов являются распакованными snapshot-копиями без `.git`. Нет commit SHA или тегов, поэтому их нельзя считать воспроизводимо закреплёнными зависимостями. Перед любой будущей интеграцией нужно выбрать официальный upstream, зафиксировать commit/tag, модельную revision и checksum.

## 5. Анализ репозиториев

### 5.1 faster-whisper

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\faster-whisper-master\faster-whisper-master`.

Что найдено:

- CTranslate2-реализация Whisper, Python 3.9+;
- CPU/GPU и `int8`/`float16` режимы;
- PyAV декодирует аудио без системного FFmpeg;
- встроен Silero VAD;
- токенизатор содержит языковые коды `uz` и `zh`;
- модель можно завернуть в отдельный долгоживущий Python API и загружать один раз при старте.

Лицензия кода: MIT. Модельные веса имеют собственную лицензию. Например, `Systran/faster-whisper-small` отмечен MIT и занимает около 486 MB; исходный `openai/whisper-small` отмечен Apache-2.0.

Практическая оценка:

- для китайского это простой универсальный fallback, но Fun-ASR лучше ориентирован на китайскую речь;
- базовый Whisper-small формально поддерживает узбекский, но локальный отчёт `uzbek-asr` показывает неприемлемый baseline WER около 116-118% на его тестах;
- для узбекского нужен отдельный fine-tuned checkpoint и собственный контрольный набор;
- официальный benchmark faster-whisper для `small`, CPU int8, 8 потоков показывает примерно 1.48 GB RAM, но это не гарантия скорости на текущем ноутбуке.

Можно использовать напрямую: библиотеку как runtime под MIT, с сохранением copyright notice.

Нельзя считать готовым решением: стандартный multilingual checkpoint без Uzbek-бенчмарка; случайно выбранный community checkpoint без аудита данных и лицензии.

### 5.2 uzbek-asr

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\uzbek-asr-main\uzbek-asr-main`.

Что найдено:

- исследовательский pipeline fine-tuning Whisper-small на 335 часах;
- нормализация с сохранением регистра, пунктуации и чисел;
- отдельная строгая нормализация для WER/CER;
- кириллица -> латиница с узбекскими орфографическими правилами;
- аудио preprocessing: mono 16 kHz, high-pass 80 Hz, удаление длинной тишины, RMS -23 dB;
- тесты нормализатора, чисел и транслитератора;
- результаты отчёта: 4.85-8.17% WER на читаемой речи и 15.16-17.20% на разговорной;
- модель намеренно не опубликована: часть разметки/фильтрации опиралась на коммерческие AI-выходы, что автор считает несовместимым с их условиями.

Лицензия: в переданной копии нет LICENSE и нет лицензионного разрешения в README.

Можно использовать: идеи preprocessing, раздельные raw/normalized WER, дизайн benchmark-набора и перечень узбекских edge cases.

Нельзя использовать напрямую: исходный код, notebooks, датасетные артефакты и невыпущенную модель. Без лицензии действуют обычные авторские права; копирование или создание производных работ не разрешено. Нужна самостоятельная реализация правил и собственные тесты.

### 5.3 Fun-ASR

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\Fun-ASR-main\Fun-ASR-main`.

Что найдено:

- Fun-ASR-Nano-2512, 800M, оптимизирован для китайского, английского, японского, китайских диалектов и акцентов;
- Fun-ASR-MLT-Nano-2512 поддерживает отдельный список из 31 языка, в котором узбекского нет;
- batch inference, hotwords, VAD-композиция, WebSocket streaming и vLLM;
- пунктуация доступна в генерируемом тексте; для отдельного sentence pipeline предусмотрен `ct-punc`;
- Nano не выдаёт надёжные character timestamps из текущего checkpoint; границы FSMN-VAD - это границы сегментов, а не точные токены;
- GPU runtime рассчитан на PyTorch/vLLM;
- отдельный llama.cpp/GGUF runtime запускается на CPU без Python, имеет встроенный FSMN-VAD.

Лицензия кода: Apache-2.0. Официальные карточки Nano, GGUF и FSMN-VAD необходимо проверять отдельно; текущие Nano и Nano-GGUF отмечены Apache-2.0.

Размер CPU-комплекта:

- encoder f16: около 469-470 MB;
- Qwen3-0.6B Q4_K_M: около 484 MB, Q8: около 805 MB;
- плюс FSMN-VAD и binary;
- итого примерно 1.0 GB для Q4 или 1.3 GB для Q8, без учёта рабочего RAM.

Вывод: основной локальный кандидат для китайского STT. Для MVP с одним завершённым сообщением streaming/vLLM не нужен; достаточно batch API. На текущем ноутбуке сначала тестируется GGUF Q4/Q5, но скорость нужно измерить.

### 5.4 TurkicTTS

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\TurkicTTS-master\TurkicTTS-master`.

Что найдено:

- IPA-посредник транслитерирует десять тюркских языков, включая узбекский, в казахский алфавит;
- звук создаётся не нативной узбекской моделью, а казахским male2 Tacotron2 + ParallelWaveGAN;
- опубликованы ссылки на acoustic model и vocoder;
- в примере есть CPU-режим, но код ориентирован на CUDA и ESPnet/ParallelWaveGAN;
- нет dependency manifest и готового HTTP-сервиса;
- субъективная оценка узбекского в README: quality 2.85, content/intelligibility 80%, similarity 45% при 22 респондентах.

Лицензия: отсутствует. Просьба цитировать статью не является лицензией.

Вывод: напрямую использовать нельзя. Архитектурная идея IPA/transliteration полезна только как исследовательская гипотеза; для продукта нужна новая реализация и нативная Uzbek TTS модель.

### 5.5 CosyVoice

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\CosyVoice-main\CosyVoice-main`.

Что найдено:

- китайский входит в официальные девять языков;
- поддержаны китайские диалекты/акценты, pinyin-control, text normalization и bi-streaming;
- доступны 300M, CosyVoice2-0.5B и Fun-CosyVoice3-0.5B;
- есть FastAPI, gRPC, Triton и streaming runtime;
- локальный FastAPI-пример отдаёт raw PCM chunks, разрешает `CORS *` и не содержит auth/rate limit/лимитов текста. Его нельзя публиковать без собственного безопасного wrapper.

Лицензия кода: Apache-2.0. Официальные карточки `CosyVoice-300M`, `CosyVoice2-0.5B` и `Fun-CosyVoice3-0.5B-2512` также сейчас отмечены Apache-2.0.

Размеры официальных репозиториев весов:

- CosyVoice-300M: около 2.62 GB;
- CosyVoice2-0.5B: около 4.86 GB;
- Fun-CosyVoice3-0.5B-2512: около 9.75 GB со всеми артефактами.

Вывод: основной локальный кандидат для китайского TTS. Для Stage 3 pilot разумнее начать с 300M/SFT и фиксированного голоса, а не с voice cloning. На текущем CPU внешнее TTS API предпочтительнее; локальная проверка CosyVoice требует отдельного согласования скачивания.

### 5.6 Pipecat

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\pipecat-main\pipecat-main`.

Что найдено:

- Python framework для real-time voice pipelines;
- Frame/FrameProcessor/Pipeline/PipelineTask, transport adapters, turn strategies, VAD, interruptions и LLM context;
- много внешних STT/TTS/LLM integrations и WebRTC/WebSocket transport;
- Python 3.11+, большой граф optional dependencies.

Лицензия: BSD-2-Clause.

Вывод: можно использовать напрямую с сохранением notice, но для текущего request-response MVP это лишняя зависимость. Полезны идеи: явные frames, state transitions, pluggable processors и cancellation. Интеграцию Pipecat следует рассматривать только при переходе к непрерывному real-time диалогу.

### 5.7 Virtual GPTeacher Language AI Tutor

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\Virtual-GPTeacher-Language-AI-Tutor-main\Virtual-GPTeacher-Language-AI-Tutor-main`.

Что найдено:

- desktop Python prototype: sounddevice/PyAudio, Vosk EN/RU, GigaChat, Yandex SpeechKit;
- конфиг ролей, тем и формата урока;
- простая история диалога и имитация wake intent строковым совпадением;
- README прямо называет проект legacy R&D prototype;
- requirements не содержит всех импортируемых SDK;
- есть небезопасные шаблоны: credential placeholders в коде, `verify_ssl_certs=False`, жёсткие Windows paths.

Лицензия: MIT.

Вывод: отдельные идеи prompt/config разрешено использовать с notice, но сам runtime не подходит Gapir: это desktop loop, нет web API, нет Uzbek/Chinese STT, отсутствует production security. Проще и безопаснее реализовать собственный orchestration layer.

### 5.8 openWakeWord

Локальный путь: `C:\Users\User\Desktop\Gapir_AI_Research\openWakeWord-main\openWakeWord-main`.

Что найдено:

- лёгкий ONNX/TFLite wake-word framework, 16 kHz PCM и 80 ms frames;
- Silero VAD и опциональное шумоподавление;
- официальные готовые модели только английские;
- собственное слово «Привет, Gapir» потребует отдельной генерации/сбора данных и обучения.

Лицензия кода: Apache-2.0. В официальном README готовые bundled-модели лицензированы CC BY-NC-SA 4.0, то есть не подходят для коммерческого Gapir.

Вывод: не интегрировать в MVP. В будущем можно исследовать собственную permissive-модель, но только с отдельным датасетом и лицензионным аудитом.

## 6. Выбор компонентов

| Компонент | MVP | Локальный путь после benchmark | Причина |
|---|---|---|---|
| Uzbek STT | Внешний STT API | faster-whisper + проверенный Uzbek checkpoint | В переданных репозиториях нет одновременно готовой, качественной и юридически бесспорной модели |
| Chinese STT | Fun-ASR-Nano GGUF или внешний fallback | Fun-ASR-Nano GPU/vLLM при росте нагрузки | Лучший фокус на китайском, VAD, permissive license, CPU runtime |
| Uzbek TTS | Внешний TTS API | `aisha-org/navoiy-tts` + CosyVoice2 после отдельного аудита | TurkicTTS без лицензии и недостаточного качества; Navoiy - реальный Uzbek checkpoint, но тяжёлый |
| Chinese TTS | Внешний API на текущем ноутбуке | CosyVoice 300M/SFT; позже CosyVoice3 | Готовый китайский TTS, streaming и API runtime, но нужен GPU для комфортной задержки |
| Tutor LLM | Внешний API со structured output | Локальный LLM только отдельным проектом | В исследовательском наборе нет подходящего LLM; локальный добавит много RAM/VRAM и ops-рисков |
| Wake word | Не входит | Собственная модель openWakeWord | Готовые модели английские и non-commercial |
| Realtime framework | Не входит | Pipecat при переходе к WebRTC/continuous call | Для одного сообщения он усложняет MVP |

## 7. Модели, которые потребуются после подтверждения

Ничего из списка сейчас не скачано.

### Минимальный локальный pilot

1. Chinese STT: `FunAudioLLM/Fun-ASR-Nano-GGUF`
   - `funasr-encoder-f16.gguf`;
   - один decoder: `qwen3-0.6b-q4km.gguf` или `q5km`;
   - `FunAudioLLM/fsmn-vad-GGUF`;
   - закреплённый prebuilt binary или собственная сборка из закреплённого commit.
2. Uzbek STT experiment: один Apache-2.0 checkpoint, выбранный после provenance review:
   - `OvozifyLabs/whisper-small-uz-v1` - около 969 MB, меньше ресурсов, но заявленный WER зависит от собственного теста;
   - либо `Kotib/uzbek_stt_v1` - около 3.06 GB, Whisper-medium и лучший standard WER в локальном сравнении, но слабое форматирование и неясная полнота provenance;
   - `islomov/rubaistt_v2_medium` не рекомендуется для production до проверки условий использования pseudo-transcriptions.
3. Chinese TTS local pilot: `FunAudioLLM/CosyVoice-300M-SFT` или 300M base, ориентир около 2.6-3 GB.
4. Uzbek TTS post-MVP: `aisha-org/navoiy-tts` 1.88 GiB плюс `FunAudioLLM/CosyVoice2-0.5B` 4.86 GB.

### Оценка ресурсов

Это planning budget, а не обещание конкретной latency:

| Профиль | RAM | Диск | GPU | Ожидаемое применение |
|---|---:|---:|---|---|
| Текущий ноутбук + external LLM/TTS | 8 GB | 3-6 GB | Не нужен | Разработка, Fun-ASR GGUF или один small STT, последовательные запросы |
| CPU-only local speech pilot | 16 GB минимум, 24 GB лучше | 12-20 GB | Не обязателен | Fun-ASR GGUF + один Whisper checkpoint; TTS может быть медленным |
| Локальный GPU MVP | 32 GB | 25-40 GB | NVIDIA 12 GB VRAM, 16 GB комфортнее | STT и CosyVoice, ограниченная параллельность |
| Production с отдельными workers | 32-64 GB на узел | 40+ GB | 16-24 GB VRAM на speech worker | Очереди, несколько моделей, warm workers, concurrency |

На текущих 7.7 GB RAM полный локальный Uzbek+Chinese STT/TTS стек не рекомендуется.

## 8. Риски до Stage 3

1. Качество Uzbek STT нельзя выводить из generic multilingual support. Нужен собственный минимум из read/conversational/noisy/code-switching записей.
2. Лицензия checkpoint не доказывает чистоту всех training data. Для community-моделей нужен provenance review.
3. `uzbek-asr` и TurkicTTS нельзя копировать без разрешения автора.
4. Нельзя публиковать примеры FastAPI как есть: отсутствуют auth, безопасный CORS, лимиты и нормальная обработка файлов.
5. Voice cloning повышает риск имитации личности. MVP должен использовать только фиксированный разрешённый голос.
6. LLM-оценка не является объективной проверкой произношения; score должен называться учебной обратной связью, а не фонетическим экзаменом.
7. SQLite и in-memory rate limiter ограничивают production deployment.
8. Все snapshot-репозитории надо заменить pinned upstream dependencies.

## 9. Источники проверки

- [faster-whisper official repository](https://github.com/SYSTRAN/faster-whisper)
- [faster-whisper-small files and license](https://huggingface.co/Systran/faster-whisper-small/tree/main)
- [Fun-ASR-Nano official model card](https://huggingface.co/FunAudioLLM/Fun-ASR-Nano-2512)
- [Fun-ASR-Nano GGUF files](https://huggingface.co/FunAudioLLM/Fun-ASR-Nano-GGUF/tree/main)
- [CosyVoice official repository](https://github.com/FunAudioLLM/CosyVoice)
- [CosyVoice-300M files](https://huggingface.co/FunAudioLLM/CosyVoice-300M/tree/main)
- [CosyVoice2-0.5B files](https://huggingface.co/FunAudioLLM/CosyVoice2-0.5B/tree/main)
- [Navoiy Uzbek TTS model card](https://huggingface.co/aisha-org/navoiy-tts)
- [openWakeWord official repository and model licensing](https://github.com/dscripka/openWakeWord)
- [Pipecat official repository](https://github.com/pipecat-ai/pipecat)
- [GitHub guidance for repositories without a license](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

