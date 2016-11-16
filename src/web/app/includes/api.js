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
    return data;
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
    return data;
  });
};

/* USER SEARCH */
module.exports.search = function(string){
  return new Prom(function(resolve, reject){
    const result = [
      { value: 'one', label: 'Oliver' },
      { value: 'two', label: 'Jamie' }
    ];

    resolve(result);
  })
}
