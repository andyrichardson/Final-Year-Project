const assert = require("assert");
const request = require("request");
const child_process = require("child_process");

describe("Containers", function(){
  describe("Database server", function(){
    it("Graphing database server is active", function(done){
      request("http://localhost:7474/", function(err, response){
        assert.equal(err, undefined);
        assert(response.statusCode == 200);
        done();
      });
    });
  });

  describe("REST API Server", function(){
    it("API server is active", function(done){
      request("http://localhost:3000/api/test", function(err, response){
        assert.equal(err, undefined);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe("Web Server", function(){
    it("Web server is active", function(done){
      request("http://localhost/", function(err, response){
        assert.equal(err, undefined);
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it("Web server redirects to API", function(done){
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

  it("Register new user", function(){
    return api.register(user1)
    .then(function(data){
      return assert.equal(data.status, 200);
    });
  });

  it("Register existing user", function(){
    return api.register(user1)
    .then(function(data){
      return assert.equal(data.status, 409);
    });
  });

  it("Prevent incorrect login", function(){
    return api.login({username: "testuser", password: "wrongpassword"})
    .then(function(data){
      return assert.equal(data.status, 401);
    });
  });

  it("Allow correct login", function(){
    return api.login({username: user1.username, password: user1.password})
    .then(function(data){
      return assert.equal(data.status, 200);
    })
  });
});
