import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Weather from './pages/weather/weather';
import Forecast from './pages/forcast/forcast'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
    
        <Route path="/forecast" element={<Forecast />} /> 
      </Routes>
    </Router>
  );
}

export default App;