interface FilterBarProps {
  showBuses: boolean;
  showTrains: boolean;
  onToggleBuses: () => void;
  onToggleTrains: () => void;
  busCount: number;
  trainCount: number;
  totalCount: number;
}

export function FilterBar({
  showBuses,
  showTrains,
  onToggleBuses,
  onToggleTrains,
  busCount,
  trainCount,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border-b">
      <button
        onClick={onToggleBuses}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          showBuses ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}
        aria-label="Buses"
      >
        Buses <span className="font-bold">{busCount}</span>
      </button>
      <button
        onClick={onToggleTrains}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          showTrains ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
        }`}
        aria-label="Trains"
      >
        Trains <span className="font-bold">{trainCount}</span>
      </button>
      <span className="ml-auto text-sm text-gray-500">
        {totalCount} vehicles
      </span>
    </div>
  );
}
