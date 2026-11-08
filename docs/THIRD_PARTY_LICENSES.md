# Gapir AI Tutor - реестр сторонних лицензий

Дата проверки: 4 августа 2026 года.

Это инженерный аудит, а не юридическое заключение. Финальное коммерческое использование моделей с неясным происхождением данных требует отдельной юридической проверки.

## 1. Переданные исследовательские репозитории

| Компонент | Локальная лицензия | Лицензия весов/данных | Разрешённое действие сейчас | Ограничение |
|---|---|---|---|---|
| faster-whisper | MIT | Зависит от checkpoint; Systran small - MIT, OpenAI Whisper card - Apache-2.0 | Использовать runtime, включить MIT notice | Каждый checkpoint проверять отдельно |
| uzbek-asr | Не найдена | Модель не выпущена; часть pipeline связана с коммерческими outputs | Изучать методы и метрики | Не копировать код/данные/модель без разрешения |
| Fun-ASR | Apache-2.0 | Nano и Nano-GGUF сейчас Apache-2.0 | Использовать pinned code/weights с attribution | Проверить каждую дополнительную VAD/punctuation/speaker model |
| TurkicTTS | Не найдена | README ссылается на отдельные казахские веса; лицензия в snapshot не приложена | Изучать статью и идею IPA mapping | Не копировать код, mapping или веса без явного разрешения |
| CosyVoice | Apache-2.0 | Официальные 300M/0.5B cards сейчас Apache-2.0 | Использовать pinned runtime/weights, сохранить license/notice | Проверить submodules, модельную revision и voice assets |
| Pipecat | BSD-2-Clause | Provider assets имеют собственные условия | Использовать framework с copyright/disclaimer | Не считать лицензии integrations автоматически разрешёнными |
| Virtual GPTeacher | MIT | Vosk/Yandex/GigaChat регулируются отдельно | Использовать отдельные идеи/фрагменты с MIT notice | Устаревшие API и небезопасные шаблоны не переносить |
| openWakeWord | Apache-2.0 | Bundled pretrained models: CC BY-NC-SA 4.0 | Использовать код в допустимом будущем R&D | Готовые модели нельзя использовать в коммерческом Gapir |

## 2. Что означает отсутствие LICENSE

В переданных snapshot-копиях `uzbek-asr` и `TurkicTTS` не найдено лицензии ни в корне, ни во вложенных каталогах. Согласно [официальной справке GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository), без лицензии обычные авторские права сохраняются и третьим лицам не даётся право воспроизводить, распространять или создавать производные работы.

Поэтому для Gapir допустимы:

- чтение и сравнение публичных методов;
- самостоятельная реализация общеизвестных алгоритмических идей;
- собственные тесты и собственный код без построчного переноса.

Недопустимы без письменного разрешения:

- копирование Python-файлов, mappings или notebooks;
- включение датасетных файлов;
- переупаковка ссылочных весов как части Gapir;
- создание производного файла на базе кода без лицензии.

## 3. Дополнительные модели-кандидаты

Они не находятся в локальной исследовательской папке и не скачивались.

| Модель | Назначение | Текущая карточка | Размер | Решение |
|---|---|---|---:|---|
| `FunAudioLLM/Fun-ASR-Nano-2512` | Chinese STT GPU | Apache-2.0 | около 1.99 GB | Разрешённый основной кандидат |
| `FunAudioLLM/Fun-ASR-Nano-GGUF` | Chinese STT CPU | Apache-2.0 | около 0.95-1.28 GB выбранной пары | Разрешённый основной CPU-кандидат |
| `Systran/faster-whisper-small` | Generic STT runtime model | MIT | около 486 MB | Только smoke/fallback, не качественный Uzbek default |
| `OvozifyLabs/whisper-small-uz-v1` | Uzbek STT | Apache-2.0 | около 969 MB | Эксперимент после проверки training-data provenance |
| `Kotib/uzbek_stt_v1` | Uzbek STT | Apache-2.0 | около 3.06 GB | Эксперимент; нужен provenance и formatting benchmark |
| `islomov/rubaistt_v2_medium` | Uzbek STT | Apache-2.0 | около 3.06 GB | Не production до проверки pseudo-transcription terms |
| `FunAudioLLM/CosyVoice-300M` | Chinese TTS | Apache-2.0 | около 2.62 GB | Разрешённый local pilot |
| `FunAudioLLM/CosyVoice2-0.5B` | Base TTS runtime | Apache-2.0 | около 4.86 GB | Разрешён, но тяжёлый |
| `FunAudioLLM/Fun-CosyVoice3-0.5B-2512` | Chinese TTS | Apache-2.0 | около 9.75 GB repo assets | Post-MVP GPU candidate |
| `aisha-org/navoiy-tts` | Uzbek TTS | Apache-2.0 | 1.88 GiB + CosyVoice2 assets | Лучший найденный local candidate, отдельный аудит обязателен |

Лицензионная метка модели не заменяет проверку:

- условий исходных датасетов;
- согласия и прав на голоса;
- commercial-use ограничений;
- требований attribution/NOTICE;
- запрета использовать outputs конкурирующего API для обучения;
- изменений карточки между revisions.

## 4. Обязательства по permissive-лицензиям

### MIT

- Сохранить copyright и полный текст MIT в распространяемой копии.
- Учитывать отдельные лицензии зависимостей и весов.

### Apache-2.0

- Включить текст Apache-2.0.
- Сохранить применимые copyright, attribution и NOTICE.
- Помечать изменённые файлы.
- Не использовать trademarks как признак одобрения продукта.
- Вести отдельный список model revisions и компонентов.

### BSD-2-Clause

- Сохранить copyright notice, два условия и disclaimer в source/binary distribution.

### CC BY-NC-SA 4.0

- Требует attribution, non-commercial use и share-alike для адаптаций.
- Поэтому bundled openWakeWord models не подходят для коммерческого Gapir и не должны попадать в production artifacts.

## 5. Правила для будущей интеграции

Для каждого компонента перед merge создаётся запись:

```text
name:
upstream_url:
version_or_commit:
model_revision:
sha256:
code_license:
weights_license:
dataset_provenance_review:
commercial_use_allowed:
attribution_file:
reviewed_at:
reviewer:
```

Скачивание модели допустимо только после:

1. явного подтверждения выбранного кандидата;
2. фиксации revision, а не плавающего `main`;
3. чтения LICENSE/model card на этой revision;
4. оценки объёма и места на диске;
5. проверки безопасного формата. `safetensors`/GGUF предпочтительнее pickle-based `.pt`, а remote code запускается только после review;
6. проверки checksum;
7. изоляции Python environment/container.

## 6. Attribution bundle для Stage 3+

В будущей реализации следует создать, но сейчас ещё не требуется:

- `THIRD_PARTY_NOTICES` с MIT/BSD notices;
- копию Apache-2.0;
- таблицу model revisions/checksums;
- ссылки на model cards;
- отметку, что restricted/non-commercial assets не включены;
- SBOM Python/Node/container dependencies.

## 7. Проверенные официальные источники

- [Fun-ASR-Nano model card](https://huggingface.co/FunAudioLLM/Fun-ASR-Nano-2512)
- [Fun-ASR-Nano GGUF model card](https://huggingface.co/FunAudioLLM/Fun-ASR-Nano-GGUF)
- [CosyVoice upstream](https://github.com/FunAudioLLM/CosyVoice)
- [CosyVoice-300M files](https://huggingface.co/FunAudioLLM/CosyVoice-300M/tree/main)
- [CosyVoice2-0.5B files](https://huggingface.co/FunAudioLLM/CosyVoice2-0.5B/tree/main)
- [Fun-CosyVoice3 files](https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512/tree/main)
- [Navoiy Uzbek TTS card](https://huggingface.co/aisha-org/navoiy-tts)
- [Ovozify Uzbek STT card](https://huggingface.co/OvozifyLabs/whisper-small-uz-v1)
- [Kotib Uzbek STT card](https://huggingface.co/Kotib/uzbek_stt_v1/tree/main)
- [Rubai Uzbek STT card](https://huggingface.co/islomov/rubaistt_v2_medium)
- [openWakeWord license section](https://github.com/dscripka/openWakeWord#license)
- [Pipecat repository/license](https://github.com/pipecat-ai/pipecat)

