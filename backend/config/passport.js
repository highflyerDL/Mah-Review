import passport from "passport";
import passportLocal from "passport-local";
import mongoose from "mongoose";
import User from "../models/user";
import config from "./auth";
import randomstring from 'randomstring';
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        });
    }
));

passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: config.facebookAuth.API_ID,
        clientSecret: config.facebookAuth.API_SECRET,
        callbackURL: config.facebookAuth.CALLBACK_URL,
        profileFields: ['id', 'emails', 'name','gender','photos']

    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            User.findOne({ $or: [{ 'facebook.id': profile.id }, { 'email': profile.emails[0].value }] }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    let newUser = new User();
                    // set all of the facebook information in our user model
                    newUser.facebook = {
                        "id": profile.id,
                        "token": token
                    };
                    newUser.name = profile.name.givenName + " " + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.hash = randomstring.generate();
                    newUser.avatar=profile.photos.length?profile.photos[0].value:undefined;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

passport.use(new GoogleStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL,
    },
    function(token, refreshToken, params, profile, done) {
        console.log(params);
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.findOne({ $or: [{ 'google.id': profile.id }, { 'email': profile.emails[0].value }] }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    user.google.accessToken = token;
                    user.google.refreshToken = refreshToken;
                    //Trap fucking pit hole
                    user.markModified('google');
                    user.save()
                        .then((newUser) => {
                            // if a user is found, log them in
                            console.log(newUser);
                            return done(null, newUser);
                        });
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();
                    console.log(token);
                    // set all of the relevant information
                    console.log(refreshToken);
                    newUser.google = {
                        "id": profile.id,
                        "accessToken": token,
                        "refreshToken": refreshToken || "",
                        "name": profile.displayName,
                    };
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email
                    newUser.hash = randomstring.generate();
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));



module.exports = passport;
