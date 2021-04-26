import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import "../Home/Home.css";


const FollowingPosts = (props) => {
  const { state, dispatch } = useContext(UserContext)
  const [data, setData] = useState([])
  console.log(data)
  useEffect(() => {
    fetch('/getfollowingpeopleposts', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.Posts)
        console.log(result.Posts)
      })
  }, [])

  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      })
      .catch((err) => console.log(err))
  }

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result 
          } else {
            return item
          }
        })
        setData(newData)
      })
      .catch((err) => console.log(err))
  }

  const commentPost = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
        console.log(result)
      })
      .catch((err) => console.log(err))
  }

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id // filter out the items(posts from our databases) whose id doesn't match with the id of user who is deleting the post; srf woh post jis pr user ne click kiya, woh delete kr do. Baqi sb database mein rehne do
        })
        setData(newData)
      })
  }

  return (
    <div className="cards_div">
      {data.length > 0 ? (
        data.map((item) => {
          return (
            <div className='card post_card'>
              <h3>
                <Link
                  to={
                    item.postedBy._id !== state._id
                      ? '/otherprofile/' + item.postedBy._id
                      : '/profile'
                  }
                >
                  {item.postedBy.name}
                </Link>
              </h3>
              {item.postedBy._id == state._id ? (
                <i
                  class='material-icons'
                  style={{ cursor: 'pointer' }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              ) : null}
              <img src={item.pic} alt='' />
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              <div className='like_div'>
                {item.likes.includes(state._id) ? (
                  <i
                    class='material-icons'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      unlikePost(item._id)
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    class='material-icons'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      likePost(item._id)
                    }}
                  >
                    thumb_up
                  </i>
                )}
              </div>
              <p>{item.likes.length} likes</p>
              <div className='comment_div'>
                {item.comments.map((record) => {
                  return (
                    <p>
                      <strong>{record.postedBy.name}</strong> {record.text}
                    </p>
                  )
                })}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  commentPost(e.target[0].value, item._id)
                }}
              >
                <input type='text' placeholder='Add a comment...' />
              </form>
            </div>
          )
        })
      ) : (
        <h2>Please follow Someone to See Their Posts!</h2>
      )}
    </div>
  )
}

export default FollowingPosts
