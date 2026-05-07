// src/screens/customer/BookingFormScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert,Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { GoldButton, formatCurrency } from '../../components/shared';

export default function BookingFormScreen({ navigation, route }) {
  const { cart = [], total = 0, promo = null } = route.params || {};
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [note, setNote] = useState('');
  const [promoInput] = useState(promo?.code || '');

  const handleNext = () => {
    if (!pickup.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa điểm nhận xe');
      return;
    }
    navigation.navigate('Payment', {
      cart,
      total,
      promo,
      pickup,
      dropoff: dropoff || pickup,
      note,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin đặt xe</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Tóm tắt đặt xe</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.bookingItem}>
              
              <View style={styles.vehicleImageBox}>
                <Image
                  source={item.image}
                  style={styles.vehicleImage}
                  resizeMode="contain"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.bookingItemName}>
                  {item.brand} {item.model}
                </Text>

                <Text style={styles.bookingItemDetail}>
                  {item.rentalDays} ngày · 
                  {formatCurrency(item.price * item.quantity * item.rentalDays)}đ
                </Text>
              </View>
            </View>
          ))}
          {promo && (
            <View style={styles.promoRow}>
              <Text style={{ color: COLORS.green, fontSize: SIZES.fontSm }}>🏷️ {promo.code}</Text>
              <Text style={{ color: COLORS.green, fontWeight: '700', fontSize: SIZES.fontSm }}>Đã áp dụng</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalVal}>{formatCurrency(total)}đ</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Địa điểm</Text>
          <Text style={styles.label}>NƠI NHẬN XE *</Text>
          <View style={styles.inputRow}>
            
            <TextInput
              style={styles.input}
              placeholder="Số nhà, đường, quận..."
              placeholderTextColor={COLORS.textMuted}
              value={pickup}
              onChangeText={setPickup}
            />
          </View>
          <Text style={[styles.label, { marginTop: 12 }]}>NƠI TRẢ XE</Text>
          <View style={styles.inputRow}>
            
            <TextInput
              style={styles.input}
              placeholder="Để trống nếu giống nơi nhận"
              placeholderTextColor={COLORS.textMuted}
              value={dropoff}
              onChangeText={setDropoff}
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Ghi chú</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Yêu cầu thêm, ghi chú cho tài xế..."
            placeholderTextColor={COLORS.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />
        </View>

        <GoldButton title="Tiếp tục thanh toán →" onPress={handleNext} style={{ marginTop: 8 }} />
        <View style={{ height: 32 }} />
      </ScrollView>
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
  content: { padding: SIZES.md, gap: 16 },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, ...SHADOWS.small },
  cardTitle: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingItemName: { fontSize: SIZES.fontMd, color: COLORS.textSecondary, fontWeight: '600' },
  bookingItemDetail: { fontSize: SIZES.fontMd, color: COLORS.textMuted },
  promoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 4,
  },
  vehicleImageBox: {
  width: 80,
  height: 80,
  backgroundColor: '#F8F8F8',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

vehicleImage: {
  width: 75,
  height: 75,
},
  totalLabel: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary },
  totalVal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold },
  section: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, ...SHADOWS.small },
  sectionTitle: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  label: { fontSize: SIZES.fontXs, color: COLORS.textMuted, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    height: 52,
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: COLORS.cream,
  },
  input: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary },
  noteInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    fontSize: SIZES.fontMd,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: COLORS.cream,
  },

});
