import { useState } from "react";
import type { CurrentWeather, Forecast } from "./types";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastChart from "./components/ForecastChart";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError("");

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!weatherRes.ok) throw new Error("City not found");
      const weatherData = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
    } catch {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
      <p className="text-slate-400 mb-8">Get real-time weather for any city</p>

      <SearchBar onSearch={handleSearch} />

      {loading && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Fetching weather...</p>
        </div>
      )}

      {error && <p className="mt-8 text-red-400">{error}</p>}

      {weather && !loading && (
        <div className="mt-8 flex flex-col items-center w-full">
          <WeatherCard weather={weather} />
          {forecast && <ForecastChart forecast={forecast} />}
        </div>
      )}
    </div>
  );
}

export default App;
