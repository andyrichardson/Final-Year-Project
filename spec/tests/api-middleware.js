const assert = require("assert");
const request = require("request");
const Moment = require("moment");

describe("API Middleware", function(){
  const api = require('../../src/web/app/includes/api');
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
        start: Moment().unix(),
        finish: Moment().add(1, "hours").unix()
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 200);
      });
    });

    it("requires a start time", function(){
      const data = {
        accessToken: user2AccessToken,
        finish: Moment().unix()
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
      });
    });

    it("requires a finish time", function(){
      const data = {
        accessToken: user2AccessToken,
        start: Moment().unix()
      };

      return api.createSlot(data)
      .then(function(data){
        assert.equal(data.status, 400);
      })
    });

    it("start date must be before end date", function(){
      const data = {
        accessToken: user2AccessToken,
        start: Moment().unix(),
        finish: Moment().add(-1, "hours").unix()
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

    it("shows slot requests made to user", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.slots[0].requests.length, 1);
        assert.equal(data.message.slots[0].requests[0], user1.username);
      });
    });

    it("gives user notification of slot request", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.notifications[0].type, 'slot response');
        assert.equal(data.message.notifications[0].username, user1.username);
      });
    });
  });

  describe("Slot Response Confirmations", function(){
    it("prevents confirming meeting for no such slot", function(){
      const data = {
        accessToken: user1AccessToken,
        username: user2.username,
        slotId: 30000
      };

      return api.confirmMeeting(data)
      .then(function(data){
        assert.equal(data.status, 400);
      });
    });

    it("prevents confirming meeting for no such user with valid slotId", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(response){
        const data = {
          accessToken: user2AccessToken,
          slotId: response.message.notifications[0].slotId,
          username: "12345"
        };

        return api.confirmMeeting(data)
        .then(function(data){
          assert.equal(data.status, 400);
        })
      })
    });

    it("prevents declining meeting with no arguments", function(){
      const data = {
        accessToken: user1AccessToken
      };

      return api.confirmMeeting(data)
      .then(function(data){
        assert.equal(data.status, 400);
        assert.equal(data.message, "One or more arguments missing.");
      });
    });

    it("creates new meeting when slot confirmed", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(response){
        const data = {
          accessToken: user2AccessToken,
          slotId: response.message.notifications[0].slotId,
          username: response.message.notifications[0].username
        };

        return api.confirmMeeting(data)
        .then(function(data){
          assert.equal(data.status, 200);
          assert.equal(data.message, "Meeting successfully created.");
        })
      })
    });

    it("removes slot following meeting creation", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert(data.message.slots === undefined);
      })
    });

    it("removes slot request notification", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert(data.message.notifications === undefined);
      });
    });

    it("shows meeting in confirmers account", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.meetings[0].username, user1.username);
      });
    });

    it("shows meeting in requesters account", function(){
      const data = {
        accessToken: user1AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.meetings[0].username, user2.username);
      });
    });
  });

  describe("Slot Response Rejections", function(){
    it("prevents declining meeting for no such slot", function(){
      return api.declineMeeting({
        accessToken: user1AccessToken,
        username: user2.username,
        slotId: 10000
      })
      .then(function(data){
        assert.equal(data.status, 400);
      });
    });

    it("prevents declining meeting for no such user", function(){
      // Create slot with user 2
      return api.createSlot({
        accessToken: user2AccessToken,
        start: Moment().unix(),
        finish: Moment().add(1, "hours").unix()
      })
      .then(function(data){
          return api.getUserAuthenticated({accessToken: user2AccessToken});
      })
      .then(function(data){
        return api.declineMeeting({
          accessToken: user1AccessToken,
          username: "nosuchname",
          slotId: data.message.slots[0].id
        })
      })
      .then(function(data){
        assert.equal(data.status, 400);
      })
    });

    it("prevents declining meeting with no arguments", function(){
      return api.declineMeeting({
        accessToken: user1AccessToken
      })
      .then(function(data){
        assert.equal(data.status, 400);
        assert.equal(data.message, 'One or more arguments missing.');
      });
    });

    it("allows slot Rejections", function(){
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

        // Respond to slot with user 1
        return api.respondSlot(data);
      })
      .then(function(data){
        return api.getUserAuthenticated({accessToken: user2AccessToken})
      })
      .then(function(data){
        return api.declineMeeting({
          accessToken: user2AccessToken,
          username: data.message.notifications[0].username,
          slotId: data.message.notifications[0].slotId
        });
      })
      .then(function(data){
        assert.equal(data.status, 200);
        assert.equal(data.message, "Slot request successfully declined.");
      })
    });

    it("removes slot request notification", function(){
      const data = {
        accessToken: user2AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert(data.message.notifications === undefined);
      });
    });
  });

  describe("Slot Feed Retrieval", function(){
    it("returns feed of friend slots", function(){
      return api.getFeed({accessToken: user1AccessToken})
      .then(function(data){
        assert.equal(data.status, 200);
        assert.equal(data.message[0].username, user2.username);
      })
    });

    it("shows slots in order of time created", function(){
      const data = {
        accessToken: user2AccessToken,
        start: Moment().unix(),
        finish: Moment().add(1, "hours").unix()
      };

      return api.createSlot(data)
      .then(function(){
        const data2 = {
          accessToken: user2AccessToken,
          start: Moment().unix(),
          finish: Moment().add(1, "hours").unix()
        };

        return api.createSlot(data2);
      })
      .then(function(){
        return api.getFeed({accessToken: user1AccessToken});
      })
      .then(function(data){
        assert(data.message[0].created > data.message[1].created);
        assert(data.message[1].created > data.message[2].created);
      })
    });

    it("doesnt show own slots", function(){
      return api.getFeed({accessToken: user2AccessToken})
      .then(function(data){
        assert.equal(data.message[0], undefined);
      });
    });

    it("doesn't show slots of non-friends", function(){
      const user3 = {
        username: "userthree",
        password: "pass1234",
        email: "three@mydomain.com",
        firstName: "userthree",
        lastName: "Testy"
      };

      return api.register(user3)
      .then(function(){
        return api.login({username: user3.username, password: user3.password});
      })
      .then(function(token){
        return api.createSlot({
          accessToken: token,
          start: Moment().unix(),
          finish: Moment().add(1, "hours").unix()
        });
      })
      .then(function(){
        return api.getFeed({accessToken: user1AccessToken});
      })
      .then(function(data){
        assert.notEqual(data.message[0].username, user3.username);
      });
    });

    it("shows matches for filters", function(){
      const start = 200000000;
      const finish = 200000100;

      return api.createSlot({
        accessToken: user1AccessToken,
        start: start,
        finish: finish
      })
      .then(function(data){
        return api.getFeed({
          accessToken: user2AccessToken,
          start: start,
          finish: finish
        });
      })
      .then(function(data){
        assert.equal(data.message[0].username, user1.username);
        assert.equal(data.message.length, 1);
      });
    });

    it("returns empty array for non matches", function(){
      return api.getFeed({
        accessToken: user1AccessToken,
        start: 0,
        finish: 100
      })
      .then(function(data){
        assert.equal(data.status, 200);
        assert.equal(data.message.length, 0);
      })
    });
  });

  describe("Advanced User Retrieval", function(){
    it("self get requests show slot information", function(){
      const data = {
        accessToken: user2AccessToken,
        start: Moment().unix(),
        finish: Moment().add(1, "hours").unix()
      };

      return api.createSlot(data)
      .then(function(){
        const formData = {
          accessToken: user2AccessToken
        };

        return api.getUserAuthenticated(formData)
      })
      .then(function(data){
        assert.notEqual(data.message.slots, undefined);
      })
    });

    it("unauthenticated requests do not leak slot information", function(){
      return api.getUser(user2.username)
      .then(function(data){
        assert.equal(data.message.slots, undefined);
      });
    });

    it("unathenticated requests do not leak notification information", function(){
      return api.getUserAuthenticated(user2.username)
      .then(function(data){
        assert.equal(data.message.notifications, undefined);
      });
    });

    it("unathenticated requests do not leak meeting information", function(){
      return api.getUserAuthenticated(user2.username)
      .then(function(data){
        assert.equal(data.message.meetings, undefined);
      });
    });

    it("friend get requests show slot information", function(){
      const data = {
        username: user2.username,
        accessToken: user1AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.notEqual(data.message.slots, undefined);
      });
    });

    it("friend requests do not show slot requests of friends", function(){
      const data = {
        username: user2.username,
        accessToken: user1AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.slots[0].requests, undefined);
      })
    });

    it("friend requests do not show notifications of friends", function(){
      const data = {
        username: user2.username,
        accessToken: user1AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.slots[0].notifications, undefined);
      })
    });

    it("friend requests do not show meetings of friends", function(){
      const data = {
        username: user2.username,
        accessToken: user1AccessToken
      };

      return api.getUserAuthenticated(data)
      .then(function(data){
        assert.equal(data.message.slots[0].meetings, undefined);
      })
    });
  });
});
