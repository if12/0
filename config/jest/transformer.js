const babelJest = require('babel-jest');

const globalPresets = [
  require.resolve('babel-preset-react'),
  require.resolve('babel-preset-es2015')
];
const { transform } = require('babel-core');

const globalPlugins = [
  'transform-object-rest-spread',
  'transform-class-properties'
].map(plugin => {
  return require.resolve(`babel-plugin-${plugin}`);
});

module.exports = babelJest.createTransformer({
  presets: globalPresets,
  plugins: globalPlugins,
  babelrc: false
});
