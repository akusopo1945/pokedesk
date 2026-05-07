; PokeDesk Web Installer
; Downloads app package from GitHub/Google Drive and installs it

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"

Name "PokeDesk"
OutFile "PokeDesk-Setup.exe"
InstallDir "$PROGRAMFILES\PokeDesk"
InstallDirRegKey HKCU "Software\PokeDesk" "InstallDir"
RequestExecutionLevel admin
BrandingText "PokeDesk Installer v0.1.0"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Welcome to PokeDesk"
!define MUI_WELCOMEPAGE_TEXT "Virtual Pet Pokemon Desktop App with Productivity Tools.$\r$\n$\r$\nThis installer will download and install PokeDesk on your computer."
!define MUI_FINISHPAGE_RUN "$INSTDIR\PokeDesk.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch PokeDesk"
!define MUI_ICON "installer.ico"
!define MUI_UNICON "installer.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Indonesian"

Section "Install"
  ; Create temp directory
  CreateDirectory "$TEMP\pokedesk-install"

  ; Download app package using NSISdl
  DetailPrint "Downloading PokeDesk (66MB)..."
  NSISdl::download "https://github.com/akusopo1945/pokedesk/releases/download/v0.1.0/PokeDesk-0.1.0.7z" "$TEMP\pokedesk-install\app.7z"
  Pop $0

  ${If} $0 != "success"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Download failed. Please check your internet connection and try again.$\r$\n$\r$\nError: $0"
    Abort
  ${EndIf}

  ; Extract using 7za (bundled)
  DetailPrint "Extracting files..."

  IfFileExists "$EXEDIR\7za.exe" 0 extract_error
    ExecWait '"$EXEDIR\7za.exe" x "$TEMP\pokedesk-install\app.7z" -o"$INSTDIR" -y' $0
    ${If} $0 == "0"
      goto extract_done
    ${EndIf}

  extract_error:
    MessageBox MB_OK|MB_ICONEXCLAMATION "Extraction failed. Please ensure 7za.exe is in the installer folder."
    Abort

  extract_done:

  ; Create shortcuts
  DetailPrint "Creating shortcuts..."
  CreateShortCut "$DESKTOP\PokeDesk.lnk" "$INSTDIR\PokeDesk.exe"
  CreateShortCut "$SMPROGRAMS\PokeDesk.lnk" "$INSTDIR\PokeDesk.exe"

  ; Save install dir to registry
  WriteRegStr HKCU "Software\PokeDesk" "InstallDir" "$INSTDIR"

  ; Add/Remove Programs entry
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "DisplayName" "PokeDesk"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "DisplayVersion" "0.1.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "Publisher" "CakDoel"
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" \
    "NoRepair" 1

  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Cleanup temp
  RMDir /r "$TEMP\pokedesk-install"

  DetailPrint "Installation complete!"
SectionEnd

Section "Uninstall"
  ; Remove files
  RMDir /r "$INSTDIR"

  ; Remove shortcuts
  Delete "$DESKTOP\PokeDesk.lnk"
  Delete "$SMPROGRAMS\PokeDesk.lnk"

  ; Remove registry keys
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk"
  DeleteRegKey HKCU "Software\PokeDesk"
SectionEnd
