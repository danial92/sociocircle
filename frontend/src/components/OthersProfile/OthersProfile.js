import React, { useState, useEffect, useContext } from 'react'
import '../Profile/Profile.css'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../App'

function OthersProfile() {
  const [data, setData] = useState(null)
  const { userid } = useParams()
  const { state, dispatch } = useContext(UserContext)
  const [followButton, setFollowButton] = useState(
    state ? !state.following.includes(userid) ? true : false : <h2>Wait!</h2>
  )
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log(data)
      })
      .catch((err) => console.log(err))
  }, [])

  const followPost = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'UPDATE',
          payload: { followers: data.followers, following: data.following },
        })
        localStorage.setItem('user', JSON.stringify(data))
        setData((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          }
        })
        setFollowButton(false)
      })
      .catch((err) => console.log(err))
  }

  const unfollowPost = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'UPDATE',
          payload: { followers: data.followers, following: data.following },
        })
        localStorage.setItem('user', JSON.stringify(data))

        setData((prevState) => {
          const unfollow = prevState.user.followers.filter(
            (item) => item !== data._id
          )
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: unfollow,
            },
          }
        })
        setFollowButton(true)
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      {data ? (
        <div>
          <div className='profile'>
            <div>
              <img
                className='profile_image'
                src={data.user.pic}
                alt=""
              />
            </div>
            <div className='profile_info'>
              <h2>{data.user.name}</h2>
              <div className='followers_posts'>
                <h4>Following {data.user.following.length}</h4>
                <h4>Followers {data.user.followers.length}</h4>
                <h4>Posts {data.posts.length}</h4>
              </div>
              {followButton ? (
                <button
                  onClick={() => followPost()}
                  className='btn waves-effect waves-light'
                  type='submit'
                  name='action'
                >
                  Follow
                </button>
              ) : (
                <button
                  onClick={() => unfollowPost()}
                  className='btn waves-effect waves-light'
                  type='submit'
                  name='action'
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className='gallery'>
            <hr />
            <div className='media'>
              {data.posts.map((post) => {
                return <img alt="" src={post.pic} />
              })}
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading..!!!</h2>
      )}
    </>
  )
}

export default OthersProfile
