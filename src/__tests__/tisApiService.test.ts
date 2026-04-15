import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { tisApiService } from '@/services/tisApiService';
import type { VehicleTripResponse, RouteDirectionResponse } from '@/types/tis';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('tisApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllVehicles', () => {
    it('fetches all vehicles from /api/v1/vehicles', async () => {
      const mockResponse: VehicleTripResponse = {
        vehicle_trip: [
          {
            vehicle_id: '1001',
            vehicle_label: '1001',
            vehicle_lat: 39.75,
            vehicle_lon: -104.99,
            bearing: 180,
            direction_id: 0,
            direction_name: 'S-Bound',
            trip_status: 'IN_TRANSIT',
            trip_id: 'trip-1',
            shape_id: null,
            route_id: 'route-15',
            agency_id: 'RTD',
            route_short_name: '15',
            route_long_name: 'East Colfax',
            route_type: 3,
            route_type_name: 'Bus',
            route_classification_id: null,
            route_classification_name: null,
            service_date: '2026-04-15',
            trip_headsign: 'Downtown',
            location_timestamp: '1713200000',
            occupancy_status: 'MANY_SEATS_AVAILABLE',
            prev_stop: null,
            curr_stop: null,
            next_stop: null,
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await tisApiService.getAllVehicles();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/vehicles');
      expect(result.vehicle_trip).toHaveLength(1);
      expect(result.vehicle_trip[0].vehicle_id).toBe('1001');
      expect(result.vehicle_trip[0].route_type).toBe(3);
    });

    it('throws on network error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(tisApiService.getAllVehicles()).rejects.toThrow('Network Error');
    });
  });

  describe('getVehiclesByType', () => {
    it('fetches vehicles by type from /api/v1/vehicles/type/{type}', async () => {
      const mockResponse: VehicleTripResponse = {
        vehicle_trip: [
          {
            vehicle_id: 'LR-101',
            vehicle_label: 'LR-101',
            vehicle_lat: 39.76,
            vehicle_lon: -105.0,
            bearing: 90,
            direction_id: 1,
            direction_name: 'E-Bound',
            trip_status: 'IN_TRANSIT',
            trip_id: 'trip-a',
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
            trip_headsign: 'Union Station',
            location_timestamp: '1713200000',
            occupancy_status: null,
            prev_stop: null,
            curr_stop: null,
            next_stop: null,
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await tisApiService.getVehiclesByType('LIGHT_RAIL');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/vehicles/type/LIGHT_RAIL');
      expect(result.vehicle_trip).toHaveLength(1);
      expect(result.vehicle_trip[0].route_type).toBe(0);
    });
  });

  describe('getRoutes', () => {
    it('fetches all routes from /api/v1/routes', async () => {
      const mockResponse: RouteDirectionResponse = {
        route_direction: [
          {
            route: {
              route_id: 'A',
              route_short_name: 'A',
              route_long_name: 'A Line',
              route_color: '0066CC',
              route_text_color: 'FFFFFF',
              route_type: 0,
              route_type_name: 'Light Rail',
              route_classification_id: null,
              route_classification_name: null,
              agency_id: 'RTD',
              service_date: null,
            },
            direction: [
              { direction_id: 0, direction_name: 'N-Bound' },
              { direction_id: 1, direction_name: 'S-Bound' },
            ],
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await tisApiService.getRoutes();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/routes');
      expect(result.route_direction).toHaveLength(1);
      expect(result.route_direction[0].route.route_short_name).toBe('A');
    });
  });

  describe('getRouteVehicles', () => {
    it('fetches vehicles for a specific route', async () => {
      const mockResponse = {
        vehicle_route: {
          vehicle_trip: [],
          route: {
            route_id: '15',
            route_short_name: '15',
            route_long_name: 'East Colfax',
            route_color: null,
            route_text_color: null,
            route_type: 3,
            route_type_name: 'Bus',
            route_classification_id: null,
            route_classification_name: null,
            agency_id: 'RTD',
            service_date: null,
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await tisApiService.getRouteVehicles('15');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/routes/15/vehicles');
      expect(result.vehicle_route.route.route_short_name).toBe('15');
    });
  });
});
