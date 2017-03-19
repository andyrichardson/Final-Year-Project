'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const User = require('./user');
const Slot = require('./slot');
const Notification = require('./notification');
const Moment = require('moment');

/* SCHEMA */
const schema = {
  start: {
    type: Number,
    required: true,
  },
  finish: {
    type: Number,
    required: true,
  },
};

/* VALIDATION */
const validator = {
  validate: (data, callback) =>
    validator.datesValid(data)
    .then(validator.datesOrdered)
    .then(callback)
    .catch(callback),

  datesValid: (data) =>
    new Prom((resolve, reject) => {
      if (isNaN(data.start) || isNaN(data.finish)) {
        reject(new Error('Validation failed. Date(s) are invalid.'));
      }

      resolve(data);
    }),

  datesOrdered: (data) =>
    new Promise((resolve, reject) => {
      if (!(data.start < data.finish)) {
        reject(new Error('Validation failed. Start date must be before end date.'));
      }

      resolve();
    }),
};

const MeetingHandler = new ModelHandler('Meeting', schema);
let model;
let db;

/* INITIALIZE */
module.exports.init = (database) => {
  MeetingHandler.init(database);

  model = Prom.promisifyAll(MeetingHandler.getModel(), { suffix: 'Prom' });
  model.on('validate', validator.validate);

  db = Prom.promisifyAll(database, { suffix: 'Prom' });
};

/* CREATE MEETING */
module.exports.create = ({ id, start, finish }, user1, user2) =>
  model.saveProm({ start, finish, })
  .then(function (meeting) {
    const query = `MATCH (a:User),(b:User),(m:Meeting)
    WHERE a.username = "${user1}"
    AND b.username = "${user2}"
    AND ID(m) = ${meeting.id}
    CREATE (a)-[:has_meeting]->(m), (b)-[:has_meeting]->(m)`;

    return db.queryProm(query);
  })
  .then(() => Slot.delete(id));

/* MODEL */
module.exports.model = () => model;
