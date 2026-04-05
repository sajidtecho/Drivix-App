import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { ParkingSpot } from '../types';

interface ParkingCardProps {
  spot: ParkingSpot;
  onPress: () => void;
}

const statusConfig = {
  available: { color: colors.available, label: 'Available', icon: 'checkmark-circle' as const },
  limited: { color: colors.limited, label: 'Limited', icon: 'warning' as const },
  full: { color: colors.full, label: 'Full', icon: 'close-circle' as const },
};

const typeIcon = {
  indoor: 'business',
  outdoor: 'sunny',
  covered: 'umbrella',
} as const;

export const ParkingCard: React.FC<ParkingCardProps> = ({ spot, onPress }) => {
  const status = statusConfig[spot.status];
  const occupancy = Math.round(((spot.totalSpots - spot.availableSpots) / spot.totalSpots) * 100);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={typeIcon[spot.type]} size={22} color={colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {spot.name}
          </Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.address} numberOfLines={1}>
              {spot.address}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <Ionicons name={status.icon} size={12} color={colors.white} />
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.occupancyBar}>
        <View style={[styles.occupancyFill, { width: `${occupancy}%` as any, backgroundColor: status.color }]} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="navigate-outline" size={14} color={colors.primary} />
          <Text style={styles.footerText}>{spot.distance}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text style={styles.footerText}>{spot.rating} ({spot.reviewCount})</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="car-outline" size={14} color={colors.primary} />
          <Text style={styles.footerText}>{spot.availableSpots}/{spot.totalSpots}</Text>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.price}>${spot.price.toFixed(2)}</Text>
          <Text style={styles.priceUnit}>/{spot.priceUnit}</Text>
        </View>
      </View>

      <View style={styles.amenities}>
        {spot.amenities.slice(0, 3).map(amenity => (
          <View key={amenity} style={styles.amenityChip}>
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
        {spot.amenities.length > 3 && (
          <View style={styles.amenityChip}>
            <Text style={styles.amenityText}>+{spot.amenities.length - 3}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  address: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  statusText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  occupancyBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 3,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 'auto',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 1,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  amenityChip: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  amenityText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
});
