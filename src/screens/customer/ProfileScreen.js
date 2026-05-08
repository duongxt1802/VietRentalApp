// src/screens/customer/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,Image, } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';
import { Avatar } from '../../components/shared';

const MENU_GROUPS = [
  {
    title: 'Tài khoản',
    items: [
      {
        icon: require('../../../assets/icon/user.png'),
        label: 'Thông tin cá nhân',
        screen: 'EditProfile'
      },
      {
        icon: require('../../../assets/icon/order.png'),
        label: 'Đơn hàng của tôi',
        screen: 'MyBookings'
      },
      {
        icon: require('../../../assets/icon/bank.png'),
        label: 'Lịch sử thanh toán',
        screen: 'PaymentHistory'
      },
      {
        icon: require('../../../assets/icon/chat.png'),
        label: 'Chat hỗ trợ',
        screen: 'Chat'
      },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      {
        icon: require('../../../assets/icon/bell.png'),
        label: 'Thông báo',
        screen: null
      },
      {
        icon: require('../../../assets/icon/lock.png'),
        label: 'Bảo mật',
        screen: 'ResetPassword'
      },
      {
        icon: require('../../../assets/icon/heart.png'),
        label: 'Ngôn ngữ',
        screen: null
      },
    ],
  },
  {
    title: 'Khác',
    items: [
      {
        icon: require('../../../assets/icon/setting.png'),
        label: 'Trợ giúp & FAQ',
        screen: null
      },
      {
        icon: require('../../../assets/icon/checklist.png'),
        label: 'Đánh giá ứng dụng',
        screen: null
      },
      {
        icon: require('../../../assets/icon/booking.png'),
        label: 'Điều khoản dịch vụ',
        screen: null
      },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    Alert.alert('Đăng xuất?', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất', style: 'destructive',
        onPress: async () => { await logout(); },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Tôi</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editBtn}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Avatar name={user?.name || 'User'} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.name || 'Người dùng'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profilePhone}>{user?.phone || 'Chưa cập nhật SĐT'}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingVal}>⭐ {user?.rating || '5.0'}</Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Đơn thuê', value: '8' },
            { label: 'Đánh giá', value: '12' },
            { label: 'Điểm tích', value: '450' },
          ].map((s, i) => (
            <View key={i} style={[styles.statItem, i !== 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {MENU_GROUPS.map((group, gi) => (
          <View key={gi} style={{ marginBottom: 8 }}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.menuItem, ii !== group.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                <Image
                    source={item.icon}
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuChevron}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.version}>VietRental v1.0.0</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: { backgroundColor: COLORS.navy, paddingTop: 50, paddingHorizontal: SIZES.md, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.white },
  editBtn: { fontSize: SIZES.fontSm, color: COLORS.gold, fontWeight: '600' },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  profileName: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.white, marginBottom: 2 },
  profileEmail: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  profilePhone: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier' },
  ratingBadge: {
    backgroundColor: 'rgba(245,166,35,0.2)',
    borderRadius: SIZES.radiusMd,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.3)',
  },
  ratingVal: { fontSize: SIZES.fontSm, color: COLORS.gold, fontWeight: '700' },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: SIZES.radiusMd },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statVal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.gold, marginBottom: 2 },
  statLabel: { fontSize: SIZES.fontXs, color: 'rgba(255,255,255,0.4)' },
  scroll: { flex: 1 },
  content: { padding: SIZES.md },
  groupTitle: { fontSize: SIZES.fontXs, color: COLORS.textMuted, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  groupCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, ...SHADOWS.small, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary, fontWeight: '500' },
  menuChevron: { fontSize: 20, color: COLORS.textMuted },
  logoutBtn: {
    backgroundColor: COLORS.redBg,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.2)',
  },
  menuIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
},

chevronIcon: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
},

ratingRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

ratingIcon: {
  width: 14,
  height: 14,
  resizeMode: 'contain',
},

logoutContent: {
  flexDirection: 'row',
  alignItems: 'center',
},

logoutIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
  marginRight: 8,
},
  logoutText: { color: COLORS.red, fontWeight: '700', fontSize: SIZES.fontMd },
  version: { textAlign: 'center', fontSize: SIZES.fontXs, color: COLORS.textMuted, marginTop: 8 },
});
