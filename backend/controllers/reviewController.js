import Post from '../models/post';
import Img from '../models/image';
import User from '../models/user';
import Review from '../models/review';
import validator from '../services/validator';

function create(req,res){
    const keys=['content']
    if(!validator(keys,req.body)){
      return res.json({"message": "All fields required"});
    }
    var newPost,newReview;
    return Post.findById(req.params.postId)
      .then((post)=>{
              newPost=post;
              return Review.create({
                content:req.body.content,
                owner:req.user.id,
                post:req.params.postId
              });
        })
      .then((review)=>{
          newReview=review;
          newPost.reviews.unshift(review);
          return newPost.save();
        })
      .then((post)=>{
        res.json(newReview);
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
