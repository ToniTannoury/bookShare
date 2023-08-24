import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import Register from "./components/Register"
import Login from "./components/Login"
import { UserProvider } from './context/userContext'
import LandingPage from './components/LandingPage'
import Feed from './components/Feed'
import Shelf from './components/Shelf'
function App(){
  return (
    <Router>
      <div className="container">
        <UserProvider>
          <Routes>
            <Route path="/" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/landing" element={<LandingPage/>}/>
            <Route path="/feed" element={<Feed/>}/>
            <Route path="/shelf" element={<Shelf/>}/>
          </Routes>
        </UserProvider>
      </div>
    </Router>
    

  )
}

export default App