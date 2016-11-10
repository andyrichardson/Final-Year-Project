const app = require('../app');
const express = require('express');
const proxy = require('http-proxy');
const config = require('../private/config');

const apiProxy = function(req, res, next){
  if (req.url.substring(0, 4) != "/api"){
    return next();
  }

  console.log('redirect');
  return res.redirect("http://localhost:3000" + req.url)
}

module.exports = apiProxy;
