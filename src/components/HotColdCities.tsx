import type { CurrentWeather } from "../types";

const HOT_CITIES = ["Dubai", "Phoenix", "Riyadh", "Cairo", "Bangkok"];
const COLD_CITIES = [
  "Yakutsk",
  "Reykjavik",
  "Fairbanks",
  "Murmansk",
  "Ulaanbaatar",
];

type CityWeather = {
  name: string;
  temp: number;
  country: string;
};

type HotColdCitiesProps = {
  onSelect: (city: string) => void;
};

async function fetchCityTemp(
  city: string,
  apiKey: string,
): Promise<CityWeather | null> {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );
    if (!res.ok) return null;
    const data: CurrentWeather = await res.json();
    return {
      name: data.name,
      temp: Math.round(data.main.temp),
      country: data.sys.country,
    };
  } catch {
    return null;
  }
}

import { useEffect, useState } from "react";

export default function HotColdCities({ onSelect }: HotColdCitiesProps) {
  const [hotData, setHotData] = useState<CityWeather[]>([]);
  const [coldData, setColdData] = useState<CityWeather[]>([]);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    Promise.all(HOT_CITIES.map((c) => fetchCityTemp(c, apiKey))).then(
      (results) => {
        const filtered = results.filter(Boolean) as CityWeather[];
        setHotData(filtered.sort((a, b) => b.temp - a.temp));
      },
    );
    Promise.all(COLD_CITIES.map((c) => fetchCityTemp(c, apiKey))).then(
      (results) => {
        const filtered = results.filter(Boolean) as CityWeather[];
        setColdData(filtered.sort((a, b) => a.temp - b.temp));
      },
    );
  }, []);

  const CityList = ({
    cities,
    color,
  }: {
    cities: CityWeather[];
    color: string;
  }) => (
    <div className="flex flex-col gap-2">
      {cities.map((city) => (
        <button
          key={city.name}
          onClick={() => onSelect(city.name)}
          className="flex justify-between items-center bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 hover:border-blue-500 transition-colors"
        >
          <span className="text-white text-sm">
            {city.name}, {city.country}
          </span>
          <span className={`font-bold text-sm ${color}`}>{city.temp}°C</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-md mt-8">
      <div>
        <h3 className="text-orange-400 font-semibold text-sm mb-3">
          🔥 Hottest Cities
        </h3>
        <CityList cities={hotData} color="text-orange-400" />
      </div>
      <div>
        <h3 className="text-blue-400 font-semibold text-sm mb-3">
          ❄️ Coldest Cities
        </h3>
        <CityList cities={coldData} color="text-blue-400" />
      </div>
    </div>
  );
}
