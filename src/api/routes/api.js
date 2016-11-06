const app = require('../app');
const express = require('express');
const router = express.Router();

const userRouter = require('./api/user');

router.use('/user', userRouter);

module.exports = router;
