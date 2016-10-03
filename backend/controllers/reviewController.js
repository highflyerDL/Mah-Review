import Post from '../models/post';
import Img from '../models/image';
import User from '../models/user';
import Review from '../models/review';
import validator from '../services/validator';
import Promise from 'bluebird';
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
        res.json({data:newReview});
      })
      .catch((err)=>{
        res.status(403).json({message:err});
        console.log(err);
      });
}

function update(req,res){
  var newReview;
  Review.findById(req.params.reviewId)
        .then((review)=>{
          switch(req.params.action){
            case upVote:
            case downVote:
            case approve:
              newReview = global[req.params.action](review,req.user,res);
            case edit:
              newReview = edit(review,req,res);
            default:
              //should return reject promise here fix later
              return res.status(400).json({message:"Invalid action"});
          }
          return newReview.save();
        })
        .then((review)=>{
          res.json({data:review});
        })
        .catch((err)=>{
          res.status(400).json({message:err});
        });
}
function upVote(review,user,res){
   if(review.upVoter.indexOf(user._id)!=-1){
      res.status(304).json({message:"Already upvote"});
   }
   const downVoteIdx=review.downVoter.indexOf(user._id);
   if(downVoteIdx!=-1){
      review.downVoter.splice(downVoteIdx, 1);
      review.vote=review.vote+1;
   }
   review.vote=review.vote+1;
   return review;
}
function downVote(review,user,res){
    if(review.downVoter.indexOf(user._id)!=-1){
       res.status(304).json({message:"Already downVote"});
    }
    const upVoteIdx=review.upVoter.indexOf(user._id);
    if(upVoteIdx!=-1){
       review.downVoter.splice(upVoteIdx, 1);
       review.vote=review.vote-1;
    }
    review.vote=review.vote-1;
    return review;
}
function edit(review,req,res){
    if(req.user.cannotEdit(review)||!req.body.content){
      res.status(401).json({message:"You are not allow to do this"});
    }
    review.content= req.body.content;
    return review;
}
function approve(review,user,res){
  Post.findById(review.post)
      .then((post)=>{
        if(post.owner==user._id){
          review.isApproved=true;
        }
        return review;
      });
}
function destroy(req,res){
  var foundReview;
  Review.findById(req.params.reviewId)
        .then((review)=>{
          if(req.user.cannotEdit(review)){
             return Promise.reject(new Error("Permission denied"));
          }
          foundReview=review;
          return Post.findById(review.post);
        }).then((post)=>{
             let reviewIndex=post.reviews.indexOf(foundReview._id);
             post.reviews.splice(reviewIndex,1);
             return post.save();
        }).then((post)=>{
             return foundReview.remove();
        }).catch((err)=>{
            return res.status(401).json({message:err});
        });
}
export default {create,update,destroy}
