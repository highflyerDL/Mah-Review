export default function(req,res,next){
  let sessionToken = req.headers.authorization;
  if(sessionToken){
      let decodedUser = jwt.verify(token,process.env.JWT_SECRET);
      if(!decodedUser){
        return res.status(401).send("not authorized");
      }
      req['user']=user;
      return next();
  }else{
    return res.status(401).send("not authorized");
  }
};
