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

; ─── Pre-Install Validation ───
Function .onInit
  ; Cek apakah PokeDesk sudah terinstal
  ReadRegStr $0 HKCU "Software\PokeDesk" "InstallDir"

  ${If} $0 != ""
    ; Baca versi terinstall
    ReadRegStr $1 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PokeDesk" "DisplayVersion"

    ${If} $1 == ""
      StrCpy $1 "unknown"
    ${EndIf}

    ; Tampilkan dialog pilihan
    MessageBox MB_YESNOCANCEL|MB_ICONQUESTION "PokeDesk sudah terinstal di $0 (v$1). Data pet/notes/tasks aman. Yes=Repair, No=Update, Cancel=Batal" IDYES do_action IDCANCEL do_cancel
    Goto do_action

    do_action:
      StrCpy $INSTDIR $0

      ; Jalankan uninstaller silent
      DetailPrint "Menghapus versi lama..."
      ExecWait '"$0\Uninstall.exe" /S _?=$0' $2

      ${If} $2 != "0"
        MessageBox MB_OK|MB_ICONEXCLAMATION "Gagal menghapus versi lama. Silakan uninstall manual dari Control Panel."
        Abort
      ${EndIf}

      Goto done

    do_cancel:
      Abort
  ${EndIf}

  done:
FunctionEnd

Section "Install"
  ; Run batch install script
  DetailPrint "Downloading and installing PokeDesk..."
  ExecWait '"$EXEDIR\install.bat" "$INSTDIR"' $0

  ${If} $0 != "0"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Installation failed. Check internet connection."
    Abort
  ${EndIf}

  ; Verify installation
  IfFileExists "$INSTDIR\PokeDesk.exe" 0 install_failed
    goto extract_done

  install_failed:
    MessageBox MB_OK|MB_ICONEXCLAMATION "Installation failed. PokeDesk.exe not found."
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
