import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useParking } from '../../context/ParkingContext';
import { ParkingCard } from '../../components/ParkingCard';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const filterOptions = {
  status: ['All', 'Available', 'Limited'],
  type: ['All', 'Indoor', 'Outdoor', 'Covered'],
  price: ['Any', '< $2/hr', '$2–4/hr', '> $4/hr'],
  sort: ['Distance', 'Price ↑', 'Price ↓', 'Rating'],
};

const amenityOptions = ['CCTV', '24/7', 'EV Charging', 'Valet', 'Car Wash', 'Covered'];

export default function FindParkingScreen() {
  const navigation = useNavigation<Nav>();
  const { parkingSpots, searchQuery, setSearchQuery } = useParking();
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [activePrice, setActivePrice] = useState('Any');
  const [activeSort, setActiveSort] = useState('Distance');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]));

  const filtered = parkingSpots
    .filter(spot => {
      if (searchQuery && !spot.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !spot.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeStatus === 'Available' && spot.status !== 'available') return false;
      if (activeStatus === 'Limited' && spot.status !== 'limited') return false;
      if (activeType !== 'All' && spot.type !== activeType.toLowerCase()) return false;
      if (activePrice === '< $2/hr' && spot.price >= 2) return false;
      if (activePrice === '$2–4/hr' && (spot.price < 2 || spot.price > 4)) return false;
      if (activePrice === '> $4/hr' && spot.price <= 4) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => spot.amenities.includes(a))) return false;
      return true;
    })
    .sort((a, b) => {
      if (activeSort === 'Price ↑') return a.price - b.price;
      if (activeSort === 'Price ↓') return b.price - a.price;
      if (activeSort === 'Rating') return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  const ChipRow = ({ options, active, onSelect }: { options: string[]; active: string; onSelect: (v: string) => void }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, active === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}>
          <Text style={[styles.chipText, active === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}>
          <Ionicons
            name="options-outline"
            size={20}
            color={showFilters ? colors.white : colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Sort chips */}
      <View style={styles.sortRow}>
        <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
        <ChipRow options={filterOptions.sort} active={activeSort} onSelect={setActiveSort} />
      </View>

      {/* Filters panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Availability</Text>
            <ChipRow options={filterOptions.status} active={activeStatus} onSelect={setActiveStatus} />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Parking Type</Text>
            <ChipRow options={filterOptions.type} active={activeType} onSelect={setActiveType} />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Price Range</Text>
            <ChipRow options={filterOptions.price} active={activePrice} onSelect={setActivePrice} />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Amenities</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {amenityOptions.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[styles.chip, selectedAmenities.includes(a) && styles.chipActive]}
                  onPress={() => toggleAmenity(a)}>
                  <Text style={[styles.chipText, selectedAmenities.includes(a) && styles.chipTextActive]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {(activeStatus !== 'All' || activeType !== 'All' || activePrice !== 'Any' || selectedAmenities.length > 0) && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setActiveStatus('All');
                setActiveType('All');
                setActivePrice('Any');
                setSelectedAmenities([]);
              }}>
              <Ionicons name="refresh-outline" size={14} color={colors.danger} />
              <Text style={styles.clearBtnText}>Clear all filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results */}
      <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>{filtered.length} spots found</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.locationText}>Near you</Text>
          </View>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.border} />
            <Text style={styles.emptyTitle}>No parking spots found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          filtered.map(spot => (
            <ParkingCard
              key={spot.id}
              spot={spot}
              onPress={() => navigation.navigate('ParkingDetail', { spot })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
  },
  filtersPanel: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterGroup: { marginBottom: 8, paddingHorizontal: 16 },
  filterLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  chipRow: { flexGrow: 0 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  clearBtnText: { fontSize: 12, color: colors.danger, fontWeight: '600' },
  results: { flex: 1 },
  resultsContent: { padding: 16 },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
});
