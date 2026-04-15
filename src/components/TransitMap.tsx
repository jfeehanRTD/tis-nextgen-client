import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import type { VehicleTrip } from '@/types/tis';

import 'leaflet/dist/leaflet.css';

const DENVER_CENTER: [number, number] = [39.7392, -104.9903];
const DEFAULT_ZOOM = 11;

function busIcon() {
  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:#f97316;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;box-shadow:0 1px 3px rgba(0,0,0,0.3);">B</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function trainIcon() {
  return L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:#3b82f6;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;box-shadow:0 1px 3px rgba(0,0,0,0.3);">T</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({ vehicles }: { vehicles: VehicleTrip[] }) {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length === 0) return;
    const bounds = L.latLngBounds(
      vehicles.map((v) => [v.vehicle_lat, v.vehicle_lon] as [number, number])
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [vehicles, map]);

  return null;
}

interface TransitMapProps {
  vehicles: VehicleTrip[];
  selectedId?: string;
  onSelect: (vehicle: VehicleTrip) => void;
}

export function TransitMap({ vehicles, selectedId, onSelect }: TransitMapProps) {
  return (
    <MapContainer
      center={DENVER_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds vehicles={vehicles} />
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.vehicle_id}
          position={[vehicle.vehicle_lat, vehicle.vehicle_lon]}
          icon={vehicle.route_type === 0 ? trainIcon() : busIcon()}
          eventHandlers={{
            click: () => onSelect(vehicle),
          }}
          opacity={selectedId && selectedId !== vehicle.vehicle_id ? 0.5 : 1}
        >
          <Popup>
            <div className="text-sm">
              <strong>{vehicle.route_short_name}</strong> {vehicle.route_long_name}
              <br />
              {vehicle.trip_headsign}
              <br />
              <span className="text-gray-500">{vehicle.vehicle_label}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
