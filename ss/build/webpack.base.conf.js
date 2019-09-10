'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const utils = require('./utils')
const env = require('./env')
const paths = require('./paths');

const publicPath = './'

module.exports = {
  context: path.resolve(__dirname, '../'),  // 绝对路径。__dirname为当前目录。
  // Entry point
  entry: [
    paths.appIndexJs,
  ],
  // 
  resolve: {
    // 自动解析文件扩展名(补全文件后缀)(从左->右)
    // import hello from './hello'  （!hello.js? -> !hello.jsx? -> !hello.json）
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve('src')
    }
  },
  module: {
    strictExportPresence: true,
    // Ignore file to parse
    noParse: function(content) {
      return /jquery|lodash/.test(content);
    },
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'babel-loader',
          }, 
          // {
          //   loader: 'eslint-loader', // 指定启用eslint-loader
          //   options: {
          //     formatter: require('eslint-friendly-formatter'),
          //     emitWarning: false
          //   }
          // }
        ]
      },
      ...utils.getStyleLoaders('css', {
        // modules: true,
      }),
      ...utils.getStyleLoaders('less', {
        use: {
          modules: true,
        }
      }),
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: ('assets/media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: ('assets/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // e.g. %PUBLIC_URL%
    // new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // Makes some environment variables available to the JS code
    // e.g. process.env.NODE_ENV === 'development'
    // new webpack.DefinePlugin(env.stringified),
    // Hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Makes the discovery automatic after missing a module
    // And then `yarn add xx`
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  performance: false,
}