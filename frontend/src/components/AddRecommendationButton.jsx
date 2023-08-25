import {useContext , useState} from 'react'
import UserContext from '../context/userContext'
import Modal from'react-modal'

const AddRecommendationButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
const [addedRecommendation, setAddRecommendation] = useState();
  const { state, dispatch } = useContext(UserContext);
  const openEditModal = () => {
    setIsModalOpen(true);
    
  };
  const closeEditModal = () => {
    setIsModalOpen(false);
  };
  const handleFileInputChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setAddRecommendation((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };
  const handleAuthorFileInputChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setAddRecommendation((prev) => ({
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
    setAddRecommendation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAuthorInputChange = (e) => {
    const { name, value } = e.target;
    setAddRecommendation((prev) => ({
      ...prev,
      author:{
        ...prev?.author,
        name: value
      }
    }));
  };
  const saveaddedRecommendation = async () => {
    const updatedRecommendation = { ...addedRecommendation };
    console.log(addedRecommendation)
  
    const filteredaddedRecommendation = {
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
    const body = new FormData();
    body.append('bookName', updatedRecommendation.bookName);
    body.append('authorName', updatedRecommendation.author.name);
    body.append('authorPic', updatedRecommendation.author.pic_url);
    body.append('review', updatedRecommendation.review);
    body.append('book_pic_url', updatedRecommendation.book_pic_url);
    body.append('genre', updatedRecommendation.genre);
  
    const response = await fetch(
      `http://localhost:5000/api/books/recommendBook`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          
        },
        body,
      }
    );
  
    const data = await response.json();
      console.log(data)
    dispatch({
      type: 'ADD_RECOMMENDED_BOOK',
      payload: filteredaddedRecommendation,
    });
  
    closeEditModal();
  };
  console.log(addedRecommendation)
  
  return (
    <div>
      <button className='add-recommendation' onClick={openEditModal}>Add Recommendation</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Add Recommendation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2 className="modal-title">Add Recommendation</h2>
        <label  className="modal-label">Author Name:</label>
        <input
          type="text"
          className="modal-input"
          name="name"
          value={addedRecommendation ? addedRecommendation.author.name : ''}
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
          value={addedRecommendation ? addedRecommendation.bookName : ''}
          onChange={(e) => handleInputChange(e)}
        />
        <label  className="modal-label">Review:</label>
        <div>
        <textarea
      
          className="modal-textarea"
          name="review"
          value={addedRecommendation ? addedRecommendation.review : ''}
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
          value={addedRecommendation ? addedRecommendation.genre : ''}
          onChange={(e) => handleInputChange(e)}
        />
        <div className="modal-buttons">
          <button className='add-to-shelve-button' style={{marginLeft:"-1px"}} onClick={saveaddedRecommendation}>Save</button>
          <button className='add-to-shelve-button' onClick={closeEditModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}

export default AddRecommendationButton