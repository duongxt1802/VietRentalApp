import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';

import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';

const KPI_CARDS = [
  {
    image: require('../../../assets/icon/moneyadmin.png'),
    label: 'Doanh thu tháng',
    value: '89.5M',
    unit: 'đ',
    trend: '+12%',
    trendUp: true,
  },
  {
    image: require('../../../assets/icon/order.png'),
    label: 'Đơn hôm nay',
    value: '14',
    unit: '',
    trend: '+3',
    trendUp: true,
  },
  {
    image: require('../../../assets/icon/car.png'),
    label: 'Xe đang thuê',
    value: '8',
    unit: '/20',
    trend: '40%',
    trendUp: false,
  },
  {
    image: require('../../../assets/icon/useradmin.png'), 
    label: 'Khách mới',
    value: '23',
    unit: '',
    trend: '+5%',
    trendUp: true,
  },
];

const QUICK_ACTIONS = [
  {
    image: require('../../../assets/icon/order.png'),
    label: 'Đơn',
    screen: 'AdminBookings',
    color: COLORS.orangeBg,
  },
  {
    image: require('../../../assets/icon/car.png'),
    label: 'Xe',
    screen: 'AdminVehicles',
    color: COLORS.blueBg,
  },
  {
    image: require('../../../assets/icon/useradmin.png'),
    label: 'KH',
    screen: 'AdminCustomers',
    color: COLORS.purpleBg,
  },
  {
    image: require('../../../assets/icon/coupon.png'),
    label: 'KM',
    screen: 'AdminPromotions',
    color: COLORS.greenBg,
  },
];


// ==========================
// DATA ĐỒNG BỘ VỚI DETAIL
// ==========================
const PENDING_ORDERS = [
  {
    id: 'ORD001',
    customer: 'Trần Hùng',
    phone: '0901234567',
    email: 'hung@gmail.com',
    total: 2550000,
    days: 3,
    status: 'pending',
    createdAt: new Date().toISOString(),
    pickup: 'Quận 1, TP.HCM',
    dropoff: 'Sân bay Tân Sơn Nhất',
    time: '10 phút trước',
    items: [
      {
        id: '1',
        brand: 'TOYOTA',
        model: 'Vios 2023',
        price: 850000,
        quantity: 1,
        rentalDays: 3,
        image: require('../../../assets/images/vios.png'),
      },
    ],
  },

  {
    id: 'ORD002',
    customer: 'Nguyễn Linh',
    phone: '0987654321',
    email: 'linh@gmail.com',
    total: 120000,
    days: 1,
    status: 'pending',
    createdAt: new Date().toISOString(),
    pickup: 'Quận 3, TP.HCM',
    dropoff: 'Quận 7, TP.HCM',
    time: '25 phút trước',
    items: [
      {
        id: '2',
        brand: 'HONDA',
        model: 'Wave Alpha 110',
        price: 120000,
        quantity: 1,
        rentalDays: 1,
        image: require('../../../assets/images/wave_alpha.png'),
      },
    ],
  },

  {
    id: 'ORD003',
    customer: 'Vũ Minh',
    phone: '0911111111',
    email: 'minh@gmail.com',
    total: 2200000,
    days: 2,
    status: 'pending',
    createdAt: new Date().toISOString(),
    pickup: 'Quận 7, TP.HCM',
    dropoff: 'Thủ Đức',
    time: '1 giờ trước',
    items: [
      {
        id: '3',
        brand: 'MAZDA',
        model: 'CX-5 2023',
        price: 1100000,
        quantity: 1,
        rentalDays: 2,
        image: require('../../../assets/images/cx5.png'),
      },
    ],
  },
];

export default function AdminDashboardScreen({
  navigation,
}) {
  const { logout } = useAuthContext();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navyDark}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            // ADMIN PANEL
          </Text>
          <Text style={styles.headerTitle}>
            Dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={styles.adminAvatar}
          onPress={logout}
        >
          <Text style={styles.avatarText}>
            AD
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI */}
        <View style={styles.kpiGrid}>
          {KPI_CARDS.map((k, i) => (
            <View
              key={i}
              style={styles.kpiCard}
            >
              <Image source={k.image} style={styles.kpiIcon} />

              <Text style={styles.kpiLabel}>
                {k.label}
              </Text>

              <Text style={styles.kpiValue}>
                {k.value}
                <Text style={styles.kpiUnit}>
                  {k.unit}
                </Text>
              </Text>

              <View
                style={[
                  styles.kpiTrend,
                  {
                    backgroundColor:
                      k.trendUp
                        ? COLORS.greenBg
                        : COLORS.redBg,
                  },
                ]}
              >
                <Text
                  style={{
                    color: k.trendUp
                      ? COLORS.green
                      : COLORS.red,
                    fontSize:
                      SIZES.fontXs,
                    fontWeight:
                      '700',
                  }}
                >
                  {k.trendUp
                    ? '↑'
                    : '↓'}{' '}
                  {k.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Truy cập nhanh
          </Text>

          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map(
              (a, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.quickAction,
                    {
                      backgroundColor:
                        a.color,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate(
                      a.screen
                    )
                  }
                >
                  <Image source={a.image} style={styles.qaIcon} />

                  <Text
                    style={
                      styles.qaLabel
                    }
                  >
                    {a.label}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Pending Orders */}
        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center',  marginBottom: 12 }}>
              <Image source={require('../../../assets/icon/pending.png')} style={{ width: 18, height: 18, resizeMode: 'contain',marginRight: 6  }} />
              <Text style={styles.sectionTitle}>Đơn chờ xác nhận</Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'AdminBookings'
                )
              }
            >
              <Text
                style={styles.seeAll}
              >
                Xem tất cả →
              </Text>
            </TouchableOpacity>
          </View>

          {PENDING_ORDERS.map(
            (o) => (
              <TouchableOpacity
                key={o.id}
                style={
                  styles.pendingCard
                }
                onPress={() =>
                  navigation.navigate(
                    'AdminBookingDetail',
                    {
                      order: o,
                    }
                  )
                }
              >
                <View
                  style={
                    styles.pendingLeft
                  }
                >
                  <Text
                    style={
                      styles.pendingId
                    }
                  >
                    #{o.id}
                  </Text>

                  <Text
                    style={
                      styles.pendingCustomer
                    }
                  >
                    {o.customer}
                  </Text>

                  <Text
                    style={
                      styles.pendingVehicle
                    }
                  >
                    {
                      o.items?.[0]
                        ?.brand
                    }{' '}
                    {
                      o.items?.[0]
                        ?.model
                    }{' '}
                    · {o.days} ngày
                  </Text>
                </View>

                <View
                  style={
                    styles.pendingRight
                  }
                >
                  <Text
                    style={
                      styles.pendingTotal
                    }
                  >
                    {(
                      o.total /
                      1000
                    ).toFixed(0)}
                    K
                  </Text>

                  <Text
                    style={
                      styles.pendingTime
                    }
                  >
                    {o.time}
                  </Text>

                  <View
                    style={
                      styles.pendingBadge
                    }
                  >
                    <Text
                      style={
                        styles.pendingBadgeText
                      }
                    >
                      Chờ
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Vehicle Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thống kê xe
          </Text>

          <View style={styles.statsRow}>
            {[
              {
                label:
                  'Sẵn sàng',
                count: 12,
                color:
                  COLORS.green,
              },
              {
                label:
                  'Đang thuê',
                count: 8,
                color:
                  COLORS.orange,
              },
              {
                label:
                  'Bảo dưỡng',
                count: 2,
                color:
                  COLORS.blue,
              },
              {
                label: 'Tổng',
                count: 22,
                color:
                  COLORS.navy,
              },
            ].map((s, i) => (
              <View
                key={i}
                style={[
                  styles.statItem,
                  {
                    borderTopWidth: 3,
                    borderTopColor:
                      s.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statCount,
                    {
                      color:
                        s.color,
                    },
                  ]}
                >
                  {s.count}
                </Text>

                <Text
                  style={
                    styles.statLabel
                  }
                >
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{ height: 30 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    backgroundColor:
      COLORS.navyDark,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal:
      SIZES.md,
    paddingBottom: 20,
  },
  kpiIcon: { width: 28, height: 28, resizeMode: 'contain' },
qaIcon: { width: 28, height: 28, resizeMode: 'contain' },
  eyebrow: {
    fontSize: SIZES.fontXs,
    color: COLORS.gold,
    fontFamily: 'Courier',
  },

  headerTitle: {
    fontSize: SIZES.fontXxl,
    fontWeight: '800',
    color: COLORS.white,
  },

  adminAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor:
      'rgba(255,255,255,0.1)',
    justifyContent:
      'center',
    alignItems: 'center',
  },

  avatarText: {
    color: COLORS.gold,
    fontWeight: '800',
  },

  scroll: {
    flex: 1,
  },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: SIZES.md,
  },

  kpiCard: {
    width: '47%',
    backgroundColor:
      COLORS.white,
    padding: 14,
    borderRadius:
      SIZES.radiusMd,
    ...SHADOWS.small,
  },


  kpiLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 6,
  },

  kpiValue: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
    marginTop: 6,
  },

  kpiUnit: {
    fontSize: SIZES.fontSm,
  },

  kpiTrend: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },

  section: {
    paddingHorizontal:
      SIZES.md,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    marginBottom: 12,
  },

  seeAll: {
    color: COLORS.gold,
    fontWeight: '700',
  },

  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },

  quickAction: {
    flex: 1,
    padding: 16,
    borderRadius:
      SIZES.radiusMd,
    alignItems: 'center',
  },

  qaLabel: {
    marginTop: 6,
    fontWeight: '700',
  },

  pendingCard: {
    backgroundColor:
      COLORS.white,
    borderRadius:
      SIZES.radiusMd,
    padding: 14,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 10,
    ...SHADOWS.small,
  },

  pendingLeft: {
    flex: 1,
  },

  pendingId: {
    color: COLORS.gold,
    fontWeight: '700',
  },

  pendingCustomer: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    marginTop: 4,
  },

  pendingVehicle: {
    color: COLORS.textMuted,
    marginTop: 4,
  },

  pendingRight: {
    alignItems: 'flex-end',
  },

  pendingTotal: {
    fontWeight: '800',
    fontSize: SIZES.fontLg,
    color: COLORS.navy,
  },

  pendingTime: {
    color: COLORS.textMuted,
    fontSize: SIZES.fontXs,
    marginTop: 4,
  },

  pendingBadge: {
    backgroundColor:
      COLORS.orangeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },

  pendingBadgeText: {
    color: COLORS.orange,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  statItem: {
    flex: 1,
    backgroundColor:
      COLORS.white,
    padding: 12,
    borderRadius:
      SIZES.radiusMd,
    alignItems: 'center',
    ...SHADOWS.small,
  },

  statCount: {
    fontSize: SIZES.fontXl,
    fontWeight: '800',
  },

  statLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});