import mongoose from 'mongoose';
import Promise from 'bluebird';
const Schema = mongoose.Schema;

const imageSchema = mongoose.Schema({
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
    }
});
imageSchema.statics.saveImages = function(files, callback) {
    return Promise.map(files, callback);
};


export default mongoose.model('Image', imageSchema);
