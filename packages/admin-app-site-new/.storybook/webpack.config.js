const path = require('path');

module.exports = ({ config }) => {
  config.resolve.modules = [
    path.resolve(__dirname, '..', 'src'),
    path.resolve(__dirname, '..', 'node_modules'),
    path.resolve(__dirname, '..', '..', '..', 'node_modules'),
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, '..', 'src'),
  };

  return config;
};
