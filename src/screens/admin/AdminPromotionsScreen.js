// src/screens/admin/AdminPromotionsScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Modal, TextInput, Alert, ScrollView,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { PROMOTIONS } from '../../data/data';
import { GoldButton } from '../../components/shared';

export default function AdminPromotionsScreen({ navigation }) {
  const [promos, setPromos] = useState(PROMOTIONS);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', maxDiscount: '', endDate: '' });

  const filtered = filter === 'all' ? promos : promos.filter((p) => p.status === filter);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.code || !form.discount) { Alert.alert('Lỗi', 'Vui lòng điền đầy đủ'); return; }
    const newPromo = {
      id: `p${Date.now()}`,
      code: form.code.toUpperCase(),
      discount: parseInt(form.discount, 10),
      type: 'percent',
      maxDiscount: parseInt(form.maxDiscount, 10) || 200000,
      description: `Giảm ${form.discount}%`,
      endDate: form.endDate,
      usedCount: 0,
      status: 'active',
    };
    setPromos((prev) => [newPromo, ...prev]);
    setShowModal(false);
    setForm({ code: '', discount: '', maxDiscount: '', endDate: '' });
    Alert.alert('✅ Tạo mã thành công!');
  };

  const handleDelete = (id) => {
    Alert.alert('Xóa mã?', '', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => setPromos((p) => p.filter((x) => x.id !== id)) },
    ]);
  };

  const statusConfig = {
    active: { label: '🟢 Đang hoạt động', bg: COLORS.greenBg, color: COLORS.green },
    expired: { label: '🔴 Hết hạn', bg: COLORS.redBg, color: COLORS.red },
    upcoming: { label: '🟡 Sắp tới', bg: COLORS.orangeBg, color: COLORS.orange },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ color: COLORS.white, fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khuyến mãi</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Text style={{ color: COLORS.gold, fontSize: 22, fontWeight: '700' }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { icon: '🏷️', val: `${promos.length} Mã`, label: 'Tổng' },
          { icon: '✅', val: `${promos.filter((p) => p.status === 'active').length} Active`, label: 'Hoạt động' },
          { icon: '⏰', val: `${promos.filter((p) => p.status === 'expired').length} Hết hạn`, label: 'Expired' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {[['all', 'Tất cả'], ['active', 'Đang hoạt động'], ['expired', 'Hết hạn']].map(([id, label]) => (
          <TouchableOpacity key={id} style={[styles.chip, filter === id && styles.chipActive]} onPress={() => setFilter(id)}>
            <Text style={[styles.chipText, filter === id && styles.chipTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: SIZES.md, gap: 10 }}
        renderItem={({ item }) => {
          const sc = statusConfig[item.status] || statusConfig.active;
          return (
            <View style={styles.promoCard}>
              <View style={styles.promoTop}>
                <Text style={styles.promoCode}>{item.code}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}% OFF</Text>
                </View>
              </View>
              <Text style={styles.promoDesc}>{item.description}</Text>
              <View style={styles.promoMeta}>
                <Text style={styles.promoMetaText}>📅 HSD: {item.endDate}</Text>
                <Text style={styles.promoMetaText}>Đã dùng: {item.usedCount} lần</Text>
              </View>
              <View style={styles.promoBottom}>
                <View style={[styles.statusChip, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                </View>
                <View style={styles.promoActions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                    <Text>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Create Modal / Bottom Sheet */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo mã khuyến mãi</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 14 }}>
              {[
                { label: 'MÃ CODE', key: 'code', placeholder: 'VD: SUMMER2025', caps: true },
                { label: 'GIẢM (%)', key: 'discount', placeholder: 'VD: 20', keyboard: 'numeric' },
                { label: 'GIẢM TỐI ĐA (VNĐ)', key: 'maxDiscount', placeholder: 'VD: 200000', keyboard: 'numeric' },
                { label: 'NGÀY HẾT HẠN', key: 'endDate', placeholder: 'VD: 2025-12-31' },
              ].map((f) => (
                <View key={f.key}>
                  <Text style={styles.label}>{f.label}</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder={f.placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={form[f.key]}
                    onChangeText={set(f.key)}
                    keyboardType={f.keyboard || 'default'}
                    autoCapitalize={f.caps ? 'characters' : 'none'}
                  />
                </View>
              ))}
              <GoldButton title="Lưu khuyến mãi" onPress={handleCreate} style={{ marginTop: 8 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navyDark, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: SIZES.md, paddingBottom: 14,
  },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.white },
  addBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(245,166,35,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.navyDark, paddingHorizontal: SIZES.md, paddingBottom: 16, gap: 8 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: SIZES.radiusMd,
    padding: 10, alignItems: 'center', gap: 2,
  },
  statIcon: { fontSize: 16 },
  statVal: { fontSize: SIZES.fontSm, fontWeight: '800', color: COLORS.gold },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: SIZES.md, paddingVertical: 12, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: SIZES.radiusFull, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  chipText: { fontSize: SIZES.fontXs, color: COLORS.textMuted, fontWeight: '600' },
  chipTextActive: { color: COLORS.white },
  promoCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 14,
    borderLeftWidth: 4, borderLeftColor: COLORS.gold, ...SHADOWS.small,
  },
  promoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  promoCode: { fontFamily: 'Courier', fontSize: SIZES.fontLg, fontWeight: '800', color: COLORS.textPrimary },
  discountBadge: { backgroundColor: COLORS.orangeBg, borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 4 },
  discountText: { color: COLORS.orange, fontWeight: '800', fontSize: SIZES.fontXs },
  promoDesc: { fontSize: SIZES.fontSm, color: COLORS.textMuted, marginBottom: 8 },
  promoMeta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  promoMetaText: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.textMuted },
  promoBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusChip: { borderRadius: SIZES.radiusFull, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: SIZES.fontXs, fontWeight: '700' },
  promoActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.cream,
    justifyContent: 'center', alignItems: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SIZES.lg, paddingBottom: 40, maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  modalClose: { fontSize: 22, color: COLORS.textMuted, padding: 4 },
  label: { fontSize: SIZES.fontXs, color: COLORS.textMuted, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 6 },
  modalInput: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: SIZES.radiusMd,
    height: 52, paddingHorizontal: 14, fontSize: SIZES.fontMd, color: COLORS.textPrimary,
    backgroundColor: COLORS.cream,
  },
});
