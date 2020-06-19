var express = require('express');
var bodyParser = require('body-parser');

var passport = require('passport');
var authenticate = require('../authenticate');
var User = require('../models/users');
// const { router } = require('../app');

var usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* Work on get later */
usersRouter.get('/', function(req, res, next) {
  res.end('respond with a resource');
});

usersRouter.post('/register', (req, res, next) => {
  var newUser = new User({username: req.body.username, email: req.body.email});
  User.register(newUser, req.body.password, (err, user) => {
      if(err){
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({success:false, status: 'Registration not successful!', err:err});
      }
      else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success:true, status: 'Registration successful!', username: user.username});
      }
        // passport.authenticate('local')(req, res, () => {

        //   })
      })
});

//login router
usersRouter.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
    return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({success:false, status: 'Login Not Successfull', err:info.message});
      //can't figure out the error in next step so hacky solution. change to jwt later.
      next(res);
    }
 
    req.login(user, (err) => {
      if (err){
        console.log('This error should not print when wrong password');
        console.log(user);
        console.log(Boolean(err));
        console.log(err);
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({success:false, status: 'Login Not Successfull', err:'User could not be logged in'});
      }
      console.log('This else part should not print when wrong password');
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({success:true, status: 'Login Successfull', username: req.user.username});
      });
 


  })(req, res,next)
});

usersRouter.get('/logout', (req, res, next) => {
  if (req.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    req.logOut();
    res.redirect('/')
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = usersRouter;
