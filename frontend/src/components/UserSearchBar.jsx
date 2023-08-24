import React, { useState, useEffect } from 'react';
import useDebounce from '../customHooks/useDebounce'; 
import '../styles/UserSearchBar.css'
import "../styles/SingleUserCard.css"
import UserInfoBar from './UserInfoBar';
function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/searchUsers?q=${debouncedSearchQuery}`,{
              headers:{
                "Authorization": `Bearer ${localStorage.getItem('token')}`
              }
             
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            setSearchResults(data.users);
          } else {
            console.error('Error fetching search results:', response.status);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='user-seach-container'>
      <input
        type="text"
        placeholder="Search Users..."
        onChange={handleSearchChange}
        className='user-search-input'
      />
      <div style={{position:"absolute"}}>
        {searchResults.map((user) => (
          <UserInfoBar user={user} search/>
        ))}
      </div>
    </div>
  );
}

export default SearchComponent;
