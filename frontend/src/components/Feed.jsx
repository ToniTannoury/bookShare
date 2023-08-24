import React , {useContext , useState}from 'react'
import UserContext from '../context/userContext'
import Navbar from './Navbar'
import UserSearchBar from './UserSearchBar'
import ContextInitializer from './contextInitializer'
import Carousel from './Carousel'
import RecommendationSearch from './RecommendationSearch'
import '../styles/Feed.css'
const Feed = () => {
  const {state , dispatch} = useContext(UserContext)
  

  const followingWithRecommendations = state.following?.map(followingUser => {
    const { name, recommendations , pic_url} = followingUser;
    return { name, recommendations , pic_url};
  });
  

  return (
    <>
      <ContextInitializer/>
      <Navbar/>
      <UserSearchBar/>
      <RecommendationSearch/>
      {followingWithRecommendations?.map(singleFollowingWithRecommendations=>{
        return(
        <div>      
          <div className='single-following-header'>
          <img className='author-image'  src={`http://localhost:5000/images/${singleFollowingWithRecommendations.pic_url}`} alt="" />
         <div className='single-following'>{ singleFollowingWithRecommendations.name}'s Recommendations</div>
          </div>
         
         <Carousel recommendations={singleFollowingWithRecommendations.recommendations} feed/>
         <hr />
        </div>)}
      )}
    </>
  )
}

export default Feed