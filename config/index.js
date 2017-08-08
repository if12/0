const path = require('path');

const dllName = 'vendor';
module.exports = {
  // Using for webpack.config
  filename: 'js/[name].js',
  host: '127.0.0.1',
  // The 6666 port will be forbid by Chrome
  // so wo use 6969
  port: 6969,
  // What your dll global name?
  dllName: dllName.toUpperCase(),
  vendorPath: path.resolve(__dirname, '../fixture', 'vendor'),
  manifestName: `${dllName}-manifest.json`
};
