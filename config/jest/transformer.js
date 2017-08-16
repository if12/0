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

const src = require('fs').readFileSync(
  '/Users/Roy/Documents/monkindey/pur-html/Examples/test/Link.test.js'
);

const code = transform(src, {
  presets: [...globalPresets, require.resolve('babel-preset-es2015')],
  plugins: [...globalPlugins],
  babelrc: false
}).code;

// console.log(code);

module.exports = babelJest.createTransformer({
  presets: globalPresets,
  plugins: globalPlugins,
  babelrc: false
});
