const assert = require("assert");
const request = require("request");
const child_process = require("child_process");

describe("Containers", function(){
  describe("Database server", function(){
    it("is listening", function(done){
      request("http://localhost:7474/", function(err, response){
        assert.equal(err, undefined);
        assert(response.statusCode == 200);
        done();
      });
    });
  });

  describe("REST API Server", function(){
    it("is listening", function(done){
      request("http://localhost:3000/api/test", function(err, response){
        assert.equal(err, undefined);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe("Web Server", function(){
    it("is listening", function(done){
      request("http://localhost/", function(err, response){
        assert.equal(err, undefined);
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it("redirects API requests", function(done){
      request("http://localhost/api/test", function(err, response){
        assert.equal(err, undefined);
        assert.equal(response.request.uri.port, 3000);
        assert.equal(response.statusCode, 200);
        done();
      })
    });
  });
});


describe("API Middleware", function(){
  const api = require('../web/app/includes/api');
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
