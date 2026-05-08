// src/screens/customer/PaymentScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,Image,TextInput,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { GoldButton, formatCurrency } from '../../components/shared';
import { saveOrder } from '../../services/storageService';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';

const PAYMENT_METHODS = [
  {
    id: 'cash',
    image: require('../../../assets/icon/cash.png'),
    label: 'Tiền mặt',
    desc: 'Thanh toán khi nhận xe'
  },
  {
    id: 'bank',
    image: require('../../../assets/icon/bank.png'),
    label: 'Chuyển khoản',
    desc: 'MoMo / ZaloPay / Ngân hàng'
  },
  {
    id: 'card',
    image: require('../../../assets/icon/card.png'),
    label: 'Thẻ tín dụng',
    desc: 'Visa / Mastercard'
  },
];

export default function PaymentScreen({ navigation, route }) {
  const { cart = [], total = 0, promo, pickup, dropoff, note } = route.params || {};
  const { clearAll } = useCartContext();
  const { user } = useAuthContext();
  const [method, setMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const transferContent = useMemo(() => `THUEXE${Date.now()}`, []);
  const transferAmount = Math.round(Number(total) || 0);
  const qrCodeUrl = useMemo(
    () =>
      `https://img.vietqr.io/image/mb-0363683170-compact2.png?amount=${transferAmount}&addInfo=${encodeURIComponent(
        transferContent,
      )}&accountName=${encodeURIComponent('VIETRENTAL COMPANY')}`,
    [transferAmount, transferContent],
  );

  const handlePay = async () => {
    try {
      if (method === 'card') {
          if (!cardNumber || !cardName || !expiryDate || !cvv) {
            Alert.alert(
              'Thiếu thông tin',
              'Vui lòng nhập đầy đủ thông tin thẻ'
            );
            return;
          }
        }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));

      const order = await saveOrder({
        items: cart,
        total,
        promoCode: promo?.code || null,
        paymentMethod: method,
        pickup,
        dropoff,
        note,
        paymentStatus: 'paid',
        userId: user?.id,
      });

      if (!order) {
        throw new Error('Failed to save order');
      }

      await clearAll();

      navigation.replace('BookingSuccess', { order });
    } catch (e) {
      Alert.alert('Lỗi', 'Thanh toán thất bại, thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Image
            source={require('../../../assets/icon/back.png')}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Tổng thanh toán</Text>
          <Text style={styles.amountValue}>{formatCurrency(total)}đ</Text>
          <Text style={styles.amountSub}>{cart.length} xe · {promo ? `Mã: ${promo.code}` : 'Không có khuyến mãi'}</Text>
        </View>

        {/* Payment methods */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        {PAYMENT_METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, method === m.id && styles.methodCardActive]}
            onPress={() => setMethod(m.id)}
          >
            <Image
                source={m.image}
                style={styles.methodIcon}
              />
            <View style={{ flex: 1 }}>
              <Text style={[styles.methodLabel, method === m.id && { color: COLORS.gold }]}>{m.label}</Text>
              <Text style={styles.methodDesc}>{m.desc}</Text>
            </View>
            <View style={[styles.radio, method === m.id && styles.radioActive]}>
              {method === m.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Bank details (shown when bank selected) */}
        {method === 'bank' && (
          <View style={styles.bankDetails}>
            <Text style={styles.bankTitle}>Thông tin chuyển khoản</Text>
            {[
              { label: 'Ngân hàng', value: 'MB Bank' },
              { label: 'Số TK', value: '036368170' },
              { label: 'Chủ TK', value: 'VIETRENTAL COMPANY' },
              { label: 'Nội dung', value: transferContent },
              { label: 'Số tiền', value: `${formatCurrency(total)}đ` },
            ].map((row, i) => (
              <View key={i} style={styles.bankRow}>
                <Text style={styles.bankLabel}>{row.label}</Text>
                <Text style={styles.bankValue}>{row.value}</Text>
              </View>
            ))}

            <View style={styles.qrWrapper}>
              <Text style={styles.qrTitle}>Quét QR để thanh toán</Text>
              <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} />
              <Text style={styles.qrHint}>Mở ứng dụng ngân hàng để quét mã QR</Text>
            </View>
          </View>
        )}
        {method === 'card' && (
            <View style={styles.cardForm}>
              <Text style={styles.cardFormTitle}>Thông tin thẻ</Text>

              <TextInput
                style={styles.cardInput}
                placeholder="Số thẻ"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                maxLength={16}
              />

              <TextInput
                style={styles.cardInput}
                placeholder="Tên chủ thẻ"
                value={cardName}
                onChangeText={setCardName}
              />

              <View style={styles.cardRow}>
                <TextInput
                  style={[styles.cardInput, { flex: 1 }]}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => {
                  let formatted = text.replace(/\D/g, '');

                  if (formatted.length >= 3) {
                    formatted =
                      formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
                  }

                  setExpiryDate(formatted);
                }}
                  maxLength={5}
                />

                <TextInput
                  style={[styles.cardInput, { flex: 1 }]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  value={cvv}
                  onChangeText={setCvv}
                  maxLength={3}
                />
              </View>
            </View>
          )}

        {/* Security note */}
        <View style={styles.securityNote}>
          <Image
            source={require('../../../assets/icon/lock.png')}
            style={styles.lockIcon}
          />
          <Text style={styles.securityText}>Giao dịch được bảo mật bởi SSL 256-bit</Text>
        </View>

        <GoldButton
          title={`Xác nhận thanh toán ${formatCurrency(total)}đ`}
          onPress={handlePay}
          loading={loading}
          style={{ marginTop: 8 }}
        />
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SIZES.md,
    paddingBottom: 12,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  content: { padding: SIZES.md, gap: 14 },
  amountCard: {
    backgroundColor: COLORS.navy,
    borderRadius: SIZES.radiusLg,
    padding: 24,
    alignItems: 'center',
  },
  amountLabel: { fontSize: SIZES.fontMd, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  amountValue: { fontSize: 36, fontWeight: '800', color: COLORS.gold, marginBottom: 6 },
  amountSub: { fontSize: SIZES.fontSm, color: 'rgba(255,255,255,0.4)' },
  sectionTitle: { fontSize: SIZES.fontLg, fontWeight: '700', color: COLORS.textPrimary, marginTop: 4 },
  methodCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  methodCardActive: {
  borderColor: COLORS.gold,
  backgroundColor: COLORS.white,
  transform: [{ scale: 1.02 }],
  shadowColor: COLORS.gold,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
  methodLabel: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  methodDesc: { fontSize: SIZES.fontXs, color: COLORS.textMuted },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: { borderColor: COLORS.gold },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.gold },
  bankDetails: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.3)',
    borderStyle: 'dashed',
  },
  bankTitle: { fontSize: SIZES.fontMd, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  bankLabel: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  bankValue: { fontSize: SIZES.fontSm, fontWeight: '700', color: COLORS.textPrimary, fontFamily: 'Courier' },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.greenBg,
    borderRadius: SIZES.radiusMd,
    padding: 12,
  },
  headerIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
},

methodIcon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
},

lockIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
},
cardForm: {
  backgroundColor: COLORS.white,
  borderRadius: SIZES.radiusMd,
  padding: 16,
  ...SHADOWS.small,
},

cardFormTitle: {
  fontSize: SIZES.fontMd,
  fontWeight: '700',
  color: COLORS.textPrimary,
  marginBottom: 12,
},

cardInput: {
  height: 50,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: SIZES.radiusMd,
  paddingHorizontal: 12,
  marginBottom: 12,
  backgroundColor: COLORS.cream,
},

cardRow: {
  flexDirection: 'row',
  gap: 10,
},
qrWrapper: {
  marginTop: 8,
  alignItems: 'center',
},
qrTitle: {
  fontSize: SIZES.fontSm,
  fontWeight: '700',
  color: COLORS.textPrimary,
  marginBottom: 8,
},
qrImage: {
  width: 180,
  height: 180,
  borderRadius: SIZES.radiusSm,
  borderWidth: 1,
  borderColor: COLORS.border,
  backgroundColor: COLORS.white,
},
qrHint: {
  marginTop: 8,
  fontSize: SIZES.fontXs,
  color: COLORS.textMuted,
},
  securityText: { fontSize: SIZES.fontSm, color: COLORS.greenText, flex: 1 },
});
