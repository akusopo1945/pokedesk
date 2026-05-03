const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let petWindow;
let tray;

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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createPetWindow() {
  petWindow = new BrowserWindow({
    width: 200,
    height: 240,
    x: 100,
    y: 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
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

function createTray() {
  // Simple tray icon
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Buka PokeDesk',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createMainWindow();
        }
      },
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
        app.quit();
      },
    },
  ]);

  tray.setToolTip('PokeDesk');
  tray.setContextMenu(contextMenu);
}

// IPC Handlers
ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-close', () => {
  mainWindow?.hide();
});

ipcMain.handle('window-toggle-pet', () => {
  if (petWindow) {
    petWindow.close();
    petWindow = null;
  } else {
    createPetWindow();
  }
});

ipcMain.handle('pet-set-ignore', (_, ignore) => {
  if (petWindow) {
    petWindow.setIgnoreMouseEvents(ignore, { forward: true });
  }
});

app.whenReady().then(() => {
  createMainWindow();
  createPetWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
