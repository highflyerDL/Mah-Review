import passport from "passport";
import passportLocal from "passport-local";
import mongoose from "mongoose";
import User from "../models/user";

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
))