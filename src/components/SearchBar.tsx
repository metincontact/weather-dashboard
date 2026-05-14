import { useState } from "react";

type SearchBarProps = {
  onSearch: (city: string) => void;
};

function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (!city.trim()) return;
    onSearch(city);
    setCity("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
