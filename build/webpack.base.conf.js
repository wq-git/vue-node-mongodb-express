'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  /*
       *  使用动态组件，component可以是一个箭头函数
       *  @表示src目录
       *  如果想在network里面看到动态加载的组件名字，可以加webpackChunkName，同时要在webpack.base.conf.js里面的output里面的filename下面加上chunkFileName
       *  network里面动态加载模块名称
       */
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {

    alias: {
      'vendor': path.resolve(__dirname, '../src'),
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'styles':'../src/styles'
    },
    extensions: ['*','.js', '.vue', '.json']
  },
  module: {
    rules: [
      {
    test: /\.sass$/,
    loaders: [ 'style-loader',"css-loader", "sass-loader"]//"vue-style-loader",
  },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },


      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
            test: /\.svg$/,
            loader: 'svg-sprite-loader',
            include: [resolve('src/icons')],
            options: {
                symbolId: 'icon-[name]'
            }
       },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
