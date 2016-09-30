import Post from '../models/post';
import Img from '../models/image';
import User from '../models/user';

function create(req,res){
    if(!req.params.postId){
        return res.status(403).json({message:"Invalid post Id"});
    }
    return Post.findById(req.params.postId)
      .then((post)=>{
              post.reviews.push({
                content:req.body.content,
                owner:req.user.id,
                post:req.params.postId
              });
           return post.save();
        })
      .then((post)=>{
          let reviews=post.reviews;
          res.json(reviews[reviews.length - 1]);
        })
      .catch((err)=>{
        res.status(403).json({message:err});
        console.log(err);
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
export default {create,update,destroy}
