'use strict';

const sass = require('node-sass'),
      mkdirp = require('mkdirp'),
      path = require('path'),
      fs = require('fs');

mkdirp.sync(path.join(__dirname, 'dist'));

let result = sass.renderSync({
  file: path.join(__dirname, 'sass', 'bundle.scss'),
  includePaths: [path.join(__dirname, 'node_modules', 'skeleton-scss')],
  excludePaths: [path.join(__dirname, 'sass', 'pages', 'IElte8')],
  outFile: 'bundle.css',
  sourceMap: true
});
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css'), result.css);
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css.map'), result.map);


let resultIE8 = sass.renderSync({
  file: path.join(__dirname, 'sass', 'bundle-IElte8.scss'),
  outFile: 'bundle.css',
  sourceMap: true
});
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle-IElte8.css'), resultIE8.css);
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle-IElte8.css.map'), resultIE8.map);
