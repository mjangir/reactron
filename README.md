![React Boilerplate Electron Version](https://i.imgur.com/8CZJbuv.png)

Reactron is a boilerplate to kick start your electron application with react based on [Electron](https://electronjs.org/) and the famous [React Boilerplate](https://github.com/react-boilerplate/react-boilerplate).

[![React](https://i.imgur.com/EHTkSo4.png)](https://facebook.github.io/react/) [![Redux](https://i.imgur.com/Dc5hwbH.png)](http://redux.js.org/) [![Webpack](https://i.imgur.com/bnWDwBq.png)](https://webpack.github.io/) [![BabelJS](https://i.imgur.com/E7u0hE2.png)](https://babeljs.io) [![React Router](https://i.imgur.com/XHfcLEk.png)](https://reacttraining.com/react-router/) [![Jest](https://i.imgur.com/fZMgFph.png)](https://jestjs.io/) [![ESLint](https://i.imgur.com/HB0kxnC.png)](https://eslint.org/)
___
### Installation
>**Note:**
>Whether you have native dependencies in your app or not, I assume it's nice to always have node-gyp build tools installed on your machine.
>
>**For Windows:** ```npm install --global --production windows-build-tools``` from CMD or Powershell (With Admin)
>
>**For Ubuntu:** [Follow My Answer On Stackoverflow](https://stackoverflow.com/questions/21155922/error-installing-node-gyp-on-ubuntu/51667296#51667296)

##### Then
First, clone the repository from github:
```{r, engine='sh'}
$ git clone https://github.com/mjangir/reactron.git
```
And then install dependencies with npm:
```{r, engine='sh'}
$ npm install
```
### Run
Start the app in the dev environment. This starts the renderer process in [hot-module-replacement](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:
```{r, engine='sh'}
$ npm run dev
```
Alternatively, you can run the renderer and main processes separately. This way, you can restart one process without waiting for the other. Run these two commands simultaneously in different console tabs:
```{r, engine='sh'}
$ npm run start-renderer-dev
$ npm run start-main-dev
```
You can also run a webpack compiled main process with the following:
```{r, engine='sh'}
$ npm start
```
### Packaging
To package apps for the local platform:
```{r, engine='sh'}
$ npm run package
```
To package apps for all platforms:

First, refer to Multi Platform Build for dependencies.
Then,
```{r, engine='sh'}
$ npm run package-all
```
### Features Added
The project has some of the common desktop application features integrated:
1. Auto Update: Publish your electron app on Github or Amazon S3 by updating the credentials in package.json. Then click on the Check For Updates in Help menu. For more information on publishing the app, [check this out](https://www.electron.build/configuration/publish).
2. Auto Launch On Start: On settings page, when you check Auto Launch At Start option, the app will be automatically started on windows or osx startup.
3. Show Tray Icon: On settings page, you can toggle Show Tray Icon option to show the icon in tray. Currently it has only quit option in the tray context menu.
4. Start Minimized: If you check this option, the application will be started minimized.
5. Apart from that, window state keeper has been added to retain the last window sizes and dimesion.
### How to keep your project updated with the boilerplate
If your application is a fork from this repository, you can add this repo to another git remote:
```{r, engine='sh'}
git remote add upstream https://github.com/mjangir/reactron.git
```
Then, use git to merge some latest commits:
```{r, engine='sh'}
git pull upstream master
```
### Thanks To
[React Boilerplate](https://github.com/react-boilerplate/react-boilerplate)
[Electron](https://electronjs.org/)
### Maintainers
[Manish Jangir](https://github.com/mjangir)
### License
MIT &copy; [Manish Jangir](https://github.com/mjangir)