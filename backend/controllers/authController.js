import passport from "passport";
import User from "../models/user";
var sendJSONresponse = (res, status, content) => {
	res.status(status);
	res.json(content);
}


module.exports.facebook=function(req,res,next){
  passport.authenticate('facebook', {session: false,scope:'email'})(req,res,next);
  return;
};
module.exports.facebookCallback=function(req,res,next){
  passport.authenticate('facebook', {
    session: false,
  },(err,user,info)=>{
    let sessionToken=user.generateJWT();
    res.cookie('mycookie', sessionToken, { maxAge: 900000, httpOnly: false});
    res.redirect('/');
  })(req,res,next);
}
module.exports.google=function(req,res,next){
  passport.authenticate('google', {session: false,scope : ['profile', 'email'],accessType: 'offline', approvalPrompt: 'force'})(req,res,next);
  return;
};
module.exports.googleCallback=function(req,res,next){
  passport.authenticate('google', {
    session: false,
  },(err,user,info)=>{
    console.log(err);
    console.log(user);
    let sessionToken=user.generateJWT();
    res.cookie('mycookie', sessionToken, { maxAge: 900000, httpOnly: false});
    res.redirect('/');
  })(req,res,next);
}
function register(req, res) {
  console.log(req.body);
  if(!req.body.name || !req.body.email || !req.body.password){
    return sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
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

function login(req, res){
  if(!req.body.email || !req.body.password){
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
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
export default { login,register };
