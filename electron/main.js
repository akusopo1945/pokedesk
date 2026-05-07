const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let petWindow;
let tray;
let isQuitting = false;

const isDev = !app.isPackaged;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    } else {
      mainWindow = null;
    }
  });
}

function createPetWindow() {
  petWindow = new BrowserWindow({
    width: 96,
    height: 96,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    petWindow.loadURL('http://localhost:5173#/pet-widget');
  } else {
    petWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: '/pet-widget',
    });
  }

  petWindow.setIgnoreMouseEvents(false);

  petWindow.on('closed', () => {
    petWindow = null;
  });
}

function showMainWindow(tab) {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    if (tab) mainWindow.webContents.send('set-active-tab', tab);
  } else {
    createMainWindow();
    if (tab) {
      setTimeout(() => {
        mainWindow?.webContents.send('set-active-tab', tab);
      }, 500);
    }
  }
}

function createTray() {
  const iconPath = isDev
    ? path.join(__dirname, '../build/icon.ico')
    : path.join(process.resourcesPath, 'build/icon.ico');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Buka PokeDesk',
      click: () => showMainWindow(),
    },
    {
      label: 'Toggle Pet',
      click: () => {
        if (petWindow) {
          petWindow.close();
          petWindow = null;
        } else {
          createPetWindow();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Keluar',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('PokeDesk');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => showMainWindow());
}

// ─── IPC Handlers: Window ───

ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-close', () => {
  mainWindow?.hide();
});

ipcMain.handle('window-quit', () => {
  isQuitting = true;
  app.quit();
});

ipcMain.handle('window-toggle-pet', () => {
  if (petWindow) {
    petWindow.close();
    petWindow = null;
  } else {
    createPetWindow();
  }
});

ipcMain.handle('window-open-stats', () => {
  showMainWindow('stats');
});

ipcMain.handle('window-toggle-fullscreen', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return mainWindow.isFullScreen();
  }
  return false;
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() || false;
});

// ─── IPC Handlers: Pet Widget ───

ipcMain.handle('pet-set-ignore', (_, ignore) => {
  if (petWindow) {
    petWindow.setIgnoreMouseEvents(ignore, { forward: true });
  }
});

ipcMain.handle('pet-request-context-menu', () => {
  if (!petWindow) return;
  const menu = Menu.buildFromTemplate([
    {
      label: '💬 Buka Chat',
      click: () => petWindow?.webContents.send('pet-do-chat'),
    },
    {
      label: '🤚 Elus',
      click: () => petWindow?.webContents.send('pet-do-pet'),
    },
    {
      label: '🍎 Beri Makan',
      click: () => petWindow?.webContents.send('pet-do-feed'),
    },
    { type: 'separator' },
    {
      label: '📊 Lihat Stats',
      click: () => showMainWindow('stats'),
    },
    { type: 'separator' },
    {
      label: '❌ Sembunyikan Pet',
      click: () => {
        petWindow?.close();
        petWindow = null;
      },
    },
  ]);
  menu.popup({ window: petWindow });
});

ipcMain.handle('pet-quick-feed', () => {
  petWindow?.webContents.send('pet-do-feed');
});

ipcMain.handle('pet-quick-pet', () => {
  petWindow?.webContents.send('pet-do-pet');
});

ipcMain.handle('pet-resize', (_, w, h) => {
  if (petWindow) {
    petWindow.setSize(w, h);
  }
});

// ─── IPC Handlers: Auto-Update ───

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('install-update', async (event, arrayBuffer) => {
  try {
    const tempDir = path.join(app.getPath('temp'), 'pokedesk-update');
    const archivePath = path.join(tempDir, 'update.7z');

    // Save archive ke temp
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(archivePath, Buffer.from(arrayBuffer));

    // Extract menggunakan 7z (jika tersedia) atau langsung restart
    // Untuk sekarang, simpan archive dan restart
    // User perlu jalankan installer ulang untuk update lengkap
    const installDir = path.dirname(app.getPath('exe'));
    const backupDir = path.join(tempDir, 'backup');

    // Backup versi lama
    fs.mkdirSync(backupDir, { recursive: true });

    // Simpan path archive untuk diproses setelah restart
    fs.writeFileSync(
      path.join(tempDir, 'update-pending.json'),
      JSON.stringify({
        archivePath,
        installDir,
        timestamp: Date.now(),
      })
    );

    return { success: true, archivePath };
  } catch (err) {
    console.error('Install update failed:', err);
    return { success: false, error: err.message };
  }
});

// ─── Single Instance Lock ───

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Sudah ada instance lain → tampilkan alert & quit
  dialog.showMessageBoxSync({
    type: 'warning',
    title: 'PokeDesk',
    message: 'PokeDesk sudah berjalan!',
    detail: 'PokeDesk sudah dijalankan sebelumnya. Cek system tray atau taskbar.',
    buttons: ['OK'],
  });
  app.quit();
} else {
  // Instance pertama → fokus window jika ada yang coba buka lagi
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // ─── App Lifecycle ───

  app.whenReady().then(() => {
    createMainWindow();
    createTray();
  });

  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    isQuitting = true;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}
