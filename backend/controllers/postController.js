import Post from '../models/post';
import Review from '../models/review';
import File from '../models/attachment';
import User from '../models/user';


export function index(req,res){
   //get all posts
   Post.find()
   .select('-files')
   .then((posts)=>{
      res.json(posts);
   });
};
//show specific post
export function show(req,res){
   Post.findById(req.params.postId)
   .then((post)=>{
     return User.populate(post,{
       path:"reviews.owner",
       select:"name",
       model:User
     });
   })
   .then((post)=>{
     res.json(post);
   });
};

export function random(req,res){
   return Post.random().then((post)=>{
     return User.populate(post,{
       path:"reviews.owner",
       select:"name",
       model:User
     });
   })
   .then((post)=>{
     res.json(post);
   });
}

export function create(req,res){
  const cost =req.body.reward+5;
  let user =req.user;
  if(user.points<req.body.reward+5){
    return res.statusCode(401).json({error:"You dont have enough points."});
  }
  user.points=user.points - cost;
  user.save()
      .then((user)=>{
        return File.saveAttachments(req.files,(file)=>{
          let attachment = new File({
            owner:req.user.id,
            originalname:file.originalname,
            mimetype:file.mimetype,
            filename:file.filename,
            size:file.size
          });
          return attachment.save();
        });
      })
      .then(
        (attachments)=>{
          console.log(req.user);
          console.log(attachments);
          let post = new Post({
            title:req.body.title,
            description:req.body.description,
            reward:req.body.reward,
            owner:req.user.id,
            files:attachments
          });
          return post.save();
        })
      .then(
        (post)=>{
        res.json(post);
      },
      (err)=>{
        console.log(err);
        return res.statusCode(401).json({error:err});
      });

};
export function reviewPost(req,res){
    if(req.body.post_id){
        return res.statusCode(403).send("error");
      }
      var newPost,newReview;
    return Post.findById(req.body.postId)
      .then(
        (post)=>{
           let review = new Review({
              content:req.body.content,
              owner:req.user.id,
              post:req.body.postId
           });
           newPost=post;
           return review.save();
        })
      .then(
        (review)=>{
          newReview=review;
          newPost.reviews.push(review.id);
          return newPost.save();
        })
      .then(
        (post)=>{
          return User.populate(newReview,{
            path:"owner",
            select:"name",
            model:User
          });
        })
      .then(
        (review)=>{
          res.json(review);
        },
        (err)=>{
          console.log(err);
        }
      );
}
