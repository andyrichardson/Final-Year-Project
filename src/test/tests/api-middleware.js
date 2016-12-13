const assert = require("assert");
const request = require("request");

describe("API Middleware", function(){
  const api = require('../../web/app/includes/api');
  const user1 = {
    username: "testuser",
    password: "password",
    email: "test@testuser.com",
    firstName: "Test",
    lastName: "User"
  };
  let accessToken;

  it("registers new users", function(){
    return api.register(user1)
    .then(function(data){
      return assert.equal(data.status, 200);
    });
  });

  it("prevents registration of an existing user", function(){
    return api.register(user1)
    .then(function(data){
      return assert.equal(data.status, 409);
    });
  });

  it("prevents incorrect credentials from logging in", function(){
    return api.login({username: "testuser", password: "wrongpassword"})
    .then(function(data){
      return assert.equal(data.status, 401);
    });
  });

  it("allows users with correct credentials to get api key (log in)", function(){
    return api.login({username: user1.username, password: user1.password})
    .then(function(data){
      accessToken = data.accessToken;
      return assert.equal(data.status, 200);
    })
  });

  it("prevents unauthenticated users from changing their password", function(){
    const data = {
      accessToken:"faketoken",
      oldPassword: "password",
      newPassword: "new password"
    };
    return api.changePassword(data)
    .then(function(data){
      assert.equal(data.status, 400);
    });
  });

  it("allows authenticated users to change their password", function(){
    const data = {
      accessToken: accessToken,
      oldPassword: "password",
      newPassword: "new password"
    };
    return api.changePassword(data)
    .then(function(data){
      accessToken = data.accessToken;
      assert.equal(data.status, 200);
    });
  });

  it("prevents authenticated users with invalid password from changing their password", function(){
    const data = {
      accessToken: accessToken,
      oldPassword: "password",
      newPassword: "new password"
    };
    return api.changePassword(data)
    .then(function(data){
      accessToken = data.accessToken;
      assert.equal(data.status, 401);
    });
  });

  it("returns matching users when searching", function(){
    return api.search(user1.username)
    .then(function(data){
      assert.equal(data[0].value, user1.username);
      assert.equal(data[0].label, user1.firstName + " " + user1.lastName);
    });
  });

  it("returns public user information", function(){
    return api.getUser(user1.username)
    .then(function(data){
      assert.equal(user1.username, data.username);
      assert.equal(user1.firstName, data.firstName);
      assert.equal(user1.lastName, data.lastName);
    });
  });

  it("doesn't leak user passwords or emails", function(){
    return api.getUser(user1.username)
    .then(function(data){
      assert(data.password === undefined);
      assert(data.email === undefined);
    })
  });
});
