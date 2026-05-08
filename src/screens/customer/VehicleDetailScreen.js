// src/screens/customer/VehicleDetailScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useCartContext } from '../../context/CartContext';
import { VehiclePlaceholder, StatusBadge, GoldButton, formatCurrency } from '../../components/shared';

const REVIEWS = [
  { id: 1, name: 'Trần Hùng', rating: 5, comment: 'Xe rất tốt, sạch sẽ, dịch vụ chu đáo!', date: '12/03/2025' },
  { id: 2, name: 'Nguyễn Linh', rating: 4, comment: 'Xe chạy êm, nhân viên hỗ trợ nhiệt tình.', date: '05/03/2025' },
  { id: 3, name: 'Vũ Minh', rating: 5, comment: 'Trải nghiệm thuê xe tuyệt vời, sẽ quay lại!', date: '28/02/2025' },
];

export default function VehicleDetailScreen({ navigation, route }) {
  const { vehicle } = route.params || {};
  
  if (!vehicle) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết xe</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: COLORS.text }}>Không tìm thấy thông tin xe</Text>
        </View>
      </View>
    );
  }

  const { addItem } = useCartContext();
  const [rentalDays, setRentalDays] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const [adding, setAdding] = useState(false);

  const totalPrice = vehicle.price * rentalDays;

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const pickupDate = new Date().toISOString().split('T')[0];
      const returnDate = new Date(Date.now() + rentalDays * 86400000).toISOString().split('T')[0];
      await addItem(vehicle, rentalDays, pickupDate, returnDate);
      Alert.alert('Đã thêm vào giỏ! 🛒', `${vehicle.model} (${rentalDays} ngày)`, [
        { text: 'Tiếp tục xem', style: 'cancel' },
        { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch {
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ');
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết xe</Text>
        <TouchableOpacity style={{ padding: 8 }}>
          <TouchableOpacity style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>❤️</Text>
        </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroSection}>
          <View style={styles.imagePlaceholder}>
            <Image
              source={vehicle.image}
              style={styles.vehicleImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.heroOverlay}>
            <Text style={styles.brand}>{vehicle.brand}</Text>
            <Text style={styles.model}>{vehicle.model}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {vehicle.rating}</Text>
              <Text style={styles.reviews}>({vehicle.reviewCount} đánh giá)</Text>
              <StatusBadge status={vehicle.status} />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {['info', 'specs', 'reviews'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'info' ? 'Thông tin' : tab === 'specs' ? 'Thông số' : 'Đánh giá'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'info' && (
            <>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <Text style={styles.description}>{vehicle.description}</Text>

              <Text style={styles.sectionTitle}>Vị trí</Text>
              <View style={styles.locationRow}>
              <Image
                source={require('../../../assets/icon/locationhome.png')}
                style={styles.smallIcon}
              />
              <Text style={styles.locationText}>{vehicle.location}</Text>
            </View>

              <Text style={styles.sectionTitle}>Trang bị kèm theo</Text>
              <View style={styles.featuresGrid}>
                {vehicle.features.map((f, i) => (
                  <View key={i} style={styles.featureChip}>
                    <Text style={styles.featureText}>✓ {f}</Text>
                  </View>
                ))}
              </View>

              {/* Rental days picker */}
              <Text style={styles.sectionTitle}>Số ngày thuê</Text>
              <View style={styles.daysRow}>
                <TouchableOpacity
                  style={styles.dayBtn}
                  onPress={() => setRentalDays((d) => Math.max(1, d - 1))}
                >
                  <Text style={styles.dayBtnText}>−</Text>
                </TouchableOpacity>
                <View style={styles.daysDisplay}>
                  <Text style={styles.daysNum}>{rentalDays}</Text>
                  <Text style={styles.daysLabel}>ngày</Text>
                </View>
                <TouchableOpacity
                  style={styles.dayBtn}
                  onPress={() => setRentalDays((d) => d + 1)}
                >
                  <Text style={styles.dayBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Price summary */}
              <View style={styles.priceSummary}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>{formatCurrency(vehicle.price)}đ × {rentalDays} ngày</Text>
                  <Text style={styles.priceRowValue}>{formatCurrency(totalPrice)}đ</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={[styles.priceRowLabel, { fontWeight: '700', color: COLORS.textPrimary }]}>Tổng cộng</Text>
                  <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}đ</Text>
                </View>
              </View>
            </>
          )}

          {activeTab === 'specs' && (
            <View style={styles.specsGrid}>
              {[
                {
                  icon: require('../../../assets/icon/seat.png'),
                  label: 'Số chỗ',
                  value: `${vehicle.specs.seats} chỗ`
                },
                {
                  icon: require('../../../assets/icon/fuel.png'),
                  label: 'Nhiên liệu',
                  value: vehicle.specs.fuel
                },
                {
                  icon: require('../../../assets/icon/setting.png'),
                  label: 'Hộp số',
                  value: vehicle.specs.transmission
                },
                {
                  icon: require('../../../assets/icon/calender.png'),
                  label: 'Năm sản xuất',
                  value: String(vehicle.specs.year)
                },
                {
                  icon: require('../../../assets/icon/car.png'),
                  label: 'Loại xe',
                  value: vehicle.typeLabel
                },
                {
                  icon: require('../../../assets/icon/locationshop.png'),
                  label: 'Địa điểm',
                  value: vehicle.location
                },
                  ].map((spec, i) => (
                <View key={i} style={styles.specItem}>
                  <Image
                    source={spec.icon}
                    style={styles.specImage}
                  />
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'reviews' && (
            <>
              <View style={styles.ratingOverview}>
                <Text style={styles.bigRating}>{vehicle.rating}</Text>
                <Text style={styles.stars}>{'⭐'.repeat(Math.floor(vehicle.rating))}</Text>
                <Text style={styles.reviewCount}>{vehicle.reviewCount} đánh giá</Text>
              </View>
              {REVIEWS.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.white }}>
                        {r.name[0]}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{r.name}</Text>
                      <Text style={styles.reviewDate}>{r.date}</Text>
                    </View>
                    <Text>{'⭐'.repeat(r.rating)}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotal}>{formatCurrency(totalPrice)}đ</Text>
          <Text style={styles.bottomDays}>({rentalDays} ngày thuê)</Text>
        </View>
        <GoldButton
          title="Thêm vào giỏ"
          onPress={handleAddToCart}
          loading={adding}
          style={{ flex: 1, marginLeft: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SIZES.md,
    paddingBottom: 12,
  },
  backBtn: { padding: 8 },
  backText: { color: COLORS.white, fontSize: 20 },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '700', color: COLORS.white },
  heroSection: { backgroundColor: COLORS.navy, paddingBottom: 24 },
  imagePlaceholder: {
  height: 220,
  marginHorizontal: SIZES.md,
  borderRadius: SIZES.radiusMd,
  marginBottom: 16,
  overflow: 'hidden', 
},

vehicleImage: {
  width: '100%',
  height: '100%',
},
  heroOverlay: { paddingHorizontal: SIZES.md },
  brand: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.gold, letterSpacing: 2, marginBottom: 4 },
  model: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.white, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rating: { fontSize: SIZES.fontMd, color: COLORS.gold, fontWeight: '700' },
  reviews: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.4)' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.md,
    paddingTop: 12,
    ...SHADOWS.small,
  },

  tab: { flex: 1, alignItems: 'center', paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.gold },
  tabText: { fontSize: SIZES.fontMd, color: COLORS.textMuted, fontWeight: '600' },
  tabTextActive: { color: COLORS.gold, fontWeight: '700' },
  tabContent: { padding: SIZES.md },
  sectionTitle: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginTop: 20, marginBottom: 10 },
  description: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, lineHeight: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { fontSize: SIZES.fontMd, color: COLORS.textSecondary },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featureChip: {
    backgroundColor: COLORS.greenBg,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureText: { fontSize: SIZES.fontSm, color: COLORS.greenText, fontWeight: '600' },
  daysRow: { flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'center', marginVertical: 8 },
  dayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayBtnText: { fontSize: 22, fontWeight: '700', color: COLORS.navy },
  daysDisplay: { alignItems: 'center' },
  daysNum: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary },
  daysLabel: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  priceSummary: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginTop: 16,
    ...SHADOWS.small,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceRowLabel: { fontSize: SIZES.fontMd, color: COLORS.textMuted },
  priceRowValue: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, fontWeight: '600' },
  priceDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalPrice: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  specItem: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  specIcon: { fontSize: 24, marginBottom: 6 },
  specLabel: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginBottom: 4 },
  specValue: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary },
  ratingOverview: { alignItems: 'center', paddingVertical: 20 },
  bigRating: { fontSize: 56, fontWeight: '800', color: COLORS.gold },
  stars: { fontSize: 20, marginBottom: 4 },
  reviewCount: { fontSize: SIZES.fontMd, color: COLORS.textMuted },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewName: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary },
  reviewDate: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  reviewComment: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, lineHeight: 22 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: 16,
    paddingBottom: 28,
    ...SHADOWS.large,
  },
  headerIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
},

smallIcon: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
},

featureRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

featureIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
  marginRight: 6,
},

specImage: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
  marginBottom: 6,
},

ratingBox: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5,
},

reviewStars: {
  flexDirection: 'row',
},

reviewStarIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
  marginLeft: 2,
},
  bottomTotal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  bottomDays: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
});
