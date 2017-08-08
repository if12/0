const path = require('path');
const webpack = require('webpack');

const { dllName, vendorPath, manifestName } = require('./');
const { localNodeModule } = require('./paths');
const vendor = ['react', 'react-dom'];

module.exports = {
  entry: {
    [dllName]: vendor
  },
  resolve: {
    modules: [localNodeModule, 'node_modules']
  },
  output: {
    path: vendorPath,
    filename: 'index.js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(vendorPath, manifestName),
      context: __dirname,
      name: '[name]'
    })
  ]
};
