const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const { vendorPath, manifestName } = require('./');
const { src, dist, example, localNodeModule } = require('./paths');
const { getFilename } = require('../utils');
const { filename } = require('./index');

const entry = fs
  .readdirSync(example)
  // Get rid of file type but js file
  .filter(file => /(.js|.jsx)$/.test(path.extname(file)))
  .reduce((entries, file) => {
    return Object.assign(entries, {
      [getFilename(file)]: path.resolve(example, file)
    });
  }, {});

// We add the compile env on the top of the project
// https://stackoverflow.com/questions/10111163/in-node-js-how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is
const resolveGlobalPath = relativePath => require.resolve('babel-loader');

// Use the global preset because of babel will look up react locally when
// set the presets: ['react'] and throw the strange error, more information in
// https://github.com/babel/babel/issues/5006
const globalPresets = [require.resolve('babel-preset-react')];
const globalPlugins = [
  'transform-object-rest-spread',
  'transform-class-properties'
].map(plugin => {
  return require.resolve(`babel-plugin-${plugin}`);
});

module.exports = {
  entry,
  output: {
    pathinfo: true,
    path: dist,
    filename
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [localNodeModule, 'node_modules']
  },
  // devtool: 'cheap-module-eval-source-map',
  // I think this will be better in development
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /(.js|.jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: resolveGlobalPath('babel-loader'),
          options: {
            // Do not let babel-core to use your local configuration
            babelrc: false,
            presets: globalPresets,
            plugins: globalPlugins
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(path.resolve(vendorPath, manifestName))
    })
  ],
  performance: {
    hints: false
  }
};
