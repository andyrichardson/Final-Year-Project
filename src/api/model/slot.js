'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const User = require('./user');
const Notification = require('./notification');
const Meeting = require('./meeting');
const Moment = require("moment");

/* SCHEMA */
const schema = {
  start: {
    type: Number,
    required: true
  },
  finish: {
    type: Number,
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
        console.log("++++++++");
        console.log(data.start);
        console.log(data.finish);
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
  model.useTimestamps(['created']);

  db = Prom.promisifyAll(database, {suffix: 'Prom'});
}

/* CREATE SLOT */
module.exports.create = function(username, start, finish){
  return User.getId(username)
  .then(function(id){
    return User.model().pushProm(id, "slots", {start: start, finish: finish});
  });
}

/* DELETE SLOT */
module.exports.delete = function(slotId){
    const query = `MATCH (s:Slot), (n:Notification {slotId:"${slotId}"})
    WHERE ID(s) = ${slotId}
    DETACH DELETE s, n`;

    return db.queryProm(query);
}

/* GET SLOT OWNER */
module.exports.getOwner = function(slotId){
  let query = `MATCH (u:User)-[:has_slot]->(s:Slot) WHERE ID(s) = ${slotId} return u`;
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

/* CONFIRM SLOT MEETING REQUEST */
module.exports.confirm = function(self, friend, slotId){
  if(self === undefined || friend === undefined || slotId === undefined){
    const error = new Error("One or more arguments missing.");
    error.status = 400;
    throw error;
  }

  const query = `MATCH (:User {username: "${self}"})-[:has_slot]->(s),
  (:User {username: "${friend}"})-[:requests_slot]->(s)
  WHERE ID(s) = ${slotId}
  RETURN s`;

  return db.queryProm(query)
  .then(function(slot){
    // No matches
    if(slot[0] === undefined){
      const error = new Error("Invalid request, slot could not be confirmed.");
      error.status = 400;
      throw error;
    }

    return Meeting.create(slot[0], self, friend);
  })
}

/* DECLINE SLOT MEETING REQUEST */
module.exports.decline = function(self, friend, slotId){
  if(self === undefined || friend === undefined || slotId === undefined){
    const error = new Error("One or more arguments missing.");
    error.status = 400;
    throw error;
  }

  // Delete request and notification
  const query = `MATCH (a:User {username: "${self}"})-[:has_slot]->(s:Slot),
  (:User {username: "${friend}"})-[r:requests_slot]->(s:Slot),
  (a)-[:has_notification]->(n:Notification {slotId: "${slotId}", username: "${friend}"})
  WHERE ID(s) = ${slotId}
  DETACH DELETE r, n
  RETURN a`;

  return db.queryProm(query)
  .then(function(data){
    if(data[0] === undefined){
      const error = new Error("Unable to decline request.")
      error.status = 400;
      throw error;
    }
  })
}

/* GET SLOT FEED */
module.exports.getFeed = function(username, start, finish){
  const query = `MATCH (u:User)-[:has_friend]-(f:User),
  (f)-[:has_slot]->(s:Slot)
  WHERE u.username = "${username}"
  RETURN s, f.username
  ORDER BY s.created DESC`;

  return db.queryProm(query)
  .then(function(data){
    return data.map(function(el){
      el.s.username = el['f.username'];
      return el.s
    });
  })
}

/* MODEL */
module.exports.model = function(){
  return model;
}
