'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../config/webpack.config.js');
const { port } = require('../config');
const paths = require('../config/paths');

const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, {
  contentBase: paths.example,
  stats: {
    colors: true
  }
});

devServer.listen(port, '127.0.0.1', () => {
  console.log(chalk.green(`The Webpack Dev Server at ${port}`));
});
