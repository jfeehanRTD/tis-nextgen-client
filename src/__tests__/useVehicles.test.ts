import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useVehicles } from '@/hooks/useVehicles';
import { tisApiService } from '@/services/tisApiService';
import type { VehicleTripResponse } from '@/types/tis';

vi.mock('@/services/tisApiService');

const mockVehicles: VehicleTripResponse = {
  vehicle_trip: [
    {
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
    },
    {
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
    },
  ],
};

describe('useVehicles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches vehicles on mount', async () => {
    vi.mocked(tisApiService.getAllVehicles).mockResolvedValue(mockVehicles);

    const { result } = renderHook(() => useVehicles());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('separates buses and trains', async () => {
    vi.mocked(tisApiService.getAllVehicles).mockResolvedValue(mockVehicles);

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.buses).toHaveLength(1);
    expect(result.current.buses[0].vehicle_id).toBe('BUS-100');
    expect(result.current.trains).toHaveLength(1);
    expect(result.current.trains[0].vehicle_id).toBe('LR-200');
  });

  it('provides vehicle counts', async () => {
    vi.mocked(tisApiService.getAllVehicles).mockResolvedValue(mockVehicles);

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalCount).toBe(2);
    expect(result.current.busCount).toBe(1);
    expect(result.current.trainCount).toBe(1);
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(tisApiService.getAllVehicles).mockRejectedValue(new Error('Server down'));

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Server down');
    expect(result.current.vehicles).toHaveLength(0);
  });

  it('supports manual refresh', async () => {
    vi.mocked(tisApiService.getAllVehicles).mockResolvedValue(mockVehicles);

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(tisApiService.getAllVehicles).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(tisApiService.getAllVehicles).toHaveBeenCalledTimes(2);
    });
  });

  it('supports filtering by showBuses/showTrains', async () => {
    vi.mocked(tisApiService.getAllVehicles).mockResolvedValue(mockVehicles);

    const { result } = renderHook(() => useVehicles({ showBuses: true, showTrains: false }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filteredVehicles).toHaveLength(1);
    expect(result.current.filteredVehicles[0].vehicle_id).toBe('BUS-100');
  });
});
