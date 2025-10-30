import { useState } from "react";
import "../styles/weather.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const units = import.meta.env.VITE_UNITS;

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeatherData = async () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const url = `${baseUrl}/weather?q=${city}&appid=${apiKey}&units=${units}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "City not found");
        setWeatherData(null);
        return; // ✅ stop here
      }

      setWeatherData(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="weather-container">
    <h1>🌤️ Weather App</h1>
  
    <input
      type="text"
      value={city}
      placeholder="Enter City..."
      onChange={handleCity}
    />
    <button onClick={fetchWeatherData}>Find Weather</button>
  
    {loading && (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    )}
  
    {error && <p className="error">{error}</p>}
  
    {weatherData && (
      <div className="weather-info">
        <h2>
          {weatherData.name}, {weatherData.sys?.country}
        </h2>
        <p>{Math.round(weatherData.main.temp)}°C</p>
        <p>{weatherData.weather[0].description}</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
        <p>Wind: {weatherData.wind.speed} m/s</p>
      </div>
    )}
  </div>
  
  );
};

export default Weather;
