import mongoose from 'mongoose'
const Schema = mongoose.Schema;
let reviewSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    vote: {
        type: Number,
        default: 0
    },
    upVoter: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    downVoter: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    isApproved: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Post',
    }
});
export default mongoose.model('Review', reviewSchema);
