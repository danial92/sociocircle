const express = require("express");
const User = require("../models/User_Schema");
const router = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_CODE } = require("../key");

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(404).json({ message: "Please fill all fields!" })
    }

    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            return res.status(404).json({ message: "User doesn't exists" })
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                const token = jwt.sign({ _id: user._id }, SECRET_CODE);
                const { _id, name, email, followers, following, pic } = user;
                res.json({ message: "Login Successful!", token, user: { _id, name, email, followers, following, pic } });
            } else {
                return res.status(402).json({ message: "Incorrect Password!" })
            }
        })
        .catch(err => res.json({ error: err }))
    })
})

router.post("/signup", (req, res) => {
    const { name, email, password, pic } = req.body;
    if(!name || !email || !password) {
        return res.status(404).json({ message: "Please fill all fields!" })
    }

    User.findOne({ email: email })
    .then(checkedUser => {
        if(checkedUser) {
            return res.status(404).json({ message: "User with this email already exists!" }); 
        }

        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name,
                email,
                password: hashedPassword,
                pic
            })

            user.save()
            .then(savedUser => res.json({ message: "User Registered!" }))
            .catch(err => res.json({ error: err }))
        })

    })
})

module.exports = router;