import React , { useContext , useState , useEffect} from 'react'
import UserContext from '../context/userContext'
import "../styles/InfoBar.css"

const UserInfoBar = ({user , search}) => {
  const { state, dispatch } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);
  console.log(user)

  // Check if the user is already followed when the component mounts
  useEffect(() => {
    setIsFollowing(state.following?.some(followingUser => followingUser._id === user._id));
  }, [state.following, user._id]);

  const handleFollowClick = async () => {
    try {
      const url = isFollowing
        ? `http://localhost:5000/api/users/unfollow/${user._id}`
        : `http://localhost:5000/api/users/follow/${user._id}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        setIsFollowing(!isFollowing); 
        if (isFollowing) {
          dispatch({ type: 'REMOVE_FOLLOWING', payload: user._id });
        } else {
          dispatch({ type: 'ADD_FOLLOWING', payload: user });
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  return (
    <div _id={user._id} className='info-bar-container'>
      <div>
        <img className='user-image'  src={`http://localhost:5000/images/${user.pic_url}`} alt="" />
        <div className='username'>{user.name}</div>
      </div>
      <div className='info-right'>
        <div className='info-box'>
          <span>{user.followers?.length}</span>
          <span>Followers</span>
        </div>
        <div  className='info-box'>
          <span>{user.following?.length}</span>
          <span>Following</span>
        </div>
        <div  className='info-box'>
          <span>{user.recommendedBooks ? user.recommendedBooks?.length :  user.recommendations?.length }</span>
          <span>Recommended Books</span>
        </div>
        <div  className='info-box'>
          <span>{user.likedBooks?.length}</span>
          <span>Liked Books</span>
        </div>
      </div>
      {search && (
        <div>
          <button
            className='add-to-shelve-button'
            onClick={handleFollowClick}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      )}
      
    </div>
  )
}

export default UserInfoBar