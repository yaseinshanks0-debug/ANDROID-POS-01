/**
 * Dqnamo POS — Windows Desktop Application (Electron Main Process)
 * Starts the embedded Express + Live Wi-Fi LAN Sync server (default port 3000)
 * and launches the native Windows desktop POS interface.
 */

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const net = require('net');

const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);
let activePort = DEFAULT_PORT;
let mainWindow = null;

function writeDesktopLog(message, err) {
  try {
    const userDataDir = app.getPath('userData');
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }
    const logFile = path.join(userDataDir, 'dqnamo-desktop.log');
    const detail = err ? ` | ${err.stack || err.message || String(err)}` : '';
    const line = `[${new Date().toISOString()}] ${message}${detail}\n`;
    fs.appendFileSync(logFile, line, 'utf8');
  } catch {
    // Ignore logging errors
  }
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in Electron main process:', err);
  writeDesktopLog('UNCAUGHT_EXCEPTION', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection in Electron main process:', reason);
  writeDesktopLog('UNHANDLED_REJECTION', reason);
});

/**
 * Resolves the packaged frontend directory (`index.html` + `assets/`) across all
 * possible Electron packaging layouts (`extraResources/www`, `electron/www`, `dist`, `app.asar.unpacked/dist`).
 */
function resolveDistDirectory() {
  const candidates = [
    path.join(__dirname, 'www'),
    process.resourcesPath ? path.join(process.resourcesPath, 'www') : null,
    path.join(__dirname, '..', 'dist'),
    process.resourcesPath ? path.join(process.resourcesPath, 'app', 'electron', 'www') : null,
    process.resourcesPath ? path.join(process.resourcesPath, 'app', 'dist') : null,
    process.resourcesPath ? path.join(process.resourcesPath, 'app.asar.unpacked', 'dist') : null,
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, 'index.html'))) {
        writeDesktopLog(`Resolved frontend dist directory: ${candidate}`);
        return candidate;
      }
    } catch {
      // Try next candidate
    }
  }

  const fallback = process.resourcesPath
    ? path.join(process.resourcesPath, 'www')
    : path.join(__dirname, '..', 'dist');
  writeDesktopLog(`Fallback frontend dist directory: ${fallback}`);
  return fallback;
}

/**
 * Resolves the bundled backend server (`server.cjs`) across unpacked and standard layouts.
 */
function resolveServerBundlePath() {
  const candidates = [
    path.join(__dirname, '..', 'dist-server', 'server.cjs'),
    process.resourcesPath ? path.join(process.resourcesPath, 'app', 'dist-server', 'server.cjs') : null,
    process.resourcesPath
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'dist-server', 'server.cjs')
      : null,
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        writeDesktopLog(`Resolved backend server bundle: ${candidate}`);
        return candidate;
      }
    } catch {
      // Try next candidate
    }
  }
  return path.join(__dirname, '..', 'dist-server', 'server.cjs');
}

/**
 * Copies initial `.data/*.json` seed files into `userData/.data` on first launch
 * without ever overwriting existing user data on subsequent launches or updates.
 */
function seedInitialDataIfNeeded(targetDataDir) {
  const seedCandidates = [
    process.resourcesPath ? path.join(process.resourcesPath, 'seed-data') : null,
    path.join(__dirname, 'seed-data'),
    path.join(__dirname, '..', '.data'),
  ].filter(Boolean);

  for (const seedDir of seedCandidates) {
    try {
      if (!fs.existsSync(seedDir)) continue;
      const entries = fs.readdirSync(seedDir);
      for (const fileName of entries) {
        if (!fileName.endsWith('.json')) continue;
        const srcFile = path.join(seedDir, fileName);
        const destFile = path.join(targetDataDir, fileName);
        if (!fs.existsSync(destFile) && fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
          writeDesktopLog(`Seeded initial data file: ${fileName}`);
        }
      }
      break;
    } catch (err) {
      writeDesktopLog(`Warning while seeding initial data from ${seedDir}`, err);
    }
  }
}

function checkExistingDqnamoServer(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/lan-sync/info`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close(() => resolve(true));
      })
      .listen(port, '127.0.0.1');
  });
}

async function resolveAvailablePort(preferredPort) {
  if (await checkExistingDqnamoServer(preferredPort)) {
    writeDesktopLog(`Reusing existing Dqnamo POS backend on port ${preferredPort}`);
    return { port: preferredPort, alreadyRunning: true };
  }
  for (let candidate = preferredPort; candidate < preferredPort + 20; candidate++) {
    if (await isPortAvailable(candidate)) {
      return { port: candidate, alreadyRunning: false };
    }
  }
  return { port: preferredPort, alreadyRunning: false };
}

function configureRuntimePaths(port) {
  const userDataDir = app.getPath('userData');
  const dataDir = path.join(userDataDir, '.data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  seedInitialDataIfNeeded(dataDir);

  const distDir = resolveDistDirectory();
  process.env.NODE_ENV = 'production';
  process.env.PORT = String(port);
  process.env.DQNAMO_ROOT_DIR = userDataDir;
  process.env.DQNAMO_DATA_DIR = dataDir;
  process.env.DQNAMO_DIST_DIR = distDir;

  return { userDataDir, dataDir, distDir };
}

async function startEmbeddedBackend() {
  try {
    const { port, alreadyRunning } = await resolveAvailablePort(DEFAULT_PORT);
    activePort = port;
    const paths = configureRuntimePaths(activePort);

    if (alreadyRunning) {
      return paths;
    }

    const serverBundlePath = resolveServerBundlePath();
    writeDesktopLog(`Starting embedded server from ${serverBundlePath} on port ${activePort}`);
    require(serverBundlePath);
    return paths;
  } catch (err) {
    console.error('Failed to start embedded Dqnamo POS server:', err);
    writeDesktopLog('FAILED_TO_START_EMBEDDED_SERVER', err);
    return configureRuntimePaths(activePort);
  }
}

function waitForServerReady(url, timeoutMs = 20000) {
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

async function createMainWindow(distDir) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 880,
    minWidth: 1024,
    minHeight: 680,
    title: 'Dqnamo POS — نظام نقاط البيع والمزامنة المحلية',
    autoHideMenuBar: true,
    backgroundColor: '#090a0f',
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

  const localUrl = `http://127.0.0.1:${activePort}`;
  const serverReady = await waitForServerReady(localUrl, 20000);

  if (serverReady) {
    try {
      await mainWindow.loadURL(localUrl);
      writeDesktopLog(`Loaded POS UI from ${localUrl}`);
      return;
    } catch (loadErr) {
      writeDesktopLog(`Failed to load ${localUrl}, attempting file fallback`, loadErr);
    }
  } else {
    writeDesktopLog(`Embedded server did not respond within timeout at ${localUrl}`);
  }

  const indexFile = path.join(distDir || resolveDistDirectory(), 'index.html');
  if (fs.existsSync(indexFile)) {
    try {
      await mainWindow.loadFile(indexFile);
      writeDesktopLog(`Loaded POS UI from local file fallback: ${indexFile}`);
    } catch (fileErr) {
      writeDesktopLog(`Failed to load file fallback ${indexFile}`, fileErr);
    }
  }

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
    const paths = await startEmbeddedBackend();
    await createMainWindow(paths.distDir);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow(paths.distDir);
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
