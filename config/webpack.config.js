const path = require('path');
const { src, dist, example, localNodeModule } = require('./paths');
const { filename } = require('.');

const entry = path.resolve(example, 'index.js');
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

// Do not let babel-core to use your local configuration
module.exports = {
  entry,
  output: {
    pathinfo: true,
    path: dist,
    filename
  },
  resolve: {
    modules: [localNodeModule, 'node_modules']
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: resolveGlobalPath('babel-loader'),
          options: {
            babelrc: false,
            presets: globalPresets,
            plugins: globalPlugins
          }
        }
      }
    ]
  }
};
