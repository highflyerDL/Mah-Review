import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

});

export default mongoose.model('Category', categorySchema);
