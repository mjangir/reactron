import { init, captureException } from '@sentry/electron';
import isDev from 'electron-is-dev';

const sentryInit = () => {
  if (!isDev) {
    init({
      dsn: 'https://8cebf30e818541fcbf04cd9a9ce2becc@sentry.io/1278563',
      sendTimeout: 0,
    });
  }
};

export default {
  sentryInit,
  captureException,
};
