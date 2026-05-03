# 📦 Panduan Instalasi PokeDesk

---

## 📋 Daftar Isi

1. [Persiapan](#-persiapan)
2. [Instalasi untuk Pengguna (End User)](#-instalasi-untuk-pengguna)
3. [Instalasi untuk Developer](#-instalasi-untuk-developer)
4. [Build Installer](#-build-installer)
5. [Troubleshooting](#-troubleshooting)

---

## 🔧 Persiapan

### Minimum System Requirements

| Komponen | Minimum | Direkomendasikan |
|---|---|---|
| **OS** | Windows 10 / Ubuntu 20.04 / macOS 11 | Versi terbaru |
| **RAM** | 2 GB | 4 GB |
| **Storage** | 500 MB | 1 GB |
| **CPU** | Dual-core 1 GHz | Quad-core |

### Software yang Dibutuhkan (untuk Development)

| Software | Versi | Fungsi |
|---|---|---|
| [Node.js](https://nodejs.org/) | v18+ (LTS) | Runtime JavaScript |
| npm | v9+ (bundled dengan Node.js) | Package manager |
| [Git](https://git-scm.com/) | v2+ | Version control |

---

## 📥 Instalasi untuk Pengguna

Cara paling mudah — download installer yang sudah jadi dan jalankan seperti aplikasi biasa.

### 🪟 Windows

#### Metode 1: Installer (.exe) — Direkomendasikan

1. **Download** file `PokeDesk-0.1.0-Setup.exe` dari halaman release
2. **Klik kanan** file → **Run as administrator** (opsional, jika perlu)
3. Ikuti wizard instalasi:
   - Pilih direktori instalasi (default: `C:\Program Files\PokeDesk`)
   - Centang **"Create desktop shortcut"** untuk shortcut di desktop
   - Klik **Install**
4. **Selesai!** PokeDesk akan muncul di Start Menu dan desktop

#### Metode 2: Portable (tanpa install)

1. Download folder `PokeDesk-0.1.0-win-unpacked` dari release
2. Ekstrak ke lokasi yang diinginkan (misal `D:\Apps\PokeDesk\`)
3. Jalankan `PokeDesk.exe` dari dalam folder

> 💡 **Tips:** Buat shortcut `PokeDesk.exe` → klik kanan → **Pin to Taskbar** untuk akses cepat.

---

### 🐧 Linux

#### Metode 1: AppImage — Direkomendasikan

```bash
# 1. Download file AppImage
# (gunakan browser atau wget)
wget https://github.com/pokedesk/pokedesk/releases/download/v0.1.0/PokeDesk-0.1.0.AppImage

# 2. Buat file bisa dieksekusi
chmod +x PokeDesk-0.1.0.AppImage

# 3. Jalankan
./PokeDesk-0.1.0.AppImage
```

**Integrasi dengan Desktop (opsional):**

```bash
# Pindahkan ke folder aplikasi
mkdir -p ~/Applications
mv PokeDesk-0.1.0.AppImage ~/Applications/

# Buat desktop entry
cat > ~/.local/share/applications/pokedesk.desktop << EOF
[Desktop Entry]
Name=PokeDesk
Comment=Virtual Pet Pokémon Desktop App
Exec=/home/$USER/Applications/PokeDesk-0.1.0.AppImage
Icon=pokedesk
Type=Application
Categories=Utility;Game;
Terminal=false
StartupWMClass=pokedesk
EOF

# Update database desktop entry
update-desktop-database ~/.local/share/applications/
```

Sekarang PokeDesk bisa dicari di Application Menu 🎉

#### Metode 2: Build dari Source

Lihat bagian [Instalasi untuk Developer](#-instalasi-untuk-developer) di bawah.

---

### 🍎 macOS

#### Metode 1: DMG — Direkomendasikan

1. Download file `PokeDesk-0.1.0.dmg` dari halaman release
2. **Double-click** file DMG untuk mount
3. **Drag** icon PokeDesk ke folder **Applications**
4. Buka **Applications** → cari **PokeDesk** → double-click untuk jalankan

> ⚠️ **macOS Gatekeeper:** Jika muncul peringatan "unidentified developer":
> - Klik kanan PokeDesk → **Open**
> - Atau buka **System Preferences → Security & Privacy → General** → klik **Open Anyway**

#### Metode 2: Build dari Source

```bash
# Pastikan Xcode Command Line Tools terinstall
xcode-select --install

# Clone dan build
git clone https://github.com/pokedesk/pokedesk.git
cd pokedesk
npm install
npm run build:mac
```

---

## 💻 Instalasi untuk Developer

Untuk yang ingin menjalankan dari source code (development mode) atau berkontribusi.

### Langkah 1: Install Prerequisites

#### Windows

```powershell
# Install Node.js (pilih salah satu)

# Opsi A: Download dari website
# Buka https://nodejs.org → Download LTS → Install

# Opsi B: Menggunakan winget (Windows 11)
winget install OpenJS.NodeJS.LTS

# Opsi C: Menggunakan Chocolatey
choco install nodejs-lts

# Opsi D: Menggunakan Scoop
scoop install nodejs-lts

# Verifikasi instalasi
node --version    # Harus v18+
npm --version     # Harus v9+
```

#### macOS

```bash
# Opsi A: Menggunakan Homebrew (direkomendasikan)
brew install node

# Opsi B: Menggunakan nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Opsi C: Download dari https://nodejs.org

# Verifikasi
node --version
npm --version
```

#### Linux (Ubuntu/Debian)

```bash
# Opsi A: Menggunakan apt
sudo apt update
sudo apt install -y nodejs npm

# Opsi B: Menggunakan NodeSource (versi terbaru)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Opsi C: Menggunakan nvm (direkomendasikan untuk developer)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Opsi D: Menggunakan fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install --lts
fnm use --lts

# Verifikasi
node --version
npm --version
```

#### Linux (Fedora/CentOS/RHEL)

```bash
# Menggunakan dnf
sudo dnf install -y nodejs npm

# Atau menggunakan NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

#### Linux (Arch/Manjaro)

```bash
sudo pacman -S nodejs npm
```

---

### Langkah 2: Clone Repository

```bash
# Clone repository
git clone https://github.com/pokedesk/pokedesk.git

# Masuk ke folder project
cd pokedesk
```

Atau jika tidak punya Git, download ZIP dari GitHub dan ekstrak.

---

### Langkah 3: Install Dependencies

```bash
# Install semua package yang dibutuhkan
npm install

# Jika ada error permission, coba:
# Linux/macOS: sudo npm install
# Windows: jalankan PowerShell sebagai Administrator
```

> ⏱️ Proses ini biasanya memakan waktu 30–90 detik tergantung koneksi internet.

---

### Langkah 4: Jalankan Aplikasi

```bash
# Jalankan dalam mode development (dengan hot-reload)
npm run dev
```

Aplikasi akan terbuka secara otomatis. Perubahan kode akan langsung ter-refleksi tanpa perlu restart.

---

### Langkah 5: Build Installer (Opsional)

Lihat bagian [Build Installer](#-build-installer) di bawah.

---

## 🔨 Build Installer

### Perintah Build

```bash
# Build web assets terlebih dahulu (selalu jalankan ini dulu)
npm run build:web

# Atau langsung build + package:

# 🪟 Windows (.exe installer)
npm run build:win

# 🐧 Linux (.AppImage)
npm run build:linux

# 🍎 macOS (.dmg)
npm run build:mac

# Semua platform sekaligus
npm run build:all
```

### Output Build

Semua installer akan tersimpan di folder `dist-installer/`:

```
dist-installer/
├── PokeDesk-0.1.0-Setup.exe        # Windows installer
├── PokeDesk-0.1.0.AppImage          # Linux portable
├── PokeDesk-0.1.0.dmg               # macOS disk image
├── win-unpacked/                     # Windows (unpacked)
├── linux-unpacked/                   # Linux (unpacked)
└── latest-linux.yml                  # Auto-update manifest
```

### Build Cross-Platform

| Target | Build di Windows | Build di macOS | Build di Linux |
|---|---|---|---|
| **Windows .exe** | ✅ Langsung | ❌ | ⚠️ Perlu Wine |
| **macOS .dmg** | ❌ | ✅ Langsung | ❌ |
| **Linux .AppImage** | ❌ | ❌ | ✅ Langsung |

> 💡 **Catatan:** Untuk build cross-platform, gunakan CI/CD (GitHub Actions) atau build di masing-masing OS.

### Build Windows di Linux (dengan Wine)

```bash
# Install Wine
# Ubuntu/Debian:
sudo apt install -y wine64

# Fedora:
sudo dnf install -y wine

# Arch:
sudo pacman -S wine

# Build
npm run build:win
```

### Konfigurasi Build

Konfigurasi build ada di `electron-builder.yml`:

```yaml
win:
  target:
    - target: nsis          # Format installer Windows
      arch:
        - x64               # Arsitektur 64-bit
        # - ia32            # Uncomment untuk 32-bit
  artifactName: PokeDesk-${version}-Setup.${ext}

nsis:
  oneClick: false            # Wizard instalasi (bukan one-click)
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
```

---

## ❓ Troubleshooting

### Masalah Umum

#### `npm install` gagal

```bash
# Bersihkan cache npm
npm cache clean --force

# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

#### `npm run dev` error: "Module not found"

```bash
# Pastikan dependencies terinstall dengan benar
npm install

# Coba rebuild native modules
npm rebuild
```

#### Aplikasi tidak muncul / blank screen

```bash
# Pastikan Vite dev server berjalan
# Buka browser ke http://localhost:5173
# Jika tidak bisa akses, coba restart:
npm run dev
```

#### Build Windows gagal di Linux

```bash
# Install Wine
sudo apt install wine64

# Atau build di Windows langsung (disarankan)
```

#### "electron" tidak dikenali sebagai perintah

```bash
# Pastikan electron terinstall
npx electron --version

# Jika error, install ulang
npm install electron --save-dev
```

#### AppImage tidak bisa dijalankan di Linux

```bash
# Pastikan file executable
chmod +x PokeDesk-0.1.0.AppImage

# Jika masih error, coba dengan --no-sandbox
./PokeDesk-0.1.0.AppImage --no-sandbox

# Untuk distro yang menggunakan AppArmor/SELinux:
# Ubuntu:
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

#### Aplikasi crash saat startup

```bash
# Jalankan dengan logging verbose untuk debug
# Windows:
PokeDesk.exe --enable-logging

# Linux:
./PokeDesk-0.1.0.AppImage --enable-logging

# macOS:
/Applications/PokeDesk.app/Contents/MacOS/PokeDesk --enable-logging
```

---

### Masalah Spesifik Platform

#### Windows

| Masalah | Solusi |
|---|---|
| Windows Defender memblokir | Klik "More info" → "Run anyway" |
| Installer minta permission | Klik kanan → "Run as administrator" |
| Aplikasi tidak muncul di Start Menu | Cek `C:\Users\[Nama]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs` |

#### macOS

| Masalah | Solusi |
|---|---|
| "Unidentified developer" | System Preferences → Security → Open Anyway |
| "App is damaged" | `xattr -cr /Applications/PokeDesk.app` |
| Tidak bisa di-mount | Coba buka dengan `hdiutil attach PokeDesk.dmg` |

#### Linux

| Masalah | Solusi |
|---|---|
| AppImage tidak executable | `chmod +x PokeDesk-*.AppImage` |
| Blank screen | Jalankan dengan `--disable-gpu` |
| Tray icon tidak muncul | Install `libappindicator3-1` |

---

### Reset Data Aplikasi

Jika ingin memulai dari awal (hapus semua data pet, notes, tasks):

```bash
# Windows
# Hapus folder: %APPDATA%/pokedesk

# macOS
rm -rf ~/Library/Application Support/pokedesk

# Linux
rm -rf ~/.config/pokedesk
```

---

## 📞 Butuh Bantuan?

- 📧 Email: support@pokedesk.dev
- 🐛 Bug Report: GitHub Issues
- 💬 Diskusi: GitHub Discussions

---

**Selamat bermain PokeDesk!** 🎮🐾
