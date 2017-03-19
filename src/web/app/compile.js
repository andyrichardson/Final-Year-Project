const browserify = require('browserify');
const reactify = require('reactify');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const sassCompiler = require('node-sass');

// Input files
const entryJs = 'app/main.js';
const entrySass = 'app/main.scss';

// Output files
const bundleJs = path.join(__dirname, '../public/res/js/bundle.js');
const bundleCss = path.join(__dirname, '../public/res/css/bundle.css');

// Browserify config
const jsCompiler = browserify({
  entries: [entryJs],
  transform: reactify,
});

// Bundling function
const bundle = function () {
  console.log('Starting Javascript compilation'.red);

  // Compile Javascript
  jsCompiler.bundle(function (err) {
    if (err) {
      return console.log(err);
    }

    console.log('Javascript compilation complete'.green);
  }).pipe(fs.createWriteStream(bundleJs));
};

const bundleSass = function () {
  console.log('Starting SASS compilation'.red);

  // Compile SASS
  sassCompiler.render({
    file: entrySass,
  }, function (err, result) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile(bundleCss, result.css, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log('SASS compilation complete'.green);
    });
  });
};

if (process.argv[2] == '--sass-watch') {
  const Sasswatcher = require('node-sass-watcher');
  const watcher = new Sasswatcher(entrySass);
  watcher.on('init', bundleSass);
  watcher.on('update', bundleSass);
  watcher.run();
} else {
  bundle();
  bundleSass();
}

module.exports = bundle;
