import mongoose from '../config/db';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const Schema = mongoose.Schema;

var userSchema = new Schema({
    __v: {
      type: Number,
      select: false
    },
    email: {
    type: String,
    unique: true,
    required: true
    },
    name: {
      type: String,
      required: true
    },
    hash: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    points:{
        type:Number,
        default:1000
    },
    salt: String
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");
}

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");
  return this.hash === hash;
}

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000)
  }, process.env.JWT_SECRET);
}
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.hash
  delete obj.salt
  return obj;
}
export default mongoose.model('User', userSchema);
