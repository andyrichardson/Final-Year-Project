'use strict';
const Prom = require('bluebird');
const Rest = require('rest');
const mime = require('rest/interceptor/mime');
const request = Rest.wrap(mime, { mime: 'application/json' });

/* HTTP ERROR CHECKER */
const errorCheck = response => new Prom((resolve, reject) => {
  if (response.status == undefined) {
    const error = new Error('Unable to communicate with authentication server.');
    error.status = 500;
    return reject(error);
  }

  if (response.entity.message == 'jwt malformed') {
    const error = new Error('Invalid/malformed authentication token');
    error.status = 400;
    return reject(error);
  }

  if (response.status.code != 200 && response.status.code != 201) {
    const error = new Error(response.entity.message);
    error.status = response.entity.status;
    return reject(error);
  }

  resolve(response);
});

class TokenMiddleware{
  /* SET AUTH SERVER URL */
  init(url) {
    this.authServer = url;
  }

  /* REGISTER */
  register(username, password) {
    return request({
      path: this.authServer + '/auth/user',
      method: 'POST',
      entity: {
        username: username,
        password: password,
      },
    })
    .catch(errorCheck)
    .then(errorCheck)
    .then(response => response);
  }

  /* CREATE TOKEN USING USER CREDENTIALS */
  create(username, password) {
    return request({
      path: this.authServer + '/auth',
      method: 'POST',
      entity: {
        username: username,
        password: password,
      },
    })
    .catch(errorCheck)
    .then(errorCheck)
    .then(response => response.entity.token);
  }

  /* UPDATE PASSWORD */
  password(username, password) {
    return request({
      path: this.authServer + '/auth/user',
      method: 'PATCH',
      entity: {
        username: username,
        password: password,
      },
    })
    .catch(errorCheck)
    .then(errorCheck);
  }

  /* DELETE TOKEN */
  delete(token) {
    return request({
      path: this.authServer + '/auth',
      method: 'DELETE',
      entity: {
        token: token,
      },
    })
    .catch(errorCheck)
    .then(errorCheck)
    .then(response => response.entity);
  }

  /* VALIDATE USER TOKEN */
  validate(req, res, next) {
    return new Prom((resolve, reject) => {
      const token = req.body.accessToken || req.query.accessToken;
      if (!token) {
        const error = new Error('Permission denied. Please log in');
        error.status = 403;
        return reject(error);
      }

      return request({
        path: this.authServer + '/auth?token=' + token,
        method: 'GET',
      })
      .catch(errorCheck)
      .then(errorCheck)
      .then(response => {
        req.auth = response.entity;
        return next();
      })
      .catch(err => reject(err));
    });
  }
}

let Token = new TokenMiddleware();

/* SET AUTH SERVER URL */
module.exports.init = url => Token.init(url);

/* REGISTER */
module.exports.register = (username, password) => Token.register(username, password);

/* CREATE TOKEN USING USER CREDENTIALS */
module.exports.create = (username, password) => Token.create(username, password);

/* CHANGE USER PASSWORD */
module.exports.password = (username, password) => Token.password(username, password);

/* DELETE TOKEN */
module.exports.delete = token => Token.delete(token);

/* VALIDATE USER TOKEN */
module.exports.validate = (req, res, next) => Token.validate(req, res, next);
