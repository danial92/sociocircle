const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

const Post = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    body: {
        type: String,
        required: true 
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    pic: {
        type: String,
        required: true
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{text: String, 
        postedBy: {type: ObjectId, ref: "User"}
    }]
})

module.exports = mongoose.model("Post", Post);