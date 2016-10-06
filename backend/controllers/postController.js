import Post from '../models/post';
import Img from '../models/image';
import User from '../models/user';
import Review from '../models/review';
import validator from '../services/validator';
import Category from '../models/category';
import cloudinaryUpload from '../services/cloudinary';
function index(req, res) {
    const orderBy = Post.getOrder(req.query.order);
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 5;
    const query = Post.getQuery(req.query);
    const Promise = require('bluebird');
    Promise.all([
        Post.getPosts(query).skip((page - 1) * limit).limit(limit).sort(orderBy),
        Post.count(query)
    ]).spread(function(posts, count) {
        const totalPage = Math.ceil(count / limit);
        res.json({
            totalPage: totalPage,
            totalPost: count,
            postCount: posts.length,
            currentPage: page,
            data: posts
        });
    }, function(err) {
        res.status(403).json({ message: err });
    });
};
//show specific post
function show(req, res) {
    Post.findDetailById(req.params.postId)
        .select("-__v")
        .then((post) => {
            return User.populate(post, {
                path: "reviews.owner",
                select: "name avatar",
                model: User
            });
        })
        .then((post) => {
            res.json({ data: post });
        })
        .catch((err) => {
            res.status(403).json({ message: err })
        });
};
function close(req,res){
  Post.findDetailById(req.params.postId)
      .select("-__v")
      .then((post) => {
          if(post.isClosed){
            Promise.reject("Post already closed");
          }
          if(req.user.cannotEdit(post)){
            Promise.reject("Permission denied");
          }
          post.isClosed=true;
          return post.save();
      })
      .then((post) => {
          res.json({ data: post });
      })
      .catch((err) => {
          res.status(403).json({ message: err })
      });
}
function create(req, res) {
    const keys = ['title', 'description','reward', 'expire','category'];
    if (!validator(keys, req.body)) {
        return res.status(403).json({ "message": "All fields required" });
    }
    if(req.body.expire<=0){
        return res.status(403).json({ "message": "Expire must be a positive number of days" });
    }
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + req.body.expire);

    //using point to post
    let user = req.user;
    if (user.points < req.body.reward) {
        return res.status(403).json({ error: "You dont have enough points." });
    }
    Category.findById(req.body.category)
            .then((category)=>{
              user.points = user.points - req.body.reward;
              return user.save();
            })
            .then((user) => {
                return Img.saveImages(req.files,cloudinaryUpload);
            })
            .then((images) => {
                return Post.create({
                    title: req.body.title,
                    description: req.body.description,
                    reward: req.body.reward,
                    owner: req.user.id,
                    expire: expiry.toString(),
                    category:req.body.category,
                    images: images
                });
            })
            .then((post) => {
                res.json({ data: post });
            })
            .catch((err) => {
                return res.status(403).json({ message: err });
            });

}

function update(req, res) {
    Post.findById(req.params.postId)
        .select("-__v")
        .then((post) => {
            if (req.user.cannotEdit(post)) {
                return Promise.reject("Permission denied");
            }
            for (let key in req.body) {
                if (["title", "description", "reward", "category", "expire"].indexOf(key) != -1) {
                    post[key] = req.body[key];
                }
            }
            return post.save();
        }).then((post) => {
            res.json({ data: post });
        }).catch((err) => {
            return res.status(403).json({ message: err });
        })

}

function destroy(req, res) {
    var foundPost;

    Post.findById(req.params.postId)
        .then((post) => {
            if (req.user.cannotEdit(post)) {
                return Promise.reject("Permission denied");
            }
            foundPost = post;
            return Review.remove({ _id: { "$in": post.reviews } });
        }).then(() => {
            return Img.remove({ _id: { "$in": foundPost.images } });
        }).then(() => {
            return foundPost.remove();
        }).then((result) => {
            if (result) return res.json({ message: "Post has been deleted." })
        }).catch((err) => {
            return res.status(404).json({ message: err });
        })
}

export default { index, show, create, update, destroy ,close};

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
