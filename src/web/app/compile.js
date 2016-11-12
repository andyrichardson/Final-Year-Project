module.exports = function(){
  const browserify = require('browserify');
  const reactify = require('reactify');
  var path = require('path');
  const fs = require('fs');

  const js_compiler = browserify({
    transform: reactify
  });
  const bundle_js = fs.createWriteStream(path.join(__dirname, '../public/res/js/bundle.js'));

  // Compile Javascript
  js_compiler.add(path.join(__dirname, 'main.js'));
  js_compiler.bundle(function(err){
    if(err){
      return console.log(err);
    }
    console.log('Javascript compilation complete');
  }).pipe(bundle_js);
}
