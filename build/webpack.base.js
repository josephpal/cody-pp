const path = require('path');
const config = require('../config');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const defaults = {
  __DEV__: JSON.stringify(config.isDev),
  __PROD__: JSON.stringify(config.isProd),
  'process.env.NODE_ENV': `"${config.env}"`,
  __APP_MODE__: `"${config.appMode}"`,
  __PUBLIC_PATH__: JSON.stringify(process.env.MODE === 'demo' ? config.assetsPublicPath : '/'),
  __DEFAULT_IP__: JSON.stringify(process.env.MODE === 'demo' ? "0.0.0.0" : '192.168.4.1'),
};

const webpackConfig = {
  entry: './src/js/main.js',
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    //filename: config.isDev ? './js/[name].js' : './js/[name].[chunkhash].js',
    filename: config.isDev ? './js/[name].js' : './[name].js',
    //chunkFilename: config.isDev ? './js/[id].js' : './js/chunk.[chunkhash].js',
    chunkFilename: config.isDev ? './js/[id].js' : './chunk.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  // node: {
  //    fs: "empty"
  // },
  plugins: [
    new webpack.DefinePlugin(defaults),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: config.isProd,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100,
          //name: path.posix.join(config.assetsSubDirectory, './img/[name].[ext]'),
          name: path.posix.join(config.assetsSubDirectory, './[name].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join(config.assetsSubDirectory, './media/[name].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          //name: path.posix.join(config.assetsSubDirectory, './fonts/[name].[ext]'),
          name: path.posix.join(config.assetsSubDirectory, './[name].[ext]'),
        },
      },
    ],
  },
};

module.exports = webpackConfig;
