import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../../components/searchbar/searchbar';
import './home.css';

const Home = () => {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      navigate(`/weather?city=${encodeURIComponent(city)}`);
    }
  };
  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="nav-logo">
          <Link to="/">Weatherly</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>
      
      <div className="clouds-layer">
        <div className="pro-cloud pc1"></div>
        <div className="pro-cloud pc2"></div>
        <div className="pro-cloud pc3"></div>
        <div className="pro-cloud pc4"></div>
      </div>

      <div className="home-content">
        <h1 className="brand-title">Weatherly</h1>
        <p className="brand-subtitle">Check the weather anywhere in the world easily</p>
        <SearchBar 
          city={city} 
          setCity={setCity} 
          onSubmit={handleSearchSubmit} 
        />
      </div>
    </div>
  );
};

export default Home;