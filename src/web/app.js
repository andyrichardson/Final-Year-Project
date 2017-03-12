const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const app = express();

// Compile javascript/react
const compile = require('./app/compile');
compile();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Static data in public folder
app.use(express.static(path.join(__dirname, 'public')));

// Api proxy
const apiProxy = require('./routes/api');
app.use(apiProxy)

// All routes other than API return web app
app.get('*', function (req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.end('error');
});

module.exports = app;
