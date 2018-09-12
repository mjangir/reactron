/* eslint global-require: 0, flowtype-errors/show-errors: 0, no-console: 0 */
import path from 'path';
import electron from 'electron';
import electronSettings from 'electron-settings';
import windowStateKeeper from 'electron-window-state';
import isDev from 'electron-is-dev';
import MenuBuilder from './menu';
import appUpdater from './autoupdater';
import { setAutoLaunch } from './startup';
import sentryUtil from '../utils/electronSentryUtil';

// Variables and Constants
let mainWindow;
let isQuitting = false;
const { app, ipcMain } = electron;
const indexPath = path.resolve(path.join(__dirname, '..', 'build'));
const mainURL = `file://${indexPath}/index.html`;

// Create application icon
const APP_ICON = path.join(__dirname, '../resources', 'icon');
const getIconPath = () =>
  APP_ICON + (process.platform === 'win32' ? '.ico' : '.png');

// Install source map support in production mode
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Install electron debugger in dev mode or DEBUG_PROD=true
if (isDev || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'node_modules');
  require('module').globalPaths.push(p);
}

// Install devtool extensions in dev mode
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

// Create single instance of the application. Restore if minimized
const isAlreadyRunning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
  }
});

// If already running, quit
if (isAlreadyRunning) {
  app.quit();
}

/**
 * Create main application window
 *
 * @returns win
 */
function createMainWindow() {
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1100,
    defaultHeight: 720,
    path: `${app.getPath('userData')}/config`,
  });

  // Let's keep the window position global so that we can access it in other process
  global.mainWindowState = mainWindowState;

  const win = new electron.BrowserWindow({
    // This settings needs to be saved in config
    title: 'Reactron',
    icon: getIconPath(),
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 300,
    minHeight: 400,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      partition: 'persist:webviewsession',
    },
    show: false,
  });

  win.on('focus', () => {
    win.webContents.send('focus');
  });

  win.once('ready-to-show', () => {
    if (electronSettings.get('startMinimized')) {
      win.minimize();
    } else {
      win.show();
    }
  });

  win.loadURL(mainURL);

  // Keep the app running in background on close event
  win.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();

      if (process.platform === 'darwin') {
        app.hide();
      } else {
        win.hide();
      }
    }
  });

  win.setTitle('Reactron');

  win.on('enter-full-screen', () => {
    win.webContents.send('enter-fullscreen');
  });

  win.on('leave-full-screen', () => {
    win.webContents.send('leave-fullscreen');
  });

  // To destroy tray icon when navigate to a new URL
  win.webContents.on('will-navigate', e => {
    if (e) {
      win.webContents.send('destroytray');
    }
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(win);

  return win;
}

// Decrease load on GPU (experimental)
app.disableHardwareAcceleration();

// Temporary fix for Electron render colors differently
// More info here - https://github.com/electron/electron/issues/10732
app.commandLine.appendSwitch('force-color-profile', 'srgb');

// eslint-disable-next-line max-params
app.on(
  'certificate-error',
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  },
);

// Create main window on application activation
app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', async () => {
  // Install devtool extensions
  if (isDev || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  // Set application menu
  mainWindow = createMainWindow();
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Initialize sentry for main process
  sentryUtil.sentryInit();

  const page = mainWindow.webContents;

  page.on('dom-ready', () => {
    if (electronSettings.get('startMinimized')) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  page.once('did-frame-finish-load', () => {
    // Initiate auto-updates on MacOS and Windows
    if (electronSettings.get('autoUpdate')) {
      appUpdater();
    }
  });

  // Temporarily remove this event
  // electron.powerMonitor.on('resume', () => {
  // 	mainWindow.reload();
  // 	page.send('destroytray');
  // });

  ipcMain.on('focus-app', () => {
    mainWindow.show();
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  // Show pdf in a new BrowserWindow
  ipcMain.on('pdf-view', (event, url) => {
    // Paddings for pdfWindow so that it fits into the main browserWindow
    const paddingWidth = 55;
    const paddingHeight = 22;

    // Get the config of main browserWindow
    const { mainWindowState } = global;

    // Window to view the pdf file
    const pdfWindow = new electron.BrowserWindow({
      x: mainWindowState.x + paddingWidth,
      y: mainWindowState.y + paddingHeight,
      width: mainWindowState.width - paddingWidth,
      height: mainWindowState.height - paddingHeight,
      webPreferences: {
        plugins: true,
        partition: 'persist:webviewsession',
      },
    });
    pdfWindow.loadURL(url);

    // We don't want to have the menu bar in pdf window
    pdfWindow.setMenu(null);
  });

  // Reload full app not just webview, useful in debugging
  ipcMain.on('reload-full-app', () => {
    mainWindow.reload();
    page.send('destroytray');
  });

  // Clear application settings
  ipcMain.on('clear-app-settings', () => {
    global.mainWindowState.unmanage(mainWindow);
    app.relaunch();
    app.exit();
  });

  // Toggle application
  ipcMain.on('toggle-app', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // Forward message
  ipcMain.on('forward-message', (event, listener, ...params) => {
    page.send(listener, ...params);
  });

  // Toggle auto launcher
  ipcMain.on('toggle-auto-launcher', (event, AutoLaunchValue) => {
    setAutoLaunch(AutoLaunchValue);
  });
});

// Before application quit
app.on('before-quit', () => {
  isQuitting = true;
});

// Send crash reports to sentry
process.on('uncaughtException', err => {
  console.error(err);
  console.error(err.stack);
});
