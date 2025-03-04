import Loading from "../../styles/loader/Loading";
import "./WeatherModal.css";

function WeatherModal({ weatherData, onClose, weatherError, loading }) {
  if (loading) {
    return <Loading />;
  }

  if (weatherError) {
    return (
      <div className="weather-modal-overlay">
        <div className="weather-modal">
          <div className="weather-modal-header">
            <h2>Weather Error</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="weather-modal-body">
            <p className="error-message">{weatherError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-modal-overlay">
        <div className="weather-modal">
          <div className="weather-modal-header">
            <h2>Weather Data Not Found</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="weather-modal-body">
            <p className="error-message">No weather data available.</p>
          </div>
        </div>
      </div>
    );
  }

  // Defensive checks
  if (
    !weatherData.weather ||
    !Array.isArray(weatherData.weather) ||
    weatherData.weather.length === 0 ||
    !weatherData.main ||
    !weatherData.wind
  ) {
    return (
      <div className="weather-modal-overlay">
        <div className="weather-modal">
          <div className="weather-modal-header">
            <h2>Weather Data Error</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="weather-modal-body">
            <p className="error-message">Invalid or incomplete weather data.</p>
          </div>
        </div>
      </div>
    );
  }

  const weather = weatherData.weather[0];

  return (
    <div className="weather-modal-overlay">
      <div className="weather-modal">
        <div className="weather-modal-header">
          <h2>Current Weather in {weatherData.name}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="weather-modal-body">
          <div className="weather-details">
            <div className="weather-info">
              <p>
                <strong>Temperature:</strong>{" "}
                <span className="weather-value">
                  {(weatherData.main.temp - 273.15).toFixed(1)}°C
                </span>
              </p>
              <p>
                <strong>Feels Like:</strong>{" "}
                <span className="weather-value">
                  {(weatherData.main.feels_like - 273.15).toFixed(1)}°C
                </span>
              </p>
              <p>
                <strong>Humidity:</strong>{" "}
                <span className="weather-value">
                  {weatherData.main.humidity}%
                </span>
              </p>
              <p>
                <strong>Wind Speed:</strong>{" "}
                <span className="weather-value">
                  {weatherData.wind.speed} m/s
                </span>
              </p>
              <p>
                <strong>Condition:</strong>{" "}
                <span className="weather-value">{weather.description}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherModal;
