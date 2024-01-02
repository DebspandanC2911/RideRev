const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session')
const mongoose = require('mongoose')
const Users = require('../models/user');
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
router.use(passport.session())
router.use(passport.initialize())
router.use(session({
    secret: 'MADHAVMADHAVMADHAV',
    resave: false,
    saveUninitialized: true
}));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ["profile", "email"],
    passReqToCallback: true
},
    async function (request, response, accessToken, refreshToken, profile, done) {


        try {
            const user = await Users.findOne({email: profile._json.email});
        
            if (user) {
                return done(null, profile);
            } else {
                return done(null, profile); // You can customize this based on your needs
            }
        } catch (err) {
            return done(err);
        }


    }
));
router.get('/',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));
router.get('/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        // console.log(req.user)
        const userEmail = req.user._json.email;
        const name = req.user.displayName ;
        const ImageUrl = req.user._json.picture
        const redirectURL = `/googlesignup/?email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(name)}&image=${encodeURIComponent(ImageUrl)}`;
        res.redirect(redirectURL);
    }
);
module.exports = router;