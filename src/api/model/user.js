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
    model.on('validate', validate.all);
    // Session.init(db, model);
    // compose();
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
    return Token.register(obj.username, obj.password)
    .then(function(data){
        const user = {
            username: obj.username,
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email
        };

        return model.save(user);
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
/* RETURN MODEL */
module.exports.model = function(){
    return model;
};
