import { remote } from 'electron';
import os from 'os';

const { app } = remote;

let instance = null;

class SystemUtil {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.connectivityERR = [
      'ERR_INTERNET_DISCONNECTED',
      'ERR_PROXY_CONNECTION_FAILED',
      'ERR_CONNECTION_RESET',
      'ERR_NOT_CONNECTED',
      'ERR_NAME_NOT_RESOLVED',
      'ERR_NETWORK_CHANGED',
    ];
    this.userAgent = null;

    return instance;
  }

  getOS() {
    if (os.platform() === 'darwin') {
      return 'Mac';
    }
    if (os.platform() === 'linux') {
      return 'Linux';
    }
    if (os.platform() === 'win32' || os.platform() === 'win64') {
      if (parseFloat(os.release()) < 6.2) {
        return 'Windows 7';
      }
      return 'Windows 10';
    }
    return null;
  }

  setUserAgent(webViewUserAgent) {
    this.userAgent = `Reactron/${app.getVersion()} ${webViewUserAgent}`;
  }

  getUserAgent() {
    return this.userAgent;
  }
}

export default new SystemUtil();
