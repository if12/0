const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const { vendorPath, manifestName } = require('./');
const { src, dist, example, localNodeModule } = require('./paths');
const { getFilename } = require('../utils');
const eslintFormatter = require('../utils/eslintFormatter');
const { filename } = require('./index');
const WatchAddPlugin = require('../utils/WatchAddPlugin');

const files = fs
  .readdirSync(example)
  // Get rid of file type but js
  .filter(file => /(.js|.js)$/.test(path.extname(file)));

const entry = makeEntry(files);

function makeEntry(files) {
  return files.reduce((entries, file) => {
    return Object.assign(entries, {
      [getFilename(file)]: path.resolve(example, file)
    });
  }, {});
}

// We add the compile env on the top of the project
// https://stackoverflow.com/questions/10111163/in-node-js-how-can-i-get-the-path-of-a-module-i-have-loaded-via-require-that-is
const resolveGlobalPath = relativePath => require.resolve(relativePath);

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

const webpackConfig = {
  entry,
  output: {
    // Only in development
    pathinfo: true,
    path: dist,
    filename
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    // Your repo node_modules will have higher priority
    modules: ['node_modules', localNodeModule]
  },
  // I think this will be better in development
  devtool: 'eval-source-map',
  module: {
    rules: [
      // Refer to create-react-app
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            loader: resolveGlobalPath('eslint-loader'),
            options: {
              // formatter: eslintFormatter,
              eslintPath: resolveGlobalPath('eslint'),
              baseConfig: {
                extends: [resolveGlobalPath('eslint-config-react-app')]
              }
            }
          }
        ],
        include: [src, example]
      },

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
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'].map(
          resolveGlobalPath
        ),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'].map(resolveGlobalPath)
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(path.resolve(vendorPath, manifestName))
    }),
    new WatchAddPlugin({
      path: example
    })
  ],
  performance: {
    hints: false
  }
};

module.exports = config => {
  // Such as `yarn start table`, and the
  // entry will be ['table'].  `yarn start`
  // entry will be [] and run every js of
  // example folder
  if (config.entry.length !== 0) {
    config.entry = makeEntry(config.entry);
  } else {
    delete config.entry;
  }

  return Object.assign(webpackConfig, config);
};
