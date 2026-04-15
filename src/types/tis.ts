// TIS Next Gen API Types - matching transit-service-api contracts

export interface StopInfo {
  stop_id: string;
  stop_name: string;
  stop_lat: number | null;
  stop_lon: number | null;
  location_type: number | null;
  parent_station: string | null;
  parent_stop_name: string | null;
}

export interface VehicleTrip {
  vehicle_id: string;
  vehicle_label: string;
  vehicle_lat: number;
  vehicle_lon: number;
  bearing: number | null;
  direction_id: number | null;
  direction_name: string | null;
  trip_status: string | null;
  trip_id: string | null;
  shape_id: number | null;
  route_id: string | null;
  agency_id: string | null;
  route_short_name: string | null;
  route_long_name: string | null;
  route_type: number | null;
  route_type_name: string | null;
  route_classification_id: number | null;
  route_classification_name: string | null;
  service_date: string | null;
  trip_headsign: string | null;
  location_timestamp: string | null;
  occupancy_status: string | null;
  prev_stop: StopInfo | null;
  curr_stop: StopInfo | null;
  next_stop: StopInfo | null;
}

export interface VehicleTripResponse {
  vehicle_trip: VehicleTrip[];
}

export interface RouteDirection {
  route: RouteDto;
  direction: DirectionDto[];
}

export interface RouteDto {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
  route_color: string | null;
  route_text_color: string | null;
  route_type: number;
  route_type_name: string | null;
  route_classification_id: number | null;
  route_classification_name: string | null;
  agency_id: string | null;
  service_date: string | null;
}

export interface DirectionDto {
  direction_id: number;
  direction_name: string;
}

export interface RouteDirectionResponse {
  route_direction: RouteDirection[];
}

// Convenience helpers

export const ROUTE_TYPE = {
  LIGHT_RAIL: 0,
  BUS: 3,
} as const;

export function isBus(vehicle: VehicleTrip): boolean {
  return vehicle.route_type === ROUTE_TYPE.BUS;
}

export function isTrain(vehicle: VehicleTrip): boolean {
  return vehicle.route_type === ROUTE_TYPE.LIGHT_RAIL;
}
