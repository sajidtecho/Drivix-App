import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const features = [
  { icon: 'search-circle', label: 'Find Parking', desc: 'Locate available spots near you instantly' },
  { icon: 'flash', label: 'Quick Book', desc: 'Reserve your spot in just a few taps' },
  { icon: 'shield-checkmark', label: 'Secure Pay', desc: 'Safe & hassle-free payment options' },
];

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <LinearGradient colors={[colors.primaryDark, colors.primary, colors.primaryLight]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={52} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Drivix</Text>
          <Text style={styles.tagline}>Smart Parking, Smarter Cities</Text>
        </View>

        {/* Feature cards */}
        <View style={styles.features}>
          {features.map(f => (
            <View key={f.label} style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Ionicons name={f.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.9}>
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 20 },
  logoArea: { alignItems: 'center', paddingTop: 40 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  features: { gap: 12 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { flex: 1 },
  featureLabel: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  cta: { gap: 12, paddingBottom: 16 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
});
