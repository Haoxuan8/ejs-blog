var mongoose = require("mongoose");
var config = require("../config/index");

var ObjectId = mongoose.Schema.Types.ObjectId;

var postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    contentMd: String,
    contentHTML: String,
    coverImg: String,
    description: String,
    display: Boolean,
    tags: [
        {
            type: ObjectId,
            ref: "Tag"
        }
    ],
    author: {
        id: {
        type: ObjectId,
        ref:"User"
        },
        username: String
    },
    meta: {
        createTime: {
            type: Date,
            default: Date.now()
        },
        updateTime: {
            type: Date,
            default: Date.now()
        },
        views: {
            type: Number,
            default: 0
        }
    }
})

postSchema.pre('save', function(next){
    if(this.isNew) {
        this.meta.createTime = Date.now();
        this.meta.updateTime = Date.now();
    } else{
        this.meta.updateTime = Date.now();
    }

    next();
});

var Post = mongoose.model("Post", postSchema);
module.exports = Post;