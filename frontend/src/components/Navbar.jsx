import React from 'react'
import "../styles/Navbar.css"
import { useNavigate , Link } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  const goto = (path)=>{
    navigate(path)
  }
  return (
    <div className='nav-bar'>
      <div className='left-nav'>
        <h2 className='app-name'>BookShare</h2>
      </div>
      <div className='right-nav'>
      <h4><Link className='link' to={'/landing'}>
            Your Recommendations
          </Link></h4> 
        <div>
          <h4><Link className='link' to={'/feed'}>
            Feed
          </Link></h4> 
        </div>
        <div >
        <h4><Link className='link' to={'/shelf'}>
            Shelf
          </Link></h4> 
        </div>
       
        <button className='logout-button'>logout</button>
      </div>
      
    </div>
    
  )
}

export default Navbar