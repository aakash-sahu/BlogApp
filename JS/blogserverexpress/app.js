var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
var session = require('express-session');
var passport = require('passport');
var authenticate = require('./authenticate');
var FileStore = require('session-file-store')(session);


var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//import routes here
var postRouter = require('./routes/postRouter');

//db imports
const mongoose = require('mongoose');
const dbUrl = config.mongoUrl;
const connect = mongoose.connect(dbUrl);

connect.then((db) => {
  console.log("Connected to the mongodb server"); 
}, (err) => {console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set session. Creates a sessions folder in root dir
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

//allow all cors for now
app.use(cors({origin:true,credentials: true}));

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//add routers here
app.use('/posts', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
