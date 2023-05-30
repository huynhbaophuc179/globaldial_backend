const express = require('express');
const router = express.Router();
// import routes
var indexRouter = require('./index');
var usersRouter = require('./users');
var topicRouter = require("./topic");
var languageRouter = require("./language");
var loginRoute = require("./login")
router.use('/', indexRouter);
router.use('/user', usersRouter);
router.use("/language", languageRouter);
router.use("/topic", topicRouter)
router.use("/login", loginRoute)
// router.use("/topic",)
// router.use('/')

module.exports = router;
