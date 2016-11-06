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

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
