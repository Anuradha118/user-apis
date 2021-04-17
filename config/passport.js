const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findByCredentials(username,password).then((user)=>{
        return done(null, user)
    }).catch((e)=>{
        console.log(e)
        return done(e)
    });
  }
));

