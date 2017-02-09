'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const User = require('./user');
const Notification = require('./notification');

/* SCHEMA */
const schema = {
  start: {
    type: Date,
    required: true
  },
  finish: {
    type: Date,
    required: true
  }
}

/* VALIDATION */
const validator = {
  validate: function(data, callback){
    return validator.datesValid(data)
    .then(validator.datesOrdered)
    .then(callback)
    .catch(callback);
  },
  datesValid: function(data){
    return new Prom(function(resolve, reject){
      if (isNaN(data.start) || isNaN(data.finish)){
        reject(new Error("Validation failed. Date(s) are invalid."));
      }
      resolve(data);
    });
  },
  datesOrdered: function(data){
    return new Promise(function(resolve, reject) {
      if(!(data.start < data.finish)){
        reject(new Error("Validation failed. Start date must be before end date."));
      }
      resolve();
    });
  }
}

const MeetingHandler = new ModelHandler("Meeting", schema);
let model, db;

/* INITIALIZE */
module.exports.init = function(database){
  MeetingHandler.init(database);

  model = Prom.promisifyAll(MeetingHandler.getModel(), {suffix: 'Prom'});
  model.on("validate", validator.validate);

  db = Prom.promisifyAll(database, {suffix: 'Prom'});
}

/* CREATE MEETING */
module.exports.create = function(slot, user1, user2){
  const meeting = {
    start: slot.start,
    finish: slot.finish
  };

  return model.saveProm(meeting)
  .then(function(meeting){
    const query = `MATCH (a:User),(b:User),(m:Meeting),(s:Slot)
    WHERE a.username = "${user1}"
    AND b.username = "${user2}"
    AND ID(m) = ${meeting.id}
    AND ID(s) = ${slot.id}
    CREATE (a)-[:has_meeting]->(m), (b)-[:has_meeting]->(m)
    DETACH DELETE s`

    return db.queryProm(query);
  });
}

/* MODEL */
module.exports.model = function(){
  return model;
}
