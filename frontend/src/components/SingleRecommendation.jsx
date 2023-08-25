import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import '../styles/SingleRecommendation.css';
import { FaHeart  , FaComment  , FaBook} from 'react-icons/fa'; 

const SingleRecommendation = ({ recommendation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const [likesCount, setLikesCount] = useState(recommendation.likes); 
  useEffect(() => {
    setIsLiked(state.likedBooks.some(book => book._id === recommendation._id));
  }, [state.likedBooks, recommendation._id]);

  const handleLikeClick = async () => {
    try {
      const response = await fetch(
        isLiked
          ? `http://localhost:5000/api/books/unlikeRecommended/${recommendation._id}`
          : `http://localhost:5000/api/books/likeRecommended/${recommendation._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
  
        setIsLiked(prevIsLiked => !prevIsLiked);

    
        if (!isLiked) {
          dispatch({ type: 'ADD_LIKED_BOOK', payload: recommendation });
          dispatch({ type: 'INCREMENT_LIKES_FOR_FOLLOWING_RECOMMENDATION', payload: {
            userIdInc:recommendation.createdBy,
            bookIdInc:recommendation._id
          } });
          
        } else {
          dispatch({ type: 'REMOVE_LIKED_BOOK', payload: recommendation });
          dispatch({ type: 'DECREMENT_LIKES_FOR_FOLLOWING_RECOMMENDATION', payload: {
            userId:recommendation.createdBy,
            bookId:recommendation._id
          } });
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='single-recommendation' style={{height:"150px"}}>
      <img
      style={{width:"90px" , height:"100px"}}
        className='recomm-search-image'
        src={`http://localhost:5000/images/${recommendation.book_pic_url}`}
        alt=""
      />
      <div style={{width:"250px" }}>
        {console.log(recommendation)}
      <FaBook className='blue'/> {recommendation.bookName}
      <br />
      <FaHeart className='blue'/> {recommendation.likes} likes
      <br />
      <FaComment className='blue'/> {recommendation.review}
      </div>
      <div style={{width:"200px" , textAlign:'end'}}>
      <button className='add-to-shelve-button' onClick={handleLikeClick}>
        {isLiked ? 'Liked' : 'Like and add to shelve'}
      </button>
      </div>
      
    </div>
  );
};

export default SingleRecommendation;
