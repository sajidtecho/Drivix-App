import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';
import { ParkingCard } from '../../components/ParkingCard';
import { RootStackParamList } from '../../types';
import { ParkingSpot } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const stats = [
  { label: 'Active', value: '1', icon: 'time', color: colors.primary },
  { label: 'Completed', value: '2', icon: 'checkmark-circle', color: colors.secondary },
  { label: 'Saved', value: '$48', icon: 'wallet', color: colors.warning },
  { label: 'Rating', value: '4.8', icon: 'star', color: '#F59E0B' },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { parkingSpots } = useParking();
  const [searchText, setSearchText] = useState('');

  const nearbySpots = parkingSpots.filter(s => s.status !== 'full').slice(0, 3);
  const filteredSearch = searchText
    ? parkingSpots.filter(
        s =>
          s.name.toLowerCase().includes(searchText.toLowerCase()) ||
          s.address.toLowerCase().includes(searchText.toLowerCase()),
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning 👋</Text>
              <Text style={styles.userName}>{user?.name ?? 'Guest'}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('Main' as any)}
            activeOpacity={0.9}>
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search parking spots..."
              placeholderTextColor={colors.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.body}>
          {/* Search results */}
          {filteredSearch.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Search Results</Text>
              {filteredSearch.map(spot => (
                <ParkingCard
                  key={spot.id}
                  spot={spot}
                  onPress={() => navigation.navigate('ParkingDetail', { spot })}
                />
              ))}
            </View>
          ) : (
            <>
              {/* Stats */}
              <View style={styles.statsGrid}>
                {stats.map(s => (
                  <View key={s.label} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: `${s.color}18` }]}>
                      <Ionicons name={s.icon as any} size={20} color={s.color} />
                    </View>
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Active Booking Banner */}
              <TouchableOpacity style={styles.activeBanner} activeOpacity={0.9}>
                <LinearGradient
                  colors={[colors.secondary, '#059669']}
                  style={styles.activeBannerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <View style={styles.activeBannerLeft}>
                    <View style={styles.activeDot} />
                    <View>
                      <Text style={styles.activeBannerTitle}>Active Booking</Text>
                      <Text style={styles.activeBannerSubtitle}>Downtown Parking Hub · Spot A-23</Text>
                      <Text style={styles.activeBannerTime}>Ends at 12:00 PM · 1h 23m left</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
              </TouchableOpacity>

              {/* Quick Actions */}
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                {[
                  { icon: 'search', label: 'Find Parking', color: colors.primary, bg: '#EEF2FF' },
                  { icon: 'qr-code', label: 'Scan QR', color: colors.secondary, bg: '#D1FAE5' },
                  { icon: 'list', label: 'Bookings', color: colors.warning, bg: '#FEF3C7' },
                  { icon: 'map', label: 'Near Me', color: '#8B5CF6', bg: '#EDE9FE' },
                ].map(action => (
                  <TouchableOpacity key={action.label} style={styles.quickAction}>
                    <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                      <Ionicons name={action.icon as any} size={22} color={action.color} />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Nearby Spots */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nearby Parking</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              {nearbySpots.map((spot: ParkingSpot) => (
                <ParkingCard
                  key={spot.id}
                  spot={spot}
                  onPress={() => navigation.navigate('ParkingDetail', { spot })}
                />
              ))}

              {/* Promo Banner */}
              <LinearGradient
                colors={['#7C3AED', '#4F46E5']}
                style={styles.promoBanner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View style={styles.promoContent}>
                  <Text style={styles.promoLabel}>LIMITED OFFER</Text>
                  <Text style={styles.promoTitle}>Get 30% off your{'\n'}next 3 bookings!</Text>
                  <TouchableOpacity style={styles.promoCta}>
                    <Text style={styles.promoCtaText}>Claim Now</Text>
                  </TouchableOpacity>
                </View>
                <Ionicons name="pricetag" size={80} color="rgba(255,255,255,0.15)" />
              </LinearGradient>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 12, paddingBottom: 24, paddingHorizontal: 20 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '800', color: colors.white },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  body: { padding: 20 },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  activeBanner: { marginBottom: 20, borderRadius: 16, overflow: 'hidden' },
  activeBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  activeBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  activeBannerTitle: { fontSize: 13, fontWeight: '800', color: colors.white },
  activeBannerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  activeBannerTime: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  quickAction: { alignItems: 'center', gap: 6 },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: colors.textPrimary },
  promoBanner: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 8,
  },
  promoContent: { flex: 1 },
  promoLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 },
  promoTitle: { fontSize: 18, fontWeight: '800', color: colors.white, marginBottom: 12, lineHeight: 24 },
  promoCta: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  promoCtaText: { fontSize: 13, fontWeight: '700', color: '#4F46E5' },
});
