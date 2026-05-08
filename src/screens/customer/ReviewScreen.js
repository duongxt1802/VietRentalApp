// src/screens/customer/ReviewScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { GoldButton } from '../../components/shared';

export default function ReviewScreen({ navigation, route }) {
  const { order } = route.params || {};
  
  if (!order) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Viết đánh giá</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: COLORS.text }}>Không tìm thấy đơn hàng</Text>
        </View>
      </View>
    );
  }

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { Alert.alert('Lỗi', 'Vui lòng chọn số sao'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    Alert.alert('Cảm ơn! ⭐', 'Đánh giá của bạn đã được ghi nhận', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Viết đánh giá</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.prompt}>Bạn hài lòng với dịch vụ?</Text>
          <Text style={styles.orderId}>Đơn #{order?.id?.slice(-8)?.toUpperCase()}</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text style={[styles.star, s <= rating && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Chưa chọn' : ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][rating]}
          </Text>

          <TextInput
            style={styles.commentInput}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            placeholderTextColor={COLORS.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <GoldButton title="Gửi đánh giá ⭐" onPress={handleSubmit} loading={loading} style={{ marginTop: 16 }} />
        </View>
      </View>
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
  content: { flex: 1, padding: SIZES.md },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusXl, padding: SIZES.lg, ...SHADOWS.medium },
  prompt: { fontSize: SIZES.fontXxl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4, textAlign: 'center' },
  orderId: { fontSize: SIZES.fontSm, color: COLORS.textMuted, textAlign: 'center', marginBottom: 24 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  star: { fontSize: 44, color: COLORS.border },
  starActive: { color: COLORS.gold },
  ratingLabel: { textAlign: 'center', fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textMuted, marginBottom: 20 },
  commentInput: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: SIZES.radiusMd,
    padding: 14, fontSize: SIZES.fontMd, color: COLORS.textPrimary, minHeight: 120, backgroundColor: COLORS.cream,
  },
});
