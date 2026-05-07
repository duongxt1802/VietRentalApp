// src/screens/customer/CartScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert, TextInput,Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useCartContext } from '../../context/CartContext';
import { GoldButton, EmptyState, VehiclePlaceholder, formatCurrency } from '../../components/shared';
import { PROMOTIONS } from '../../data/data';

export default function CartScreen({ navigation }) {
  const { cart, cartLoading, totalPrice, totalItems, increaseQty, decreaseQty, removeItem, clearAll } = useCartContext();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const discount = appliedPromo
    ? Math.min(totalPrice * (appliedPromo.discount / 100), appliedPromo.maxDiscount)
    : 0;
  const finalTotal = totalPrice - discount;

  const applyPromo = () => {
    const promo = PROMOTIONS.find(
      (p) => p.code === promoCode.toUpperCase() && p.status === 'active'
    );
    if (!promo) {
      Alert.alert('Mã không hợp lệ', 'Mã khuyến mãi không tồn tại hoặc đã hết hạn');
      return;
    }
    setAppliedPromo(promo);
    Alert.alert('Áp dụng thành công! 🎉', `Giảm ${promo.discount}% tối đa ${formatCurrency(promo.maxDiscount)}đ`);
  };

  const handleRemove = (item) => {
    Alert.alert('Xóa khỏi giỏ?', `${item.brand} ${item.model}`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => removeItem(item.id) },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigation.navigate('BookingForm', { cart, total: finalTotal, promo: appliedPromo });
  };

  if (cartLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.textMuted }}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        {cart.length > 0 && (
          <TouchableOpacity
            onPress={() => Alert.alert('Xóa tất cả?', '', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Xóa', style: 'destructive', onPress: clearAll },
            ])}
            style={{ padding: 8 }}
          >
            <Text style={{ color: COLORS.red, fontSize: SIZES.fontSm }}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <EmptyState
          icon={
            <Image
              source={require('../../../assets/icon/cart.png')}
              style={styles.emptyCartIcon}
            />
          }
          title="Giỏ hàng trống"
          subtitle="Thêm xe để bắt đầu đặt thuê"
          action={() => navigation.navigate('VehicleList')}
          actionLabel="Tìm xe ngay"
        />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: SIZES.md, gap: 12 }}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.vehicleImage}
                  resizeMode="contain"
                />
              </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemModel}>{item.model}</Text>
                  <View style={styles.dateRow}>
                    <Image
                      source={require('../../../assets/icon/calender.png')}
                      style={styles.smallIcon}
                    />
                    <Text style={styles.itemDates}>
                      {item.pickupDate} → {item.returnDate}
                    </Text>
                  </View>
                  <Text style={styles.itemDays}>{item.rentalDays} ngày thuê</Text>
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(item.price * item.quantity * item.rentalDays)}đ
                    </Text>
                    <Text style={styles.itemPriceSub}>
                      {formatCurrency(item.price)}/ngày
                    </Text>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    style={styles.deleteBtn}
                  >
                    <Image
                      source={require('../../../assets/icon/trash.png')}
                      style={styles.deleteIcon}
                    />
                  </TouchableOpacity>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => decreaseQty(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => increaseQty(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={
              <>
                {/* Promo code */}
                <View style={styles.promoBox}>
                  <View style={styles.promoTitleRow}>
                    <Image
                      source={require('../../../assets/icon/coupon.png')}
                      style={styles.smallIcon}
                    />
                    <Text style={styles.promoTitle}>Mã khuyến mãi</Text>
                  </View>
                  <View style={styles.promoRow}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Nhập mã (VD: SUMMER2025)"
                      placeholderTextColor={COLORS.textMuted}
                      value={promoCode}
                      onChangeText={setPromoCode}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.promoApplyBtn} onPress={applyPromo}>
                      <Text style={styles.promoApplyText}>Áp dụng</Text>
                    </TouchableOpacity>
                  </View>
                  {appliedPromo && (
                    <View style={styles.promoApplied}>
                      <Text style={styles.promoAppliedText}>
                         {appliedPromo.code} — Giảm {formatCurrency(discount)}đ
                      </Text>
                      <TouchableOpacity onPress={() => { setAppliedPromo(null); setPromoCode(''); }}>
                        <Text style={{ color: COLORS.red, fontSize: SIZES.fontSm }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Summary */}
                <View style={styles.summary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tạm tính ({totalItems} xe)</Text>
                    <Text style={styles.summaryVal}>{formatCurrency(totalPrice)}đ</Text>
                  </View>
                  {discount > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: COLORS.green }]}>Giảm giá</Text>
                      <Text style={{ color: COLORS.green, fontWeight: '700' }}>−{formatCurrency(discount)}đ</Text>
                    </View>
                  )}
                  <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border }]}>
                    <Text style={[styles.summaryLabel, { fontWeight: '800', color: COLORS.textPrimary, fontSize: SIZES.fontLg }]}>
                      Tổng cộng
                    </Text>
                    <Text style={styles.totalPrice}>{formatCurrency(finalTotal)}đ</Text>
                  </View>
                </View>
              </>
            }
          />

          <View style={styles.bottomBar}>
            <GoldButton
              title={`Đặt thuê (${formatCurrency(finalTotal)}đ) →`}
              onPress={handleCheckout}
              style={{ flex: 1 }}
            />
          </View>
        </>
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
  cartItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    ...SHADOWS.small,
  },
  itemInfo: { flex: 1 },
  itemBrand: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.gold, marginBottom: 2 },
  itemModel: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  itemDates: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginBottom: 2 },
  itemDays: { fontSize: SIZES.fontXs, color: COLORS.blue, fontWeight: '600', marginBottom: 6 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  itemPrice: { fontSize: SIZES.fontLg, fontWeight: '800', color: COLORS.textPrimary },
  itemPriceSub: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  itemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  deleteBtn: { padding: 4 },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cream,
    borderRadius: SIZES.radiusMd,
    padding: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.navy },
  qty: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary, minWidth: 20, textAlign: 'center' },
  promoBox: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginTop: 12,
    ...SHADOWS.small,
  },
  promoTitle: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  promoRow: { flexDirection: 'row', gap: 8 },
  promoInput: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    fontSize: SIZES.fontMd,
    fontFamily: 'Courier',
    color: COLORS.textPrimary,
  },
  promoApplyBtn: {
    backgroundColor: COLORS.navy,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  promoApplyText: { color: COLORS.white, fontWeight: '700', fontSize: SIZES.fontSm },
  promoApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: COLORS.greenBg,
    borderRadius: SIZES.radiusMd,
    padding: 10,
  },
  promoAppliedText: { fontSize: SIZES.fontSm, color: COLORS.greenText, fontWeight: '600' },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginTop: 12,
    marginBottom: 100,
    ...SHADOWS.small,
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
  emptyCartIcon: {
  width: 70,
  height: 70,
  resizeMode: 'contain',
},

dateRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 2,
},

smallIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
},

deleteIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
},

promoTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 10,
},

promoSuccessRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

closeIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: SIZES.fontMd, color: COLORS.textMuted },
  summaryVal: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, fontWeight: '600' },
  totalPrice: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SIZES.md,
    paddingBottom: 28,
    ...SHADOWS.large,
  },
});
