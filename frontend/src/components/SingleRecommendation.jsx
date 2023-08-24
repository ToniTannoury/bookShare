import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../context/userContext';
import '../styles/SingleRecommendation.css';

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
        // Toggle the isLiked state immediately
        setIsLiked(prevIsLiked => !prevIsLiked);

        // Update the context state based on the new recommendation state
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
    <div className='single-recommendation'>
      <img
        className='recomm-search-image'
        src={`http://localhost:5000/images/${recommendation.book_pic_url}`}
        alt=""
      />
      {recommendation.bookName}
      <button className='add-to-likes' onClick={handleLikeClick}>
        {isLiked ? 'Liked' : 'Like and add to shelve'}
      </button>
    </div>
  );
};

export default SingleRecommendation;
