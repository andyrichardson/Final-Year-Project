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

const SlotHandler = new ModelHandler("Slot", schema);
let model, db;

/* INITIALIZE */
module.exports.init = function(database){
  SlotHandler.init(database);

  model = Prom.promisifyAll(SlotHandler.getModel(), {suffix: 'Prom'});
  model.on("validate", validator.validate);

  db = Prom.promisifyAll(database, {suffix: 'Prom'});
}

/* CREATE SLOT */
module.exports.create = function(username, start, finish){
  return User.getId(username)
  .then(function(id){
    return User.model().pushProm(id, "slots", {start: start, finish: finish});
  });
}

/* GET SLOT OWNER */
module.exports.getOwner = function(slotId){
  let query = `match (u:User)-[:has_slot]->(s:Slot) WHERE ID(s) = ${slotId} return u`;
  return db.queryProm(query)
  .then(function(data){
    if(data[0] === undefined){
      const error = new Error("Slot with declared ID does not exist.");
      error.status = 422;
      throw error;
    }
    return data[0];
  })
}

/* RESPOND TO SLOT */
module.exports.respond = function(username, slotId){
  if(isNaN(slotId)){
    const error = new Error("No/invalid slot ID declared.")
    error.status = 400;
    throw error;
  }

  let ownerUsername;

  return module.exports.getOwner(slotId)
  .then(function(owner){
    ownerUsername = owner.username;
    return User.hasFriend(username, owner.username)
  })
  .then(function(friends){
    if(!friends){
      const error = new Error("You do not have permission to respond to this slot.");
      error.status = 400;
      throw error;
    }

    return User.getUserAuthenticated(username, username);
  })
  .then(function(user){
    if(user.slotRequests !== undefined){
      user.slotRequests.forEach(function(el) {
        if(el.id == slotId){
          const error = new Error("Slot request already exists.");
          error.status = 401;
          throw error;
        }
      });
    }

    return db.relateProm(user.id, "requests_slot", slotId)
  })
  .then(function(){
    const data = {
      type: 'slot response',
      username: username,
      slotId: slotId
    };

    return Notification.create(ownerUsername, data);
  });
}

/* MODEL */
module.exports.model = function(){
  return model;
}
