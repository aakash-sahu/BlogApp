var express = require('express');
var bodyParser = require('body-parser');

var passport = require('passport');
var authenticate = require('../authenticate');
var User = require('../models/users');
// const { router } = require('../app');

var router = express.Router();
router.use(bodyParser.json());

/* Work on get later */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  var newUser = new User({username: req.body.username, email: req.body.email});
  User.register(newUser, 
    req.body.password, (err, user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({err:err});
      }
      else {
        user.email = req.body.email;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({err:err});
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({success:true, status: 'Registration successful!', username: user.username});
          })
        })
      }
    })
});



module.exports = router;
