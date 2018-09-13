/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { ipcRenderer } from 'electron';
import electronSettings from 'electron-settings';
import H1 from 'components/H1';
import messages from './messages';
import appTray from '../../lib/AppTray';

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAutoLaunch = this.toggleAutoLaunch.bind(this);
    this.toggleStartMinimized = this.toggleStartMinimized.bind(this);
    this.toggleTray = this.toggleTray.bind(this);
    this.state = {
      autoLaunch: electronSettings.get('startAtLogin'),
      showTray: electronSettings.get('showTrayIcon'),
      startMinimized: electronSettings.get('startMinimized'),
    };
  }

  componentDidMount() {
    appTray.destroyTrayIcon();
    appTray.showTrayIcon();
  }

  toggleAutoLaunch() {
    const autoLaunch = electronSettings.get('startAtLogin');
    const newValue = !autoLaunch;
    electronSettings.set('startAtLogin', newValue);
    ipcRenderer.send('toggle-auto-launcher', newValue);
    this.setState({
      autoLaunch: newValue,
    });
  }

  toggleStartMinimized(e) {
    const status = e.target.checked;
    electronSettings.set('startMinimized', status);
    this.setState({
      startMinimized: status,
    });
  }

  toggleTray() {
    this.setState({
      showTray: !this.state.showTray,
    });
    appTray.toggleTrayIcon();
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Settings Page</title>
          <meta name="description" content="Settings page of Reactron" />
        </Helmet>
        <H1>
          <FormattedMessage {...messages.header} />
        </H1>
        <label htmlFor="toggleAutoLaunch">
          <input
            name="toggleAutoLaunch"
            id="toggleAutoLaunch"
            type="checkbox"
            checked={this.state.autoLaunch}
            onChange={this.toggleAutoLaunch}
          />
          <FormattedMessage {...messages.autoLaunch} />
        </label>
        <br />
        <label htmlFor="toggleTray">
          <input
            name="toggleTray"
            id="toggleTray"
            type="checkbox"
            checked={this.state.showTray}
            onChange={this.toggleTray}
          />
          <FormattedMessage {...messages.showTrayIcon} />
        </label>
        <br />
        <label htmlFor="startMinimized">
          <input
            name="startMinimized"
            id="startMinimized"
            type="checkbox"
            checked={this.state.startMinimized}
            onChange={this.toggleStartMinimized}
          />
          <FormattedMessage {...messages.startMinimized} />
        </label>
      </div>
    );
  }
}
