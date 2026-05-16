type SearchHistoryProps = {
  history: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
};

export default function SearchHistory({
  history,
  onSelect,
  onClear,
}: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-3">
      <div className="flex justify-between items-center mb-2">
        <p className="text-slate-500 text-xs uppercase tracking-wider">
          Recent searches
        </p>
        <button
          onClick={onClear}
          className="text-slate-600 hover:text-red-400 text-xs transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full hover:border-blue-500 hover:text-white transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
