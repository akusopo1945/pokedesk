# 🎮 PokeDesk

**Virtual Pet Pokémon Desktop App** — Tamagochi-style pet dengan tools produktivitas.

> Dikembangkan oleh **CakDoel**

![PokeDesk](build/icon.png)

## ✨ Fitur

- 🐾 **Virtual Pet** — Pilih starter Pokémon (Bulbasaur/Charmander/Squirtle), rawat, dan evolusi!
- 💬 **AI Chat** — Chat dengan pet menggunakan MiMo AI (Xiaomi)
- 📝 **PokeNotes** — Catatan warna-warni dengan sistem EXP
- ✅ **PokeTasks** — Kanban board (To Do → In Progress → Done) dengan prioritas & deadline
- ⏱️ **Pomodoro Timer** — Sesi fokus 25/5/15 menit dengan pendamping pet
- 📊 **Stats & Achievements** — 16 achievements, leveling system, dan dashboard produktivitas
- 🔄 **Auto-Update** — Cek update otomatis setiap 24 jam
- 🎨 **Dark Theme** — UI terinspirasi Pokedex

## 🚀 Quick Start

> 📖 **Panduan instalasi lengkap** tersedia di **[INSTALL.md](INSTALL.md)** (termasuk troubleshooting & build cross-platform)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- pnpm (recommended) atau npm

### Install & Run (Development)

```bash
# Clone / masuk ke folder project
cd pokedesk

# Install dependencies
pnpm install

# Jalankan dalam mode development
pnpm run dev
```

### Build Installer

#### 🪟 Windows (.exe)

> ⚠️ Build Windows harus dilakukan di **Windows** atau di **Linux + Wine**

```bash
# Build web installer (full package)
pnpm run build:win
```

Output: `dist-installer/PokeDesk-0.1.0-Setup.exe`

#### 🐧 Linux (AppImage)
```bash
pnpm run build:linux
```

#### 🍎 macOS (DMG)
```bash
pnpm run build:mac
```

## 🚀 Release Workflow

### Commit Convention

| Action | Format | Contoh |
|---|---|---|
| Commit biasa | `<type>: <desc>` | `feat: tambah pet widget` |
| Release beta | `<type>: <desc> [beta]` | `feat: auto-update [beta]` |
| Release stable | `release: vX.X.X [stable]` | `release: v0.2.0 [stable]` |

### Release Types

- **`[beta]`** — Pre-release untuk testing. Auto-update **TIDAK** notif user.
- **`[stable]`** — Release siap pakai. Auto-update **notif user** "Ada versi baru!"

### Contoh Workflow

```bash
# Development
git commit -m "feat: tambah sound effects"
git push
# → Tidak ada release

# Beta release (testing)
git commit -m "feat: new feature [beta]"
git push
# → GitHub Actions build + upload pre-release
# → Auto-update tidak notif user

# Stable release
git commit -m "release: v0.2.0 [stable]"
git push
# → GitHub Actions build + upload stable release
# → Auto-update notif user

# Manual: Upload ke Google Drive (opsional, sebagai fallback)
# 1. Download .7z dari GitHub Releases
# 2. Upload ke Google Drive
# 3. Edit version.json, tambah googleDrive URL
# 4. git commit -m "chore: add gdrive link" && git push
```

### Alur Auto-Update

```
App start → cek version.json di GitHub (setiap 24 jam)
    │
    ├─ Versi sama → skip
    │
    └─ Versi baru (stable) → banner di TopBar "🔄 v0.2.0 tersedia!"
         │
         ├─ User klik "Update" → download .7z (GitHub → GDrive fallback)
         │
         └─ Download selesai → "Restart & Update"
```

## 📁 Struktur Project

```
pokedesk/
├── electron/           # Electron main process
│   ├── main.js         # Window management, tray, IPC, auto-update
│   └── preload.js      # Context bridge
├── src/                # React source code
│   ├── components/
│   │   ├── Common/     # Sidebar, TopBar, UpdateBanner, AchievementPopup
│   │   ├── Pet/        # PetPanel, PetWidget, PokeStats
│   │   ├── Notes/      # NoteBoard
│   │   ├── Tasks/      # TaskBoard (Kanban)
│   │   └── Timer/      # PomodoroTimer
│   ├── stores/         # Zustand state (pet, notes, tasks, timer, achievements)
│   ├── services/       # EXP, AI (MiMo), Update service
│   └── styles/         # TailwindCSS globals
├── data/               # JSON data (pokemon, achievements)
├── build/              # App icons
├── installer/          # Web installer (NSIS + PowerShell)
├── scripts/            # Build scripts
├── .github/workflows/  # CI/CD (auto-release)
├── version.json        # Version manifest untuk auto-update
└── dist/               # Vite build output
```

## 🎮 Cara Bermain

1. **Pilih Starter** — Bulbasaur 🌱, Charmander 🔥, atau Squirtle 💧
2. **Beri Nama** — Beri nama untuk Pokémon-mu
3. **Gunakan Tools** — Buat catatan, selesaikan task, fokus dengan Pomodoro
4. **Rawat Pet** — Beri makan berry, elus, jaga stats-nya
5. **Chat dengan Pet** — Klik kanan pet widget → Chat (AI-powered)
6. **Evolusi** — Naikkan level hingga Pokémon-mu berevolusi!

### Sistem EXP

| Aksi | EXP |
|---|---|
| Task selesai | +10 (+ bonus prioritas) |
| Note dibuat | +3 |
| Pomodoro selesai | +15 |
| Beri makan | +2 |
| Elus pet | +1 |
| Login harian | +5 |

### Sistem Evolusi

| Level | Stage |
|---|---|
| 1–15 | Base (Charmander) |
| 16–35 | Stage 1 (Charmeleon) |
| 36+ | Stage 2 (Charizard) |

## 🛠️ Tech Stack

- **Electron** — Desktop framework
- **React 18** — UI library
- **Vite** — Build tool
- **TailwindCSS** — Styling
- **Zustand** — State management
- **Framer Motion** — Animasi
- **MiMo AI** — AI Chat (Xiaomi)
- **electron-builder** — Packaging & installer

## 📝 License

MIT License — lihat [LICENSE.txt](LICENSE.txt)
