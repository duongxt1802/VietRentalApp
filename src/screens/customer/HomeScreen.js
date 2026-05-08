// src/screens/customer/HomeScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, FlatList,Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import { VEHICLES, VEHICLE_TYPES } from '../../data/data';
import { VehiclePlaceholder, StatusBadge, SectionHeader, formatCurrency, Avatar } from '../../components/shared';

export default function HomeScreen({ navigation }) {
  const { user } = useAuthContext();
  const { totalItems } = useCartContext();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'CHÀO BUỔI SÁNG';
    if (h < 18) return 'CHÀO BUỔI CHIỀU';
    return 'CHÀO BUỔI TỐI';
  };

  const featured = useMemo(() => {
    return VEHICLES.filter((v) => {
      const matchType = activeType === 'all' || v.type === activeType;
      const matchSearch =
        !search ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.typeLabel.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    }).slice(0, 4);
  }, [search, activeType]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* NAV BAR */}
      <View style={styles.navbar}>
        <Text style={styles.navLogo}>
          Viet<Text style={{ color: COLORS.gold }}>Rental</Text>
        </Text>
        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => {}}
          >
            <Image
            source={require('../../../assets/icon/bell.png')}
            style={styles.navIcon}
          />
            <View style={styles.notifBadge}><Text style={styles.notifNum}>3</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar name={user?.name || 'User'} size={36} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{getGreeting()}</Text>
          <Text style={styles.greeting}>
            Xin chào, {user?.name?.split(' ').slice(-1)[0]}
          </Text>
          <Text style={styles.greetingSub}>Bạn muốn thuê xe hôm nay?</Text>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Image
              source={require('../../../assets/icon/search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm xe phù hợp..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Image
                source={require('../../../assets/icon/filter.png')}
                style={styles.filterIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS STRIP */}
        <View style={styles.statsStrip}>
          {[
            { value: '50+', label: 'Xe' },
            { value: '4.9★', label: 'Đánh giá' },
            { value: '1K+', label: 'Khách hàng' },
          ].map((s, i) => (
            <View key={i} style={[styles.statItem, i !== 2 && { borderRightWidth: 1, borderRightColor: COLORS.border }]}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* CATEGORIES */}
        <View style={{ marginBottom: 20 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SIZES.md, gap: 8 }}>
            {VEHICLE_TYPES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.chip, activeType === t.id && styles.chipActive]}
                onPress={() => setActiveType(t.id)}
              >
                <Image
                  source={t.image}
                  style={styles.typeIcon}
                />
                <Text style={[styles.chipText, activeType === t.id && styles.chipTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FEATURED VEHICLES */}
        <SectionHeader
          title={search ? `Kết quả: "${search}"` : 'Xe nổi bật'}
          action={() => navigation.navigate('VehicleList')}
          actionLabel="Xem tất cả →"
        />

        {featured.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Image
              source={require('../../../assets/icon/search.png')}
              style={styles.emptyIcon}
            />
            <Text style={{ color: COLORS.textMuted, fontSize: SIZES.fontMd }}>Không tìm thấy xe phù hợp</Text>
          </View>
        ) : (
          featured.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={styles.vehicleCard}
              onPress={() => navigation.navigate('VehicleDetail', { vehicle })}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
              <Image
                source={vehicle.image}
                style={styles.vehicleImage}
                resizeMode="contain"
              />
            </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleBrand}>{vehicle.brand}</Text>
                <Text style={styles.vehicleModel}>{vehicle.model}</Text>
                <View style={styles.specRow}>
                    <Image
                      source={require('../../../assets/icon/seat.png')}
                      style={styles.specIcon}
                    />
                    <Text style={styles.specText}>
                      {vehicle.specs.seats} chỗ
                    </Text>

                    <Image
                      source={require('../../../assets/icon/fuel.png')}
                      style={styles.specIcon}
                    />
                    <Text style={styles.specText}>
                      {vehicle.specs.fuel}
                    </Text>

                    <Image
                      source={require('../../../assets/icon/calender.png')}
                      style={styles.specIcon}
                    />
                    <Text style={styles.specText}>
                      {vehicle.specs.year}
                    </Text>
                  </View>
              </View>
              <View style={styles.vehicleRight}>
                <Text style={styles.vehiclePrice}>{formatCurrency(vehicle.price)}</Text>
                <Text style={styles.vehiclePriceUnit}>{vehicle.priceUnit}</Text>
                <StatusBadge status={vehicle.status} />
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Cart FAB */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.cartFab}
          onPress={() => navigation.navigate('Cart')}
        >
          <Image
            source={require('../../../assets/icon/cart.png')}
            style={styles.cartIcon}
          />
          <View style={styles.cartBadge}>
            <Text style={styles.cartNum}>{totalItems}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  navbar: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: SIZES.md,
  },
  navLogo: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.white },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative', padding: 4 },
  notifBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: COLORS.gold, borderRadius: 8,
    width: 16, height: 16, justifyContent: 'center', alignItems: 'center',
  },
  notifNum: { color: COLORS.navy, fontSize: 9, fontWeight: '800' },
  hero: { backgroundColor: COLORS.navy, padding: SIZES.md, paddingTop: 8, paddingBottom: 28 },
  eyebrow: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.gold, letterSpacing: 2, marginBottom: 8 },
  greeting: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  greetingSub: { fontSize: SIZES.fontMd, color: 'rgba(255,255,255,0.5)', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  navIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
},
specRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
},

specIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
  marginRight: 4,
},

specText: {
  fontSize: SIZES.fontXs,
  color: COLORS.textMuted,
  marginRight: 10,
},
searchIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
},

filterIcon: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
},

typeIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
  marginRight: 6,
},

emptyIcon: {
  width: 50,
  height: 50,
  resizeMode: 'contain',
  marginBottom: 12,
},

cartIcon: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
},
  searchInput: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.white },
  filterBtn: {
    backgroundColor: COLORS.gold,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginTop: -16,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.medium,
    marginBottom: 20,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statVal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold, marginBottom: 2 },
  statLabel: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  chipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  chipText: { fontSize: SIZES.fontSm, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.white },
  vehicleCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    marginHorizontal: SIZES.md,
    marginBottom: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.small,
  },
  vehicleInfo: { flex: 1 },
  vehicleBrand: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.gold, marginBottom: 2 },
  vehicleModel: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  vehicleSpecs: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  vehicleRight: { alignItems: 'flex-end', gap: 4 },
  vehiclePrice: { fontSize: SIZES.fontLg, fontWeight: '800', color: COLORS.textPrimary },
  vehiclePriceUnit: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginBottom: 4 },
  cartFab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.gold,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  imageContainer: {
  width: 85,
  height: 85,
  backgroundColor: 'transparent',
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
},

vehicleImage: {
  width: 90,
  height: 90,
},
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartNum: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
});
