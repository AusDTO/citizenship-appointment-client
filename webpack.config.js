'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  debug: true,
  context: path.join(__dirname, 'lib'),
  entry: {
    index: "./index",
    booking: "./booking"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  devtool: 'source-map',
  target: 'web',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|lib)/,
        loader: 'babel'
      },
      {
        test: /\.mustache$/,
        exclude: /(node_modules|lib)/,
        loader: 'mustache?noShortcut'
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  node: {
   fs: 'empty'
  },
  resolve: {
    alias: {
      'hogan.js': 'hogan.js/dist/template-3.0.2.js'
    }
  }
};
