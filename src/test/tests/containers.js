const assert = require("assert");
const request = require("request");

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
