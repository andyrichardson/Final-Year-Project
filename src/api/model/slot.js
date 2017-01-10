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

const SlotHandler = new ModelHandler("Slot", schema);
let model;

/* INITIALIZE */
module.exports.init = function(db){
  SlotHandler.init(db);
  model = Prom.promisifyAll(SlotHandler.getModel(), {suffix: 'Prom'});
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
