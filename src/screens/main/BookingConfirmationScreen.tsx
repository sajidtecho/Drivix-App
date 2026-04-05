import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BookingConfirmation'>;
  route: RouteProp<RootStackParamList, 'BookingConfirmation'>;
};

export default function BookingConfirmationScreen({ navigation, route }: Props) {
  const { booking } = route.params;

  const handleShare = async () => {
    await Share.share({
      message: `My parking is booked!\n📍 ${booking.parkingSpotName}\n🕐 ${booking.startTime}–${booking.endTime} on ${booking.date}\n🚗 ${booking.vehicleNumber} · Spot ${booking.spotNumber}\n💳 Total: $${booking.totalAmount.toFixed(2)}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary, colors.primaryLight]} style={styles.gradient}>
        {/* Success icon */}
        <View style={styles.iconCircle}>
          <View style={styles.iconInner}>
            <Ionicons name="checkmark" size={50} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your parking spot has been reserved successfully</Text>

        {/* Booking Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{booking.parkingSpotName}</Text>
            <View style={styles.bookingIdBadge}>
              <Text style={styles.bookingIdText}>#{booking.id}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.detailsGrid}>
            {[
              { icon: 'calendar-outline', label: 'Date', value: booking.date },
              { icon: 'time-outline', label: 'Time', value: `${booking.startTime} – ${booking.endTime}` },
              { icon: 'car-outline', label: 'Vehicle', value: booking.vehicleNumber },
              { icon: 'grid-outline', label: 'Spot No.', value: booking.spotNumber },
              { icon: 'hourglass-outline', label: 'Duration', value: `${booking.duration} hr${booking.duration > 1 ? 's' : ''}` },
              { icon: 'cash-outline', label: 'Total Paid', value: `$${booking.totalAmount.toFixed(2)}` },
            ].map(item => (
              <View key={item.label} style={styles.detailItem}>
                <View style={styles.detailIconBg}>
                  <Ionicons name={item.icon as any} size={16} color={colors.primary} />
                </View>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.cardDivider} />

          {/* QR Code Placeholder */}
          <View style={styles.qrSection}>
            <View style={styles.qrCode}>
              <Ionicons name="qr-code-outline" size={80} color={colors.primary} />
            </View>
            <Text style={styles.qrLabel}>Scan at entry gate</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.9}>
            <Ionicons name="share-social-outline" size={20} color={colors.primary} />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.9}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
            <Ionicons name="home-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.bookingsLink}
          onPress={() => navigation.navigate('Main')}>
          <Text style={styles.bookingsLinkText}>View My Bookings →</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, alignItems: 'center' },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: { fontSize: 26, fontWeight: '900', color: colors.white, marginBottom: 6 },
  successSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, flex: 1, marginRight: 8 },
  bookingIdBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bookingIdText: { fontSize: 11, color: colors.primary, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailItem: { width: '46%', gap: 4 },
  detailIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: { fontSize: 11, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  qrSection: { alignItems: 'center', paddingVertical: 8 },
  qrCode: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 8,
  },
  qrLabel: { fontSize: 12, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  shareBtnText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  homeBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  homeBtnText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  bookingsLink: { paddingVertical: 8 },
  bookingsLinkText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
});
