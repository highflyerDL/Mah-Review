import passport from "passport";
import mongoose from "mongoose";
import User from "../models/user";

var sendJSONresponse = (res, status, content) => {
	res.status(status);
	res.json(content);
}

export function register(req, res) {
  console.log(req.body);
  if(!req.body.name || !req.body.email || !req.body.password){
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save((err) => {
    var token;
    if(err){
      sendJSONresponse(res, 404, err);
    } else {
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        "token": token
      });
    }
  });
}

export function login(req, res){
  if(!req.body.email || !req.body.password){
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  console.log("body", req.body);
  passport.authenticate("local", (err,user,info)=>{
    var token;
    if(err){
      sendJSONresponse(res, 404, err);
      return;
    }

    if(user){
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        token: token
      });
    } else {
      sendJSONresponse(res, 401, info);
    }
  })(req, res);
}
