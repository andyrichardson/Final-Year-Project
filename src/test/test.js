const assert = require("assert");
const request = require("request");
const sleep = require("sleep").sleep;
const child_process = require("child_process");

describe("Containers", function(){
  describe("Database server", function(){
    before(function(done){
      this.timeout(30000);
      child_process.execFile("../../dist/neo4j.sh", ["-t"], function(err, stdout, stdin){
        assert(err == undefined);
      });
      setTimeout(done, 20000);
    })

    it("Graphing database server is active", function(done){
      request("http://localhost:7474/", function(err, response){
        assert(err == undefined);
        assert(response.statusCode == 200);
        done();
      })
    });
  });

  describe("Web Server", function(){
    before(function(done){
      this.timeout(10000);
      child_process.execFile('../../dist/web.sh', ["-t"], function(err, stdout, stdin){
        assert(err == undefined);
        done();
      });
      setTimeout(done, 1000);
    });

    it("Web server is active", function(done){
      request("http://localhost:7474", function(err, response){
        assert.equal(err, undefined);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe("REST API Server", function(){
    before(function(done){
      this.timeout(10000);
      child_process.execFile('../../dist/api.sh', ['-t'], function(err, stdout, stdin){
        assert(err == undefined);
        done();
      });
      setTimeout(done, 6000);
    });

    it("API server is active", function(done){
      request("http://localhost:3000/api/test", function(err, response){
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