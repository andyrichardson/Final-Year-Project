const assert = require("assert");
const jsdom = require('mocha-jsdom');
const React = require('react');
const TestUtils = require('react-addons-test-utils');
const Enzyme = require("enzyme");

const componentDir = "../../src/web/app/components";

describe("React Components", function(){
  jsdom({ skipWindowCheck: true });

  it("should render navbar", function(done){
    const navbar = require(componentDir + "/navbar.jsx");
    enzyme.mount(navbar);
  });

});
