import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

const statusConfig = {
  active: { color: colors.primary, bg: '#EEF2FF', label: 'Active', icon: 'time-outline' as const },
  completed: { color: colors.secondary, bg: '#D1FAE5', label: 'Completed', icon: 'checkmark-circle-outline' as const },
  cancelled: { color: colors.danger, bg: '#FEE2E2', label: 'Cancelled', icon: 'close-circle-outline' as const },
};

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const status = statusConfig[booking.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.spotName} numberOfLines={1}>{booking.parkingSpotName}</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.address} numberOfLines={1}>{booking.parkingSpotAddress}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icon} size={13} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary} />
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{booking.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{booking.startTime} – {booking.endTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="car-outline" size={14} color={colors.primary} />
          <Text style={styles.detailLabel}>Vehicle</Text>
          <Text style={styles.detailValue}>{booking.vehicleNumber}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="grid-outline" size={14} color={colors.primary} />
          <Text style={styles.detailLabel}>Spot</Text>
          <Text style={styles.detailValue}>{booking.spotNumber}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.durationText}>{booking.duration} hr{booking.duration > 1 ? 's' : ''}</Text>
          <Text style={styles.bookingId}>#{booking.id}</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${booking.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {booking.status === 'active' && onCancel && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => onCancel(booking.id)}
          activeOpacity={0.8}>
          <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.cancelText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  spotName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: 200,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  address: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: 180,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '45%',
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bookingId: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    gap: 6,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
});
