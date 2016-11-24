const assert = require("assert");
const request = require("request");
const sleep = require("sleep").sleep;
const child_process = require("child_process");

describe("Database server", function(){
  before(function(done){
    this.timeout(30000);
    child_process.execFile("../../dist/neo4j.sh", ["-t"], function(err, stdout, stdin){
      assert(error == undefined);
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
