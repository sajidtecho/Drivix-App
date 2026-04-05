import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useParking } from '../../context/ParkingContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { bookings } = useParking();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const MenuItem = ({
    icon,
    label,
    value,
    onPress,
    color,
    toggle,
    toggleValue,
    onToggle,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    color?: string;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (v: boolean) => void;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={toggle}
      activeOpacity={toggle ? 1 : 0.7}>
      <View style={[styles.menuIcon, { backgroundColor: `${color || colors.primary}18` }]}>
        <Ionicons name={icon as any} size={20} color={color || colors.primary} />
      </View>
      <Text style={[styles.menuLabel, color === colors.danger && { color: colors.danger }]}>{label}</Text>
      <View style={styles.menuRight}>
        {toggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={toggleValue ? colors.primary : colors.textLight}
          />
        ) : (
          <>
            {value && <Text style={styles.menuValue}>{value}</Text>}
            <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          <View style={styles.headerBadges}>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
            <View style={styles.memberBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.memberText}>Premium Member</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Bookings', value: String(bookings.length) },
              { label: 'Completed', value: String(completedBookings) },
              { label: 'Spent', value: `$${totalSpent.toFixed(0)}` },
              { label: 'Vehicles', value: String(user?.vehicles.length ?? 0) },
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Edit Profile button */}
        <View style={styles.editProfileRow}>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Ionicons name="pencil-outline" size={16} color={colors.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileBtn}>
            <Ionicons name="share-social-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Vehicles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Add New</Text>
            </TouchableOpacity>
          </View>
          {user?.vehicles.map(v => (
            <View key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleIcon}>
                <Ionicons
                  name={v.type === 'car' ? 'car' : v.type === 'bike' ? 'bicycle' : 'bus'}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleNumber}>{v.number}</Text>
                <Text style={styles.vehicleModel}>{v.model}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={18} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon="person-outline" label="Personal Information" value={user?.phone ?? ''} />
            <MenuItem icon="card-outline" label="Payment Methods" value="2 cards" />
            <MenuItem icon="location-outline" label="Saved Locations" value="3 places" />
            <MenuItem icon="gift-outline" label="Promotions & Offers" value="2 active" />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="notifications-outline"
              label="Push Notifications"
              toggle
              toggleValue={notifications}
              onToggle={setNotifications}
            />
            <MenuItem
              icon="navigate-outline"
              label="Location Services"
              toggle
              toggleValue={locationServices}
              onToggle={setLocationServices}
            />
            <MenuItem icon="language-outline" label="Language" value="English" />
            <MenuItem icon="moon-outline" label="Dark Mode" value="Off" />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon="help-circle-outline" label="Help Center" />
            <MenuItem icon="chatbubble-outline" label="Contact Support" />
            <MenuItem icon="star-outline" label="Rate the App" />
            <MenuItem icon="document-text-outline" label="Privacy Policy" />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="log-out-outline"
              label="Sign Out"
              color={colors.danger}
              onPress={handleLogout}
            />
          </View>
        </View>

        <Text style={styles.version}>Drivix v1.0.0 · Made with ❤️ for smart cities</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, paddingTop: 32, alignItems: 'center' },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: colors.white },
  userName: { fontSize: 22, fontWeight: '800', color: colors.white, marginBottom: 2 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10 },
  headerBadges: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedText: { fontSize: 11, color: colors.white, fontWeight: '600' },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.4)',
  },
  memberText: { fontSize: 11, color: '#FDE68A', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.white },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  editProfileRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  editProfileText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  shareProfileBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  sectionAction: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehicleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: { flex: 1 },
  vehicleNumber: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  vehicleModel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  menuGroup: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13, color: colors.textSecondary },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textLight,
    paddingVertical: 20,
  },
});
