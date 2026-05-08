// src/screens/customer/BookingSuccessScreen.js
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,Image,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { GoldButton, formatCurrency } from '../../components/shared';

export default function BookingSuccessScreen({ navigation, route }) {
  const { order } = route.params || {};

  const formatDate = (iso) => {
    if (!iso) return '---';
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đặt xe thành công!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Success icon */}
        <View style={styles.successCircle}>
          <Image
            source={require('../../../assets/icon/check-success.png')}
            style={styles.successIcon}
          />
        </View>
        <Text style={styles.successTitle}>Đặt xe thành công!</Text>
        <Text style={styles.successSub}>Chúng tôi sẽ xác nhận đơn hàng trong vài phút</Text>

        {/* Order info */}
        <View style={styles.orderCard}>
          <View style={styles.orderIdRow}>
            <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
            <Text style={styles.orderId}>#{order?.id?.slice(-8)?.toUpperCase()}</Text>
          </View>

          <View style={styles.divider} />

          {[
            {
              image: require('../../../assets/icon/calender.png'),
              label: 'Thời gian đặt',
              value: formatDate(order?.createdAt)
            },
            {
              image: require('../../../assets/icon/card.png'),
              label: 'Thanh toán',
              value:
                order?.paymentMethod === 'cash'
                  ? 'Tiền mặt'
                  : order?.paymentMethod === 'bank'
                  ? 'Chuyển khoản'
                  : 'Thẻ tín dụng'
            },
            {
              image: require('../../../assets/icon/locationhome.png'),
              label: 'Nhận xe',
              value: order?.pickup || '---'
            },
            {
              image: require('../../../assets/icon/moneyadmin.png'),
              label: 'Tổng tiền',
              value: `${formatCurrency(order?.total || 0)}đ`
            }
          ].map((row, i) => (
            <View key={i} style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Image source={row.image} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>{row.label}</Text>
              </View>

              <Text
                style={[
                  styles.infoValue,
                  row.label === 'Tổng tiền' && {
                    color: COLORS.gold,
                    fontWeight: '800'
                  }
                ]}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <GoldButton
          title="Xem đơn hàng của tôi"
          onPress={() => navigation.navigate('MyBookings')}
          style={{ marginTop: 8 }}
        />
        <TouchableOpacity
          style={{ alignItems: 'center', marginTop: 14 }}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={{ color: COLORS.textMuted, fontSize: SIZES.fontMd }}>Về trang chủ</Text>
        </TouchableOpacity>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.white },
  content: { padding: SIZES.md, alignItems: 'center' },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.greenBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    borderWidth: 3,
    borderColor: COLORS.green,
  },
  successIcon: {
  width: 55,
  height: 55,
  resizeMode: 'contain'
},
  successTitle: { fontSize: SIZES.fontHero, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: SIZES.fontMd, color: COLORS.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  orderIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  orderIdLabel: { fontSize: SIZES.fontMd, color: COLORS.textMuted },
  orderId: { fontFamily: 'Courier', fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.navy },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  infoValue: { fontSize: SIZES.fontSm, fontWeight: '600', color: COLORS.textSecondary, maxWidth: '55%', textAlign: 'right' },
  successIcon: {
  width: 55,
  height: 55,
  resizeMode: 'contain',
},

infoLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

infoIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
},

timelineIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
},
});
