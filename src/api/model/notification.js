'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const User = require('./user');

/* SCHEMA */
const schema = {
  type: {
    type: String,
    required: true,
  },
};

const NotificationHandler = new ModelHandler('Notification', schema);
let model;
let db;

/* INITIALIZE */
module.exports.init = (database) => {
  NotificationHandler.init(database);
  model = Prom.promisifyAll(NotificationHandler.getModel(), { suffix: 'Prom' });
  db = Prom.promisifyAll(database, { suffix: 'Prom' });
};

/* ADD NOTIFICATION */
module.exports.create = (username, notification) => {
  notification.created = Math.round(Date.now() / 1000);

  return User.getId(username)
  .then((id) =>
    User.model().pushProm(id, 'notifications', notification)
  );
};

/* MODEL */
module.exports.model = () => model;
