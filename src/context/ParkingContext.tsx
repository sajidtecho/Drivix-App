import React, { createContext, useContext, useState } from 'react';
import { Booking, ParkingSpot } from '../types';
import { mockBookings, mockParkingSpots } from '../data/mockData';

interface ParkingContextType {
  parkingSpots: ParkingSpot[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredSpots: ParkingSpot[];
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parkingSpots] = useState<ParkingSpot[]>(mockParkingSpots);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpots = parkingSpots.filter(
    spot =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)),
    );
  };

  return (
    <ParkingContext.Provider
      value={{
        parkingSpots,
        bookings,
        addBooking,
        cancelBooking,
        searchQuery,
        setSearchQuery,
        filteredSpots,
      }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = (): ParkingContextType => {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error('useParking must be used within ParkingProvider');
  return ctx;
};
