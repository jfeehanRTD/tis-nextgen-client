import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleList } from '@/components/VehicleList';
import type { VehicleTrip } from '@/types/tis';

const mockBus: VehicleTrip = {
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
  curr_stop: null,
  next_stop: null,
};

const mockTrain: VehicleTrip = {
  vehicle_id: 'LR-200',
  vehicle_label: 'LR-200',
  vehicle_lat: 39.76,
  vehicle_lon: -105.01,
  bearing: 45,
  direction_id: 1,
  direction_name: 'NE-Bound',
  trip_status: 'STOPPED_AT',
  trip_id: 'trip-rail',
  shape_id: null,
  route_id: 'A',
  agency_id: 'RTD',
  route_short_name: 'A',
  route_long_name: 'A Line',
  route_type: 0,
  route_type_name: 'Light Rail',
  route_classification_id: null,
  route_classification_name: null,
  service_date: '2026-04-15',
  trip_headsign: 'DIA',
  location_timestamp: '1713200000',
  occupancy_status: null,
  prev_stop: null,
  curr_stop: null,
  next_stop: null,
};

describe('VehicleList', () => {
  it('renders a list of vehicles', () => {
    render(<VehicleList vehicles={[mockBus, mockTrain]} onSelect={vi.fn()} />);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows route name and headsign', () => {
    render(<VehicleList vehicles={[mockBus]} onSelect={vi.fn()} />);

    expect(screen.getByText('East Colfax')).toBeInTheDocument();
    expect(screen.getByText('Civic Center')).toBeInTheDocument();
  });

  it('shows vehicle type badge', () => {
    render(<VehicleList vehicles={[mockBus, mockTrain]} onSelect={vi.fn()} />);

    expect(screen.getByText('Bus')).toBeInTheDocument();
    expect(screen.getByText('Light Rail')).toBeInTheDocument();
  });

  it('calls onSelect when a vehicle is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<VehicleList vehicles={[mockBus]} onSelect={onSelect} />);

    await user.click(screen.getByText('15'));

    expect(onSelect).toHaveBeenCalledWith(mockBus);
  });

  it('shows empty state when no vehicles', () => {
    render(<VehicleList vehicles={[]} onSelect={vi.fn()} />);

    expect(screen.getByText(/no active vehicles/i)).toBeInTheDocument();
  });

  it('highlights selected vehicle', () => {
    render(
      <VehicleList
        vehicles={[mockBus, mockTrain]}
        onSelect={vi.fn()}
        selectedId="BUS-100"
      />
    );

    const selectedItem = screen.getByTestId('vehicle-item-BUS-100');
    expect(selectedItem).toHaveClass('ring-2');
  });
});
