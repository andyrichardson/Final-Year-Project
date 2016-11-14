/* CREATE API TOKEN COOKIE */
module.exports.saveToken = function(body){
  const bodyObject = JSON.parse(body);
  document.cookie = "accessToken=" + bodyObject.accessToken;
}
