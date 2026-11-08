/**
 * Dqnamo POS — Windows Desktop Application (Electron Main Process)
 * Starts the embedded Express + Live Wi-Fi LAN Sync server on port 3000
 * and launches the native Windows desktop POS interface.
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PORT = parseInt(process.env.PORT || '3000', 10);
const LOCAL_URL = `http://127.0.0.1:${PORT}`;

let mainWindow = null;

function configureRuntimePaths() {
  const userDataDir = app.getPath('userData');
  const dataDir = path.join(userDataDir, '.data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  process.env.NODE_ENV = 'production';
  process.env.PORT = String(PORT);
  process.env.DQNAMO_ROOT_DIR = userDataDir;
  process.env.DQNAMO_DATA_DIR = dataDir;
  process.env.DQNAMO_DIST_DIR = path.join(__dirname, '..', 'dist');

  try {
    process.chdir(userDataDir);
  } catch (err) {
    console.warn('Could not change working directory to userData:', err);
  }
}

function startEmbeddedBackend() {
  try {
    configureRuntimePaths();
    const serverBundlePath = path.join(__dirname, '..', 'dist-server', 'server.cjs');
    require(serverBundlePath);
  } catch (err) {
    console.error('Failed to start embedded Dqnamo POS server:', err);
  }
}

function waitForServerReady(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      const req = http.get(`${url}/api/lan-sync/info`, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
        } else {
          setTimeout(check, 250);
        }
      });
      req.setTimeout(1500, () => {
        req.destroy();
      });
    };
    check();
  });
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 880,
    minWidth: 1024,
    minHeight: 680,
    title: 'Dqnamo POS — نظام نقاط البيع والمزامنة المحلية',
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  await waitForServerReady(LOCAL_URL);
  await mainWindow.loadURL(LOCAL_URL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    startEmbeddedBackend();
    await createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
