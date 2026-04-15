import type { VehicleTrip } from '@/types/tis';

interface VehicleDetailProps {
  vehicle: VehicleTrip | null;
}

function formatOccupancy(status: string | null): string {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function VehicleDetail({ vehicle }: VehicleDetailProps) {
  if (!vehicle) return null;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">{vehicle.vehicle_label}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          vehicle.route_type === 0
            ? 'bg-blue-100 text-blue-800'
            : 'bg-orange-100 text-orange-800'
        }`}>
          {vehicle.route_type_name || (vehicle.route_type === 0 ? 'Light Rail' : 'Bus')}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-500">Route:</span>{' '}
          {vehicle.route_short_name} - {vehicle.route_long_name}
        </div>
        <div>
          <span className="font-medium text-gray-500">Headsign:</span>{' '}
          {vehicle.trip_headsign}
        </div>
        {vehicle.direction_name && (
          <div>
            <span className="font-medium text-gray-500">Direction:</span>{' '}
            {vehicle.direction_name}
          </div>
        )}
        {vehicle.trip_status && (
          <div>
            <span className="font-medium text-gray-500">Status:</span>{' '}
            {vehicle.trip_status}
          </div>
        )}
        {vehicle.occupancy_status && (
          <div>
            <span className="font-medium text-gray-500">Occupancy:</span>{' '}
            {formatOccupancy(vehicle.occupancy_status)}
          </div>
        )}
        {vehicle.curr_stop && (
          <div>
            <span className="font-medium text-gray-500">Current Stop:</span>{' '}
            {vehicle.curr_stop.stop_name}
          </div>
        )}
        {vehicle.next_stop && (
          <div>
            <span className="font-medium text-gray-500">Next Stop:</span>{' '}
            {vehicle.next_stop.stop_name}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-2">
          {vehicle.vehicle_lat?.toFixed(5)}, {vehicle.vehicle_lon?.toFixed(5)}
        </div>
      </div>
    </div>
  );
}
