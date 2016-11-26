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

  it("allows users with correct credentials to log in", function(){
    return api.login({username: user1.username, password: user1.password})
    .then(function(data){
      return assert.equal(data.status, 200);
    })
  });

  it("returns matching users when searching", function(){
    return api.search(user1.username)
    .then(function(data){
      assert.equal(data[0].value, user1.username);
      assert.equal(data[0].label, user1.firstName + " " + user1.lastName);
    })
  })
});
