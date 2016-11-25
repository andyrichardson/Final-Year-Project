const app = require('../app');
const express = require('express');
const router = express.Router();

const userRouter = require('./api/user');

router.use('/user', userRouter);

router.get('/test', function(req, res, next){
  res.status = 200;
  res.end();
})

module.exports = router;
