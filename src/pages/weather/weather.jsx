import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; 
import { getWeatherData } from '../../services/weatherapi';
import { getCityImage } from '../../services/imgapi'; 
import './weather.css';

const Weather = () => {
  const [searchParams] = useSearchParams();
  const cityQuery = searchParams.get('city') || 'Cairo';

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");
  
  // 👈 هذا هو السطر الذي كان ناقصاً وتسبب في الإيرور (تعريف الـ State وصورتها المبدئية)
  const [cityImage, setCityImage] = useState('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=600&q=80'); 

 useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const cleanedCity = cityQuery.trim().toLowerCase();
        const formattedCity = cleanedCity.charAt(0).toUpperCase() + cleanedCity.slice(1);
        
        // 1. جلب بيانات الطقس
        const data = await getWeatherData(formattedCity);
        setWeatherData(data);
        
        // 2. جلب الصورة الحقيقية الاحترافية ديناميكياً من السيرفيس الجديدة 🌟
        const imageUrl = await getCityImage(formattedCity);
        setCityImage(imageUrl);
        
        setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      } catch (err) {
        console.log("Using smart mock data for presentation safety.");
        const cleanedCity = cityQuery.trim().toLowerCase();
        const formattedCity = cleanedCity.charAt(0).toUpperCase() + cleanedCity.slice(1);
        
        setWeatherData({
          name: formattedCity,
          sys: { country: 'Global' },
          main: { temp: 24, humidity: 45, pressure: 1012 },
          wind: { speed: 5.4, deg: 180 },
          visibility: 10000,
          weather: [{ description: 'Clear Sky' }]
        });
        
        // حتى في الـ catch هيروح يجيب الصورة صح من السيرفيس
        const imageUrl = await getCityImage(formattedCity);
        setCityImage(imageUrl);
        
        setLastUpdatedTime("01:30 PM (Preview)");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityQuery]);
  
  if (loading) return <div className="loader-screen"><div className="spinner"></div><p>Loading Dashboard...</p></div>;

  const formatTime = (timestamp) => {
    if (!timestamp) return "06:30 AM";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="weather-page-container">
      <div className="weather-dashboard">
        
        {/* 1. الـ Sidebar الأيسر */}
        <div className="weather-sidebar animate-fade-in-left">
          
          {/* 👈 زرار سهم الباك الجديد في أول السايدبار */}
          <Link to="/" className="back-to-home-btn" title="Back to Home">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>back</span>
          </Link>

          <div className="weather-icon-wrapper">
            <div className="big-sun"></div>
            <div className="forecast-cloud"></div>
          </div>

          <div className="current-temp-wrapper">
            <h1 className="current-degree">
              {Math.round(weatherData.main.temp)}<span className="unit">°C</span>
            </h1>
          </div>

          <div className="date-time-info">
            <p className="current-day-time">Today, <span className="time-blur">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span></p>
          </div>

          <hr className="sidebar-divider" />

          <div className="weather-condition-details">
            <div className="condition-item">
              <span className="emoji-icon animated-bounce">☁️</span>
              <span className="sidebar-description-text">{weatherData.weather[0].description}</span>
            </div>
            <div className="condition-item last-updated-row">
              <span className="emoji-icon">⏱️</span>
              <span>Last Update: {lastUpdatedTime}</span>
            </div>
          </div>

          <div 
            className="city-card-bg" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.6)), url('${cityImage}')` 
            }}
          >
            <div className="city-overlay">
              <span>{weatherData.name}, {weatherData.sys.country}</span>
            </div>
          </div>
        </div>

        {/* 2. الجزء الأيمن الرئيسي */}
        <div className="weather-main-content animate-fade-in-right">
          
          {/* الـ Header مع إضافة زر الانتقال للبيدج التالتة */}
          <div className="main-header">
            <h2 className="section-title shimmer-text">
  Today's Highlights in {weatherData.name}, {weatherData.sys.country}
</h2>
            
            <div className="header-controls-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              
              {/* 👈 زرار السهم المتجه للبيدج الثالثة (Forecast) */}
              <Link to={`/forecast?city=${encodeURIComponent(cityQuery)}`} className="go-to-forecast-btn" title="View 5-Day Forecast">
                <span>5-Day Forecast</span>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>

              <div className="unit-toggle">
                <span className="active-unit">°C</span>
                <span>°F</span>
              </div>
            </div>
          </div>

          <div className="highlights-grid">
            
            {/* كارت 1: الضغط الجوي */}
            <div className="highlight-card transition-card">
              <div className="card-header-with-icon">
                <p className="card-label">Air Pressure</p>
                <div className="pressure-arrows-container">
                  <svg className="arrow-down-press" viewBox="0 0 24 24" fill="#3b82f6"><path d="M11 4h2v10h3l-4 4-4-4h3z"/></svg>
                  <svg className="arrow-up-press" viewBox="0 0 24 24" fill="#ff9900"><path d="M13 20h-2V10H8l4-4 4 4h-3z"/></svg>
                </div>
              </div>
              <h3 className="card-value gradient-text-pressure">{weatherData.main.pressure} <span className="value-unit-grey">hPa</span></h3>
              <p className="card-sub-value">Standard Atmospheric</p>
            </div>

            {/* كارت 2: Wind Speed */}
            <div className="highlight-card transition-card">
              <div className="card-header-with-icon">
                <p className="card-label">Wind Speed</p>
                <svg className="card-icon-colored rotate-wind" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7"/></svg>
              </div>
              <h3 className="card-value text-blue">{weatherData.wind.speed} <span className="value-unit">m/s</span></h3>
              <p className="card-sub-value">Direction: {weatherData.wind.deg}°🧭</p>
            </div>

            {/* كارت 3: Sunrise & Sunset */}
            <div className="highlight-card transition-card">
              <div className="card-header-with-icon">
                <p className="card-label">Sun Schedule</p>
              </div>
              <div className="sun-schedule sun-schedule-top">
                <div className="sun-time-row">
                  <span className="sun-arrow sunrise-gold">☀️</span>
                  <span className="sun-type-text">Sunrise</span>
                  <span className="time-highlight">{formatTime(weatherData.sys.sunrise)}</span>
                </div>
                <div className="sun-time-row">
                  <span className="sun-arrow sunset-orange">🌙</span>
                  <span className="sun-type-text">Sunset</span>
                  <span className="time-highlight">{formatTime(weatherData.sys.sunset || 1719164520)}</span>
                </div>
              </div>
            </div>

            {/* كارت 4: Humidity */}
            <div className="highlight-card transition-card">
              <div className="card-header-with-icon">
                <p className="card-label">Humidity</p>
                <svg className="card-icon-colored pulse-drop" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <h3 className="card-value text-blue">{weatherData.main.humidity}<span className="value-unit">%</span></h3>
              <p className="card-sub-value">{weatherData.main.humidity > 60 ? 'High Moisture 🌧️' : 'Optimal Quality 👍'}</p>
            </div>

            {/* كارت 5: Visibility */}
            <div className="highlight-card transition-card">
              <div className="card-header-with-icon">
                <p className="card-label">Visibility</p>
                <svg className="card-icon-colored pulse-eye" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </div>
              <h3 className="card-value text-gold">{(weatherData.visibility / 1000).toFixed(1)} <span className="value-unit">km</span></h3>
              <p className="card-sub-value">Atmospheric Clearness</p>
            </div>

            {/* كارت 6: UV Radiation */}
            <div className="highlight-card">
              <div className="card-header-with-icon">
                <p className="card-label">UV Radiation</p>
              </div>
              
              <div className="uv-gauge-container">
                <div className="uv-gauge">
                  <span className="gauge-number">{weatherData.uv || 5}</span>
                </div>
              </div>
              
              <p className="card-sub-value">Moderate UV Level ☀️</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Weather;