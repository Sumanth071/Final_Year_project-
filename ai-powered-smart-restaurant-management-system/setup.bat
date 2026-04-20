@echo off
REM AI-Powered Smart Restaurant Management System - Setup Script (Windows)
REM This script sets up and starts the entire application

echo.
echo ════════════════════════════════════════════════════════════════
echo   Restaurant Management System - Setup
echo ════════════════════════════════════════════════════════════════
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version
echo.

REM Get the directory where the batch file is located
set PROJECT_ROOT=%~dp0

echo Project Root: %PROJECT_ROOT%
echo.

REM Install dependencies
echo ════════════════════════════════════════════════════════════════
echo Installing Dependencies...
echo ════════════════════════════════════════════════════════════════
echo.

echo Installing server dependencies...
cd /d "%PROJECT_ROOT%server"
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo OK: Server dependencies installed
echo.

echo Installing client dependencies...
cd /d "%PROJECT_ROOT%client"
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo OK: Client dependencies installed
echo.

REM Check environment variables
echo ════════════════════════════════════════════════════════════════
echo Checking Environment Variables...
echo ════════════════════════════════════════════════════════════════
echo.

if exist "%PROJECT_ROOT%server\.env" (
    echo OK: Server .env file exists
) else (
    echo WARNING: Server .env file not found
)
echo.

REM Start instructions
echo ════════════════════════════════════════════════════════════════
echo Setup Complete! Follow these steps to start the application:
echo ════════════════════════════════════════════════════════════════
echo.
echo STEP 1: Start Backend Server
echo   Open Command Prompt and run:
echo   cd %PROJECT_ROOT%server
echo   npm run dev
echo.
echo STEP 2: Start Frontend Server (in a NEW Command Prompt)
echo   cd %PROJECT_ROOT%client
echo   npm run dev
echo.
echo STEP 3: Open Browser
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
