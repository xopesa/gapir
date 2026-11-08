@echo off
setlocal
cd /d "%~dp0..\..\.."
call services\ai-workers\scripts\start-ai-workers.bat || exit /b 1
if "%AI_WORKER_HOST%"=="" set AI_WORKER_HOST=127.0.0.1
if "%AI_STT_WORKER_PORT%"=="" set AI_STT_WORKER_PORT=8101
if "%AI_TTS_WORKER_PORT%"=="" set AI_TTS_WORKER_PORT=8102
set AI_STT_WORKER_URL=http://%AI_WORKER_HOST%:%AI_STT_WORKER_PORT%
set AI_TTS_WORKER_URL=http://%AI_WORKER_HOST%:%AI_TTS_WORKER_PORT%
npm.cmd run dev
