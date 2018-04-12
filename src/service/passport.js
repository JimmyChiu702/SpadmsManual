const passport = require('passport');
const User = require('../model/user');
const LocalStrategy = require('passport-local');

const localLogin = new LocalStrategy((name, password, done) => {
    User.authenticate(name, password, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        return done(null, user);
    });
});

passport.use(localLogin);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.get(id, (err, user) => {
        done(err, user);
    });
});