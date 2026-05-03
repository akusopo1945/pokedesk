const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),
  togglePet: () => ipcRenderer.invoke('window-toggle-pet'),
  setPetIgnore: (ignore) => ipcRenderer.invoke('pet-set-ignore', ignore),
});
