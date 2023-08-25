import React , { useContext , useState} from 'react'
import UserContext from '../context/userContext'
import Modal from 'react-modal'
import "../styles/Recommendation.css"
const Recommendation = ({recommendation , openEditModal , shelf}) => {
  const { state, dispatch } = useContext(UserContext);
  const deleteRecommendedBook = async(e)=>{
    const recId = e.target.parentElement.parentElement.getAttribute('_id')
    const response = await fetch(
      `http://localhost:5000/api/books/deleteRecommendedBook/${recId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,       
        },
      }
    );
  
    const data = await response.json();
      console.log(data)
    dispatch({
      type: 'DELETE_RECOMMENDED_BOOK',
      payload:recId ,
    });
  }
  const removeFromshelf =async ()=>{
    const response = await fetch(
         `http://localhost:5000/api/books/unlikeRecommended/${recommendation._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    dispatch({ type: 'REMOVE_LIKED_BOOK', payload: recommendation });
    dispatch({ type: 'DECREMENT_LIKES_FOR_FOLLOWING_RECOMMENDATION', payload: {
      userId:recommendation.createdBy,
      bookId:recommendation._id
    } });
  }
 


  return (
    <div _id={recommendation._id} className='recommendation-container'>
      <div className='recommendation-header'>
        <span className='book-title'>{recommendation.bookName}</span>
        <div className='genre-box'>
          {recommendation.genre}
        </div>
      </div>
      <div >
        <img className='recommendation-image' src={`http://localhost:5000/images/${recommendation.book_pic_url}`} />
      </div>
      <div className='number-of-likes'>
        <span>{recommendation.likes} Likes</span>
      </div>
      <div className='author-info'>
        <img className='author-image'  src={`http://localhost:5000/images/${recommendation.author.pic_url}`} alt="" />
        <div className='author-details'>
          <span>Author:</span>
          <span>{recommendation.author.name}</span>
        </div>
      </div>
      <div className='review'>
        <span className='review-text'>{recommendation.review}</span>
      </div>
      <div>
        {!shelf && <button onClick={deleteRecommendedBook } className='add-to-shelve-button'>Remove</button>}

        {shelf && <button  onClick={removeFromshelf} className='add-to-shelve-button'>Remove</button>}
        {!shelf && <button onClick={openEditModal}className='add-to-shelve-button'>Edit</button>}
      </div>
    </div>
  )
}

export default Recommendation