'use strict';

const path = require('path');

const fse = require('fs-extra');
const spawn = require('cross-spawn');
const majo = require('majo');
const ejs = require('ejs');

const { checkNpmInstalled, checkYarnInstalled, fallback } = require('../utils');

const name = process.argv[2];

const TEMPLATE_PATH = path.resolve(__dirname, '../template');
const PATH = path.resolve(process.cwd(), name);

// I like it
const stream = majo();

process.on('unhandledRejection', err => {
  throw err;
});

// Beacause we want to render file with ejs template,
// and not use the fs-extra.copy method
function copy() {
  stream
    .source(`**`, {
      baseDir: TEMPLATE_PATH
    })
    .use(ctx =>
      Promise.all(
        ctx.fileList.map(file => {
          const content = ctx.fileContents(file);
          const res = ejs.render(content, {
            name
          });

          ctx.writeContents(file, res);
        })
      )
    )
    .dest(PATH, {
      baseDir: '/'
    });
}

function chdir() {
  return Promise.resolve(process.chdir(PATH));
}

// Installing
function install(deps) {
  return fallback([
    {
      fn: checkYarnInstalled,
      resolve: 'yarn'
    },
    {
      fn: checkNpmInstalled,
      resolve: 'npm'
    }
  ]).then(
    cmd => {
      return new Promise((resolve, reject) => {
        let child;
        let args;
        if (cmd === 'yarn') {
          args = ['add'].concat(deps);
        } else {
          args = ['install'].concat(deps);
        }

        child = spawn(cmd, args, {
          stdio: 'inherit'
        });

        child.on('close', code => {
          if (code !== 0) {
            reject();
          }

          resolve();
        });
      });
    },
    () => {
      throw new Error(`You must have the Package manager in your computer`);
    }
  );
}

fse.ensureDir(PATH).then(copy).then(chdir).then(() => {
  return install(['react', 'react-dom']);
});
