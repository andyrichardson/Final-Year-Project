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

  const user2 = {
    username: "usertwo",
    password: "pass1234",
    email: "test@mydomain.com",
    firstName: "Testy",
    lastName: "McTest"
  };

  let user1AccessToken, user2AccessToken;

  describe("Registration and Authentication", function(){
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
        user1AccessToken = data.accessToken;
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
        accessToken: user1AccessToken,
        oldPassword: "password",
        newPassword: "new password"
      };
      return api.changePassword(data)
      .then(function(data){
        user1AccessToken = data.accessToken;
        assert.equal(data.status, 200);
      });
    });

    it("prevents authenticated users with invalid password from changing their password", function(){
      const data = {
        accessToken: user1AccessToken,
        oldPassword: "password",
        newPassword: "new password"
      };
      return api.changePassword(data)
      .then(function(data){
        assert.equal(data.status, 401);
      });
    });
  });

  describe("User Search and Retrieval", function(){
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
        assert.equal(user1.username, data.message.username);
        assert.equal(user1.firstName, data.message.firstName);
        assert.equal(user1.lastName, data.message.lastName);
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

  describe("User Friendships", function(){
    it("allows users to add other users", function(){
      return api.register(user2)
      .then(function(){
        return api.login({username: user2.username, password: user2.password})
      })
      .then(function(data){
        user2AccessToken = data.accessToken;
        return api.addUser({accessToken: data.accessToken, username: user1.username});
      })
      .then(function(data){
        assert.equal(data.status, 200);
      })
    })

    it("prevents users from adding themselves", function(){
      return api.addUser({accessToken: user2AccessToken, username: user2.username})
      .then(function(data){
        assert.equal(data.status, 403);
      });
    });

    it("prevents users from adding existing friends", function(){
      return api.addUser({accessToken: user2AccessToken, username: user1.username})
      .then(function(data){
        assert.equal(data.status, 409);
      })
    });

    it("prevents users from adding non existant users", function(){
      return api.addUser({accessToken: user2AccessToken, username: "nosuchname"})
      .then(function(data){
        assert.equal(data.status, 403);
      })
    });
  });

  describe("Slot Creation", function(){
    it("creates a slot", function(){
      const data = {
        accessToken: user2AccessToken,
        start: new Date(),
        finish: new Date(new Date().getTime() + 100)
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 200);
      })
    });

    it("requires a start time", function(){
      const data = {
        accessToken: user2AccessToken,
        finish: new Date()
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
      })
    });

    it("requires a finish time", function(){
      const data = {
        accessToken: user2AccessToken,
        start: new Date()
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
      })
    });

    it("start date must be before end date", function(){
      const data = {
        accessToken: user2AccessToken,
        start: new Date(),
        finish: new Date(new Date().getTime() - 100)
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
      })
    });
  });

  describe("Slot Responses", function(){
    it("allows response to friends slot", function(){
      const data = {
        accessToken: user1AccessToken,
        username: user2.username
      };

      return api.getUserAuthenticated(data)
      .then(function(user){
        const data = {
          accessToken: user1AccessToken,
          slotId: user.message.slots[0].id
        };

        return api.respondSlot(data);
      })
      .then(function(data){
        assert.equal(data.status, 200);
        assert.equal(data.message, 'Slot response successfully submitted.');
      });
    });

    it("prevents slot responses to nonexistent slotId", function(){
      const data = {
        accessToken: user1AccessToken,
        slotId: 300
      };

      return api.respondSlot(data)
      .then(function(data){
        assert.equal(data.status, 422);
        assert.equal(data.message, 'Slot with declared ID does not exist.');
      });
    });

    it("returns error for invalid slotId data type", function(){
      const data = {
        accessToken: user1AccessToken,
        slotId: "hi112"
      };

      return api.respondSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
        assert.equal(data.message, 'No/invalid slot ID declared.');
      });
    });

    it("returns error for missing slot id", function(){
      const data = {
        accessToken: user1AccessToken
      };

      return api.respondSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
        assert.equal(data.message, 'No/invalid slot ID declared.');
      });
    });

  });

  describe("Advanced user retrieval", function(){
    it("unauthenticated requests do not leak slot information", function(){
      return api.getUser(user2.username)
      .then(function(data){
        assert.equal(data.slots, undefined);
      });
    });

    it("self get requests show slot information", function(){
      const data = {
        username: user2.username,
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.notEqual(data.message.slots, undefined);
      })
    });

    it("friend get requests show slot information", function(){
      const data = {
        username: user2.username,
        accessToken: user1AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.notEqual(data.message.slots, undefined);
      })
    });
  });
});
