const app = require('../app');
const express = require('express');
const router = express.Router();

const userRouter = require('./api/user');
const slotRouter = require('./api/slot');

router.use('/user', userRouter);
router.use('/slot', slotRouter);

router.get('/test', (req, res, next) => {
  res.status = 200;
  res.end();
});

module.exports = router;
