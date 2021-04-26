import React, { useState, useEffect } from 'react'
// import axios from "axios";
import { useHistory } from "react-router-dom";
import M from 'materialize-css';

function Register() {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setURL] = useState(undefined);
 
    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])
 
    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "socio_circle");
        data.append("cloud_name", "danial92");
        fetch("https://api.cloudinary.com/v1_1/danial92/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setURL(data.url);
                // console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    }
 
    const uploadFields = () => {
        // Remember! Below in the code, I have added '!' at the start of the regex code(present insdie the small brackets () )
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid Email!", classes: "#f44336 red" });
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#f44336 red" })
                } else {
                    M.toast({ html: data.message, classes: "#00e676 green accent-3" })
                    history.push("/login");
                }
            }).catch(err => {
                console.log(err);
            })
    }
 
    const PostData = () => {
        if(image) {
            uploadPic();
        } else {
            uploadFields();
        }
    }

    return (
        <div>
            <div class="card auth_card">
                <h2>Sign Up Here!</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div class="file-field input-field">
                    <div class="btn">
                        <span>Upload Image</span>
                        <input type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" />
                    </div>
                </div>
                <a onClick={() => PostData()} href class="waves-effect waves-light btn" type="submit">Sign Up</a>
            </div>
        </div>
    )
}

export default Register;