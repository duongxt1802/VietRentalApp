// src/screens/admin/AdminCustomersScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, TextInput,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { Avatar, formatCurrency } from '../../components/shared';

const CUSTOMERS = [
  { id: 1, name: 'Trần Hùng', email: 'thanhhung@gmail.com', phone: '0912xxx789', orders: 8, total: 12500000, rating: 4.8, initials: 'TH', color: COLORS.blue },
  { id: 2, name: 'Nguyễn Linh', email: 'nguyenlinh@gmail.com', phone: '0934xxx123', orders: 5, total: 7200000, rating: 4.9, initials: 'NL', color: COLORS.purple },
  { id: 3, name: 'Vũ Minh', email: 'vuminh@email.com', phone: '0978xxx456', orders: 3, total: 4800000, rating: 4.7, initials: 'VM', color: COLORS.green },
  { id: 4, name: 'Phạm Trang', email: 'phamtrang@email.com', phone: '0901xxx789', orders: 1, total: 750000, rating: 5.0, initials: 'PT', color: COLORS.orange },
];

const TRANSACTIONS = [
  { id: 'T001', customer: 'Trần Hùng', amount: 2550000, method: 'bank', date: '15/04', status: 'success' },
  { id: 'T002', customer: 'Nguyễn Linh', amount: 360000, method: 'cash', date: '14/04', status: 'success' },
  { id: 'T003', customer: 'Vũ Minh', amount: 2200000, method: 'card', date: '13/04', status: 'pending' },
  { id: 'T004', customer: 'Phạm Trang', amount: 750000, method: 'bank', date: '12/04', status: 'failed' },
  { id: 'T005', customer: 'Hoàng Nam', amount: 3000000, method: 'bank', date: '11/04', status: 'success' },
];

export default function AdminCustomersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('customers');
  const [search, setSearch] = useState('');

  const filteredCustomers = CUSTOMERS.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusDotColor = { success: COLORS.green, pending: COLORS.orange, failed: COLORS.red };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ color: COLORS.white, fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khách hàng</Text>
        <Text style={{ fontSize: 20 }}>🔍</Text>
      </View>

      {/* Tab switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'customers' && styles.tabActive]}
          onPress={() => setActiveTab('customers')}
        >
          <Text style={[styles.tabText, activeTab === 'customers' && styles.tabTextActive]}> Khách hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.tabActive]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.tabTextActive]}> Giao dịch</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'customers' ? (
        <>
          {/* Search */}
          <View style={styles.searchBar}>
            <Text>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên / email / SĐT..."
              placeholderTextColor={COLORS.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <FlatList
            data={filteredCustomers}
            keyExtractor={(c) => String(c.id)}
            contentContainerStyle={{ padding: SIZES.md, gap: 10 }}
            renderItem={({ item }) => (
              <View style={styles.customerRow}>
                <View style={{ position: 'relative' }}>
                  <Avatar name={item.name} size={44} bg={item.color} />
                  
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerEmail}>{item.email}</Text>
                  <Text style={styles.customerPhone}>{item.phone}</Text>
                  <Text style={styles.customerRating}>⭐{item.rating}</Text>
                </View>
                <View style={styles.customerStats}>
                  <Text style={styles.customerTotal}>{formatCurrency(item.total)}</Text>
                  <Text style={styles.customerOrders}>{item.orders} đơn</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <FlatList
          data={TRANSACTIONS}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: SIZES.md, gap: 8 }}
          ListHeaderComponent={
            <View style={styles.revenueBanner}>
              <View>
                <Text style={styles.revenueLabel}>Tổng doanh thu tháng 4</Text>
                <Text style={styles.revenueTotal}>89.500.000đ</Text>
              </View>
              <View style={styles.revenueTrend}>
                <Text style={styles.revenueTrendText}>↑ 12% vs T3</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.txRow}>
              <Text style={styles.txId}>{item.id}</Text>
              <Text style={styles.txCustomer} numberOfLines={1}>{item.customer}</Text>
              <Text style={styles.txAmount}>{formatCurrency(item.amount)}</Text>
              <View style={styles.txMethodChip}>
                <Text style={styles.txMethodText}>
                  {item.method === 'bank' ? '🏦' : item.method === 'cash' ? '💵' : '💳'}
                </Text>
              </View>
              <Text style={styles.txDate}>{item.date}</Text>
              <View style={[styles.txStatusDot, { backgroundColor: statusDotColor[item.status] }]} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navyDark, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: SIZES.md, paddingBottom: 14,
  },
  headerTitle: { flex: 1, fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.white, marginLeft: 8 },
  tabSwitcher: {
    flexDirection: 'row', backgroundColor: COLORS.navyDark,
    paddingHorizontal: SIZES.md, paddingBottom: 14, gap: 8,
  },
  tab: {
    flex: 1, height: 44, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.white },
  tabText: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  tabTextActive: { color: COLORS.gold, fontWeight: '800' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.white, margin: SIZES.md, marginBottom: 4,
    borderRadius: SIZES.radiusMd, paddingHorizontal: 14, height: 44,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary },
  customerRow: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOWS.small,
  },
  customerRating: { position: 'absolute', bottom: -6, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: COLORS.gold },
  customerInfo: { flex: 1 },
  customerName: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary },
  customerEmail: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  customerPhone: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.textMuted },
  customerStats: { alignItems: 'flex-end', gap: 2 },
  customerTotal: { fontFamily: 'Courier', fontSize: SIZES.fontMd, fontWeight: '800', color: COLORS.gold },
  customerOrders: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  chevron: { fontSize: 18, color: COLORS.textMuted },
  revenueBanner: {
    backgroundColor: COLORS.navy, borderRadius: SIZES.radiusMd, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  revenueLabel: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  revenueTotal: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.white },
  revenueTrend: { backgroundColor: COLORS.greenBg, borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 6 },
  revenueTrendText: { fontSize: SIZES.fontSm, color: COLORS.green, fontWeight: '800' },
  txRow: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8, ...SHADOWS.small,
  },
  txId: { fontFamily: 'Courier', fontSize: 10, color: COLORS.gold, width: 36 },
  txCustomer: { flex: 1, fontSize: SIZES.fontXs, color: COLORS.textSecondary, fontWeight: '600' },
  txAmount: { fontFamily: 'Courier', fontSize: SIZES.fontSm, fontWeight: '700', color: COLORS.textPrimary },
  txMethodChip: { width: 24, height: 24, borderRadius: 6, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center' },
  txMethodText: { fontSize: 12 },
  txDate: { fontSize: SIZES.fontXs, color: COLORS.textMuted, width: 30 },
  txStatusDot: { width: 8, height: 8, borderRadius: 4 },
});
