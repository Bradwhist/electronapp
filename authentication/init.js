var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(function(user, pass, cb){
  findUser(username, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false)
    }

    bcrypt.compare(password, user.passwordHash, (err, isValid) => {
      if (err) {
        return done(err)
      }
      if (!isValid) {
        return done(null, false)
      }
      return done(null, user)
    })
  })
}))
