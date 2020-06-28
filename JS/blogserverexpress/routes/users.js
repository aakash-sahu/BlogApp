var express = require('express');
var bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path'); //to extract file extension as path.extname('abc.jpeg') => '.jpeg'
const crypto = require('crypto'); //to create random file name -- let id = crypto.randomBytes(8).toString('hex')
//TODO - resize images
var passport = require('passport');
const connectEnsureLogin = require("connect-ensure-login");
var authenticate = require('../authenticate');
var User = require('../models/users');
const config = require('../config');
// const { router } = require('../app');

//file upload using multer for account update page
//storage options
const storage = multer.diskStorage({
  destination: (req, file,cb ) => {
      cb(null, 'public/images/profilePics');
  },
  filename: (req, file, cb) => {
      const filename = crypto.randomBytes(8).toString('hex');
      const fExtension = path.extname(file.originalname);
      cb(null, filename+fExtension)
  }
});

// allowing only certain file types
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('You can upload only image files'), false)
  }
  cb(null,true);
};

const upload = multer({storage: storage, fileFilter: imageFilter});

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
      //can't figure out the error in next step so hacky solution. change to jwt later. fixed using return statement to end execution
      return;
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
      res.json({success:true, status: 'Login Successfull', 
              user: {username: req.user.username,email:req.user.email, image:req.user.image,_id: req.user._id }});
      });
 


  })(req, res,next)
});

//logout router
usersRouter.get('/logout', (req, res, next) => {
  console.log(req.user);
  if (req.user) {

    req.session.destroy();
    res.clearCookie('session-id');
    req.logOut();
    res.end("You are successfully logged out");
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


//account update router
//it's working wihtout authentication--need to figure out how to get it working with authentication
usersRouter.put('/update', upload.single('imageFile'),  (req, res, next) => {
  console.log("Current user:", req.user.username, req.user.email);
  console.log("Req body:",req.body.username, req.body.email);
  console.log("Update user account ",req.isAuthenticated()); //, req.user
  // console.log(req.file);
  // add file path to the user account
  if (req.file) {
    req.body.image = config.serverUrl+ req.file.path.slice(7);
  } //remove the public part from the path. slice first 7 chars
  if (req.isAuthenticated()) {
    // User.findByIdAndUpdate(req.body._id, {$set:req.body}, {new:true, runValidators:true, useFindAndModify:false})
    if (req.user.username != req.body.username){
      User.findOne({username: req.body.username}, (err, user) => {
        if (err) {return next(err)}
        console.log("usr in first block: :", user);
        if (user) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          res.json({success:false, status: 'Update Not Successfull', err:"Username already exists. Choose another one!"});
          return;
        }
      })
    }
   if (req.user.email != req.body.email) {
     User.findOne({email: req.body.email}, (err, user) => {
        if (err) {return next(err)}
        // console.log("User in 2nd block: ", user)
        if (user) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          res.json({success:false, status: 'Update Not Successfull', err:"Email already exists. Choose another one"});
          return;
        }
      })
    }
      console.log("why is code below this being executed when error??")
      User.findByIdAndUpdate(req.body._id, {$set:req.body}, {new:true, useFindAndModify:false})
      .then((user) => {
        //relogin user afer account update
        req.login(user, (err) => {
          if (err) {
            console.log(err);
            return next(err);
          }
          res.statusCode=200;
          res.setHeader("Content-Type", "application/json");
          res.json({success:true, status: 'Update successful!', user: user});
          return;
          })
        }, (err) => next(err))
        .catch((err) => next(err))

  }
  else {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.json({success:false, status: 'Update not successful!', err:'You are not authenticated!' });
  }
});

module.exports = usersRouter;
