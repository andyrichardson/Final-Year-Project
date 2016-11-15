const Cookie = require('./cookie');
const Api = require('./api');

/* CREATE API TOKEN COOKIE */
module.exports.saveToken = function(body){
  const bodyObject = JSON.parse(body);
  Cookie.set("accessToken", bodyObject.accessToken);
};

/* LOG IN */
module.exports.login = function(state){
  return Api.login(state)
  .then(function(data){
    if(data.statusCode != 200){
      return false;
    }
    else{
      module.exports.saveToken(data.body);
      location.reload();
    }
  })
  .catch(function(err){
    console.log(err);
  })
};

/* LOG OUT */
module.exports.logout = function(){
  Cookie.delete('accessToken');
  location.reload();
};
