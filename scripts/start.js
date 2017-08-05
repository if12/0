'use strict';

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../config/webpack.config.js');
const { port, filename } = require('../config');
const paths = require('../config/paths');

const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, {
  setup(app) {
    // Customize your View Engine
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    app.set('views', path.resolve(__dirname, '../views/'));

    // Add the index router
    app.get('/', (req, res) => {
      res.redirect('index');
    });

    // Add the router and gereator HTML for user
    // depend on the example name you send
    app.get('/:example', (req, res) => {
      let example = req.params.example;
      res.render('example', {
        filename: filename.replace(/\[(\w+)\]/, ($1, name) => example),
        name: example
      });
    });
  },
  contentBase: paths.example,
  stats: {
    colors: true
  }
});

devServer.listen(port, '127.0.0.1', () => {
  console.log(chalk.green(`The Webpack Dev Server at ${port}`));
});
