'use strict';

const path = require('path');
const fs = require('fs');
const fw = require('find-what');

// Refer to create-react-app
// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/paths.js
const appDir = fs.realpathSync(process.cwd());
const resolveAppPath = relativePath => path.resolve(appDir, relativePath);

module.exports = {
  src: resolveAppPath('src'),
  dist: resolveAppPath('dist'),
  example: resolveAppPath('example'),
  localNodeModule: path.resolve(fw(__dirname, 'node_modules'), 'node_modules')
};
