const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),
  quit: () => ipcRenderer.invoke('window-quit'),
  toggleFullscreen: () => ipcRenderer.invoke('window-toggle-fullscreen'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  togglePet: () => ipcRenderer.invoke('window-toggle-pet'),
  setPetIgnore: (ignore) => ipcRenderer.invoke('pet-set-ignore', ignore),

  // Pet widget
  requestPetMenu: () => ipcRenderer.invoke('pet-request-context-menu'),
  quickFeed: () => ipcRenderer.invoke('pet-quick-feed'),
  quickPet: () => ipcRenderer.invoke('pet-quick-pet'),
  openMainAtStats: () => ipcRenderer.invoke('window-open-stats'),
  resizePet: (w, h) => ipcRenderer.invoke('pet-resize', w, h),

  // Auto-update
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  installUpdate: (blob) => ipcRenderer.invoke('install-update', blob),

  // IPC listeners
  onPetDoFeed: (cb) => ipcRenderer.on('pet-do-feed', () => cb()),
  onPetDoPet: (cb) => ipcRenderer.on('pet-do-pet', () => cb()),
  onPetDoChat: (cb) => ipcRenderer.on('pet-do-chat', () => cb()),
  onSetActiveTab: (cb) => ipcRenderer.on('set-active-tab', (_, tab) => cb(tab)),
});
