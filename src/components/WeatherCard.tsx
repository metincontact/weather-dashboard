import type { CurrentWeather } from "../types";

type WeatherCardProps = {
  weather: CurrentWeather;
};

function WeatherCard({ weather }: WeatherCardProps) {
  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-white text-2xl font-bold">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-slate-400 capitalize">
            {weather.weather[0].description}
          </p>
        </div>
        <img src={icon} alt="weather icon" className="w-16 h-16" />
      </div>

      <p className="text-white text-6xl font-bold mb-6">
        {Math.round(weather.main.temp)}°C
      </p>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-700 rounded-xl p-3">
          <p className="text-slate-400 text-xs mb-1">Feels like</p>
          <p className="text-white font-semibold">
            {Math.round(weather.main.feels_like)}°C
          </p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3">
          <p className="text-slate-400 text-xs mb-1">Humidity</p>
          <p className="text-white font-semibold">{weather.main.humidity}%</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3">
          <p className="text-slate-400 text-xs mb-1">Wind</p>
          <p className="text-white font-semibold">{weather.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
