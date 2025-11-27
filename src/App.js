import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';

const API_KEY = '1627cf47ee8dabdaa87d08bb5cfbddaf';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Toronto');

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.cod === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error(data.message || 'City not found');
        }
      }
      
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const handleSearch = (searchCity) => {
    setCity(searchCity);
    fetchWeatherData(searchCity);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>🌤️ Weather Forecast</h1>
          <p>Get real-time weather information for any city</p>
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {weatherData && !loading && (
          <WeatherCard data={weatherData} />
        )}

        {!weatherData && !loading && !error && (
          <div className="no-data">
            <p>Enter a city name to get weather information</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;