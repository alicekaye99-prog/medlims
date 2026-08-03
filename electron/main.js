const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec, execFile } = require('child_process');

let mainWindow;
let pdfWindow = null;

// Windows 7 compatibility — only apply on Win7 (6.1)
const winVer = os.release();
const isWin7 = process.platform === 'win32' && winVer.startsWith('6.1');
if (isWin7) {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-software-rasterizer');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'MedLIMS',
    icon: path.join(__dirname, '../icons/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#ffffff',
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // ── Block DevTools in production builds ──
  if (app.isPackaged) {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') { event.preventDefault(); return; }
      if (input.control && input.shift && input.key.toLowerCase() === 'i') { event.preventDefault(); return; }
      if (input.control && input.shift && input.key.toLowerCase() === 'j') { event.preventDefault(); return; }
      if (input.control && input.key.toLowerCase() === 'u') { event.preventDefault(); return; }
    });
    // Block right-click Inspect Element
    mainWindow.webContents.on('context-menu', (event) => { event.preventDefault(); });
    // Force-close DevTools if somehow opened
    mainWindow.webContents.on('devtools-opened', () => { mainWindow.webContents.closeDevTools(); });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Get PDF save folder — use custom path if set, otherwise default
const CUSTOM_PATH_FILE = path.join(app.getPath('userData'), 'pdf_save_path.txt');
function getPDFFolder() {
  // Check for custom path
  try {
    if (fs.existsSync(CUSTOM_PATH_FILE)) {
      const custom = fs.readFileSync(CUSTOM_PATH_FILE, 'utf8').trim();
      if (custom && fs.existsSync(custom)) {
        return custom;
      }
    }
  } catch(e) {}
  const folder = path.join(app.getPath('userData'), 'Saved PDFs');
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  return folder;
}

ipcMain.handle('get-pdf-folder', () => getPDFFolder());

// Set custom PDF save folder
ipcMain.handle('set-pdf-folder', async (event, folderPath) => {
  try {
    if (folderPath) {
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(CUSTOM_PATH_FILE, folderPath, 'utf8');
      return { success: true, path: folderPath };
    } else {
      // Reset to default
      if (fs.existsSync(CUSTOM_PATH_FILE)) fs.unlinkSync(CUSTOM_PATH_FILE);
      return { success: true, path: getPDFFolder() };
    }
  } catch(e) {
    return { success: false, error: e.message };
  }
});

// Open folder picker dialog
ipcMain.handle('pick-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select folder to save PDF results',
  });
  if (result.canceled || !result.filePaths.length) return { canceled: true };
  return { canceled: false, path: result.filePaths[0] };
});

// Open folder in file explorer
ipcMain.handle('open-folder', (event, folderPath) => {
  shell.openPath(folderPath || getPDFFolder());
});

// ── Printer Management ──
const PRINTER_PREFS_FILE = path.join(app.getPath('userData'), 'printer_prefs.json');
function loadPrinterPrefs() {
  try {
    if (fs.existsSync(PRINTER_PREFS_FILE)) return JSON.parse(fs.readFileSync(PRINTER_PREFS_FILE, 'utf8'));
  } catch(e) {}
  return { resultPrinter: '', labelPrinter: '' };
}
function savePrinterPrefs(prefs) {
  try { fs.writeFileSync(PRINTER_PREFS_FILE, JSON.stringify(prefs), 'utf8'); } catch(e) {}
}

// Get list of all printers
ipcMain.handle('get-printers', async () => {
  try {
    const printers = mainWindow.webContents.getPrinters();
    return printers.map(p => ({
      name: p.name,
      displayName: p.displayName || p.name,
      isDefault: p.isDefault,
      status: p.status,
    }));
  } catch(e) {
    return [];
  }
});

// Get saved printer preferences
ipcMain.handle('get-printer-prefs', () => loadPrinterPrefs());

// Save printer preferences
ipcMain.handle('set-printer-prefs', (event, prefs) => {
  savePrinterPrefs(prefs);
  return { success: true };
});

// Print label HTML to a specific printer (for barcode/thermal labels)
ipcMain.handle('print-label', (event, htmlContent, printerName) => {
  return new Promise((resolve) => {
    try {
      const labelWin = new BrowserWindow({
        width: 400,
        height: 300,
        show: true,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: false,
        },
        autoHideMenuBar: true,
        backgroundColor: '#ffffff',
      });

      // Position off-screen-ish
      labelWin.setPosition(-2000, 0);

      const tempPath = path.join(app.getPath('temp'), 'medlims_label_' + Date.now() + '.html');
      fs.writeFileSync(tempPath, htmlContent);
      labelWin.loadFile(tempPath);

      labelWin.webContents.once('did-finish-load', () => {
        setTimeout(() => {
          const printOpts = {
            silent: true,
            printBackground: true,
            color: true,
            margins: { marginType: 'none' },
          };
          if (printerName) printOpts.deviceName = printerName;
          labelWin.webContents.print(printOpts, (success) => {
            labelWin.close();
            try { fs.unlinkSync(tempPath); } catch(e) {}
            resolve({ success });
          });
        }, 800);
      });

      setTimeout(() => {
        if (labelWin && !labelWin.isDestroyed()) {
          labelWin.close();
          try { fs.unlinkSync(tempPath); } catch(e) {}
          resolve({ success: false, error: 'timeout' });
        }
      }, 15000);
    } catch(e) {
      resolve({ success: false, error: e.message });
    }
  });
});

ipcMain.handle('save-pdf', (event, filename, base64data) => {
  try {
    const folder = getPDFFolder();
    const filePath = path.join(folder, filename);
    const buffer = Buffer.from(base64data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return { success: true, filePath, filename };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Open PDF in the built-in viewer (single result print)
ipcMain.handle('print-pdf', (event, filePath, filename) => {
  try {
    if (pdfWindow && !pdfWindow.isDestroyed()) {
      pdfWindow.close();
    }

    pdfWindow = new BrowserWindow({
      width: 950,
      height: 750,
      minWidth: 600,
      minHeight: 500,
      title: 'MedLIMS — PDF Viewer',
      icon: path.join(__dirname, '../icons/icon.ico'),
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        plugins: true,
        webSecurity: false,
      },
      autoHideMenuBar: true,
      backgroundColor: '#1a1a2e',
    });

    const viewerPath = path.join(__dirname, 'pdf-viewer.html');
    const encodedPath = encodeURIComponent(filePath);
    const encodedName = encodeURIComponent(filename || path.basename(filePath));
    pdfWindow.loadURL(`file://${viewerPath}?file=${encodedPath}&name=${encodedName}`);

    pdfWindow.on('closed', () => {
      pdfWindow = null;
    });

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Silent print — uses OS-level print, optionally to a specific printer
ipcMain.handle('silent-print-pdf', (event, filePath, printerName) => {
  return new Promise((resolve) => {
    try {
      if (process.platform === 'win32') {
        const prefs = loadPrinterPrefs();
        const targetPrinter = printerName || prefs.resultPrinter || '';
        
        // Try Adobe Reader / Foxit with specific printer
        const tryPaths = [
          'C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
          'C:\\Program Files\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
          'C:\\Program Files (x86)\\Adobe\\Reader 11.0\\Reader\\AcroRd32.exe',
          'C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\FoxitPDFReader.exe',
        ];
        
        let found = false;
        for (const readerPath of tryPaths) {
          if (fs.existsSync(readerPath)) {
            found = true;
            // /t file printer = print to specific printer
            const args = targetPrinter
              ? ['/t', filePath, targetPrinter]
              : ['/t', filePath];
            execFile(readerPath, args, { timeout: 30000 }, () => {
              resolve({ success: true });
            });
            break;
          }
        }
        
        if (!found) {
          const cmd = `powershell -Command "Start-Process -FilePath '${filePath.replace(/'/g, "''")}' -Verb Print"`;
          exec(cmd, { timeout: 15000 }, () => resolve({ success: true }));
        }
      } else {
        const cmd = printerName ? `lp -d "${printerName}" "${filePath}"` : `lp "${filePath}"`;
        exec(cmd, () => resolve({ success: true }));
      }
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
