const browserify = require('browserify');
const reactify = require('reactify');
const watchify = require('watchify');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Browserify config
const js_compiler = browserify({
  entries: ['app/main.js'],
  transform: reactify,
  plugin: [watchify]
});

// Output file
const bundle_js = path.join(__dirname, '../public/res/js/bundle.js');

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

// Watchify
js_compiler.on('update', bundle);

module.exports = bundle;

//
// var fs = require('fs');
// var browserify = require('browserify');
// var watchify = require('watchify');
//
// var b = browserify({
//   entries: ['path/to/entry.js'],
//   cache: {},
//   packageCache: {},
//   plugin: [watchify]
// });
//
// b.on('update', bundle);
// bundle();
//
// function bundle() {
//   b.bundle().pipe(fs.createWriteStream('output.js'));
// }
