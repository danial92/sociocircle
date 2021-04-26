const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/danial92/image/upload/v1607043481/no-avatar_m0tcya.png"
    },
    password: {
        type: String,
        required: true 
    },
    followers: [{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}]
})

module.exports = mongoose.model("User", User);