import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useParking } from '../../context/ParkingContext';
import { BookingCard } from '../../components/BookingCard';

type FilterType = 'all' | 'active' | 'completed' | 'cancelled';

export default function MyBookingsScreen() {
  const { bookings, cancelBooking } = useParking();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: () => cancelBooking(id),
        },
      ],
    );
  };

  const counts = {
    all: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const filters: { key: FilterType; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'active', label: 'Active', icon: 'time' },
    { key: 'completed', label: 'Completed', icon: 'checkmark-circle' },
    { key: 'cancelled', label: 'Cancelled', icon: 'close-circle' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{bookings.length} total</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterTabs}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}>
            <Ionicons
              name={f.icon as any}
              size={14}
              color={filter === f.key ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.filterTabText, filter === f.key && styles.filterTabTextActive]}>
              {f.label}
            </Text>
            {counts[f.key] > 0 && (
              <View style={[styles.filterCount, filter === f.key && styles.filterCountActive]}>
                <Text style={[styles.filterCountText, filter === f.key && styles.filterCountTextActive]}>
                  {counts[f.key]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings list */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={72} color={colors.border} />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'active'
                ? 'You have no active bookings right now'
                : filter === 'completed'
                ? 'No completed bookings yet'
                : filter === 'cancelled'
                ? 'No cancelled bookings'
                : 'Start booking a parking spot!'}
            </Text>
          </View>
        ) : (
          filtered.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, flex: 1 },
  totalBadge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  totalBadgeText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterTabText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: colors.white },
  filterCount: {
    backgroundColor: colors.border,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterCountActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  filterCountText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  filterCountTextActive: { color: colors.white },
  list: { flex: 1 },
  listContent: { padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 },
});
