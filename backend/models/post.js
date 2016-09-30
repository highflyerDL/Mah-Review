import mongoose from 'mongoose'
const Schema = mongoose.Schema;
var reviewSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  content:{
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  isApproved:{
    type:Boolean,
    default:false
  },
  owner:{
    type:mongoose.SchemaTypes.ObjectId,
    ref:'User',
  },
  post:{
    type:mongoose.SchemaTypes.ObjectId,
    ref:'Post',
  }
});

var postSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  title: {
      type: String,
      required: true
  },
  description:{
      type: String,
      required: true
  },
  category:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'Category',
  },
  reward:{
      type: Number,
      required: true
  },
  created: {
      type: Date,
      default: Date.now
  },
  owner:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'User',
  },
  images:[{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'Image',
  }],
  reviews:[reviewSchema],
});

postSchema.statics.findDetailById = function(id){
    return this.findById(id)
               .populate([{path:'owner', select:'name id'},
                         {path:'images', select:'source'},
                         {path:'reviews', select:'id owner content created isApproved'}]);
};
postSchema.statics.getPosts=function(keyword=0,categoryId=0,page=0,limit=20){
  let criteria=[];
  if(keyword){
    criteria.push({'title' : new RegExp('^'+keyword+'$', "i")});
  }
  if(categoryId){
    criteria.push({'category' : categoryId});
  }
  let query="";
  if(!criteria.length){
    query={$and :criteria};
  }
  return this.find(query).skip(page*limit).limit(limit);
}

export default mongoose.model('Post', postSchema);
