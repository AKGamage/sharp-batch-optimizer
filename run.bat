@echo off
chcp 65001 >nul 2>&1
title Image Converter
cd /d "%~dp0"

echo.
echo ============================================================
echo    Image Converter — Setup ^& Run
echo ============================================================
echo.

REM ─── Check Node.js ──────────────────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  ERROR: Node.js is not installed or not in PATH.
    echo  Download it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Node.js %NODE_VER% detected.

REM ─── Check npm ──────────────────────────────────────────────
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  ERROR: npm is not available. Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)

REM ─── Check input folder ────────────────────────────────────
if not exist "input\" (
    echo  ERROR: input\ folder not found.
    echo  Create an input\ folder and add your images.
    echo.
    pause
    exit /b 1
)

REM ─── Install dependencies if needed ─────────────────────────
if not exist "node_modules\sharp" (
    echo.
    echo  Installing dependencies...
    echo.
    if not exist "package.json" (
        call npm init -y
    )
    call npm install sharp
    if %ERRORLEVEL% neq 0 (
        echo.
        echo  ERROR: Failed to install sharp. Check your internet connection.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo  Dependencies installed successfully.
    echo.
) else (
    echo  Dependencies already installed.
)

REM ─── Run the converter ──────────────────────────────────────
echo.
node convert.js

echo.
pause
