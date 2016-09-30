import Post from '../models/post';
import Img from '../models/image';
import User from '../models/user';
import config from '../config/auth';
import path from "path";
import cloudinary from 'cloudinary';
import Datauri from 'datauri';
function index(req,res){
    Post.find()
    .then((posts)=>{
       return res.json({posts:posts});
    });
};
//show specific post
function show(req,res){
   Post.findDetailById(req.params.postId)
   .then((post)=>{
     return User.populate(post,{
       path:"reviews.owner",
       select:"name",
       model:User
     });
   })
   .then((post)=>{
      res.json(post);
   })
   .catch((err)=>{
      res.status(403).json({message:err})
   });
};

function create(req,res){
  //set up cloudinary
  console.log(req.files);
  let dUri = new Datauri();
  cloudinary.config(config.cloudinary);
  //using point to post
  let user =req.user;
  if(user.points<req.body.reward){
    return res.status(403).json({error:"You dont have enough points."});
  }
  user.points=user.points - req.body.reward;
  user.save()
      .then((user)=>{
        return Img.saveImages(req.files,(file)=>{
                dUri.format(path.extname(req.files[0].originalname).toString(),req.files[0].buffer);
                return cloudinary.uploader
                         .upload(dUri.content)
                         .then((img)=>{
                            return Img.create({
                              url:img.url,
                              format:img.format,
                              type:img.resource_type,
                              owner:req.user.id
                            });
                         });
                       });
      })
      .then((images)=>{
          console.log(images);
          return Post.create({
            title:req.body.title,
            description:req.body.description,
            reward:req.body.reward,
            owner:req.user.id,
            images:images
          });
        })
      .then((post)=>{
        res.json({post:post});
      })
      .catch((err)=>{
        return res.status(403).json({error:err});
      });

}
function requestIsValid(req,res){
  if(!req.params.postId||!req.params.reviewId){
      res.status(403).json({message:"Invalid url params"});
      return false;
  }
  if(req.user.cannotEdit()){
     res.status(401).json({message:"Permission denied"});
     return false;
  }
  return true;
}
function update(req,res){
  if(!requestIsValid(req,res)) return;
  //update

}
function destroy(req,res){
  if(!requestIsValid(req,res)) return;
  //delete
}

export default {index,show,create,update,destroy};

/*upload sample
function upload(req,res){
  let dUri = new Datauri();
  //console.log(req.files);
  cloudinary.config(config.cloudinary);
  return Img.saveImages(req.files,(file)=>{
          dUri.format(path.extname(req.files[0].originalname).toString(),req.files[0].buffer);
          return cloudinary.uploader
                           .upload(dUri.content)
                           .then((img)=>{
                              return Img.create({
                                url:img.url,
                                format:img.format,
                                type:img.resource_type,
                                owner:req.user.id
                              });
                           });
        }).then((images)=>{
          console.log(images);
          res.json(images);
        }).catch((err)=>{
          console.log(err);
          res.status(403).json({message:err});
        });
}
*/
