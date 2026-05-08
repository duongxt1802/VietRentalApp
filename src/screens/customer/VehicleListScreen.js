// src/screens/customer/VehicleListScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar,Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { VEHICLES, VEHICLE_TYPES } from '../../data/data';
import { VehiclePlaceholder, StatusBadge, VehicleCardSkeleton, formatCurrency } from '../../components/shared';

const SORT_OPTIONS = [
  { id: 'default', label: 'Mặc định' },
  { id: 'price_asc', label: 'Giá tăng dần' },
  { id: 'price_desc', label: 'Giá giảm dần' },
  { id: 'rating', label: 'Đánh giá cao' },
];

export default function VehicleListScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [sort, setSort] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    let result = VEHICLES.filter((v) => {
      const matchType = activeType === 'all' || v.type === activeType;
      const matchSearch =
        !search ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.typeLabel.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });

    if (sort === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [search, activeType, sort]);

  const renderVehicle = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VehicleDetail', { vehicle: item })}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
  <Image
    source={item.image}
    style={styles.vehicleImage}
    resizeMode="contain"
  />
</View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <Text style={styles.model}>{item.model}</Text>
        <View style={styles.specRow}>
            <Image
              source={require('../../../assets/icon/seat.png')}
              style={styles.specIcon}
            />
            <Text style={styles.specText}>{item.specs.seats}</Text>

            <Image
              source={require('../../../assets/icon/fuel.png')}
              style={styles.specIcon}
            />
            <Text style={styles.specText}>{item.specs.fuel}</Text>

            <Image
              source={require('../../../assets/icon/locationhome.png')}
              style={styles.specIcon}
            />
            <Text style={styles.specText}>{item.location}</Text>
          </View>
        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.price}>{formatCurrency(item.price)}đ</Text>
            <Text style={styles.priceUnit}>{item.priceUnit}</Text>
          </View>
          <StatusBadge status={item.status} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Image
          source={require('../../../assets/icon/back.png')}
          style={styles.backIcon}
        />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm xe</Text>
        <TouchableOpacity onPress={() => setShowSort(!showSort)} style={styles.sortBtn}>
          <Image
          source={require('../../../assets/icon/filter.png')}
          style={styles.sortIcon}
        />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image
            source={require('../../../assets/icon/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, loại, địa điểm..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: COLORS.textMuted }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.sortOption, sort === opt.id && styles.sortOptionActive]}
              onPress={() => { setSort(opt.id); setShowSort(false); }}
            >
              <Text style={[styles.sortOptionText, sort === opt.id && { color: COLORS.gold, fontWeight: '700' }]}>
                {opt.label}
              </Text>
              {sort === opt.id && <Text style={{ color: COLORS.gold }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Type filters */}
      <View style={{ paddingVertical: 10 }}>
        <FlatList
          horizontal
          data={VEHICLE_TYPES}
          keyExtractor={(t) => t.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SIZES.md, gap: 8 }}
          renderItem={({ item: t }) => (
            <TouchableOpacity
              style={[styles.chip, activeType === t.id && styles.chipActive]}
              onPress={() => setActiveType(t.id)}
            >
              <Image
                source={t.image}
                style={styles.typeIcon}
              />
              <Text style={[styles.chipText, activeType === t.id && styles.chipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results count */}
      <Text style={styles.resultCount}>{filtered.length} xe được tìm thấy</Text>

      {/* List */}
      {loading ? (
        <View>
          {[1, 2, 3].map((i) => <VehicleCardSkeleton key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderVehicle}
          contentContainerStyle={{ paddingHorizontal: SIZES.md, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 48 }}>
              <Image
                source={require('../../../assets/icon/search.png')}
                style={styles.emptyIcon}
              />
              <Text style={{ color: COLORS.textMuted, fontSize: SIZES.fontLg, fontWeight: '600' }}>Không tìm thấy xe</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: SIZES.fontMd, marginTop: 4 }}>Thử thay đổi từ khóa tìm kiếm</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SIZES.md,
    paddingBottom: 12,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  sortBtn: { padding: 8 },
  sortIcon: { fontSize: 20 },
  searchContainer: { backgroundColor: COLORS.white, paddingHorizontal: SIZES.md, paddingBottom: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary },
  sortDropdown: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
    zIndex: 100,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sortOptionActive: { backgroundColor: 'rgba(245,166,35,0.05)' },
  sortOptionText: { fontSize: SIZES.fontMd, color: COLORS.textSecondary },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
},

searchIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
},

closeIcon: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
},

typeIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
  marginRight: 5,
},

checkIcon: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
},

emptyIcon: {
  width: 55,
  height: 55,
  resizeMode: 'contain',
  marginBottom: 12,
},

specRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: 10,
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

sortIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
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
  chipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  chipText: { fontSize: SIZES.fontSm, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.white },
  resultCount: { fontSize: SIZES.fontSm, color: COLORS.textMuted, paddingHorizontal: SIZES.md, marginBottom: 8 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 14,
    ...SHADOWS.small,
  },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  brand: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.gold, fontWeight: '700' },
  rating: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  model: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  specs: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginBottom: 10, lineHeight: 18 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: SIZES.fontLg, fontWeight: '800', color: COLORS.textPrimary },
  priceUnit: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
});
