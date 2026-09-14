import React from 'react';
import './searchbar.css'; 

const SearchBar = ({ city, setCity, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search for your favorite city.."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="main-search-input"
        />
        <button type="submit" className="explore-btn">
          Explore
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
