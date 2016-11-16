'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');

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

/* INITIALIZE */
module.exports.init = function(db){
    UserHandler.init(db);
    model = Prom.promisifyAll(UserHandler.getModel(), {suffix: 'Prom'});
    model.setUniqueKey('username');
    model.on('validate', validate.all);
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
    return model.whereProm({username: username}, {limit: 1})
    .then(function(node){
        if(node[0] === undefined){
            throw new Error("No such user");
        }

        const user = node[0];
        user.password = undefined;
        user.email = undefined;
        return user;
    });
};

/* SEARCH */
module.exports.search = function(query){
  return model.whereProm({username: new RegExp("^" + query + "[a-z]*")}, {limit: 5})
  .then(function(node){
    if(node[0] == undefined){
      throw new Error("No matching users");
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

/* RETURN MODEL */
module.exports.model = function(){
    return model;
};
