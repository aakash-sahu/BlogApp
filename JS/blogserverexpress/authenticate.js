var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');

//set up passport to use local strategy with userfield as email instead of password
//passport.use(User.createStrategy()); try this later for above
// and serialize deserealize user for maintaining sessions
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());