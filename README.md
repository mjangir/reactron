![React Boilerplate Electron Version](https://i.imgur.com/8CZJbuv.png)
Reactron is a boilerplate to kick start your electron application with react based on [Electron](https://electronjs.org/) and the famous [React Boilerplate](https://github.com/react-boilerplate/react-boilerplate).

[![React](https://i.imgur.com/EHTkSo4.png)](https://facebook.github.io/react/) [![Redux](https://i.imgur.com/Dc5hwbH.png)](http://redux.js.org/) [![Webpack](https://i.imgur.com/bnWDwBq.png)](https://webpack.github.io/) [![BabelJS](https://i.imgur.com/E7u0hE2.png)](https://babeljs.io) [![React Router](https://i.imgur.com/XHfcLEk.png)](https://reacttraining.com/react-router/) [![Jest](https://i.imgur.com/fZMgFph.png)](https://jestjs.io/) [![ESLint](https://i.imgur.com/HB0kxnC.png)](https://eslint.org/)
___
### Installation
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