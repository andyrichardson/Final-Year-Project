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
