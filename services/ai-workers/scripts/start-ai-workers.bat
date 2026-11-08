@echo off
setlocal
cd /d "%~dp0.."
if not exist ".venv\Scripts\python.exe" (
  echo Worker environment not found. Run setup-ai-workers.bat first.
  exit /b 1
)
if "%AI_STT_MODEL_PATH%"=="" (
  echo Set AI_STT_MODEL_PATH to an existing local faster-whisper model directory.
  exit /b 1
)
if "%AI_WORKER_HOST%"=="" set AI_WORKER_HOST=127.0.0.1
if "%AI_STT_WORKER_PORT%"=="" set AI_STT_WORKER_PORT=8101
if "%AI_TTS_WORKER_PORT%"=="" set AI_TTS_WORKER_PORT=8102
start "Gapir STT Worker" /D "%CD%" .venv\Scripts\python.exe -m uvicorn app:app --app-dir stt-worker --host %AI_WORKER_HOST% --port %AI_STT_WORKER_PORT%
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0wait-worker.ps1" -Url "http://%AI_WORKER_HOST%:%AI_STT_WORKER_PORT%/health" -Seconds 30
if errorlevel 1 (
  echo STT worker did not become healthy. Gapir was not started.
  exit /b 1
)
echo STT worker is healthy at http://%AI_WORKER_HOST%:%AI_STT_WORKER_PORT%.
if /I "%AI_TTS_WORKER_ENABLED%"=="true" (
  start "Gapir TTS Worker" /D "%CD%" .venv\Scripts\python.exe -m uvicorn app:app --app-dir tts-worker --host %AI_WORKER_HOST% --port %AI_TTS_WORKER_PORT%
  echo TTS worker process started. Its health remains unavailable until a licensed model backend is configured.
) else (
  echo TTS worker is disabled. Set AI_TTS_WORKER_ENABLED=true only after configuring a licensed backend.
)
