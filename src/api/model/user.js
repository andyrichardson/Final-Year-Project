'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const Slot = require('./slot');

/* SCHEMA */
const schema = {
  username: {
    type: String,
    lowercase: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  }
};

/* VALIDATION */
const validate = {
  all: function(user, callback){
    console.log('validating');
    console.log(user);
    callback();
  },
  firstName: function(){

  }
};

/* CREATE INSTANCE OF MODEL HANDLER */
const UserHandler = new ModelHandler('User', schema);
let model;

const hidePrivateData = function(user){
  console.log('call');
  return new Prom(function(fulfill, reject){
    if(user.friends != undefined){
      user.friends.forEach(function(el){
        el.password = undefined;
        el.email = undefined;
        return hidePrivateData(el);
      })
    }

    user.password = undefined;
    user.email = undefined;
    fulfill(user);
  })

}

/* INITIALIZE */
module.exports.init = function(db){
  UserHandler.init(db);
  model = Prom.promisifyAll(UserHandler.getModel(), {suffix: 'Prom'});

  Slot.init(db);

  model.setUniqueKey('username');
  model.on('validate', validate.all);
  model.compose(model, "friends", "has_friend", {many: true});
  model.compose(model, "requests", "has_request", {many:true}); // change model to request type
  model.compose(Slot.model(), "slots", "has_slot", {many: true});
};

/* LOG IN */
module.exports.login = function(username, password){
  return Token.create(username, password);
};

/* LOG OUT */
module.exports.logout = function(token){
  return Token.delete(token);
};

/* REGISTER/CREATE */
module.exports.create = function(obj){
  const user = {
    username: obj.username,
    password: obj.password,
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email
  };

  return model.saveProm(user)
  .then(function(){
    return Token.register(user.username, user.password);
  });
};

/* EDIT */
module.exports.edit = function(username, changes){
  return model.whereProm({username: username}, {limit: 1})
  .then(function(node){
    const user = node[0];

    // Set new properties
    for(let attr in user){
      if(changes.hasOwnProperty(attr)){
        if(attr == 'username' || attr == 'id'){
          continue;
        }

        user[attr] = changes[attr];
      }
    }

    return model.updateProm(user, true);
  })
  .then(function(data){
    return data;
  });
};

/* CHANGE PASSWORD */
module.exports.changePassword = function(username, oldPassword, newPassword){
  // Verify existing password
  return Token.create(username, oldPassword)
  .then(function(){
    // Set new password
    return Token.password(username, newPassword);
  })
  .then(function(){
    // Get new access token
    return Token.create(username, newPassword);
  });
};

/* GET */
module.exports.getUser = function(username){
  let node;

  return model.whereProm({username: username}, {limit: 1})
  .then(function(data){
    node = data;
    if(node[0] === undefined){
      throw new Error("No such user");
    }

    return model.queryProm("MATCH (x:User {username: {username}})-[:has_friend]-(node:User)", {username: username})
  })
  .then(function(data){
    const user = node[0];
    user.friends = data;
    user.password = undefined;
    user.email = undefined;

    return hidePrivateData(user)
  });
};

/* GET ID */
module.exports.getId = function(username){
  return model.whereProm({username: username}, {limit: 1})
  .then(function(data){
    return data[0].id;
  });
}

/* SEARCH */
module.exports.search = function(query){
  return model.whereProm({username: new RegExp("^" + query + "[a-z]*")}, {limit: 5})
  .then(function(node){
    if(node[0] == undefined){
      return [];
    }

    // Generate serch criteria
    const result = new Array();

    for(let x in node){
      const user = node[x];
      result.push({
        label: user.firstName + " " + user.lastName,
        value: user.username
      });
    }

    return result;
  });
};

/* ADD FRIEND */
module.exports.addUser = function(user, friend){
  if(user == friend){
    const error = new Error("User cannot be friends with self");
    error.status = 403;
    throw error;
  }

  let userProm = model.whereProm({username: user}, {limit: 1});
  let friendProm = model.whereProm({username: friend}, {limit: 1});

  return Prom.all([userProm, friendProm])
  .then(function(data){
    user = data[0][0];
    friend = data[1][0];

    if(friend == undefined){
      const error = new Error("Target friend does not exist");
      error.status = 403;
      throw error;
    }

    if(user.friends != undefined){
      user.friends.forEach(function (fr) {
        if(fr.username == friend.username){
          const error = new Error("Friendship already present");
          error.status = 409;
          throw error;
        }
      });
    }

    if(user == undefined){
      throw new Error("Source user does not exist");
    }

    return model.pushProm(user.id, "friends", friend);
  });
}

/* RETURN MODEL */
module.exports.model = function(){
  return model;
};
