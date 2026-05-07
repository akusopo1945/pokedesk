# download.ps1 — PokeDesk Web Installer Download Script
# Downloads app package from GitHub (primary) or Google Drive (fallback)

$ErrorActionPreference = "Stop"

$tempDir = "$env:TEMP\pokedesk-install"
$outputFile = "$tempDir\app.7z"

# URLs — update setiap release
$githubUrl = "https://github.com/akusopo1945/pokedesk/releases/download/v0.1.0/PokeDesk-0.1.0.7z"
$googleDriveUrl = ""

# Create temp directory
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Function: download dengan progress
function Download-File {
    param($url, $output)

    $webClient = New-Object System.Net.WebClient
    $webClient.Headers.Add("User-Agent", "PokeDesk-Installer/1.0")

    $eventData = Register-ObjectEvent $webClient DownloadProgressChanged -Action {
        $percent = $EventArgs.ProgressPercentage
        Write-Host "PROGRESS:$percent"
    }

    try {
        $webClient.DownloadFile($url, $output)
    } finally {
        Unregister-Event -SourceIdentifier $eventData.Name
        $webClient.Dispose()
    }
}

# Try GitHub (primary)
try {
    Write-Host "Downloading from GitHub..."
    Download-File $githubUrl $outputFile
    Write-Host "SUCCESS"
    exit 0
} catch {
    Write-Host "GitHub failed: $_"
}

# Fallback: Google Drive
if ($googleDriveUrl) {
    try {
        Write-Host "Trying Google Drive..."
        Download-File $googleDriveUrl $outputFile
        Write-Host "SUCCESS"
        exit 0
    } catch {
        Write-Host "Google Drive failed: $_"
    }
}

Write-Host "FAILED: All download sources failed"
exit 1
