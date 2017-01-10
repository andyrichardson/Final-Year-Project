'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const User = require('./user');

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

const SlotHandler = new ModelHandler("Slot", schema);
let model;

/* INITIALIZE */
module.exports.init = function(db){
  SlotHandler.init(db);
  model = Prom.promisifyAll(SlotHandler.getModel(), {suffix: 'Prom'});
  model.on("validate", validator.validate);
}

/* CREATE SLOT */
module.exports.create = function(username, start, finish){
  return User.getId(username)
  .then(function(id){
    return User.model().pushProm(id, "slots", {start: start, finish: finish});
  });
}

module.exports.model = function(){
  return model;
}
