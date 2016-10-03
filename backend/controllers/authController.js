import passport from "passport";
import User from "../models/user";
var sendJSONresponse = (res, status, content) => {
	res.status(status);
	res.json(content);
}


function facebook(req,res,next){
  passport.authenticate('facebook', {session: false,scope:'email'})(req,res,next);
  return;
};
function google(req,res,next){
  passport.authenticate('google', {session: false,scope : ['profile', 'email'],accessType: 'offline', approvalPrompt: 'force'})(req,res,next);
  return;
};
function oauthCallback(name,req,res,next){
	passport.authenticate(name, {
    session: false,
  },(err,user,info)=>{
    let sessionToken=user.generateJwt();
    res.cookie('mycookie', sessionToken, { maxAge: 90000, httpOnly: false});
    res.redirect('/');
  })(req,res,next);
}
function facebookCallback(req,res,next){
  	oauthCallback('facebook',req,res,next);
}
function googleCallback(req,res,next){
  	oauthCallback('google',req,res,next);
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
      return sendJSONresponse(res, 404, err);
    }
    token = user.generateJwt();
    return sendJSONresponse(res, 200, {
			      "token": token
			    });
  });
}

function login(req, res){
  if(!req.body.email || !req.body.password){
    return sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
  }
  passport.authenticate("local", (err,user,info)=>{
    var token;
    if(err){
      sendJSONresponse(res, 404, err);
      return;
    }

    if(user){
      token = user.generateJwt();
      return sendJSONresponse(res, 200, {
        token: token
      });
    }
      return sendJSONresponse(res, 401, info);
  })(req, res);
}
export default { login,register,facebook,google,facebookCallback,googleCallback };
