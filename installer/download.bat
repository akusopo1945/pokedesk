@echo off
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0download.ps1"
exit /b %errorlevel%
