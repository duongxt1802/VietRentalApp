// src/screens/auth/ResetPasswordScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Alert,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { GoldButton } from '../../components/shared';

export default function ResetPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1 = async () => {
    if (!email.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập email'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep(2);
  };

  const handleStep2 = async () => {
    if (otp !== '123456') { Alert.alert('Lỗi', 'Mã OTP không đúng (demo: 123456)'); return; }
    setStep(3);
  };

  const handleStep3 = async () => {
    if (!newPass || newPass !== confirmPass) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    Alert.alert('Thành công', 'Mật khẩu đã được đổi!', [
      { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lại mật khẩu</Text>
        <View style={styles.stepRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {step === 1 && (
            <>
              <Text style={styles.stepTitle}>📧 Nhập email</Text>
              <Text style={styles.stepDesc}>Chúng tôi sẽ gửi mã OTP tới email của bạn</Text>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <GoldButton title="Gửi mã OTP →" onPress={handleStep1} loading={loading} style={{ marginTop: 24 }} />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.stepTitle}>🔑 Nhập mã OTP</Text>
              <Text style={styles.stepDesc}>Mã OTP đã được gửi tới {email}</Text>
              <Text style={styles.label}>MÃ OTP (Demo: 123456)</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>🔑</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập 6 chữ số"
                  placeholderTextColor={COLORS.textMuted}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <GoldButton title="Xác nhận →" onPress={handleStep2} style={{ marginTop: 24 }} />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.stepTitle}>🔒 Mật khẩu mới</Text>
              <Text style={styles.stepDesc}>Tạo mật khẩu mạnh cho tài khoản của bạn</Text>
              <Text style={styles.label}>MẬT KHẨU MỚI</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tối thiểu 8 ký tự"
                  placeholderTextColor={COLORS.textMuted}
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry
                />
              </View>
              <Text style={[styles.label, { marginTop: 16 }]}>XÁC NHẬN MẬT KHẨU</Text>
              <View style={styles.inputRow}>
                <Text style={styles.icon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  secureTextEntry
                />
              </View>
              <GoldButton title="Đổi mật khẩu ✓" onPress={handleStep3} loading={loading} style={{ marginTop: 24 }} />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: SIZES.lg,
    alignItems: 'center',
  },
  back: { position: 'absolute', top: 52, left: SIZES.lg, padding: 8 },
  backText: { color: COLORS.white, fontSize: 20 },
  headerTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.white, marginBottom: 16 },
  stepRow: { flexDirection: 'row', gap: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  stepDotActive: { backgroundColor: COLORS.gold, width: 24 },
  scroll: { flex: 1 },
  content: { padding: SIZES.md, paddingTop: SIZES.xl },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.lg,
    ...SHADOWS.medium,
  },
  stepTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  stepDesc: { fontSize: SIZES.fontMd, color: COLORS.textMuted, marginBottom: 24, lineHeight: 22 },
  label: { fontSize: SIZES.fontXs, color: COLORS.textMuted, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    height: SIZES.inputHeight,
    paddingHorizontal: 14,
    gap: 10,
  },
  icon: { fontSize: 16 },
  input: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary },
});
