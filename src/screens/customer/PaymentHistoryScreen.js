// src/screens/customer/PaymentHistoryScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { getOrders } from '../../services/storageService';
import { EmptyState, SkeletonBox, formatCurrency } from '../../components/shared';
import { useAuthContext } from '../../context/AuthContext';

export default function PaymentHistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useFocusEffect(useCallback(() => {
    (async () => {
      setLoading(true);
      const data = await getOrders(user?.id);
      setOrders(data || []);
      setLoading(false);
    })();
  }, [user?.id]));

  const total = orders.reduce((s, o) => s + (o.total || 0), 0);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '---';

  const methodLabel = (m) => ({ cash: '💵 Tiền mặt', bank: '🏦 Chuyển khoản', card: '💳 Thẻ' }[m] || m);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử thanh toán</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Summary banner */}
      <View style={styles.summaryBanner}>
        <View>
          <Text style={styles.summaryLabel}>Tổng chi tiêu</Text>
          <Text style={styles.summaryTotal}>{formatCurrency(total)}đ</Text>
        </View>
        <View>
          <Text style={styles.summaryLabel}>Số giao dịch</Text>
          <Text style={[styles.summaryTotal, { textAlign: 'right' }]}>{orders.length}</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ padding: SIZES.md, gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.txCard, { gap: 8 }]}>
              <SkeletonBox width="50%" height={12} radius={4} />
              <SkeletonBox width="100%" height={16} radius={4} />
              <SkeletonBox width="30%" height={10} radius={4} />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: SIZES.md, gap: 10, paddingBottom: 32 }}
          ListEmptyComponent={<EmptyState icon="💳" title="Chưa có giao dịch" subtitle="Đặt xe đầu tiên của bạn!" />}
          renderItem={({ item }) => {
  const firstVehicle = item.items?.[0];

  return (
    <View style={styles.txCard}>
      
      {/* Top */}
      <View style={styles.txTop}>
        <Text style={styles.txId}>
          #{item.id?.slice(-8)?.toUpperCase()}
        </Text>

        <Text
          style={[
            styles.txStatus,
            item.paymentStatus === 'paid'
              ? { color: COLORS.green }
              : { color: COLORS.orange }
          ]}
        >
          {item.paymentStatus === 'paid'
            ? '✅ Đã thanh toán'
            : '⏳ Chờ'}
        </Text>
      </View>

      {/* Date */}
      <Text style={styles.txDate}>
        {formatDate(item.createdAt)}
      </Text>

      {/* Vehicle info */}
      {firstVehicle && (
        <View style={styles.vehicleRow}>
          <View style={styles.vehicleImageBox}>
            <Image
              source={firstVehicle.image}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleName}>
              {firstVehicle.brand} {firstVehicle.model}
            </Text>

            <Text style={styles.vehicleDays}>
              {firstVehicle.rentalDays} ngày thuê
            </Text>
          </View>
        </View>
      )}

      {/* Bottom */}
      <View style={styles.txBottom}>
        <Text style={styles.txMethod}>
          {methodLabel(item.paymentMethod)}
        </Text>

        <Text style={styles.txAmount}>
          {formatCurrency(item.total)}đ
        </Text>
      </View>
      
    </View>
  );
}}/>
      )}
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
  summaryBanner: {
    backgroundColor: COLORS.navy, flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg, paddingVertical: 20,
  },
  vehicleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
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

vehicleName: {
  fontSize: SIZES.fontMd,
  fontWeight: '700',
  color: COLORS.textPrimary,
},

vehicleDays: {
  fontSize: SIZES.fontXs,
  color: COLORS.textMuted,
  marginTop: 4,
},
  summaryLabel: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },
  summaryTotal: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.gold },
  txCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 14, ...SHADOWS.small },
  txTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  txId: { fontFamily: 'Courier', fontSize: SIZES.fontSm, fontWeight: '700', color: COLORS.navy },
  txStatus: { fontSize: SIZES.fontSm, fontWeight: '600' },
  txDate: { fontSize: SIZES.fontXs, color: COLORS.textMuted, marginBottom: 10 },
  txBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txMethod: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  txAmount: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
});
