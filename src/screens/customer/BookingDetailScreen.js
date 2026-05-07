// src/screens/customer/BookingDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Image, } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { StatusBadge, GoldButton, formatCurrency } from '../../components/shared';
import { updateOrderStatus } from '../../services/storageService';

export default function BookingDetailScreen({ navigation, route }) {
  const { order } = route.params || {};
  
  if (!order) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: COLORS.text }}>Không tìm thấy đơn hàng</Text>
        </View>
      </View>
    );
  }

  const formatDate = (iso) => iso ? new Date(iso).toLocaleString('vi-VN') : '---';

  const handleCancel = () => {
    Alert.alert('Hủy đơn?', 'Bạn có chắc muốn hủy đơn hàng này?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Hủy đơn', style: 'destructive',
        onPress: async () => {
          await updateOrderStatus(order.id, 'cancelled');
          Alert.alert('Đã hủy', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.orderId}>#{order.id?.slice(-8)?.toUpperCase()}</Text>
            <StatusBadge status={order.status} />
          </View>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚗 Xe thuê</Text>
          {(order.items || []).map((item, i) => (
            <View key={i} style={styles.vehicleRow}>
              
              <View style={styles.vehicleImageBox}>
                <Image
                  source={item.image}
                  style={styles.vehicleImage}
                  resizeMode="contain"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleName}>
                  {item.brand} {item.model}
                </Text>

                <Text style={styles.vehicleDetail}>
                  {item.rentalDays} ngày thuê
                </Text>
              </View>

              <Text style={styles.vehiclePrice}>
                {formatCurrency(item.price * item.quantity * item.rentalDays)}đ
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Thông tin</Text>
          {[
            { label: '📍 Nhận xe', value: order.pickup },
            { label: '🏁 Trả xe', value: order.dropoff },
            { label: '💳 Thanh toán', value: order.paymentMethod },
            { label: '📝 Ghi chú', value: order.note || '(Không có)' },
          ].map((r, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{r.label}</Text>
              <Text style={styles.infoVal}>{r.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalVal}>{formatCurrency(order.total)}đ</Text>
          </View>
        </View>

        {order.status === 'pending' && (
          <>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>🗑 Hủy đơn hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewBtn} onPress={() => navigation.navigate('Review', { order })}>
              <Text style={styles.reviewText}>⭐ Viết đánh giá</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: SIZES.md, paddingBottom: 12, ...SHADOWS.small,
  },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  content: { padding: SIZES.md, gap: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, ...SHADOWS.small },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontFamily: 'Courier', fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.navy },
  date: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  cardTitle: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
 vehicleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
vehicleImageBox: {
  width: 70,
  height: 70,
  backgroundColor: '#F8F8F8',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

vehicleImage: {
  width: 65,
  height: 65,
},

vehiclePrice: {
  fontSize: SIZES.fontSm,
  fontWeight: '700',
  color: COLORS.gold,
},
  vehicleName: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textSecondary },
  vehicleDetail: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  infoVal: { fontSize: SIZES.fontSm, color: COLORS.textSecondary, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary },
  totalVal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold },
  cancelBtn: {
    backgroundColor: COLORS.redBg, borderRadius: SIZES.radiusMd, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.red,
  },
  cancelText: { color: COLORS.red, fontWeight: '700', fontSize: SIZES.fontMd },
  reviewBtn: {
    backgroundColor: COLORS.goldPale, borderRadius: SIZES.radiusMd, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.gold,
  },
  reviewText: { color: COLORS.gold, fontWeight: '700', fontSize: SIZES.fontMd },
});
