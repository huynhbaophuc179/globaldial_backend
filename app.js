var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require("./service/mongooseConnection")
const cors = require("cors");
const fireApp = require("./service/firebaseService");
const { getAuth } = require('firebase-admin/auth');
// routes
let defaultAuth = getAuth(fireApp);
const routes = require('./routes/app_routes');
const bodyParser = require('body-parser');
require('dotenv').config()
//application
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//using middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(cors());


//***************************************** */
//logic section
// using all the routes from app_routes

function setDefaultAuth(req, res, next) {
  req.auth = defaultAuth;
  next();
}
app.use(setDefaultAuth);

app.use('/', routes);

// implement websocket

//***************************************** */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

connectDB();

module.exports = app;
