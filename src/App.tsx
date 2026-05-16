import { useState } from "react";
import type { CurrentWeather, Forecast } from "./types";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastChart from "./components/ForecastChart";
import HotColdCities from "./components/HotColdCities";
import SearchHistory from "./components/SearchHistory";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("search-history");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchWeather = async (city: string) => {
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

      // Search history güncelle
      setHistory((prev) => {
        const updated = [city, ...prev.filter((c) => c !== city)].slice(0, 5);
        localStorage.setItem("search-history", JSON.stringify(updated));
        return updated;
      });
    } catch {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => fetchWeather(city);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
          );
          const weatherData = await weatherRes.json();

          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
          );
          const forecastData = await forecastRes.json();

          setWeather(weatherData);
          setForecast(forecastData);
        } catch {
          setError("Could not get weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied.");
        setLoading(false);
      },
    );
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("search-history");
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
      <p className="text-slate-400 mb-8">Get real-time weather for any city</p>

      <SearchBar onSearch={handleSearch} />

      <button
        onClick={handleLocation}
        className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
      >
        📍 Use my location
      </button>

      <SearchHistory
        history={history}
        onSelect={handleSearch}
        onClear={clearHistory}
      />

      {loading && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Fetching weather...</p>
        </div>
      )}

      {error && <p className="mt-8 text-red-400">{error}</p>}

      {weather && !loading && (
        <div className="mt-8 flex flex-col items-center w-full">
          <button
            onClick={() => {
              setWeather(null);
              setForecast(null);
            }}
            className="mb-6 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <WeatherCard weather={weather} />
          {forecast && <ForecastChart forecast={forecast} />}
        </div>
      )}

      {!weather && !loading && <HotColdCities onSelect={handleSearch} />}
    </div>
  );
}
