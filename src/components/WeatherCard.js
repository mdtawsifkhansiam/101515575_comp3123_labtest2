import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ data }) => {
  const {
    name,
    sys: { country },
    weather,
    main: { temp, feels_like, humidity, pressure, temp_min, temp_max },
    wind: { speed, deg },
    visibility,
    dt
  } = data;

  const weatherInfo = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`;
  
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackgroundGradient = (weatherId, isDay = true) => {
    // Check if it's day or night based on current time
    const currentHour = new Date().getHours();
    isDay = currentHour >= 6 && currentHour < 18;
    
    // Weather-based backgrounds with proper contrast for white text
    if (weatherId >= 200 && weatherId < 300) {
      return 'linear-gradient(135deg, #2d3748, #4a5568)'; // Dark gray for thunderstorms
    }
    if (weatherId >= 300 && weatherId < 400) {
      return 'linear-gradient(135deg, #4c51bf, #667eea)'; // Blue for drizzle
    }
    if (weatherId >= 500 && weatherId < 600) {
      return 'linear-gradient(135deg, #2b6cb0, #3182ce)'; // Dark blue for rain
    }
    if (weatherId >= 600 && weatherId < 700) {
      return 'linear-gradient(135deg, #2d3748, #4a5568)'; // Dark gray for snow (FIXED)
    }
    if (weatherId >= 700 && weatherId < 800) {
      return 'linear-gradient(135deg, #4a5568, #718096)'; // Gray for atmosphere
    }
    if (weatherId === 800) {
      return isDay 
        ? 'linear-gradient(135deg, #f6ad55, #fc8181)'  // Warm colors for clear day
        : 'linear-gradient(135deg, #2d3748, #4c51bf)'; // Dark blue for clear night
    }
    // Clouds
    return isDay 
      ? 'linear-gradient(135deg, #90cdf4, #63b3ed)'    // Light blue for cloudy day
      : 'linear-gradient(135deg, #4a5568, #2d3748)';   // Dark gray for cloudy night
  };

  const getTextColor = (weatherId) => {
    // Return appropriate text color based on background
    if (weatherId >= 600 && weatherId < 700) return '#ffffff'; // White text for snow
    if (weatherId >= 200 && weatherId < 300) return '#ffffff'; // White text for thunderstorms
    if (weatherId >= 700 && weatherId < 800) return '#ffffff'; // White text for atmosphere
    return '#ffffff'; // Default white text for good contrast
  };

  const textColor = getTextColor(weatherInfo.id);
  const backgroundGradient = getBackgroundGradient(weatherInfo.id);

  return (
    <div className="weather-app">
      <div className="weather-grid">
        {/* Main Weather Card */}
        <div 
          className="main-weather-card" 
          style={{
            background: backgroundGradient,
            color: textColor
          }}
        >
          <div className="card-header">
            <div className="location-info">
              <h2 style={{color: textColor}}>{name}, {country}</h2>
              <p className="current-date" style={{color: textColor}}>{formatDate(dt)}</p>
            </div>
            <div className="update-time" style={{color: textColor}}>
              Updated: {formatTime(dt)}
            </div>
          </div>

          <div className="weather-hero">
            <div className="weather-icon-section">
              <div className="weather-icon-container">
                <img src={iconUrl} alt={weatherInfo.description} className="weather-icon" />
              </div>
            </div>
            
            <div className="temperature-section">
              <div className="current-temperature">
                <span className="temp-value" style={{color: textColor}}>{Math.round(temp)}</span>
                <span className="temp-unit" style={{color: textColor}}>°C</span>
              </div>
              <div className="weather-status">
                <h3 className="weather-condition" style={{color: textColor}}>{weatherInfo.main}</h3>
                <p className="weather-description" style={{color: textColor}}>{weatherInfo.description}</p>
                <div className="feels-like" style={{color: textColor}}>
                  Feels like {Math.round(feels_like)}°C
                </div>
              </div>
            </div>
          </div>

          <div className="weather-highlights">
            <div className="highlight-item">
              <div className="highlight-icon">🌡️</div>
              <div className="highlight-content">
                <span className="highlight-label" style={{color: textColor}}>Min/Max</span>
                <span className="highlight-value" style={{color: textColor}}>{Math.round(temp_min)}° / {Math.round(temp_max)}°</span>
              </div>
            </div>
            
            <div className="highlight-item">
              <div className="highlight-icon">💨</div>
              <div className="highlight-content">
                <span className="highlight-label" style={{color: textColor}}>Wind</span>
                <span className="highlight-value" style={{color: textColor}}>{speed} m/s {getWindDirection(deg)}</span>
              </div>
            </div>
            
            <div className="highlight-item">
              <div className="highlight-icon">💧</div>
              <div className="highlight-content">
                <span className="highlight-label" style={{color: textColor}}>Humidity</span>
                <span className="highlight-value" style={{color: textColor}}>{humidity}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="details-panel">
          <div className="panel-header">
            <h3>Weather Details</h3>
            <div className="weather-badge">{weatherInfo.main}</div>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon">🌡️</div>
              <div className="detail-info">
                <span className="detail-label">Temperature</span>
                <span className="detail-value">{Math.round(temp)}°C</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🤔</div>
              <div className="detail-info">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{Math.round(feels_like)}°C</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">📊</div>
              <div className="detail-info">
                <span className="detail-label">Min / Max</span>
                <span className="detail-value">{Math.round(temp_min)}° / {Math.round(temp_max)}°</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">💨</div>
              <div className="detail-info">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{speed} m/s</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🧭</div>
              <div className="detail-info">
                <span className="detail-label">Wind Direction</span>
                <span className="detail-value">{getWindDirection(deg)}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">💧</div>
              <div className="detail-info">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{humidity}%</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🔽</div>
              <div className="detail-info">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{pressure} hPa</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">👁️</div>
              <div className="detail-info">
                <span className="detail-label">Visibility</span>
                <span className="detail-value">{visibility / 1000} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;