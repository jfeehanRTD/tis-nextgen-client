import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VehicleDetail } from '@/components/VehicleDetail';
import type { VehicleTrip } from '@/types/tis';

const mockVehicle: VehicleTrip = {
  vehicle_id: 'BUS-100',
  vehicle_label: 'BUS-100',
  vehicle_lat: 39.74,
  vehicle_lon: -104.98,
  bearing: 270,
  direction_id: 0,
  direction_name: 'W-Bound',
  trip_status: 'IN_TRANSIT',
  trip_id: 'trip-bus',
  shape_id: null,
  route_id: '15',
  agency_id: 'RTD',
  route_short_name: '15',
  route_long_name: 'East Colfax',
  route_type: 3,
  route_type_name: 'Bus',
  route_classification_id: null,
  route_classification_name: null,
  service_date: '2026-04-15',
  trip_headsign: 'Civic Center',
  location_timestamp: '1713200000',
  occupancy_status: 'MANY_SEATS_AVAILABLE',
  prev_stop: null,
  curr_stop: {
    stop_id: 'STOP-1',
    stop_name: 'Colfax & Broadway',
    stop_lat: 39.74,
    stop_lon: -104.98,
    location_type: 0,
    parent_station: null,
    parent_stop_name: null,
  },
  next_stop: {
    stop_id: 'STOP-2',
    stop_name: 'Civic Center Station',
    stop_lat: 39.74,
    stop_lon: -104.99,
    location_type: 0,
    parent_station: null,
    parent_stop_name: null,
  },
};

describe('VehicleDetail', () => {
  it('renders vehicle info', () => {
    render(<VehicleDetail vehicle={mockVehicle} />);

    expect(screen.getByText('BUS-100')).toBeInTheDocument();
    expect(screen.getByText('15 - East Colfax')).toBeInTheDocument();
    expect(screen.getByText('Civic Center')).toBeInTheDocument();
  });

  it('shows direction', () => {
    render(<VehicleDetail vehicle={mockVehicle} />);

    expect(screen.getByText('W-Bound')).toBeInTheDocument();
  });

  it('shows trip status', () => {
    render(<VehicleDetail vehicle={mockVehicle} />);

    expect(screen.getByText('IN_TRANSIT')).toBeInTheDocument();
  });

  it('shows current and next stop', () => {
    render(<VehicleDetail vehicle={mockVehicle} />);

    expect(screen.getByText('Colfax & Broadway')).toBeInTheDocument();
    expect(screen.getByText('Civic Center Station')).toBeInTheDocument();
  });

  it('shows occupancy status', () => {
    render(<VehicleDetail vehicle={mockVehicle} />);

    expect(screen.getByText(/many seats/i)).toBeInTheDocument();
  });

  it('renders null when no vehicle selected', () => {
    const { container } = render(<VehicleDetail vehicle={null} />);

    expect(container.firstChild).toBeNull();
  });
});
