// src/components/shared.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// ─── Gold Button ───
export const GoldButton = ({ title, onPress, style, textStyle, disabled, loading }) => (
  <TouchableOpacity
    style={[styles.goldBtn, disabled && styles.goldBtnDisabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.85}
  >
    {loading ? (
      <ActivityIndicator color={COLORS.navy} size="small" />
    ) : (
      <Text style={[styles.goldBtnText, textStyle]}>{title}</Text>
    )}
  </TouchableOpacity>
);

// ─── Ghost Button ───
export const GhostButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity
    style={[styles.ghostBtn, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.ghostBtnText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

// ─── Skeleton Loader ───
export const SkeletonBox = ({ width, height, radius = 8, style }) => (
  <View
    style={[
      {
        width,
        height,
        borderRadius: radius,
        backgroundColor: '#E8E8E8',
        overflow: 'hidden',
      },
      style,
    ]}
  />
);

export const VehicleCardSkeleton = () => (
  <View style={[styles.skeletonCard, SHADOWS.small]}>
    <SkeletonBox width={80} height={60} radius={10} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <SkeletonBox width={60} height={10} radius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width={140} height={16} radius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width={100} height={12} radius={4} />
    </View>
    <View style={{ alignItems: 'flex-end' }}>
      <SkeletonBox width={70} height={18} radius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width={60} height={22} radius={12} />
    </View>
  </View>
);

// ─── Status Badge ───
export const StatusBadge = ({ status }) => {
  const config = {
    available: { label: 'Sẵn sàng', bg: COLORS.greenBg, color: COLORS.greenText, dot: COLORS.green },
    rented: { label: 'Đang thuê', bg: COLORS.orangeBg, color: COLORS.orange, dot: COLORS.orange },
    maintenance: { label: 'Bảo dưỡng', bg: COLORS.blueBg, color: COLORS.blue, dot: COLORS.blue },
    pending: { label: 'Chờ xác nhận', bg: COLORS.orangeBg, color: COLORS.orange, dot: COLORS.orange },
    confirmed: { label: 'Đã xác nhận', bg: COLORS.greenBg, color: COLORS.greenText, dot: COLORS.green },
    cancelled: { label: 'Đã hủy', bg: COLORS.redBg, color: COLORS.red, dot: COLORS.red },
    completed: { label: 'Hoàn tất', bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' },
  };
  const c = config[status] || config.pending;
  return (
    <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: c.dot }]} />
      <Text style={[styles.statusText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
};

// ─── Empty State ───
export const EmptyState = ({ icon, title, subtitle, action, actionLabel }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon || '📭'}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
    {action ? (
      <GoldButton title={actionLabel || 'Thử lại'} onPress={action} style={{ marginTop: 20, paddingHorizontal: 32 }} />
    ) : null}
  </View>
);

// ─── Vehicle Placeholder Image ───
export const VehiclePlaceholder = ({ type, size = 80 }) => {
  const icons = {
    motorbike: '🏍️',
    car: '🚗',
    van: '🚐',
    electric: '⚡',
    truck: '🚚',
  };
  return (
    <View style={[styles.vehiclePlaceholder, { width: size, height: size * 0.75, borderRadius: 10 }]}>
      <Text style={{ fontSize: size * 0.35 }}>{icons[type] || '🚗'}</Text>
    </View>
  );
};

// ─── Section Header ───
export const SectionHeader = ({ title, action, actionLabel }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? (
      <TouchableOpacity onPress={action}>
        <Text style={styles.sectionAction}>{actionLabel || 'Xem tất cả →'}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

// ─── Avatar Initials ───
export const Avatar = ({ name, size = 44, bg = COLORS.navy }) => {
  const initials = (name || '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
};

// ─── Format currency ───
export const formatCurrency = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${Math.round(amount / 1000)}K`;
  return amount?.toLocaleString('vi-VN') || '0';
};

export const formatCurrencyFull = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const styles = StyleSheet.create({
  goldBtn: {
    backgroundColor: COLORS.gold,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  goldBtnDisabled: { opacity: 0.5 },
  goldBtnText: { color: COLORS.navy, fontWeight: '700', fontSize: SIZES.fontLg, letterSpacing: 0.3 },
  ghostBtn: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  ghostBtnText: { color: COLORS.white, fontWeight: '600', fontSize: SIZES.fontLg },
  skeletonCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.md,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: SIZES.fontXs, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: SIZES.fontXl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
  emptySub: { fontSize: SIZES.fontMd, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
  vehiclePlaceholder: { backgroundColor: '#F0F0EE', justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: SIZES.md },
  sectionTitle: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary },
  sectionAction: { fontSize: SIZES.fontSm, color: COLORS.gold, fontWeight: '600' },
  avatar: { justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.white, fontWeight: '700' },
});
