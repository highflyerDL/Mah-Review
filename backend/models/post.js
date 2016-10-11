import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    }
  };
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
    },
    reward: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    expire: {
        type: Date,
        required: true
    },
    isClosed:{
       type:Boolean,
       default:false
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    images: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Image',
    }],
    reviews: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Review',
    }],
},schemaOptions);
postSchema.virtual('isExpired').get(function () {
  const today = new Date().getTime();
  const expire= new Date(this.expire).getTime();
  return today>expire;
});
postSchema.statics.findDetailById = function(id) {
    let order = { vote: -1, created: -1 }
    return this.findById(id).select("-__v")
        .populate([{ path: 'owner', select: 'name id avatar' },
            { path: 'images', select: 'url type format created' },
            { path: 'category', select: 'id name' },
            { path: 'reviews', options: { sort: order } }
        ]);
}
postSchema.statics.getQuery = function(params) {
    var today = new Date();
    let criteria = [{ expire: { $gte: today } }];
    for (let key in params) {
        if(params[key]){
            switch (key) {
                case "title":
                    criteria.push({ 'title': new RegExp('.*' + params[key] + '.*', "i") });
                    break;
                case "category":
                    criteria.push({ 'category': params[key] });
                    break;
                case "description":
                    criteria.push({ 'description': new RegExp('.*' + params[key] + '.*', "i") });
                    break;
                case "owner":
                    criteria.push({ 'owner': params[key] });
                    break;
            }
      }
    }
    let query = "";
    if (criteria.length) {
        query = { $and: criteria };
    }
    return query;
}
postSchema.statics.getOrder = function(str) {
    if (!str) {
        return { "created": -1, "reward": -1 }
    }
    let orderBy = {};
    let orders = str.split("|");
    orders.map((order)=>{
        const o=order.split("*");
        orderBy[o[0]]=(o[1]=="asc")?1:-1;
        return;
    });
    return orderBy;
}
postSchema.statics.getPosts = function(query) {
    return this.find(query).select("-__v")
        .populate([{ path: 'owner', select: 'name id avatar' },
            { path: 'images', select: 'url type format created' },
            { path: 'category', select: 'id name' }
        ]);
}

export default mongoose.model('Post', postSchema);
