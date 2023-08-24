import React, { useState, useEffect } from 'react';
import useDebounce from '../customHooks/useDebounce'; 
import SingleRecommendation from './SingleRecommendation';

const RecommendationSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchOption, setSearchOption] = useState('name'); 
  const [searchData, setSearchData] = useState(null); 
  const debouncedSearchValue = useDebounce(searchValue, 300); 

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchOption(event.target.value);
  };

  useEffect(() => {
    // Perform the search when debouncedSearchValue or searchOption changes
    const performSearch = async () => {
      if (debouncedSearchValue.trim() === '') {
        setSearchData(null);
        return;
      }

      let apiUrl = '';
      switch (searchOption) {
        case 'name':
          apiUrl = `http://localhost:5000/api/users/searchFollowingRecommendationsByBookName/${debouncedSearchValue}`;
          break;
        case 'genre':
          apiUrl = `http://localhost:5000/api/users/searchFollowingRecommendationsByGenre/${debouncedSearchValue}`;
          break;
        case 'author':
          apiUrl = `http://localhost:5000/api/users/searchFollowingRecommendationsByAuthorName/${debouncedSearchValue}`;
          break;
        default:
          return;
      }

      try {
        const response = await fetch(apiUrl , {
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Handle searchData as needed
          setSearchData(data)
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    performSearch();
  }, [debouncedSearchValue, searchOption]);

  return (
    <div>
      <form>
        <div className='recommendation-search'>
          <label className='recom-search-label'>
            Search Your Following's Recommendations
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchInputChange}
            className='recommendation-search-input'
          />
        </div>
        <div className='recommendation-search'>
          <label className='recom-search-label'>
            Search by:
          </label>
          <div>
            <input
              type="radio"
              value="name"
              checked={searchOption === 'name'}
              onChange={handleRadioChange}
            />
            Name
          
            <input
              type="radio"
              value="genre"
              checked={searchOption === 'genre'}
              onChange={handleRadioChange}
            />
            Genre

            <input
              type="radio"
              value="author"
              checked={searchOption === 'author'}
              onChange={handleRadioChange}
            />
            Author
          </div>
        </div>
      </form>
      <div className='following-recommendations-list'>
        {searchData?.recommendations?.map(singlerec => (
          <SingleRecommendation recommendation={singlerec} key={singlerec._id} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationSearch;
