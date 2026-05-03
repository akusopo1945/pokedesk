# 🎮 PokeDesk

**Virtual Pet Pokémon Desktop App** — Tamagochi-style pet dengan tools produktivitas.

> Dikembangkan oleh **CakDoel**

![PokeDesk](build/icon.png)

## ✨ Fitur

- 🐾 **Virtual Pet** — Pilih starter Pokémon (Bulbasaur/Charmander/Squirtle), rawat, dan evolusi!
- 📝 **PokeNotes** — Catatan warna-warni dengan sistem EXP
- ✅ **PokeTasks** — Kanban board (To Do → In Progress → Done) dengan prioritas & deadline
- ⏱️ **Pomodoro Timer** — Sesi fokus 25/5/15 menit dengan pendamping pet
- 📊 **Stats & Achievements** — 16 achievements, leveling system, dan dashboard produktivitas
- 🎨 **Dark Theme** — UI terinspirasi Pokedex

## 🚀 Quick Start

> 📖 **Panduan instalasi lengkap** tersedia di **[INSTALL.md](INSTALL.md)** (termasuk troubleshooting & build cross-platform)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

### Install & Run (Development)

```bash
# Clone / masuk ke folder project
cd pokedesk

# Install dependencies
npm install

# Jalankan dalam mode development
npm run dev
```

### Build Installer

#### 🪟 Windows (.exe)

> ⚠️ Build Windows harus dilakukan di **Windows** atau di **Linux + Wine**

**Cara 1: Build di Windows**
```bash
npm run build:win
```
Output: `dist-installer/PokeDesk-0.1.0-Setup.exe`

**Cara 2: Build di Linux (perlu Wine)**
```bash
# Install Wine terlebih dahulu
sudo apt install wine64

# Build
npm run build:win
```

#### 🐧 Linux (AppImage)
```bash
npm run build:linux
```
Output: `dist-installer/PokeDesk-0.1.0.AppImage`

#### 🍎 macOS (DMG)
```bash
npm run build:mac
```
Output: `dist-installer/PokeDesk-0.1.0.dmg`

## 📁 Struktur Project

```
pokedesk/
├── electron/           # Electron main process
│   ├── main.js         # Window management, tray, IPC
│   └── preload.js      # Context bridge
├── src/                # React source code
│   ├── components/
│   │   ├── Common/     # Sidebar, TopBar, AchievementPopup
│   │   ├── Pet/        # PetPanel, PokeStats
│   │   ├── Notes/      # NoteBoard
│   │   ├── Tasks/      # TaskBoard (Kanban)
│   │   └── Timer/      # PomodoroTimer
│   ├── stores/         # Zustand state (pet, notes, tasks, timer, achievements)
│   ├── services/       # EXP calculation
│   └── styles/         # TailwindCSS globals
├── data/               # JSON data (pokemon, achievements)
├── build/              # App icons
└── dist/               # Vite build output
```

## 🎮 Cara Bermain

1. **Pilih Starter** — Bulbasaur 🌱, Charmander 🔥, atau Squirtle 💧
2. **Beri Nama** — Beri nama untuk Pokémon-mu
3. **Gunakan Tools** — Buat catatan, selesaikan task, fokus dengan Pomodoro
4. **Rawat Pet** — Beri makan berry, elus, jaga stats-nya
5. **Evolusi** — Naikkan level hingga Pokémon-mu berevolusi!

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
- **electron-builder** — Packaging & installer

## 📝 License

MIT License — lihat [LICENSE.txt](LICENSE.txt)
