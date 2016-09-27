import mongoose from '../config/db';

const Schema = mongoose.Schema;

const attachmentSchema = mongoose.Schema({
    __v: {
      type: Number,
      select: false
    },
    originalname: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default:Date.now
    },
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
    }

});
attachmentSchema.statics.saveAttachments = function(files,callback) {
    return Promise.map(files,callback);
};

export default mongoose.model('Attachment', attachmentSchema);
