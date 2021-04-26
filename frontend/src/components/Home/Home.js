import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import { UserContext } from "../../App";


function Home() {
    const { state, dispatch } = useContext(UserContext);
    const [data, setData] = useState([]);
    console.log(data);

    useEffect(() => {
        fetch("/allposts", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setData(data.posts);
        })
        .catch(err => console.log(err));
    }, [])

    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => console.log(err));
    }
 
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) { 
                        return result
                    } else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err => console.log(err));
    }
 
    const commentPost = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
                console.log(result)
            })
            .catch(err => console.log(err));
    }
 
    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id 
                })
                setData(newData);
            })
    }


    return (
        <div className="cards_div">
           {
               data.map(post => {
                   return (
                    <div className="card post_card" key={post._id}>
                        <h3><Link to={post.postedBy._id != state._id ? `/otherprofile/${post.postedBy._id}` : "/profile"}>{post.postedBy.name}</Link></h3>
                        <img src={post.pic} alt="" />
                        <div className="like_div">
                            {
                                post.likes.includes(state._id) ? <i class="material-icons" style={{ cursor: "pointer", marginTop: '10px' }} onClick={() => { unlikePost(post._id) }}>thumb_down</i>
                                    : <i class="material-icons" style={{ cursor: "pointer", marginTop: '10px' }} onClick={() => { likePost(post._id) }}>thumb_up</i>
                            }
                        </div>
                        <p>{post.likes.length} Likes</p>
                        <p style={{ margin: '0px', fontSize: 'medium' }}><strong>{post.title}</strong> {post.body}</p>
                        <div className="comment_div">
                            {
                                post.comments.map(record => {
                                    return (
                                            <>
                                                {
                                                    <p><strong>{record.postedBy.name}</strong> {record.text}</p>
                                                }
                                            </>
                                    )
                                })
                            }
                        </div> 

                        <form onSubmit={(e) => {
                            e.preventDefault()
                            commentPost(e.target[0].value, post._id)
                        }}>
                            <input type="text" placeholder="Add a comment..." />
                        </form>
                    </div>
                )
            })}
        </div>
    )
}

export default Home;
