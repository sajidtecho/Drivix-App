import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Booking } from '../../types';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Booking'>;
  route: RouteProp<RootStackParamList, 'Booking'>;
};

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

const durations = [1, 2, 3, 4, 6, 8, 12, 24];

export default function BookingScreen({ navigation, route }: Props) {
  const { spot } = route.params;
  const { user } = useAuth();
  const { addBooking } = useParking();

  const [selectedVehicle, setSelectedVehicle] = useState(user?.vehicles[0] ?? null);
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(2);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [startHour] = startTime.split(':').map(Number);
  const endHour = (startHour + duration) % 24;
  const endTime = `${String(endHour).padStart(2, '0')}:00`;
  const totalAmount = spot.price * duration;
  const serviceFee = parseFloat((totalAmount * 0.05).toFixed(2));
  const grandTotal = parseFloat((totalAmount + serviceFee).toFixed(2));

  const handleBook = async () => {
    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions to proceed.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const booking: Booking = {
      id: `B${Date.now()}`,
      parkingSpotId: spot.id,
      parkingSpotName: spot.name,
      parkingSpotAddress: spot.address,
      vehicleNumber: selectedVehicle?.number ?? 'Unknown',
      date: today,
      startTime,
      endTime,
      duration,
      totalAmount: grandTotal,
      status: 'active',
      spotNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 100) + 1}`,
    };

    addBooking(booking);
    setLoading(false);
    navigation.navigate('BookingConfirmation', { booking });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Parking</Text>
          <View style={styles.spotInfo}>
            <Ionicons name="business-outline" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.spotName} numberOfLines={1}>{spot.name}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Select Vehicle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Vehicle</Text>
            <View style={styles.vehiclesRow}>
              {(user?.vehicles ?? []).map(v => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.vehicleCard, selectedVehicle?.id === v.id && styles.vehicleCardActive]}
                  onPress={() => setSelectedVehicle(v)}>
                  <Ionicons
                    name={v.type === 'car' ? 'car-outline' : v.type === 'bike' ? 'bicycle-outline' : 'bus-outline'}
                    size={22}
                    color={selectedVehicle?.id === v.id ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[styles.vehicleNum, selectedVehicle?.id === v.id && styles.vehicleNumActive]}>
                    {v.number}
                  </Text>
                  <Text style={styles.vehicleModel}>{v.model}</Text>
                  {selectedVehicle?.id === v.id && (
                    <View style={styles.selectedDot}>
                      <Ionicons name="checkmark" size={10} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addVehicleCard}>
                <Ionicons name="add-circle-outline" size={28} color={colors.textLight} />
                <Text style={styles.addVehicleText}>Add Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date</Text>
            <View style={styles.dateCard}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.dateText}>{today}</Text>
              <Text style={styles.dateBadge}>Today</Text>
            </View>
          </View>

          {/* Start Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timesRow}>
              {timeSlots.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, startTime === t && styles.timeChipActive]}
                  onPress={() => setStartTime(t)}>
                  <Text style={[styles.timeChipText, startTime === t && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duration</Text>
            <View style={styles.durationsGrid}>
              {durations.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.durationChip, duration === d && styles.durationChipActive]}
                  onPress={() => setDuration(d)}>
                  <Text style={[styles.durationNum, duration === d && styles.durationNumActive]}>{d}</Text>
                  <Text style={[styles.durationUnit, duration === d && styles.durationUnitActive]}>
                    hr{d > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.summaryLabel}>Time Slot</Text>
                <Text style={styles.summaryValue}>{startTime} → {endTime}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="hourglass-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{duration} hour{duration > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="car-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.summaryLabel}>Vehicle</Text>
                <Text style={styles.summaryValue}>{selectedVehicle?.number ?? '—'}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.summaryLabel}>Parking Fee</Text>
                <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="receipt-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.summaryLabel}>Service Fee (5%)</Text>
                <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRowTotal}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>${grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity style={styles.paymentCard}>
              <View style={styles.paymentIcon}>
                <Ionicons name="card" size={22} color={colors.primary} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>Credit Card</Text>
                <Text style={styles.paymentNumber}>**** **** **** 4242</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.8}>
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Cancellation Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>${grandTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
          onPress={handleBook}
          disabled={loading}
          activeOpacity={0.9}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white, marginBottom: 6 },
  spotInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  spotName: { fontSize: 14, color: 'rgba(255,255,255,0.8)', flex: 1 },
  body: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  vehiclesRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  vehicleCard: {
    width: 130,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  vehicleCardActive: { borderColor: colors.primary, backgroundColor: '#EEF2FF' },
  vehicleNum: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  vehicleNumActive: { color: colors.primary },
  vehicleModel: { fontSize: 11, color: colors.textSecondary },
  selectedDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addVehicleCard: {
    width: 100,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  addVehicleText: { fontSize: 11, color: colors.textLight },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  dateBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  timesRow: { flexGrow: 0 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  timeChipTextActive: { color: colors.white },
  durationsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  durationChip: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  durationNum: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  durationNumActive: { color: colors.white },
  durationUnit: { fontSize: 11, color: colors.textSecondary },
  durationUnitActive: { color: 'rgba(255,255,255,0.8)' },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  summaryLabel: { flex: 1, fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  summaryRowTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  totalAmount: { fontSize: 22, fontWeight: '900', color: colors.primary },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: { flex: 1 },
  paymentLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  paymentNumber: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  termsText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  termsLink: { color: colors.primary, fontWeight: '600' },
  footer: {
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
  footerInfo: {},
  footerLabel: { fontSize: 11, color: colors.textSecondary },
  footerTotal: { fontSize: 22, fontWeight: '900', color: colors.primary },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  confirmBtnDisabled: { opacity: 0.7 },
  confirmBtnText: { fontSize: 15, fontWeight: '800', color: colors.white },
});
