const User = require('../models/user');

export default function(req,res,next){
  let sessionToken = req.headers.authorization;
  if(sessionToken){
    User.findByToken(sessionToken)
    .then((user)=>{
          console.log(user);
          req['user']=user;
          next();
    }).catch((err)=>{
          console.log(err);
          res.status(401).json({message:"not authorized"});
    });
  }else{
    return res.status(401).json({message:"not authorized"});
  }
};