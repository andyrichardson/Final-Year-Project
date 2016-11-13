const Prom = require('bluebird');
const request = Prom.promisifyAll(require('request'), {suffix: "Prom"});
const baseUri = "http://localhost:3000/api";

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
}

// const data = {
//   username: 'andy',
//   password: 'pass',
//   email: 'emaill',
//   firstName: 'Andy',
//   lastName: 'richardson'
// };
//
// module.exports.login(data)
// .then(function(data){
//   console.log(data)
// });
