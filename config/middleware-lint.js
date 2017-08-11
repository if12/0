const { src, example } = require('./paths');
const { resolveGlobalPath } = require('../utils/');

module.exports = (config, next) => {
  // Inspired by create-react-app
  config.module.rules.push({
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
  });

  next();
};
