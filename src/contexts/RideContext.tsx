import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Ride {
  id: string;
  driverName: string;
  phoneNumber: string;
  seatsAvailable: number;
  travelTime: 'morning' | 'evening';
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

interface RideContextType {
  rides: Ride[];
  addRide: (ride: Omit<Ride, 'id' | 'createdAt'>) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRides = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);

  const addRide = (rideData: Omit<Ride, 'id' | 'createdAt'>) => {
    const newRide: Ride = {
      ...rideData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setRides(prev => [...prev, newRide]);
  };

  return (
    <RideContext.Provider value={{ rides, addRide }}>
      {children}
    </RideContext.Provider>
  );
};