// src/screens/auth/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />

      {/* Background gradient blobs */}
      <View style={styles.blobGold} />
      <View style={styles.blobBlue} />

      {/* Logo */}
      <Animated.View style={[styles.logoArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.logoIcon}>
        <Image
          source={require('../../../assets/icon/logo.png')}
          style={{ width: 32, height: 32, resizeMode: 'cover' }}
        />
      </View>
        <Text style={styles.logoText}>
          Viet<Text style={{ color: COLORS.gold }}>Rental</Text>
        </Text>
      </Animated.View>

      {/* Hero Text */}
      <Animated.View style={[styles.heroArea, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.eyebrow}>// KHÁM PHÁ VIỆT NAM</Text>
        <Text style={styles.headline}>
          Thuê xe{' '}
          <Text style={{ color: COLORS.gold }}>dễ dàng</Text>
          {',\n'}Di chuyển{' '}
          <Text style={{ color: COLORS.gold }}>thoải mái</Text>
        </Text>
        <Text style={styles.subtext}>
          50+ phương tiện đa dạng. Giá minh bạch, đặt xe nhanh chóng.
        </Text>
      </Animated.View>

      {/* Stats Strip */}
      <Animated.View style={[styles.statsStrip, { opacity: fadeAnim }]}>
        {[
          { value: '50+', label: 'Xe' },
          { value: '4.9★', label: 'Đánh giá' },
          { value: '1K+', label: 'Khách hàng' },
        ].map((stat, i) => (
          <View key={i} style={[styles.statItem, i !== 2 && styles.statDivider]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View style={[styles.bottomArea, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Bắt đầu ngay →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.ghostBtnText}>Đã có tài khoản</Text>
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: SIZES.lg,
    paddingTop: 60,
    paddingBottom: 48,
  },
  blobGold: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(245,166,35,0.06)',
  },
  blobBlue: {
    position: 'absolute',
    bottom: -60,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(37,99,235,0.05)',
  },
  logoArea: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 60 },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.25)',
  },
  logoText: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.white },
  heroArea: { flex: 1, justifyContent: 'center' },
  eyebrow: {
    fontFamily: 'Courier',
    fontSize: SIZES.fontXs,
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 16,
  },
  headline: { fontSize: 34, fontWeight: '800', color: COLORS.white, lineHeight: 42, marginBottom: 16 },
  subtext: { fontSize: SIZES.fontMd, color: 'rgba(255,255,255,0.45)', lineHeight: 24 },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 36,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statDivider: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.08)' },
  statValue: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold, marginBottom: 2 },
  statLabel: { fontSize: SIZES.fontXs, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },
  bottomArea: { gap: 12 },
  primaryBtn: {
    backgroundColor: COLORS.gold,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.navy, fontWeight: '800', fontSize: SIZES.fontLg },
  ghostBtn: {
    height: 52,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: { color: COLORS.white, fontWeight: '600', fontSize: SIZES.fontMd },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 24, backgroundColor: COLORS.gold },
});
