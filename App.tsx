import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ParkingProvider } from './src/context/ParkingContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </ParkingProvider>
    </AuthProvider>
  );
}
