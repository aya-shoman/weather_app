import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getForecastData } from '../../services/weatherapi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './forcast.css';

const Forecast = () => {
  const [searchParams] = useSearchParams();
  const cityQuery = searchParams.get('city') || 'Cairo';

  const [forecastList, setForecastList] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [cityName, setCityName] = useState(cityQuery);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchForecast = async () => {
      try {
        setLoading(true);
        const data = await getForecastData(cityQuery.trim());
        setCityName(data.city.name);
        
        const hourlyData = data.list.slice(0, 8).map(item => ({
          time: new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
        }));
        setChartData(hourlyData);
        setForecastList(data.list.filter((item) => item.dt_txt.includes("12:00:00")));
      } catch (err) {
        setForecastList([{ dt: 1, dt_txt: "2026-06-25 12:00:00", main: { temp: 34, humidity: 40, visibility: 10000 }, weather: [{ main: "Clear", description: "Clear Sky" }] }]);
        setChartData([{ time: "12 PM", temp: 32 }]);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [cityQuery]);

  const getDayName = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' });

  if (loading) return <div className="loader-screen">Loading...</div>;

  return (
    <div className="forecast-page-wrapper">
      <div className="forecast-header-nav">
        <Link to={`/weather?city=${cityQuery}`} className="back-to-dash-btn">← Back</Link>
        <h1>{cityName} 5-Day Forecast</h1>
      </div>

      <div className="forecast-cards-grid">
        {forecastList.map((day) => (
          <div key={day.dt} className="forecast-card-item">
            <div className="card-header">
              <span className="day-text">{getDayName(day.dt_txt)}</span>
              <span className="weather-icon">{day.weather[0].main === 'Clear' ? '☀️' : '☁️'}</span>
            </div>
            <h2 className="card-temp">{Math.round(day.main.temp)}°C</h2>
            <p className="card-desc">{day.weather[0].description}</p>
            <div className="card-details">
              <div className="detail-item"><span>💧</span> {day.main.humidity}%</div>
              <div className="detail-item"><span>👁️</span> {Math.round((day.visibility || 10000) / 1000)}km</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="chart-title">24-Hour Temperature Trend</h3>
      <div className="chart-container-wrapper" style={{ width: '100%', height: 260 }}>
        {isClient && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px' }} />
              <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Forecast;