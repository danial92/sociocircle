const express = require("express");
const router = express.Router();
const User = require("../models/User_Schema");
const Post = require("../models/Post_Schema");
const requireLogin = require("../middleware/requireLogin");


router.get("/user/:id", requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
    .select("-password")
    .then(user => {
        Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if(err) {
                return res.json({ err: err })
            } 
                res.json({ user, posts })
        })
    }).catch(err => {
        return res.json({ error: "User Not Found!" });
    });
})

router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { // followId --> id of user whom we follow
        $push: { followers: req.user._id }
    }, {
        new: true 
    }, (err, result) => {
        if(err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {new: true}).then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { // followId --> id of user whom we follow
        $pull: { followers: req.user._id }
    }, {
        new: true 
    }, (err, result) => {
        if(err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {new: true}).then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put("/updatepic", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: {pic: req.body.pic}}, { new: true }, 
    (err, result) => {
        if(err) {
            return res.status(422).json({ error: err })
        }

        res.json(result);
    })
})


module.exports = router;