/* eslint-disable */
const { merge } = require('webpack-merge');

module.exports = () => {
  const env = process.env.NODE_ENV;

  const baseConfig = require('./build/webpack.base');
  const envConfig = require(`./build/webpack.${env}`);

  return merge(baseConfig, envConfig);
};
