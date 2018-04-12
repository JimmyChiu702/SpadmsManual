const passportService = require('../service/passport');
const passport = require('passport');

const signinOption = {
    successRedirect: '/manual',
    failureRedirect: '/signin'
};
const requireSignin = passport.authenticate('local', signinOption);

const express = require('express');
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());
router.post('/signin', requireSignin);

router.use((req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/signin');
});

router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/signin');
});

module.exports = router;