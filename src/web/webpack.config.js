var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/main.js',
  target: 'web',
  output: {
    publicPath: "/res/js",
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devServer: {
    inline:true,
    port: 80,
    host: "0.0.0.0",
    historyApiFallback: {
      index: 'index.html'
    }
  },
  node: {
    fs: "empty",
    tls: "empty",
    net: 'empty'
  },
  externals: {
  'cheerio': 'window',
  'react/addons': 'react',
  'react/lib/ExecutionEnvironment': 'react',
  'react/lib/ReactContext': 'react',
  }
};
