const Prom = require('bluebird');
const request = Prom.promisifyAll(require('request'), {suffix: "Prom"});
const baseUri = "http://localhost:3000/api";

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
