import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/main/HomeScreen';
import FindParkingScreen from '../screens/main/FindParkingScreen';
import MyBookingsScreen from '../screens/main/MyBookingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { colors } from '../theme/colors';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabs = [
  { name: 'Home' as const, icon: 'home', label: 'Home', component: HomeScreen },
  { name: 'FindParking' as const, icon: 'search', label: 'Find', component: FindParkingScreen },
  { name: 'MyBookings' as const, icon: 'calendar', label: 'Bookings', component: MyBookingsScreen },
  { name: 'Profile' as const, icon: 'person', label: 'Profile', component: ProfileScreen },
];

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const tab = tabs.find(t => t.name === route.name);
          const iconName = tab ? (focused ? tab.icon : `${tab.icon}-outline`) : 'home';
          return (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons name={iconName as any} size={22} color={color} />
            </View>
          );
        },
      })}>
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 70,
    paddingBottom: 10,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrapper: {
    width: 36,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#EEF2FF',
  },
});
