import mongoose from '../config/db';
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


export default mongoose.model('Review', reviewSchema);
