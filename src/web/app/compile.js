const browserify = require('browserify');
const reactify = require('reactify');
const watchify = require('watchify');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const sass_compiler = require('node-sass');
const sasswatcher = require('node-sass-watcher');

// Input files
const entry_js = 'app/main.js';
const entry_sass = 'app/main.scss';

// Output files
const bundle_js = path.join(__dirname, '../public/res/js/bundle.js');
const bundle_css = path.join(__dirname, '../public/res/css/bundle.css');

// Browserify config
const js_compiler = browserify({
  entries: [entry_js],
  transform: reactify,
  plugin: [watchify]
});

// Bundling function
const bundle = function(){
  console.log('Starting Javascript compilation'.red);

  // Compile Javascript
  js_compiler.bundle(function(err){
    if(err){
      return console.log(err);
    }
    console.log('Javascript compilation complete'.green);
  }).pipe(fs.createWriteStream(bundle_js));
}

const bundle_sass = function(){
  console.log('Starting SASS compilation'.red);

  // Compile SASS
  sass_compiler.render({
    file: entry_sass
  }, function(err, result){
    if(err){
      return console.log(err);
    }
    fs.writeFile(bundle_css, result.css, function(err){
      if(err){
        return console.log(err);
      }
        console.log('SASS compilation complete'.green);
    })
  })
}

// Watchify
js_compiler.on('update', bundle);

const watcher = new sasswatcher(entry_sass);
watcher.on('init', bundle_sass);
watcher.on('update', bundle_sass);
watcher.run();

module.exports = bundle;
