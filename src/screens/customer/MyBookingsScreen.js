// src/screens/customer/MyBookingsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar,Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { getOrders } from '../../services/storageService';
import { StatusBadge, EmptyState, SkeletonBox, formatCurrency } from '../../components/shared';
import { useAuthContext } from '../../context/AuthContext';

const FILTER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'completed', label: 'Hoàn tất' },
  { id: 'cancelled', label: 'Đã hủy' },
];

export default function MyBookingsScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuthContext();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getOrders(user?.id);
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, [user?.id]));

  const filtered = activeFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const formatDate = (iso) => {
    if (!iso) return '---';
    return new Date(iso).toLocaleDateString('vi-VN');
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('BookingDetail', { order: item })}
      activeOpacity={0.9}
    >
      <View style={styles.orderTop}>
        <View>
          <Text style={styles.orderId}>#{item.id?.slice(-8)?.toUpperCase()}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.orderDivider} />

      <View style={styles.orderItems}>
        {(item.items || []).slice(0, 2).map((v, i) => (
        <View key={i} style={styles.vehicleRow}>
          
          <View style={styles.vehicleImageBox}>
            <Image
              source={v.image}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.orderItemText}>
              {v.brand} {v.model}
            </Text>

            <Text style={styles.vehicleDays}>
              {v.rentalDays} ngày thuê
            </Text>
          </View>

          <Text style={styles.vehiclePrice}>
            {formatCurrency((v.price * v.rentalDays) * (v.quantity || 1))}đ
          </Text>
        </View>
      ))}
        {(item.items || []).length > 2 && (
          <Text style={styles.orderMore}>+{item.items.length - 2} xe khác</Text>
        )}
      </View>

      <View style={styles.orderBottom}>
        <View style={styles.methodChip}>
          <Text style={styles.methodText}>
            {item.paymentMethod === 'cash' ? '💵 Tiền mặt' : item.paymentMethod === 'bank' ? '🏦 Chuyển khoản' : '💳 Thẻ'}
          </Text>
        </View>
        <Text style={styles.orderTotal}>{formatCurrency(item.total)}đ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter tabs */}
      <View style={{ paddingVertical: 10, backgroundColor: COLORS.white }}>
        <FlatList
          horizontal
          data={FILTER_TABS}
          keyExtractor={(t) => t.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SIZES.md, gap: 8 }}
          renderItem={({ item: t }) => (
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === t.id && styles.filterTabActive]}
              onPress={() => setActiveFilter(t.id)}
            >
              <Text style={[styles.filterTabText, activeFilter === t.id && styles.filterTabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={{ padding: SIZES.md, gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.orderCard, { gap: 10 }]}>
              <SkeletonBox width="60%" height={14} radius={4} />
              <SkeletonBox width="100%" height={40} radius={8} />
              <SkeletonBox width="40%" height={12} radius={4} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SIZES.md, gap: 12, paddingBottom: 32 }}
          renderItem={renderOrder}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="📋"
              title="Chưa có đơn hàng"
              subtitle={activeFilter !== 'all' ? 'Không có đơn nào ở trạng thái này' : 'Bắt đầu thuê xe ngay hôm nay!'}
              action={activeFilter === 'all' ? () => navigation.navigate('VehicleList') : null}
              actionLabel="Tìm xe ngay"
            />
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
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  filterTabText: { fontSize: SIZES.fontSm, color: COLORS.textMuted, fontWeight: '600' },
  filterTabTextActive: { color: COLORS.white },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    ...SHADOWS.small,
  },
  vehicleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

vehicleImageBox: {
  width: 65,
  height: 65,
  backgroundColor: '#F8F8F8',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

vehicleImage: {
  width: 60,
  height: 60,
},

vehicleDays: {
  fontSize: SIZES.fontXs,
  color: COLORS.textMuted,
  marginTop: 2,
},

vehiclePrice: {
  fontSize: SIZES.fontSm,
  fontWeight: '700',
  color: COLORS.gold,
},
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontFamily: 'Courier', fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.navy },
  orderDate: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginTop: 2 },
  orderDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  orderItems: { gap: 4, marginBottom: 12 },
  orderItemText: { fontSize: SIZES.fontSm, color: COLORS.textSecondary },
  orderMore: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginTop: 2 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  methodChip: {
    backgroundColor: COLORS.blueBg,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  methodText: { fontSize: SIZES.fontXs, color: COLORS.blue, fontWeight: '600' },
  orderTotal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold },
});
