// src/screens/admin/AdminBookingsScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
 StatusBar,
  Image,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { getOrders, saveOrder } from '../../services/storageService';

import {
  StatusBadge,
  EmptyState,
  formatCurrency,
  SkeletonBox,
} from '../../components/shared';


// ======================
// DEMO ORDERS
// ======================
const DEMO_ORDERS = [
  {
    id: 'ORD001',
    customer: 'Trần Hùng',
    total: 2550000,
    days: 3,
    status: 'pending',
    createdAt: new Date().toISOString(),
    pickup: 'Quận 1, TP.HCM',
    items: [
      {
        id: '1',
        brand: 'TOYOTA',
        model: 'Vios 2023',
        image: require('../../../assets/images/vios.png'),
      },
    ],
  },
  {
    id: 'ORD002',
    customer: 'Nguyễn Linh',
    total: 120000,
    days: 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
    pickup: 'Quận 3, TP.HCM',
    items: [
      {
        id: '2',
        brand: 'HONDA',
        model: 'Wave Alpha 110',
        image: require('../../../assets/images/wave_alpha.png'),
      },
    ],
  },
  {
    id: 'ORD003',
    customer: 'Vũ Minh',
    total: 2200000,
    days: 2,
    status: 'pending',
    createdAt: new Date().toISOString(),
    pickup: 'Quận 7, TP.HCM',
    items: [
      {
        id: '3',
        brand: 'MAZDA',
        model: 'CX-5 2023',
        image: require('../../../assets/images/cx5.png'),
      },
    ],
  },
];

export default function AdminBookingsScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = React.useState('all');

  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        try {
          setLoading(true);

          let storedOrders = await getOrders();

          // Nếu chưa có đơn nào -> seed demo
          if (!storedOrders || storedOrders.length === 0) {
            for (const order of DEMO_ORDERS) {
              await saveOrder(order);
            }

            storedOrders = await getOrders();
          }

          setOrders(storedOrders || []);
        } catch (error) {
          console.log('Load orders error:', error);
        } finally {
          setLoading(false);
        }
      };

      loadOrders();
    }, [])
  );

  const filtered =
    filter === 'all'
      ? orders
      : (orders || []).filter((o) => o.status === filter);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navyDark}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 8 }}
        >
          <Text style={{ color: COLORS.white, fontSize: 20 }}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Quản lý đơn hàng
        </Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {
            label: 'Tổng',
            val: (orders || []).length,
            color: COLORS.gold,
          },
          {
            label: 'Chờ',
            val: (orders || []).filter(
              (o) => o.status === 'pending'
            ).length,
            color: COLORS.orange,
          },
          {
            label: 'Xác nhận',
            val: (orders || []).filter(
              (o) => o.status === 'confirmed'
            ).length,
            color: COLORS.green,
          },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text
              style={[
                styles.statVal,
                { color: s.color },
              ]}
            >
              {s.val}
            </Text>

            <Text style={styles.statLabel}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {[
          ['all', 'Tất cả'],
          ['pending', 'Chờ xác nhận'],
          ['confirmed', 'Đã xác nhận'],
          ['cancelled', 'Đã hủy'],
        ].map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.chip,
              filter === id && styles.chipActive,
            ]}
            onPress={() => setFilter(id)}
          >
            <Text
              style={[
                styles.chipText,
                filter === id &&
                  styles.chipTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ padding: SIZES.md, gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.card, { gap: 8 }]}
            >
              <SkeletonBox
                width="50%"
                height={12}
                radius={4}
              />
              <SkeletonBox
                width="100%"
                height={40}
                radius={8}
              />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: SIZES.md,
            gap: 10,
            paddingBottom: 32,
          }}
          ListEmptyComponent={
            <EmptyState
              icon="📋"
              title="Không có đơn hàng"
              subtitle="Chưa có đơn hàng nào ở trạng thái này"
            />
          }
          renderItem={({ item }) => {
            const firstVehicle =
              item.items?.[0];

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate(
                    'AdminBookingDetail',
                    { order: item }
                  )
                }
              >
                {/* Top */}
                <View style={styles.cardTop}>
                  <Text style={styles.orderId}>
                    #{item.id}
                  </Text>

                  <StatusBadge
                    status={item.status}
                  />
                </View>

                <Text style={styles.orderDate}>
                  {new Date(
                    item.createdAt
                  ).toLocaleString('vi-VN')}
                </Text>

                {/* Vehicle */}
                {firstVehicle && (
                  <View style={styles.vehicleRow}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={firstVehicle.image}
                        style={styles.vehicleImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.vehicleName}>
                        {firstVehicle.brand}{' '}
                        {firstVehicle.model}
                      </Text>

                      <Text style={styles.vehicleDays}>
                        {item.days} ngày thuê
                      </Text>
                    </View>
                  </View>
                )}

                {/* Bottom */}
                <View style={styles.cardBottom}>
                  <Text style={styles.orderItems}>
                    {item.items?.length || 0} xe ·{' '}
                    {item.pickup}
                  </Text>

                  <Text style={styles.orderTotal}>
                    {formatCurrency(item.total)}đ
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    backgroundColor: COLORS.navyDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SIZES.md,
    paddingBottom: 14,
  },

  headerTitle: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    color: COLORS.white,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyDark,
    paddingHorizontal: SIZES.md,
    paddingBottom: 16,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor:
      'rgba(255,255,255,0.07)',
    borderRadius: SIZES.radiusMd,
    padding: 10,
    alignItems: 'center',
  },

  statVal: {
    fontSize: SIZES.fontXxl,
    fontWeight: '800',
  },

  statLabel: {
    fontSize: SIZES.fontXs,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: SIZES.md,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },

  chipText: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  chipTextActive: {
    color: COLORS.navy,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    ...SHADOWS.small,
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  orderId: {
    fontFamily: 'Courier',
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.navy,
  },

  orderDate: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginBottom: 10,
  },

  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  imageContainer: {
    width: 85,
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },

  vehicleImage: {
    width: '100%',
    height: '100%',
  },

  vehicleName: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  vehicleDays: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderItems: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
  },

  orderTotal: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.gold,
  },
});