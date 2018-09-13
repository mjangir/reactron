import { app } from 'electron';
import AutoLaunch from 'auto-launch';
import isDev from 'electron-is-dev';
import es from 'electron-settings';

export const setAutoLaunch = autoLaunchValue => {
  // Don't run this in development
  if (isDev) {
    return;
  }

  // On Mac, work around a bug in auto-launch where it opens a Terminal window
  // See https://github.com/Teamwork/node-auto-launch/issues/28#issuecomment-222194437
  const appPath =
    process.platform === 'darwin'
      ? app.getPath('exe').replace(/\.app\/Content.*/, '.app')
      : undefined; // Use the default

  const AutoLauncher = new AutoLaunch({
    name: 'Reactron',
    path: appPath,
    isHidden: false,
  });
  const autoLaunchOption = es.get('startAtLogin', autoLaunchValue);

  if (autoLaunchOption) {
    AutoLauncher.enable();
  } else {
    AutoLauncher.disable();
  }
};
