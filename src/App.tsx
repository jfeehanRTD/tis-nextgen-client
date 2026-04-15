import { useState, useCallback } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { TransitMap } from '@/components/TransitMap';
import { VehicleList } from '@/components/VehicleList';
import { VehicleDetail } from '@/components/VehicleDetail';
import { FilterBar } from '@/components/FilterBar';
import { RefreshCw } from 'lucide-react';
import type { VehicleTrip } from '@/types/tis';

export default function App() {
  const [showBuses, setShowBuses] = useState(true);
  const [showTrains, setShowTrains] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTrip | null>(null);

  const {
    filteredVehicles,
    busCount,
    trainCount,
    totalCount,
    loading,
    error,
    refresh,
  } = useVehicles({ showBuses, showTrains });

  const handleSelect = useCallback((vehicle: VehicleTrip) => {
    setSelectedVehicle((prev) =>
      prev?.vehicle_id === vehicle.vehicle_id ? null : vehicle
    );
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">TIS Next Gen - Transit Client</h1>
          <p className="text-xs text-gray-500">POC - Real-time vehicle tracking via TIS REST API</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      <FilterBar
        showBuses={showBuses}
        showTrains={showTrains}
        onToggleBuses={() => setShowBuses((v) => !v)}
        onToggleTrains={() => setShowTrains((v) => !v)}
        busCount={busCount}
        trainCount={trainCount}
        totalCount={totalCount}
      />

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-700">
          Failed to fetch vehicles: {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r bg-white overflow-y-auto flex flex-col">
          {selectedVehicle && (
            <div className="border-b p-2">
              <VehicleDetail vehicle={selectedVehicle} />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <VehicleList
              vehicles={filteredVehicles}
              onSelect={handleSelect}
              selectedId={selectedVehicle?.vehicle_id}
            />
          </div>
        </div>

        <div className="flex-1">
          <TransitMap
            vehicles={filteredVehicles}
            selectedId={selectedVehicle?.vehicle_id}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}
