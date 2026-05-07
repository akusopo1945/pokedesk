@echo off
set INSTALL_DIR=%~1
set TEMP_DIR=%TEMP%\pokedesk-install
set ZIP_FILE=%TEMP_DIR%\app.7z

if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

echo Downloading...
curl.exe -L -o "%ZIP_FILE%" "https://github.com/akusopo1945/pokedesk/releases/download/v0.1.0/PokeDesk-0.1.0.7z"
if errorlevel 1 exit /b 1

if not exist "%ZIP_FILE%" exit /b 1

echo Extracting...
"%~dp07za.exe" x "%ZIP_FILE%" -o"%INSTALL_DIR%" -y
if errorlevel 1 exit /b 1

echo Done!
exit /b 0
