const express = require("express");
const router = express();
const Post = require("../models/Post_Schema");
const requireLogin = require("../middleware/requireLogin");


router.post("/createpost", requireLogin, (req, res) => {
    const { title, body, picURL } = req.body;

    if(!title || !body || !picURL) {
        return res.json({ message: "Please don't leave anything blank!" })
    }

    const post = new Post({
        title,
        body,
        postedBy: req.user,
        pic: picURL
    })

    req.user.password = undefined;
    post.save()
    .then(post => res.json({ post: post, message: "Post Created Successfully!" }))
    .catch(err => res.json({ error: err }))
})

router.get("/allposts", requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => res.json({ posts: posts }))
    .catch(err => res.json({ error: err }))
})

router.get("/myposts", requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then(posts => res.json({ posts: posts }))
    .catch(err => res.json({ error: err }))
})

router.get('/getfollowingpeopleposts',requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } }) // is line ka mtlb k un users ki posts find kro jin ko hum follow kr rahe(whom we are following)
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({Posts: posts});
    })
    .catch(err => {
        res.json({error: err});
    })
})

router.put("/like", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes : req.user._id }
    },{
        new: true
    })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result);
        }
    })
})

router.put("/unlike", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result);
        }
    })
})

router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id 
    }
    Post.findByIdAndUpdate(req.body.postId, { 
        $push: { comments: comment }
    },{
        new: true 
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result);
        }
    })
})

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post) {
            return res.status(422).json({ error: err })
        } 
        if(post.postedBy._id.toString() === req.user._id.toString()) { // the person who created the post === the person who is currently requesting to delete the post
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => console.log(err))
        } 
    })
})

module.exports = router;