/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import "./CreatePost.css";

function CreatePost() {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [URL, setURL] = useState("");

    useEffect(() => {
        if (URL) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    picURL: URL
                })
            })
            .then(res => res.json())
            .then(data => {
                // if (!data.error) {
                //     console.log(data.message)
                // } else {
                //     console.log(data.error)
                //     }
                console.log(data);
                setURL(data.url);
                history.push("/")
                })
                .catch(err => console.log(err));
        }
    }, [URL])

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image); // appending image
        data.append("upload_preset", "socio_circle"); // appending upload_preset
        data.append("cloud_name", "danial92"); // appending cloud account username
        fetch("https://api.cloudinary.com/v1_1/danial92/image/upload", {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setURL(data.url)
        })
        .catch(err => console.log(err));
    }


    return (
        <div class="card create_card">
            <h2>Create Your Post!</h2>
            <span>Title</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <span>Body</span>
            <input type="text" value={body} onChange={(e) => setBody(e.target.value)} />
            <div class="file-field input-field">
                <div class="btn">
                    <span>Upload</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>
                <div class="file-path-wrapper picInput">
                    <input class="file-path validate" type="text" placeholder="Upload your image..!!!" />
                </div>
                </div>
                    <a onClick={() => postDetails()} class="waves-effect waves-light btn" type="submit" name="action">Create!</a>
            </div>
    )
}

export default CreatePost;