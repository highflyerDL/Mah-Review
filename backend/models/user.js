import mongoose from 'mongoose';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Image',
    },
    isAdmin: {
        type: Boolean,
        required: false
    },
    hash: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    points: {
        type: Number,
        default: 1000
    },
    salt: String
});
userSchema.statics.findByToken = function(token) {
    console.log(token);
    let decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedUser);
    if (decodedUser) {
        console.log(decodedUser._id);
        return this.findOne({ _id: decodedUser._id }).select("-__v");
    } else {
        return Promise.reject("User not found");
    }
};
userSchema.methods.canEdit = function(obj) {
    return this.isAdmin || this._id == obj.owner;
}
userSchema.methods.cannotEdit = function(obj) {
    return !this.canEdit(obj);
}
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString("hex");
}

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString("hex");
    return this.hash === hash;
}

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    console.log(this._id);
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
