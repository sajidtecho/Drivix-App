import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ParkingDetail'>;
  route: RouteProp<RootStackParamList, 'ParkingDetail'>;
};

const amenityIcons: Record<string, string> = {
  CCTV: 'shield-checkmark',
  '24/7': 'time',
  'EV Charging': 'flash',
  Covered: 'umbrella',
  Valet: 'people',
  'Car Wash': 'water',
  Security: 'lock-closed',
  Lift: 'enter',
  Shuttle: 'bus',
};

export default function ParkingDetailScreen({ navigation, route }: Props) {
  const { spot } = route.params;
  const occupancyPct = Math.round(((spot.totalSpots - spot.availableSpots) / spot.totalSpots) * 100);
  const statusColor = spot.status === 'available' ? colors.available : spot.status === 'limited' ? colors.limited : colors.full;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(spot.rating));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={22} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.heroIcon}>
            <Ionicons
              name={spot.type === 'indoor' ? 'business' : spot.type === 'covered' ? 'umbrella' : 'sunny'}
              size={40}
              color={colors.primary}
            />
          </View>
          <Text style={styles.heroTitle}>{spot.name}</Text>
          <View style={styles.heroAddressRow}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroAddress}>{spot.address}</Text>
          </View>

          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: statusColor }]}>
              <Text style={styles.badgeText}>
                {spot.availableSpots} spots {spot.status}
              </Text>
            </View>
            <View style={styles.badge2}>
              <Ionicons name="navigate-outline" size={12} color={colors.primary} />
              <Text style={styles.badge2Text}>{spot.distance}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Price & Rating */}
          <View style={styles.priceRatingRow}>
            <View style={styles.priceCard}>
              <Text style={styles.priceBig}>${spot.price.toFixed(2)}</Text>
              <Text style={styles.priceSmall}>per hour</Text>
            </View>
            <View style={styles.ratingCard}>
              <View style={styles.starsRow}>
                {stars.map((filled, i) => (
                  <Ionicons key={i} name={filled ? 'star' : 'star-outline'} size={14} color="#F59E0B" />
                ))}
              </View>
              <Text style={styles.ratingNum}>{spot.rating}</Text>
              <Text style={styles.ratingCount}>({spot.reviewCount} reviews)</Text>
            </View>
          </View>

          {/* Occupancy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.occupancyRow}>
              <Text style={styles.occupancyText}>{spot.availableSpots} of {spot.totalSpots} spots available</Text>
              <Text style={[styles.occupancyPct, { color: statusColor }]}>{100 - occupancyPct}% free</Text>
            </View>
            <View style={styles.occupancyBar}>
              <View style={[styles.occupancyFill, { width: `${occupancyPct}%` as any, backgroundColor: statusColor }]} />
            </View>
          </View>

          {/* Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Operating Hours</Text>
            <View style={styles.hoursRow}>
              <View style={styles.hoursItem}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.hoursLabel}>Opens</Text>
                  <Text style={styles.hoursValue}>{spot.openTime === '00:00' ? 'Always Open' : spot.openTime}</Text>
                </View>
              </View>
              <View style={styles.hoursDivider} />
              <View style={styles.hoursItem}>
                <Ionicons name="moon-outline" size={18} color={colors.primary} />
                <View>
                  <Text style={styles.hoursLabel}>Closes</Text>
                  <Text style={styles.hoursValue}>{spot.closeTime === '23:59' ? 'Never' : spot.closeTime}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {spot.amenities.map(a => (
                <View key={a} style={styles.amenityItem}>
                  <View style={styles.amenityIcon}>
                    <Ionicons
                      name={(amenityIcons[a] || 'checkmark') as any}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.amenityLabel}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pricing Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingTable}>
              {[
                { label: '1 Hour', amount: spot.price },
                { label: '2 Hours', amount: spot.price * 2 },
                { label: '4 Hours', amount: spot.price * 4 },
                { label: 'Full Day (8 hrs)', amount: spot.price * 8 * 0.85, note: '15% discount' },
              ].map(row => (
                <View key={row.label} style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>{row.label}</Text>
                  {row.note && <Text style={styles.pricingNote}>{row.note}</Text>}
                  <Text style={styles.pricingAmount}>${row.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Map placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={40} color={colors.textLight} />
              <Text style={styles.mapText}>Map View</Text>
              <TouchableOpacity style={styles.directionsBtn}>
                <Ionicons name="navigate" size={16} color={colors.white} />
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookSection}>
        <View style={styles.bookInfo}>
          <Text style={styles.bookPriceLabel}>Starting from</Text>
          <Text style={styles.bookPrice}>${spot.price.toFixed(2)}<Text style={styles.bookPriceUnit}>/hr</Text></Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, spot.status === 'full' && styles.bookBtnDisabled]}
          onPress={() => spot.status !== 'full' && navigation.navigate('Booking', { spot })}
          disabled={spot.status === 'full'}
          activeOpacity={0.9}>
          <Text style={styles.bookBtnText}>{spot.status === 'full' ? 'No Spots Available' : 'Book Now'}</Text>
          {spot.status !== 'full' && <Ionicons name="arrow-forward" size={18} color={colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, alignItems: 'center' },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.white, textAlign: 'center', marginBottom: 6 },
  heroAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  heroAddress: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  heroBadges: { flexDirection: 'row', gap: 10 },
  badge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.white },
  badge2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badge2Text: { fontSize: 12, fontWeight: '600', color: colors.primary },
  content: { padding: 20 },
  priceRatingRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  priceCard: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  priceBig: { fontSize: 28, fontWeight: '900', color: colors.primary },
  priceSmall: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  ratingCard: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 4 },
  ratingNum: { fontSize: 22, fontWeight: '800', color: '#92400E' },
  ratingCount: { fontSize: 11, color: '#92400E', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  occupancyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  occupancyText: { fontSize: 14, color: colors.textSecondary },
  occupancyPct: { fontSize: 14, fontWeight: '700' },
  occupancyBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  occupancyFill: { height: '100%', borderRadius: 4 },
  hoursRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  hoursItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  hoursLabel: { fontSize: 11, color: colors.textSecondary },
  hoursValue: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  hoursDivider: { width: 1, height: 40, backgroundColor: colors.border, marginHorizontal: 16 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amenityItem: { width: '28%', alignItems: 'center', gap: 6 },
  amenityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenityLabel: { fontSize: 11, color: colors.textPrimary, fontWeight: '500', textAlign: 'center' },
  pricingTable: { backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden' },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pricingLabel: { flex: 1, fontSize: 14, color: colors.textPrimary },
  pricingNote: { fontSize: 11, color: colors.secondary, fontWeight: '600', marginRight: 8 },
  pricingAmount: { fontSize: 15, fontWeight: '700', color: colors.primary },
  mapPlaceholder: {
    height: 160,
    backgroundColor: colors.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  mapText: { fontSize: 14, color: colors.textLight },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  directionsBtnText: { fontSize: 13, fontWeight: '600', color: colors.white },
  bookSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  bookInfo: {},
  bookPriceLabel: { fontSize: 11, color: colors.textSecondary },
  bookPrice: { fontSize: 22, fontWeight: '900', color: colors.primary },
  bookPriceUnit: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  bookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  bookBtnDisabled: { backgroundColor: colors.textLight },
  bookBtnText: { fontSize: 16, fontWeight: '800', color: colors.white },
});
