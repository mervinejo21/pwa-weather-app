import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );
  const [unit, setUnit] = useState(localStorage.getItem("unit") || "C");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  const saveRecentSearch = (city) => {
    const updatedSearches = [
      city,
      ...recentSearches.filter((c) => c !== city),
    ].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const fetchData = async (e) => {
    if (e.key === "Enter") {
      try {
        setLoading(true);
        await delay(2000);
        const data = await fetchWeather(cityName);
        setWeatherData(data);
        saveRecentSearch(cityName);
        setCityName("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchFromRecent = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (error) {
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  const getTemperature = () => {
    if (!weatherData) return null;
    return unit === "C"
      ? `${weatherData.current.temp_c} °C`
      : `${weatherData.current.temp_f} °F`;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />
      {loading && <p>Loading...</p>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <p style={{ margin: 0, fontSize: "18px" }}>
              Temperature: {getTemperature()}
            </p>
            <button
              onClick={toggleUnit}
              style={{ padding: "10px", fontSize: "16px" }}
            >
              Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
            </button>
          </div>

          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity}</p>
          <p>Pressure: {weatherData.current.pressure_mb}</p>
          <p>Visibility: {weatherData.current.vis_km}</p>
        </div>
      )}
      <div>
        <h3>Recent Searches</h3>
        <ul>
          {recentSearches.map((city, index) => (
            <li
              key={index}
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => fetchFromRecent(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
