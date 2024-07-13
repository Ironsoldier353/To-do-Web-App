const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        // Match user
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Username not found' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
            .catch(err => console.log(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
          const user = await User.findById(id);
          done(null, user);
      } catch (err) {
          done(err, null);
      }
  });
  
  
};
