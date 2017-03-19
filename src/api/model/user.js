'use strict';
const Prom = require('bluebird');
const base64Img = Prom.promisifyAll(require('base64-img'), { suffix: 'Prom' });
const path = require('path');
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
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
};

/* VALIDATION */
const validate = {
  all: function (user, callback) {
    console.log('validating');
    console.log(user);
    callback();
  },

  firstName: function () {

  },
};

/* CREATE INSTANCE OF MODEL HANDLER */
const UserHandler = new ModelHandler('User', schema);
let model;
let  db;

/* SENSOR DATA FOR SELF SCOPE */
const sensorSelf = user => new Prom((fulfill, reject) => {
  if (user.friends !== undefined) {
    user.friends.forEach(el => {
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

/* SENSOR DATA FOR FRIEND SCOPE */
const sensorFriend = user => sensorSelf(user)
.then(user => {
  if (user.friends != undefined) {
    user.friends.forEach(el => {
      el.slots = undefined;
    });
  }

  user.notifications = undefined;
  user.slotRequests = undefined;
  return user;
});

/* SENSOR DATA FOR PUBLIC SCOPE */
const sensorPublic = user => sensorSelf(user)
.then(user => sensorFriend(user))
.then(user => {
  user.slots = undefined;
  return user;
});

/* GET SLOT REQUESTS FOR REQUESTING USER */
const getRequests = user => new Promise((resolve, reject) => {
  if (user.slots === undefined) {
    return resolve(user);
  }

  const query = `match (u:User {username: "${user.username}"})\
  -[:has_slot]->(s:Slot)<-[:requests_slot]-(f:User) \
  return f, s`;
  return db.queryProm(query)
  .then(result => {
    if (result[0] !== undefined) {
      user.slots.forEach(slot => {
        result.forEach(pair => {
          if (pair.s.id == slot.id) {
            if (slot.requests === undefined) {
              return slot.requests = [pair.f.username];
            }

            slot.requests.push(pair.f.username);
          }
        });
      });
    }

    resolve(user);
  });
});

/* GET SCHEDULED MEETINGS FOR REQUESTING USER */
const getMeetings = user => {
  const query = `MATCH (u:User {username: "${user.username}"})-[:has_meeting]->(m:Meeting),
  (f:User)-[:has_meeting]->(m)
  RETURN m, f`;

  return db.queryProm(query)
  .then(data => {
    // No meetings
    if (data[0] === undefined) {
      return user;
    }

    // Create meeting objects
    user.meetings = data.map(el => {
      const data = el.m;
      data.username = el.f.username;
      return data;
    });

    // Sort meeting objects
    user.meetings = user.meetings.sort((meeting1, meeting2) => meeting1.start - meeting2.start);

    return user;
  });
};

/* GET FRIENDS */
const getFriends = user => model.queryProm(
  'MATCH (x:User {username: {username}})-[:has_friend]-(node:User)',
  { username: user.username }
)
.then(friends => {
  user.friends = friends.sort((user1, user2) => user1.username.localeCompare(user2.username));

  return user;
});

/* INITIALIZE */
module.exports.init = database => {
  UserHandler.init(database);
  model = Prom.promisifyAll(UserHandler.getModel(), { suffix: 'Prom' });
  db = Prom.promisifyAll(database, { suffix: 'Prom' });

  Meeting.init(database);
  Slot.init(database);
  Notification.init(database);

  model.setUniqueKey('username');
  model.on('validate', validate.all);
  model.compose(model, 'friends', 'has_friend', { many: true });
  model.compose(model, 'requests', 'has_request', { many: true }); // change model to request type
  model.compose(model, 'slotRequests', 'requests_slot', { many: true });
  model.compose(Slot.model(), 'slots', 'has_slot', {
    many: true,
    orderBy: { property: 'created', desc: 'false' },
  });
  model.compose(Notification.model(), 'notifications', 'has_notification', { many: true, orderBy: { property: 'created', desc: 'false' } });
};

/* LOG IN */
module.exports.login = (username, password) => Token.create(username, password);

/* LOG OUT */
module.exports.logout = token => Token.delete(token);

/* REGISTER/CREATE */
module.exports.create = obj => {
  const password = obj.password;

  const user = {
    username: obj.username.toLowerCase(),
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
  };

  return module.exports.getUser(obj.username)
  .then(() => {
    const error = new Error('User already exists');
    error.status = 409;
    throw error;
  })
  .catch(err => {
    if (err.message == 'User already exists') {
      throw err;
    }

    return model.saveProm(user)
    .then(() => Token.register(user.username, password));
  });
};

/* EDIT */
module.exports.edit = (username, changes) => model.whereProm({ username: username }, { limit: 1 })
.then(node => {
  const user = node[0];

  // Set new properties
  for (let attr in user) {
    if (changes.hasOwnProperty(attr)) {
      if (attr == 'username' || attr == 'id') {
        continue;
      }

      user[attr] = changes[attr];
    }
  }

  return model.updateProm(user, true);
})
.then(data => data);

/* CHANGE PASSWORD */
module.exports.changePassword = (username, oldPassword, newPassword) => // Verify existing password
Token.create(username, oldPassword)
.then(() => // Set new password
Token.password(username, newPassword))
.then(() => // Get new access token
Token.create(username, newPassword));

/* GET USER */
module.exports.getUser = username => model.whereProm({ username: username }, { limit: 1 })
.then(node => {
  if (node[0] === undefined) {
    const error = new Error('No such user');
    error.status = 403;
    throw error;
  }

  return getFriends(node[0]);
})
.then(user => sensorPublic(user))
.then(user => sensorSelf(user));

/* GET USER AUTHENTICATED */
module.exports.getUserAuthenticated = (self, username) => model.whereProm({ username: username }, { limit: 1 })
.then(node => {
  if (node[0] === undefined) {
    throw new Error('No such user');
  }

  return getFriends(node[0]);
})
.then(user => {
  let friend = false;

  // Determine if friends
  user.friends.forEach(fr => {
    if (fr.username == self) {
      friend = true;
    }
  });

  // If self
  if (user.username == self) {
    return getRequests(user)
    .then(user => getMeetings(user))
    .then(user => sensorSelf(user));
  }

  if (friend) {
    return sensorFriend(user);
  }

  return sensorPublic(user);
});

/* GET SELF */
module.exports.getSelf = username => model.whereProm({ username: username }, { limit: 1 })
.then(data => {
  node = data;
  if (node[0] === undefined) {
    throw new Error('No such user');
  }

  return model.queryProm('MATCH (x:User {username: {username}})-[:has_friend]-(node:User)',
    { username: username }
  );
})
.then(data => {
  const user = node[0];
  user.friends = data;
  user.password = undefined;
  user.email = undefined;
});

/* GET ID */
module.exports.getId = username => model.whereProm({ username: username }, { limit: 1 })
.then(data => data[0].id);

/* SEARCH */
module.exports.search = string => {
  string = string.toLowerCase();

  const query = `MATCH (u:User)
  WHERE u.username contains "${string}"
  OR (lower(u.firstName) + " " +  lower(u.lastName))
  CONTAINS "${string}"
  RETURN u`;

  return db.queryProm(query)
  .then(node => {
    if (node[0] == undefined) {
      return [];
    }

    // Generate serch criteria
    const result = new Array();

    for (let x in node) {
      const user = node[x];
      result.push({
        label: user.firstName + ' ' + user.lastName,
        value: user.username,
      });
    }

    return result;
  });
};

/* ADD FRIEND */
module.exports.addUser = (user, friend) => {
  if (user == friend) {
    const error = new Error('User cannot be friends with self');
    error.status = 403;
    throw error;
  }

  let userProm = module.exports.getUser(user);
  let friendProm = module.exports.getUser(friend);

  return Prom.all([userProm, friendProm])
  .then(data => {
    user = data[0];
    friend = data[1];

    if (user.friends != undefined) {
      user.friends.forEach(fr => {
        if (fr.username == friend.username) {
          const error = new Error('Friendship already present');
          error.status = 409;
          throw error;
        }
      });
    }

    return db.relateProm(user.id, 'has_friend', friend.id);
  });
};

/* HAS FRIEND */
module.exports.hasFriend = (username1, username2) => {
  const query = `match (a:User {username: "${username1}"})\
  -[r:has_friend]-(b:User {username: "${username2}"}) \
  return r`;
  return db.queryProm(query)
  .then(data => data[0] !== undefined);
};

module.exports.setImage = (username, imageUri) => base64Img.imgProm(imageUri, path.join('/var/www/img'), username);

/* RETURN MODEL */
module.exports.model = () => model;
