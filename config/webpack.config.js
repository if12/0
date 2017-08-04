const path = require('path');
const { src, dist } = require('./paths');
const { filename } = require('.');

const entry = path.resolve(src, 'index.js');
// We add the compile env on the top of the project
// https://stackoverflow.com/questions/10111163/in-node-js-how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is
const resolveGlobalPath = relativePath => require.resolve('babel-loader');

// Use the global preset because of babel will look up react locally when
// set the presets: ['react'] and throw the strange error, more information in
// https://github.com/babel/babel/issues/5006
const globalPresets = [require.resolve('babel-preset-react')];

// Do not let babel-core to use your local configuration
module.exports = {
  entry,
  output: {
    pathinfo: true,
    path: dist,
    filename
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        // exclude: function(file) {
        //   if (/node_modules/.test(file)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // },
        use: {
          loader: resolveGlobalPath('babel-loader'),
          options: {
            babelrc: false,
            presets: globalPresets
          }
        }
      }
    ]
  }
};
