# Drivix – Smart Parking Mobile App

A full-featured mobile app smart parking ecosystem designed to eliminate the anxiety and time-loss associated with urban parking.

## Features

- **Welcome & Onboarding** – Beautiful splash screen introducing the app's core value
- **Authentication** – Login & Sign Up with form validation
- **Home Dashboard** – Overview of bookings, stats, nearby spots & promotions
- **Find Parking** – Search & filter spots by availability, type, price, and amenities
- **Parking Detail** – Full details including availability, pricing, amenities, and hours
- **Booking** – Select vehicle, time slot, duration, and confirm with payment summary
- **Booking Confirmation** – Receipt with QR code for gate entry and sharing
- **My Bookings** – Filter and manage active, completed, and cancelled bookings
- **Profile** – Manage vehicles, payment methods, preferences, and account settings

## Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript** for type safety
- **React Navigation** (Native Stack + Bottom Tabs)
- **Expo Linear Gradient** for UI styling
- **@expo/vector-icons** (Ionicons)
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (for physical device testing)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

### Type Checking

```bash
npx tsc --noEmit
```

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── ParkingCard.tsx  # Parking spot card
│   └── BookingCard.tsx  # Booking history card
├── context/             # React Context state management
│   ├── AuthContext.tsx  # User authentication state
│   └── ParkingContext.tsx # Parking spots & bookings state
├── data/
│   └── mockData.ts      # Mock parking spots & bookings
├── navigation/
│   ├── AppNavigator.tsx # Root navigator (auth vs main)
│   └── MainNavigator.tsx # Bottom tab navigator
├── screens/
│   ├── auth/
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   └── main/
│       ├── HomeScreen.tsx
│       ├── FindParkingScreen.tsx
│       ├── ParkingDetailScreen.tsx
│       ├── BookingScreen.tsx
│       ├── BookingConfirmationScreen.tsx
│       ├── MyBookingsScreen.tsx
│       └── ProfileScreen.tsx
├── theme/
│   └── colors.ts        # App color palette
└── types/
    └── index.ts         # TypeScript interfaces & types
```

## Screenshots

The app features a clean, modern design with a deep blue primary palette:

- **Welcome Screen** – Gradient background with feature highlights and CTA buttons
- **Login/Signup** – Form screens with validation and social login options
- **Home** – Dashboard with stats, active booking banner, and nearby spots
- **Find Parking** – Search with real-time filtering and sorting
- **Parking Detail** – Rich detail view with availability bar, amenity grid, pricing table
- **Booking** – Step-by-step booking with vehicle selection, time/duration pickers
- **Confirmation** – Success screen with booking summary and QR code
- **My Bookings** – Tabbed list with active, completed, and cancelled bookings
- **Profile** – User stats, vehicle management, preferences, and settings

## License

MIT
