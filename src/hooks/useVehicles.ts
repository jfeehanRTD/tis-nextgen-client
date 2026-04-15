import { useState, useEffect, useCallback, useMemo } from 'react';
import { tisApiService } from '@/services/tisApiService';
import { isBus, isTrain } from '@/types/tis';
import type { VehicleTrip } from '@/types/tis';

export interface VehicleFilters {
  showBuses?: boolean;
  showTrains?: boolean;
}

export interface UseVehiclesResult {
  vehicles: VehicleTrip[];
  buses: VehicleTrip[];
  trains: VehicleTrip[];
  filteredVehicles: VehicleTrip[];
  totalCount: number;
  busCount: number;
  trainCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useVehicles(filters?: VehicleFilters): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<VehicleTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tisApiService.getAllVehicles();
      setVehicles(response.vehicle_trip);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const buses = useMemo(() => vehicles.filter(isBus), [vehicles]);
  const trains = useMemo(() => vehicles.filter(isTrain), [vehicles]);

  const filteredVehicles = useMemo(() => {
    const showBuses = filters?.showBuses ?? true;
    const showTrains = filters?.showTrains ?? true;

    return vehicles.filter((v) => {
      if (isBus(v) && !showBuses) return false;
      if (isTrain(v) && !showTrains) return false;
      return true;
    });
  }, [vehicles, filters?.showBuses, filters?.showTrains]);

  return {
    vehicles,
    buses,
    trains,
    filteredVehicles,
    totalCount: vehicles.length,
    busCount: buses.length,
    trainCount: trains.length,
    loading,
    error,
    refresh: fetchVehicles,
  };
}
