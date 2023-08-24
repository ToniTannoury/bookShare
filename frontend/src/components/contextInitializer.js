import React , {useEffect , useContext} from 'react'
import UserContext from '../context/userContext'
const ContextInitializer = () => {
  const {state , dispatch} = useContext(UserContext)
  console.log(state)
  useEffect(()=>{
    const getPopulatingData = async()=>{
      const response = await fetch("http://localhost:5000/api/users/me" , {
        method:"GET",
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      console.log(data)
      dispatch({
        type: 'INITIALIZE_STATE',
        payload:data ,
      });
    }
    getPopulatingData()

  },[])
  return (
    <></>
  )
}

export default ContextInitializer