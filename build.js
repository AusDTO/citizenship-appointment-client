'use strict';

const sass = require('node-sass'),
      mkdirp = require('mkdirp'),
      path = require('path'),
      fs = require('fs');

mkdirp.sync(path.join(__dirname, 'dist'));

let result = sass.renderSync({
  file: path.join(__dirname, 'sass', 'bundle.scss'),
  includePaths: [path.join(__dirname, 'node_modules', 'node-normalize-scss'),
                 path.join(__dirname, 'node_modules', 'bourbon'),
                 path.join(__dirname, 'node_modules', 'neat')],
  excludePaths: [path.join(__dirname, 'sass', 'pages', 'IElte8')],
  outputStyle: 'compressed',
  outFile: 'bundle.css',
  sourceMap: true
});
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css'), result.css);
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css.map'), result.map);


let resultIE8 = sass.renderSync({
  file: path.join(__dirname, 'sass', 'bundle-IElte8.scss'),
  outputStyle: 'compressed',
  outFile: 'bundle.css',
  sourceMap: false
});
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle-IElte8.css'), resultIE8.css);
