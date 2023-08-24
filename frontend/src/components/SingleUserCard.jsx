import React from 'react'
import "../styles/SingleUserCard.css"
const SingleUserCard = ({user}) => {
  return (
    <div className='user-card'>
      <img className='user-search-image'  src={`http://localhost:5000/images/${user.pic_url}`} alt="" />
      <span>{user.name}</span>
    </div>
  )
}

export default SingleUserCard