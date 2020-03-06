var mongoose =require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;


var tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Tag name is required",
        unique: true
    },
    posts: [{
        type: ObjectId,
        ref: "Post"
    }]
});

var Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;