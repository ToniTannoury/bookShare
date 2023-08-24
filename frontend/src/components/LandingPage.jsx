import {useContext , useState} from 'react'
import Recommendation from './Recommendation';
import ContextInitializer from './contextInitializer';
import Carousel from './Carousel';
import UserContext from '../context/userContext'
import Navbar from './Navbar';
import UserInfoBar from './UserInfoBar';
import Modal from'react-modal'
import AddRecommendationButton from './AddRecommendationButton';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
const [editedRecommendation, setEditedRecommendation] = useState();
  const { state, dispatch } = useContext(UserContext);
  const openEditModal = (recommendation) => {
    setIsModalOpen(true);
    setEditedRecommendation(recommendation);
  };
  const closeEditModal = () => {
    setIsModalOpen(false);
  };
  const handleFileInputChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setEditedRecommendation((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };
  const handleAuthorFileInputChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setEditedRecommendation((prev) => ({
        ...prev,
        author:{
          ...prev.author,
          pic_url: files[0],
        }
        
      }));
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecommendation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAuthorInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRecommendation((prev) => ({
      ...prev,
      author:{
        ...prev.author,
        name: value
      }
    }));
  };
  const saveEditedRecommendation = async () => {
    // Create a copy of the edited recommendation
    const updatedRecommendation = { ...editedRecommendation };
  
    console.log(typeof updatedRecommendation.author.pic_url === "object")
    if (!updatedRecommendation.author.pic_url) {
      updatedRecommendation.author.pic_url = updatedRecommendation.author.pic_url.name;
      console.log( updatedRecommendation.author.pic_url)
    }
  
    // Check if a new book picture was inputted, if not, keep the old name
    console.log(typeof  updatedRecommendation.book_pic_url)
    if (!updatedRecommendation.book_pic_url) {
      updatedRecommendation.book_pic_url = updatedRecommendation.book_pic_url.name;
      console.log( updatedRecommendation.book_pic_url.name)
    }
  
    // Prepare the data for dispatch and sending to the server
    const filteredEditedRecommendation = {
      author: {
        name: updatedRecommendation.author.name,
        pic_url:typeof updatedRecommendation.author.pic_url === "object" ? updatedRecommendation.author.pic_url.name :  updatedRecommendation.author.pic_url,
      },
      _id: updatedRecommendation._id,
      bookName: updatedRecommendation.bookName,
      review: updatedRecommendation.review,
      book_pic_url:typeof updatedRecommendation.book_pic_url === "object" ? updatedRecommendation.book_pic_url.name :  updatedRecommendation.book_pic_url ,
      genre: updatedRecommendation.genre,
    };
  console.log(filteredEditedRecommendation)
    const body = new FormData();
    body.append('bookName', updatedRecommendation.bookName);
    body.append('authorName', updatedRecommendation.author.name);
    body.append('authorPic', updatedRecommendation.author.pic_url);
    body.append('review', updatedRecommendation.review);
    body.append('book_pic_url', updatedRecommendation.book_pic_url);
    body.append('genre', updatedRecommendation.genre);
  
    // Send the PATCH request to update the recommendation
    const response = await fetch(
      `http://localhost:5000/api/books/updateRecommendedBook/${updatedRecommendation._id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body,
      }
    );
  
    const data = await response.json();
  
    // Dispatch the edited recommendation to update the state
    dispatch({
      type: 'EDIT_RECOMMENDED_BOOK',
      payload: filteredEditedRecommendation,
    });
  
    // Close the modal
    closeEditModal();
  };
  
  
  return (
    <div>
      <ContextInitializer/>
      <Navbar/>
      <UserInfoBar user={state}/>
      <AddRecommendationButton/>
      <div className='recommendations-list'>
      <Carousel recommendations={state.recommendedBooks} openEditModal={openEditModal}/>

      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Recommendation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">Edit Recommendation</h2>
        <label  className="modal-label">Author Name:</label>
        <input
          type="text"
          className="modal-input"
          name="name"
          value={editedRecommendation ? editedRecommendation.author.name : ''}
          onChange={(e) => handleAuthorInputChange(e)}
        />
       <label  className="modal-label">Author Picture:</label>
        <input
          type="file"
          className="modal-input"
          name="pic_url"
          onChange={(e)=>handleAuthorFileInputChange(e)}
        />
        <label  className="modal-label">Book Name:</label>
        <input
          type="text"
          className="modal-input"
          name="bookName"
          value={editedRecommendation ? editedRecommendation.bookName : ''}
          onChange={(e) => handleInputChange(e)}
        />
        <label  className="modal-label">Review:</label>
        <div>
        <textarea
      
          className="modal-textarea"
          name="review"
          value={editedRecommendation ? editedRecommendation.review : ''}
          onChange={(e) => handleInputChange(e)}
        />
        </div>
        
         <label  className="modal-label">Book Picture:</label>
        <input
          type="file"
          className="modal-input"
          name="book_pic_url"
          onChange={handleFileInputChange}
        />
         <label  className="modal-label">Genre:</label>
        <input
          type="text"
          className="modal-input"
          name="genre"
          value={editedRecommendation ? editedRecommendation.genre : ''}
          onChange={(e) => handleInputChange(e)}
        />
        <div className="modal-buttons">
          <button className="modal-button" onClick={saveEditedRecommendation}>Save</button>
          <button className="modal-button" onClick={closeEditModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}

export default LandingPage