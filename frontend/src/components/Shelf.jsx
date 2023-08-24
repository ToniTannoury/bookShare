import {useContext} from 'react'
import Navbar from './Navbar'
import UserContext from '../context/userContext'
import Carousel from './Carousel'
import ContextInitializer from './contextInitializer'
const Shelf = () => {
  const {state , dispatch} = useContext(UserContext)
  console.log(state)
  const groupedRecommendations = state.likedBooks?.reduce((groups, book) => {
    if (!groups[book.genre]) {
      groups[book.genre] = [];
    }
    groups[book.genre].push(book);
    return groups;
  }, {});
  console.log(groupedRecommendations)
  return (
    <div>
      <ContextInitializer/>
      <Navbar/>
     
      {groupedRecommendations && Object.entries(groupedRecommendations).map(([genre, recommendations]) => (
  <div key={genre}>
    <div className='single-following-header'>
      <img className='author-image' src={`http://localhost:5000/images/th.jpg`} alt={genre} />
      <div className='single-following'>{genre} Recommendations</div>
    </div>
    
    <Carousel recommendations={recommendations} shelf/>
    <hr />
  </div>
))}
     
    </div>
  )
}

export default Shelf