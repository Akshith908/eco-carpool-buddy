import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Ride {
  id?: number;
  driverName: string;
  phoneNumber: string;
  seatsAvailable: number;
  travelTime: 'morning' | 'evening';
  latitude: number;
  longitude: number;
}

interface RideContextType {
  rides: Ride[];
  addRide: (ride: Ride) => Promise<void>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // ✅ Correct v5 object syntax
  const { data: rides = [] } = useQuery<Ride[]>({
    queryKey: ['rides'],
    queryFn: async () => {
      const res = await axios.get('/api/rides');
      return res.data;
    },
  });

  // Mutation to add a new ride
  const mutation = useMutation({
    mutationFn: async (ride: Ride) => {
      const res = await axios.post('/api/rides', ride);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] }); // refresh ride list
    },
  });

  const addRide = async (ride: Ride) => {
    await mutation.mutateAsync(ride);
  };

  return (
    <RideContext.Provider value={{ rides, addRide }}>
    {children}
    </RideContext.Provider>
  );
};

export const useRides = () => {
  const context = useContext(RideContext);
  if (!context) throw new Error('useRides must be used within RideProvider');
  return context;
};
