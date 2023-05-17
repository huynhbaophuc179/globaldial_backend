const express = require('express');
const router = express.Router();
// import routes
var indexRouter = require('./index');
var usersRouter = require('./users');


router.use('/', indexRouter);
router.use('/users', usersRouter);
// router.use('/')

module.exports = router;
