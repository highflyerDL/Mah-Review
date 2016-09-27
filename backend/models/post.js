import mongoose from '../config/db';
const Schema = mongoose.Schema;

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
  files:[{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'Attachment',
  }],
  reviews:[{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'Review',
  }],
});

postSchema.statics.random = function() {
  return this.count().then((count)=> {
    let rand = Math.floor(Math.random() * count);
    return this.findOne()
               .skip(rand)
               .populate([{path:'owner', select:'name id'},
                         {path:'files', select:'filename'},
                         {path:'reviews', select:'id owner content created isApproved'}]);
  });
};
postSchema.statics.findById = function(id){
    return this.findOne({_id: id })
               .populate([{path:'owner', select:'name id'},
                         {path:'files', select:'filename'},
                         {path:'reviews', select:'id owner content created isApproved'}]);
};

export default mongoose.model('Post', postSchema);
