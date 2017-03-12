const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./private/config');
const seraph = require('seraph');

// Routers
const apiRouter = require('./routes/api');
const errorRouter = require('./routes/error');

const app = express();

// Models
const database = seraph(config.database);

const Token = require('./model/token');
Token.init(config.authServer);

const UserModel = require('./model/user');
UserModel.init(database);

// Allow cross domain requests
const allowCrossDomain = function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', `http://${process.env.HOSTNAME}`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}
app.use(allowCrossDomain);

const dataLimit = "10mb";

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json({limit: dataLimit}));
app.use(bodyParser.urlencoded({ extended: false, limit: dataLimit }));
app.use(cookieParser());

// Routing
app.use('/api', apiRouter);

// 404 Not found
app.use(function(req, res, next) {
    next({
        message: "Not found"
    });
});

app.use(errorRouter);

module.exports = app;
