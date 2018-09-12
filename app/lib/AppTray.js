import path from 'path';
import electron from 'electron';
import electronSettings from 'electron-settings';

const { ipcRenderer, remote } = electron;

const { Tray, Menu } = remote;

const APP_ICON = path.join(__dirname, '../resources/tray', 'tray');

let instance = null;

/**
 * Handles toggle application tray icon
 *
 * @class AppTray
 */
class AppTray {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.tray = null;
    return instance;
  }

  /**
   * Get tray icon path
   *
   * @returns
   * @memberof AppTray
   */
  getIconPath() {
    if (process.platform === 'linux') {
      return `${APP_ICON}linux.png`;
    }
    return APP_ICON + (process.platform === 'win32' ? 'win.ico' : 'osx.png');
  }

  /**
   * Get tray icon size
   *
   * @returns
   * @memberof AppTray
   */
  getIconSize() {
    switch (process.platform) {
      case 'darwin':
        return 20;
      case 'win32':
        return 100;
      case 'linux':
        return 100;
      default:
        return 80;
    }
  }

  /**
   * Creates actual tray icon
   *
   * @memberof AppTray
   */
  createTray() {
    this.tray = new Tray(this.getIconPath());
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Focus',
        click() {
          ipcRenderer.send('focus-app');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        click() {
          ipcRenderer.send('quit-app');
        },
      },
    ]);
    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('Reactron');
    this.tray.on('click', () => {
      // Click event only works on Windows
      if (process.platform === 'win32') {
        ipcRenderer.send('toggle-app');
      }
    });
  }

  /**
   * Show the tray icon
   *
   * @memberof AppTray
   */
  showTrayIcon() {
    if (electronSettings.get('showTrayIcon')) {
      this.createTray();
    } else {
      this.destroyTrayIcon();
    }
  }

  /**
   * Destroy the tray icon
   *
   * @returns
   * @memberof AppTray
   */
  destroyTrayIcon() {
    if (!this.tray) {
      return;
    }
    this.tray.destroy();
    if (this.tray.isDestroyed()) {
      this.tray = null;
    } else {
      throw new Error('Tray icon not properly destroyed.');
    }
  }

  /**
   * Toggle tray icon
   *
   * @memberof AppTray
   */
  toggleTrayIcon() {
    const oldValue = electronSettings.get('showTrayIcon');
    electronSettings.set('showTrayIcon', !oldValue);
    this.showTrayIcon();
  }
}

export default new AppTray();
