import User from "../models/user";

function index(req,res){
    User.find({},{_id:1,name:1,email:1})
        .then((users)=>{
          res.json({users:users});
        }).catch((err)=>{
          res.status(403).json({message:err});
        });
}

function update(req,res){
  //validate
  //update user profile,avatar,buy coins
  //update

}

export default {index,update};
