@echo off
setlocal
cd /d "%~dp0.."
py -3.11 --version >nul 2>&1
if errorlevel 1 (
  echo Python 3.11 is required. Install it, then run this script again.
  exit /b 1
)
echo This will create services\ai-workers\.venv and install pinned Python packages.
set /p GAPIR_CONFIRM=Type YES to continue: 
if /I not "%GAPIR_CONFIRM%"=="YES" (
  echo Cancelled. Nothing was installed.
  exit /b 1
)
py -3.11 -m venv .venv || exit /b 1
call .venv\Scripts\python.exe -m pip install --upgrade pip || exit /b 1
call .venv\Scripts\python.exe -m pip install -r requirements\stt-faster-whisper.txt || exit /b 1
echo AI worker environment is ready. Model weights were not downloaded.

