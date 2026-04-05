export type ParkingStatus = 'available' | 'limited' | 'full';

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: number;
  priceUnit: string;
  totalSpots: number;
  availableSpots: number;
  status: ParkingStatus;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: string[];
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  type: 'indoor' | 'outdoor' | 'covered';
}

export interface Booking {
  id: string;
  parkingSpotId: string;
  parkingSpotName: string;
  parkingSpotAddress: string;
  vehicleNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  spotNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bike' | 'truck';
  number: string;
  model: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  ParkingDetail: { spot: ParkingSpot };
  Booking: { spot: ParkingSpot };
  BookingConfirmation: { booking: Booking };
};

export type MainTabParamList = {
  Home: undefined;
  FindParking: undefined;
  MyBookings: undefined;
  Profile: undefined;
};
