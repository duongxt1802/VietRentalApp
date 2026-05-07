// src/screens/admin/AdminBookingDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';

import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { formatCurrency } from '../../components/shared';
import { updateOrderStatus } from '../../services/storageService';

export default function AdminBookingDetailScreen({
  navigation,
  route,
}) {
  const { order } = route.params || {};
  const [status, setStatus] = useState(
    order?.status || 'pending'
  );

  const handleConfirm = () => {
  Alert.alert(
    'Xác nhận đơn?',
    `Xác nhận đơn #${order?.id}?`,
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xác nhận',
        onPress: async () => {
          await updateOrderStatus(order.id, 'confirmed');

          setStatus('confirmed');

          navigation.goBack();
        },
      },
    ]
  );
};

  const handleReject = () => {
  Alert.alert(
    'Từ chối đơn?',
    'Bạn có chắc muốn hủy đơn?',
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xác nhận',
        style: 'destructive',
        onPress: async () => {
          await updateOrderStatus(order.id, 'cancelled');

          setStatus('cancelled');

          navigation.goBack();
        },
      },
    ]
  );
};
  const statusColor = {
    pending: COLORS.orange,
    confirmed: COLORS.green,
    cancelled: COLORS.red,
  }[status];

  const statusLabel = {
    pending: ' Chờ xác nhận',
    confirmed: ' Đã xác nhận',
    cancelled: ' Đã từ chối',
  }[status];

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
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Chi tiết đơn
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        {/* Status */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor:
                statusColor + '22',
              borderColor: statusColor,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColor },
            ]}
          >
            {statusLabel}
          </Text>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.orderId}>
            Đơn #{order?.id || 'ORD001'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Image source={require('../../../assets/icon/calender.png')} style={styles.inlineIcon} />
          <Text style={styles.orderTime}>{new Date(order?.createdAt || new Date()).toLocaleString('vi-VN')}</Text>
        </View>
        </View>

        {/* Customer */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Image source={require('../../../assets/icon/user.png')} style={styles.inlineIcon} />
            <Text style={styles.cardTitle}>Khách hàng</Text>
          </View>

          <Text style={styles.infoVal}>
            {order?.customer ||
              order?.customerName ||
              'Khách hàng'}
          </Text>

          <View style={styles.infoRow}>
          <Image source={require('../../../assets/icon/phone.png')} style={styles.inlineIcon} />
          <Text style={styles.infoSub}>{order?.phone || 'Chưa cập nhật'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Image source={require('../../../assets/icon/email.png')} style={styles.inlineIcon} />
          <Text style={styles.infoSub}>{order?.email || 'Chưa cập nhật'}</Text>
        </View>
        </View>

        {/* Vehicles */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Image source={require('../../../assets/icon/car.png')} style={styles.inlineIcon} />
            <Text style={styles.cardTitle}>Phương tiện thuê</Text>
          </View>

          {(order?.items || []).map(
            (item, index) => (
              <View
                key={index}
                style={[
                  styles.vehicleRow,
                  {
                    borderBottomWidth:
                      index !==
                      order.items.length -
                        1
                        ? 1
                        : 0,
                    borderBottomColor:
                      COLORS.border,
                  },
                ]}
              >
                {/* Image */}
                <View
                  style={
                    styles.imageContainer
                  }
                >
                  <Image
                    source={item.image}
                    style={
                      styles.vehicleImage
                    }
                    resizeMode="contain"
                  />
                </View>

                {/* Vehicle Info */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={
                      styles.infoVal
                    }
                  >
                    {item.brand}{' '}
                    {item.model}
                  </Text>

                  <Text
                    style={
                      styles.infoSub
                    }
                  >
                    {item.rentalDays ||
                      order?.days ||
                      1}{' '}
                    ngày thuê
                  </Text>

                  <Text
                    style={
                      styles.infoSub
                    }
                  >
                    {formatCurrency(
                      (item.price ||
                        0) *
                        (item.quantity ||
                          1) *
                        (item.rentalDays ||
                          order?.days ||
                          1)
                    )}
                    đ
                  </Text>
                </View>
              </View>
            )
          )}

          <View style={styles.infoRow}>
          <Image source={require('../../../assets/icon/locationhome.png')} style={styles.inlineIcon} />
          <Text style={styles.infoSub}>Nhận tại: {order?.pickup || 'Chưa cập nhật'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Image source={require('../../../assets/icon/locationshop.png')} style={styles.inlineIcon} />
          <Text style={styles.infoSub}>Trả tại: {order?.dropoff || 'Chưa cập nhật'}</Text>
        </View>
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Image source={require('../../../assets/icon/moneyadmin.png')} style={styles.inlineIcon} />
            <Text style={styles.cardTitle}>Tổng thanh toán</Text>
            <Text style={styles.totalVal}>
              {formatCurrency(
                order?.total || 2550000
              )}
              đ
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={require('../../../assets/icon/checkmoney.png')} style={styles.inlineIcon} />
            <Text style={[styles.infoSub, { color: COLORS.green }]}>Đã thanh toán thành công </Text>
          </View>
        </View>

        {/* Actions */}
        {status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={handleReject}
            >
              <Text
                style={styles.rejectText}
              >
                Từ chối
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
            >
              <Text
                style={styles.confirmText}
              >
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
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

  content: {
    padding: SIZES.md,
    gap: 12,
  },

  statusBanner: {
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
  },
  inlineIcon: { width: 16, height: 16, resizeMode: 'contain' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },

  statusText: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    ...SHADOWS.small,
  },

  orderId: {
    fontFamily: 'Courier',
    fontSize: SIZES.fontXl,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 4,
  },

  orderTime: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
  },

  cardTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  infoVal: {
    fontSize: SIZES.fontLg,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },

  infoSub: {
    fontSize: SIZES.fontSm,
    color: COLORS.textMuted,
    marginBottom: 2,
  },

  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
    width: '100%',
    height: '100%',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  totalVal: {
    fontSize: SIZES.fontXxl,
    fontWeight: '800',
    color: COLORS.gold,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },

  rejectBtn: {
    flex: 1,
    height: 52,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.redBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.red,
  },

  rejectText: {
    color: COLORS.red,
    fontWeight: '700',
    fontSize: SIZES.fontMd,
  },

  confirmBtn: {
    flex: 1,
    height: 52,
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.greenBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.green,
  },

  confirmText: {
    color: COLORS.navy,
    fontWeight: '800',
    fontSize: SIZES.fontMd,
  },
});