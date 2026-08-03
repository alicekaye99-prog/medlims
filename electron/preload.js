const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
  savePDF: (filename, base64data) => ipcRenderer.invoke('save-pdf', filename, base64data),
  printPDF: (filePath, filename) => ipcRenderer.invoke('print-pdf', filePath, filename),
  silentPrintPDF: (filePath, printerName) => ipcRenderer.invoke('silent-print-pdf', filePath, printerName),
  getPDFFolder: () => ipcRenderer.invoke('get-pdf-folder'),
  setPDFFolder: (folderPath) => ipcRenderer.invoke('set-pdf-folder', folderPath),
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  // Printer management
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  getPrinterPrefs: () => ipcRenderer.invoke('get-printer-prefs'),
  setPrinterPrefs: (prefs) => ipcRenderer.invoke('set-printer-prefs', prefs),
  printLabel: (html, printerName) => ipcRenderer.invoke('print-label', html, printerName),
});
