import type { VehicleTrip } from '@/types/tis';

interface VehicleListProps {
  vehicles: VehicleTrip[];
  onSelect: (vehicle: VehicleTrip) => void;
  selectedId?: string;
}

export function VehicleList({ vehicles, onSelect, selectedId }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No active vehicles
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {vehicles.map((vehicle) => {
        const isSelected = vehicle.vehicle_id === selectedId;
        return (
          <li
            key={vehicle.vehicle_id}
            data-testid={`vehicle-item-${vehicle.vehicle_id}`}
            className={`p-3 cursor-pointer hover:bg-gray-50 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            onClick={() => onSelect(vehicle)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{vehicle.route_short_name}</span>
                <span className="text-sm text-gray-500">{vehicle.route_long_name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                vehicle.route_type === 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {vehicle.route_type_name || (vehicle.route_type === 0 ? 'Light Rail' : 'Bus')}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {vehicle.trip_headsign}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
