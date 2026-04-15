import { describe, it, expect } from 'vitest';
import { isBus, isTrain, ROUTE_TYPE } from '@/types/tis';
import type { VehicleTrip } from '@/types/tis';

function makeVehicle(overrides: Partial<VehicleTrip> = {}): VehicleTrip {
  return {
    vehicle_id: '1234',
    vehicle_label: '1234',
    vehicle_lat: 39.7392,
    vehicle_lon: -104.9903,
    bearing: null,
    direction_id: null,
    direction_name: null,
    trip_status: null,
    trip_id: null,
    shape_id: null,
    route_id: null,
    agency_id: null,
    route_short_name: null,
    route_long_name: null,
    route_type: null,
    route_type_name: null,
    route_classification_id: null,
    route_classification_name: null,
    service_date: null,
    trip_headsign: null,
    location_timestamp: null,
    occupancy_status: null,
    prev_stop: null,
    curr_stop: null,
    next_stop: null,
    ...overrides,
  };
}

describe('type helpers', () => {
  it('isBus returns true for route_type 3', () => {
    expect(isBus(makeVehicle({ route_type: ROUTE_TYPE.BUS }))).toBe(true);
  });

  it('isBus returns false for light rail', () => {
    expect(isBus(makeVehicle({ route_type: ROUTE_TYPE.LIGHT_RAIL }))).toBe(false);
  });

  it('isTrain returns true for route_type 0', () => {
    expect(isTrain(makeVehicle({ route_type: ROUTE_TYPE.LIGHT_RAIL }))).toBe(true);
  });

  it('isTrain returns false for bus', () => {
    expect(isTrain(makeVehicle({ route_type: ROUTE_TYPE.BUS }))).toBe(false);
  });
});
