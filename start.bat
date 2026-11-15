@echo off
:: ============================================================================
:: Peak - Automated Dev Server Launcher
:: Checks dependencies, launches Vite dev server, opens browser, and ensures
:: clean, self-cleaning termination with zero zombie processes on exit/close.
:: ============================================================================
setlocal enabledelayedexpansion
title Peak Development Server
cd /d "%~dp0"

echo.
echo ============================================================
echo   PEAK DEVELOPMENT SERVER
echo ============================================================
echo.

:: 1. Check if node_modules exists; if not, run npm install
if not exist "%~dp0node_modules\" (
    echo [Peak] node_modules directory not found.
    echo [Peak] Installing dependencies with npm install...
    echo.
    call npm.cmd install
    if errorlevel 1 (
        call npm install
        if errorlevel 1 (
            echo.
            echo [Peak] ERROR: npm install failed. Please check your network and Node.js setup.
            echo.
            pause
            exit /b 1
        )
    )
    echo.
    echo [Peak] Dependencies installed successfully.
    echo.
)

:: 2. Check if PowerShell is available to run the supervised runner
where powershell.exe >nul 2>nul
if %errorlevel% equ 0 (
    if exist "%~dp0scripts\dev-server.ps1" (
        powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\dev-server.ps1"
        exit /b %errorlevel%
    )
)

:: ============================================================================
:: Pure Batch Fallback Runner (if PowerShell is unavailable)
:: ============================================================================
echo [Peak] Running standalone batch dev server runner...

:: Clean up any leftover processes on port 5173 before launching
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [Peak] Clearing stale process on port 5173 (PID %%a)...
    taskkill /F /T /PID %%a >nul 2>&1
)

:: Start npm run dev in background sub-shell
echo [Peak] Launching npm run dev...
start "Peak Vite Server" /b cmd /c "npm.cmd run dev || npm run dev"

:: Wait for local dev server to become available on port 5173
echo [Peak] Waiting for server on http://localhost:5173...
set ATTEMPTS=0

:WAIT_PORT
set /a ATTEMPTS+=1
if !ATTEMPTS! gtr 40 (
    echo [Peak] Timeout waiting for dev server to start.
    goto CLEANUP
)

set PORT_PID=
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    set PORT_PID=%%a
)

if defined PORT_PID (
    echo.
    echo ============================================================
    echo   Peak Dev Server is LIVE at http://localhost:5173
    echo   Opening default web browser...
    echo   Press Ctrl+C to stop the server cleanly.
    echo ============================================================
    echo.
    start http://localhost:5173
    goto RUNNING_LOOP
)

:: Delay ~500ms using ping
ping 127.0.0.1 -n 1 -w 500 >nul 2>&1
goto WAIT_PORT

:RUNNING_LOOP
:: Keep window open and wait
pause >nul

:CLEANUP
echo.
echo [Peak] Cleaning up dev server processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [Peak] Terminating PID %%a...
    taskkill /F /T /PID %%a >nul 2>&1
)
echo [Peak] Done. All processes stopped.
exit /b 0
