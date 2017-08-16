#!/usr/bin/env node

'use strict';
const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
  case 'init':
  case 'start':
  case 'test': {
    spawn.sync('node', [require.resolve(`../scripts/${script}`)].concat(args), {
      stdio: 'inherit'
    });
  }
}
