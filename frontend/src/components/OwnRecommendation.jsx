import React , {useState , useContext , useEffect} from 'react'
import UserContext from '../context/userContext';
const OwnRecommendation = ({recommendation}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(recommendation.likes); 
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    setIsLiked(state.likedBooks.some(book => book._id === recommendation._id));
    
  }, [state.likedBooks, recommendation._id, recommendation.likes]);

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
  
  
  console.log(likesCount)
  console.log(recommendation)
  if(!recommendation){
    return
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
        <button className='add-to-shelve-button' onClick={handleLikeClick}>
          {isLiked ? 'Liked' : 'Like and add to shelve'}
        </button>
      </div>
  </div>
  )
}

export default OwnRecommendation