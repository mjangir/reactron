/* eslint global-require: 0 */
import { app, dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import es from 'electron-settings';
import isDev from 'electron-is-dev';

function appUpdater(updateFromMenu = false) {
  // Don't initiate auto-updates in development
  if (isDev) {
    return;
  }

  if (process.platform === 'linux' && !process.env.APPIMAGE) {
    // const { linuxUpdateNotification } = require('./linuxupdater');
    // linuxUpdateNotification();
    return;
  }

  let updateAvailable = false;

  // Create Logs directory
  const logsDir = `${app.getPath('userData')}/logs`;

  // Log whats happening
  const log = require('electron-log');

  log.transports.file.file = `${logsDir}/updates.log`;
  log.transports.file.level = 'info';
  autoUpdater.logger = log;

  // Handle auto updates for beta/pre releases
  autoUpdater.allowPrerelease = es.get('allowPreRelease') || false;

  const eventsListenerRemove = ['update-available', 'update-not-available'];

  autoUpdater.on('update-available', info => {
    if (updateFromMenu) {
      dialog.showMessageBox({
        message: `A new version ${info.version}, of Reactron is available`,
        detail:
          'The update will be downloaded in the background. You will be notified when it is ready to be installed.',
      });

      updateAvailable = true;

      eventsListenerRemove.forEach(event => {
        autoUpdater.removeAllListeners(event);
      });
    }
  });

  autoUpdater.on('update-not-available', () => {
    if (updateFromMenu) {
      dialog.showMessageBox({
        message: 'No updates available',
        detail: `You are running the latest version of Reactron.\nVersion: ${app.getVersion()}`,
      });
      autoUpdater.removeAllListeners();
    }
  });

  autoUpdater.on('error', error => {
    if (updateFromMenu) {
      const messageText = updateAvailable
        ? 'Unable to download the updates'
        : 'Unable to check for updates';
      dialog.showMessageBox(
        {
          type: 'error',
          buttons: ['Manual Download', 'Cancel'],
          message: messageText,
          detail: `${error.toString()}\n\nThe latest version of Reactron Website is available at -
          \nhttps://github.com/mjangir/reactron/.\nCurrent Version: ${app.getVersion()}`,
        },
        response => {
          if (response === 0) {
            shell.openExternal('https://github.com/mjangir/reactron');
          }
        },
      );
      autoUpdater.removeAllListeners();
    }
  });

  // Ask the user if update is available
  // eslint-disable-next-line no-unused-vars
  autoUpdater.on('update-downloaded', event => {
    // Ask user to update the app
    dialog.showMessageBox(
      {
        type: 'question',
        buttons: ['Install and Relaunch', 'Install Later'],
        defaultId: 0,
        message: `A new update ${event.version} has been downloaded`,
        detail:
          'It will be installed the next time you restart the application',
      },
      response => {
        if (response === 0) {
          setTimeout(() => {
            autoUpdater.quitAndInstall();
            // force app to quit. This is just a workaround, ideally autoUpdater.quitAndInstall() should relaunch the app.
            app.quit();
          }, 1000);
        }
      },
    );
  });
  // Init for updates
  autoUpdater.checkForUpdates();
}

export default {
  appUpdater,
};
