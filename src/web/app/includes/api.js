const Prom = require('bluebird');
const request = Prom.promisifyAll(require('request'), {suffix: "Prom"});
let baseUri;

if(typeof window == "undefined"){
  // For testing purposes only
  baseUri = "http://localhost:3000/api";
}
else{
  baseUri = `http://${window.location.hostname}:3000/api`;
}

/* USER REGISTRATION */
module.exports.register = function(data){
  const formData = {
    form: {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    }
  };

  return request.postProm(baseUri + '/user', formData)
  .then(function(data){
    return JSON.parse(data.body);
  });
};

/* USER LOGIN */
module.exports.login = function(data){
  const formData = {
    form: {
      username: data.username,
      password: data.password
    }
  };

  return request.postProm(baseUri + "/user/auth", formData)
  .then(function(data){
    return JSON.parse(data.body);
  });
};

/* USER PASSWORD CHANGE */
module.exports.changePassword = function(data){
  const formData = {
    form: {
      accessToken: data.accessToken,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    }
  };

  return request.patchProm(baseUri + "/user/auth", formData)
  .then(function(data){
    return JSON.parse(data.body);
  });
}

/* USER SEARCH */
module.exports.search = function(string){
  return request.getProm(baseUri + "/user/search/" + string)
  .then(function(data){
    return JSON.parse(data.body);
  });
};

/* GET USER */
module.exports.getUser = function(username){
  return request.getProm(baseUri + "/user/" + username)
  .then(function(data){
    return JSON.parse(data.body);
  });
}

/* GET FEED */
module.exports.getFeed = function(accessToken){
  return request.getProm(baseUri + "/slot/" + "?accessToken=" + accessToken)
  .then(function(data){
    return JSON.parse(data.body);
  });
}

/* GET USER AUTHENTICATED */
module.exports.getUserAuthenticated = function(data){
  return request.getProm(baseUri + "/user/" + (data.username || "") + "?accessToken=" + data.accessToken)
  .then(function(data){
    return JSON.parse(data.body);
  });
}

/* ADD USER */
module.exports.addUser = function(data){
  const formData = {
    form: {
      accessToken: data.accessToken,
    }
  };

  return request.postProm(baseUri + "/user/" + data.username, formData)
  .then(function(data){
    return JSON.parse(data.body);
  });
}

/* CREATE SLOT */
module.exports.createSlot = function(data){
  const formData = {
    form: {
      accessToken: data.accessToken,
      start: data.start,
      finish: data.finish
    }
  };

  return request.postProm(baseUri + "/slot/", formData)
  .then(function(data){
    return JSON.parse(data.body);
  })
}

/* RESPOND TO SLOT */
module.exports.respondSlot = function(data){
  const formData = {
    form: {
      accessToken: data.accessToken,
      slotId: data.slotId
    }
  };

  return request.postProm(baseUri + "/slot/respond", formData)
  .then(function(data){
    return JSON.parse(data.body);
  })
}

/* CONFIRM SLOT MEETING */
module.exports.confirmMeeting = function(data){
  const formData = {
    form: {
      accessToken: data.accessToken,
      username: data.username,
      slotId: data.slotId
    }
  };

  return request.postProm(baseUri + "/slot/confirm", formData)
  .then(function(data){
    return JSON.parse(data.body);
  });
}

/* DECLINE SLOT MEETING */
module.exports.declineMeeting = function(data){
  const formData = {
    form: {
      accessToken: data.accessToken,
      username: data.username,
      slotId: data.slotId
    }
  };

  return request.postProm(baseUri + "/slot/decline", formData)
  .then(function(data){
    return JSON.parse(data.body);
  });
}
