@echo off
setlocal

set TEMP_DIR=%TEMP%\pokedesk-install
set ZIP_FILE=%TEMP_DIR%\app.zip
set INSTALL_DIR=%~1

if "%INSTALL_DIR%"=="" (
    echo ERROR: No install directory specified
    exit /b 1
)

echo Creating temp directory...
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

echo Downloading PokeDesk...
curl -L -o "%ZIP_FILE%" "https://github.com/akusopo1945/pokedesk/releases/download/v0.1.0/PokeDesk-0.1.0.zip"
if errorlevel 1 (
    echo Download failed
    exit /b 1
)

if not exist "%ZIP_FILE%" (
    echo Download failed - file not found
    exit /b 1
)

echo Extracting files...
powershell -ExecutionPolicy Bypass -NoProfile -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%INSTALL_DIR%' -Force"
if errorlevel 1 (
    echo Extraction failed
    exit /b 1
)

echo Done!
exit /b 0
