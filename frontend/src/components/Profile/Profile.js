import React, { useContext, useState, useEffect } from 'react'
import './Profile.css'
import { UserContext } from '../../App'

function Profile() {
  const { state, dispatch } = useContext(UserContext)
  const [image, setImage] = useState('')
  const [url, setURL] = useState('')
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/myposts', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.posts)
        setData(result.posts)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    if (image) {
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'socio_circle')
      data.append('cloud_name', 'danial92')
      fetch('https://api.cloudinary.com/v1_1/danial92/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch('/updatepic', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result)
              localStorage.setItem(
                'user',
                JSON.stringify({ ...state, pic: result.pic })
              )
              dispatch({ type: 'UPDATE_PIC', payload: result.pic })
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [image])

  const updatePic = (file) => {
    setImage(file)
  }

  return (
    <>
      <div className='profile'>
        <div>
          <img className='profile_image' src={state ? state.pic : ''} alt='' />
        </div>
          <div className='profile_info'>
          <h2>{state ? state.name : 'Loading..!!!'}</h2>
          <div className='followers_posts'>
            <h5>Following {state ? state.following.length : '0'}</h5>
            <h5>Followers {state ? state.followers.length : '0'}</h5>
            <h5>Posts {data.length}</h5>
          </div>
          <div class='file-field input-field'>
            <div class='btn'>
              <span>Update Picture</span>
              <input
                type='file'
                onChange={(e) => updatePic(e.target.files[0])}
              />
            </div>
            <div class='file-path-wrapper'>
              <input class='file-path validate' type='text' />
            </div>
          </div>
          </div>
        </div>
        <hr />
        <div className='gallery'>
            <div className='media'>
            {data.map((post) => {
                return <img key={post._id} src={post.pic} alt={post._id.name} />
            })}
        </div>
      </div>
    </>
  )
}

export default Profile
