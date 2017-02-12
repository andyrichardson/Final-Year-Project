'use strict';
const Prom = require('bluebird');
const ModelHandler = require('./ModelHandler');
const Token = require('./token');
const Slot = require('./slot');
const Notification = require('./notification');
const Meeting = require('./meeting');

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
let model, db;

/* SENSOR DATA FOR SELF SCOPE */
const sensorSelf = function(user){
  return new Prom(function(fulfill, reject){
    if(user.friends !== undefined){
      user.friends.forEach(function(el){
        el.password = undefined;
        el.email = undefined;
        el.friends = undefined;
        el.notifications = undefined;
        el.slotRequests = undefined;
      });
    }

    user.password = undefined;
    fulfill(user);
  });
}

/* SENSOR DATA FOR FRIEND SCOPE */
const sensorFriend = function(user){
  return sensorSelf(user)
  .then(function(user){
    if(user.friends != undefined){
      user.friends.forEach(function(el){
        el.slots = undefined;
      });
    }
    user.notifications = undefined;
    user.slotRequests = undefined;
    return user;
  });
}

/* SENSOR DATA FOR PUBLIC SCOPE */
const sensorPublic = function(user){
  return sensorSelf(user)
  .then(function(user){
    return sensorFriend(user);
  })
  .then(function(user){
    user.slots = undefined;
    return user;
  });
}

/* GET SLOT REQUESTS FOR REQUESTING USER */
const getRequests = function(user){
  return new Promise(function(resolve, reject) {
    if(user.slots === undefined){
      return resolve(user);
    }

    const query = `match (u:User {username: "${user.username}"})-[:has_slot]->(s:Slot)<-[:requests_slot]-(f:User) return f, s`;
    return db.queryProm(query)
    .then(function(result){
      if(result[0] !== undefined){
        user.slots.forEach(function (slot) {
          result.forEach(function(pair){
            if(pair.s.id == slot.id){
              if(slot.requests === undefined){
                return slot.requests = [pair.f.username];
              }

              slot.requests.push(pair.f.username);
            }
          })
        });
      }

      resolve(user);
    })
  });
}

/* GET SCHEDULED MEETINGS FOR REQUESTING USER */
const getMeetings = function(user){
  const query = `MATCH (u:User {username: "${user.username}"})-[:has_meeting]->(m:Meeting),
  (f:User)-[:has_meeting]->(m)
  RETURN m, f`;

  return db.queryProm(query)
  .then(function(data){
    // No meetings
    if(data[0] === undefined){
      return user;
    }

    // Create meeting objects
    user.meetings = data.map(function(el) {
      const data = el.m;
      data.username = el.f.username;
      return data;
    });

    // Sort meeting objects
    user.meetings = user.meetings.sort(function(meeting1, meeting2){
      return meeting1.start - meeting2.start;
    });

    return user;
  })
}

/* GET FRIENDS */
const getFriends = function(user){
  return model.queryProm("MATCH (x:User {username: {username}})-[:has_friend]-(node:User)", {username: user.username})
  .then(function(friends){
    user.friends = friends.sort(function(user1, user2){
      return user1.username.localeCompare(user2.username);
    });

    return user;
  });
}

/* INITIALIZE */
module.exports.init = function(database){
  UserHandler.init(database);
  model = Prom.promisifyAll(UserHandler.getModel(), {suffix: 'Prom'});
  db = Prom.promisifyAll(database, {suffix: 'Prom'});

  Meeting.init(database)
  Slot.init(database);
  Notification.init(database);

  model.setUniqueKey('username');
  model.on('validate', validate.all);
  model.compose(model, "friends", "has_friend", {many: true});
  model.compose(model, "requests", "has_request", {many:true}); // change model to request type
  model.compose(model, "slotRequests", "requests_slot", {many: true});
  model.compose(Slot.model(), "slots", "has_slot", {many: true});
  // model.compose(Meeting.model(), "meetings", "has_meeting", {many: true});
  model.compose(Notification.model(), "notifications", "has_notification", {many: true, orderBy: {property: 'created', desc: 'false'}});
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
    username: obj.username.toLowerCase(),
    password: obj.password,
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email
  };

  return module.exports.getUser(obj.username)
  .then(function(){
    const error = new Error("User already exists");
    error.status = 409;
    throw error;
  })
  .catch(function(err){
    if(err.message == "User already exists"){
      throw err
    }

    return model.saveProm(user)
    .then(function(){
      return Token.register(user.username, user.password);
    });
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

/* GET USER */
module.exports.getUser = function(username){
  return model.whereProm({username: username}, {limit: 1})
  .then(function(node){
    if(node[0] === undefined){
      const error = new Error("No such user");
      error.status = 403;
      throw error;
    }

    return getFriends(node[0])
  })
  .then(function(user){
    return sensorPublic(user);
  })
  .then(function(user){
    return sensorSelf(user);
  });
};

/* GET USER AUTHENTICATED */
module.exports.getUserAuthenticated = function(self, username){
  return model.whereProm({username: username}, {limit: 1})
  .then(function(node){
    if(node[0] === undefined){
      throw new Error("No such user");
    }

    return getFriends(node[0])
  })
  .then(function(user){
    let friend = false;

    // Determine if friends
    user.friends.forEach(function (fr) {
      if(fr.username == self){
        friend = true;
      }
    });

    // If self
    if(user.username == self){
      return getRequests(user)
      .then(function(user){
        return getMeetings(user)
      })
      .then(function(user){
        return sensorSelf(user);
      })
    }

    if(friend){
      return sensorFriend(user);
    }

    return sensorPublic(user);
  });
}

/* GET SELF */
module.exports.getSelf = function(username){
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
  })
}

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

  let userProm = module.exports.getUser(user);
  let friendProm = module.exports.getUser(friend);

  return Prom.all([userProm, friendProm])
  .then(function(data){
    user = data[0];
    friend = data[1];

    if(user.friends != undefined){
      user.friends.forEach(function (fr) {
        if(fr.username == friend.username){
          const error = new Error("Friendship already present");
          error.status = 409;
          throw error;
        }
      });
    }

    return db.relateProm(user.id, "has_friend", friend.id);
  });
}

/* HAS FRIEND */
module.exports.hasFriend = function(username1, username2){
  const query = `match (a:User {username: "${username1}"})-[r:has_friend]-(b:User {username: "${username2}"}) return r`
  return db.queryProm(query)
  .then(function(data){
    return data[0] !== undefined;
  });
}

/* RETURN MODEL */
module.exports.model = function(){
  return model;
};
