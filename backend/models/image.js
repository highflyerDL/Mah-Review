import mongoose from 'mongoose';
import Promise from 'bluebird';
const Schema = mongoose.Schema;

const imageSchema = mongoose.Schema({
    __v: {
        type: Number,
        select: false
    },
    type: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }
});
imageSchema.statics.saveImages = function(files, callback) {
    return Promise.map(files, callback);
};


export default mongoose.model('Image', imageSchema);
