import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = mongoose.Schema({
    __v: {
      type: Number,
      select: false
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Image',
    }
});
categorySchema.statics.saveImages = function(files,callback) {
    return Promise.map(files,callback);
};

export default mongoose.model('Category', categorySchema);
