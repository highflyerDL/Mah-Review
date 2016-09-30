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
                         {path:'images', select:'url type format created'}]);
};
postSchema.statics.getQuery=function(params){
    let criteria=[];

    for(let key in params){
      switch(key) {
        case "title":
            criteria.push({'title' : new RegExp('.*'+params[key]+'.*', "i")});
            break;
        case "category":
            criteria.push({'category' : params[key]});
            break;
        case "description":
            criteria.push({'description' : new RegExp('.*'+params[key]+'.*', "i")});
            break;
        case "owner":
            criteria.push({'owner' : params[key]});
            break;
        }
    }
    let query="";
    if(criteria.length){
      query={$and :criteria};
    }
    return query;
}
postSchema.statics.getOrder=function(str){
  if(!str){
    return { "created": -1,"reward": -1}
  }
  let orderBy={};
  let orders=str.split("*");
  if(orders[orders.length-1]==="asc"){
    for(var i =0;i<orders.length-1;i++){
      orderBy[orders[i]]=1;
    }
  }else{
    for(var i =0;i<orders.length-1;i++){
      if(orders[i]!=="dsc")
        orderBy[orders[i]]=-1;
    }
  }
  return orderBy;
}
postSchema.statics.getPosts=function(query){
  return this.find(query)
             .populate([{path:'owner', select:'name id'},
            {path:'images', select:'url type format created'}]);
}

export default mongoose.model('Post', postSchema);
