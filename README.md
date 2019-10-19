# Dolphin Audio visualizer 🐬

_An audio visualization tool for dolphin audio recordings, displaying live annotations and sound clusters_

## Running the project

First, [install the latest version of npm](https://www.npmjs.com) on your machine.

Then, run the following from your terminal clone this project locally...

```
git clone https://github.com/Holben888/dolphin-audio-visualizer.git 
cd dolphin-audio-visualizer
```

...install the dependencies...

```
npm install
```

...and start the application!
```
npm start
```

You should see your web browser automatically open. By default, this application runs on port `5000`. To change this, check the project configuration in the `rollup.config.js` file.

Since the `start` script uses the `--watch` flag, the webpage should automatically reload whenever you modify files under the `src` directory!

## Project breakdown

For now, this application uses the latest vanilla clientside languages (HTML5, CSS3, ES6 JavaScript).

### `src`

In this directory, you will find all of the source code for this project. For now, you will find:
- `index.html` The entrypoint for the application
- `index.js` The main JavaScript file for this application

### `src/build`

In this directory, you will find the deployed JavaScript bundle under `main.js`. This is generated using the Rollup build tool.

### `.vscode`

This directory contains some extra configuration files for those using the [VS Code editor](https://code.visualstudio.com). `extensions.json` contains some of the extensions we recommend while editing this project on your machine.