import axios from 'axios';
import type {
  VehicleTripResponse,
  RouteDirectionResponse,
} from '@/types/tis';

export interface VehicleRouteResponse {
  vehicle_route: {
    vehicle_trip: import('@/types/tis').VehicleTrip[];
    route: import('@/types/tis').RouteDto;
  };
}

export const tisApiService = {
  async getAllVehicles(): Promise<VehicleTripResponse> {
    const { data } = await axios.get<VehicleTripResponse>('/api/v1/vehicles');
    return data;
  },

  async getVehiclesByType(type: string): Promise<VehicleTripResponse> {
    const { data } = await axios.get<VehicleTripResponse>(`/api/v1/vehicles/type/${type}`);
    return data;
  },

  async getRoutes(): Promise<RouteDirectionResponse> {
    const { data } = await axios.get<RouteDirectionResponse>('/api/v1/routes');
    return data;
  },

  async getRouteVehicles(routeId: string): Promise<VehicleRouteResponse> {
    const { data } = await axios.get<VehicleRouteResponse>(`/api/v1/routes/${routeId}/vehicles`);
    return data;
  },
};
