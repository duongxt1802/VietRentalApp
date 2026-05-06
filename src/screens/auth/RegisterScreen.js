// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';
import { GoldButton } from '../../components/shared';

const getPasswordStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthColors = ['#E8E8E2', '#DC2626', '#EA580C', '#F5A623', '#16A34A'];
const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];

export default function RegisterScreen({ navigation }) {
  const { login } = useAuthContext();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    confirmPassword: '', address: '', license: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const strength = getPasswordStrength(form.password);
  const passMatch = form.password && form.password === form.confirmPassword;

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (!passMatch) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (!agreed) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với điều khoản dịch vụ');
      return;
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      const newUser = {
        id: `u_${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        licenseNumber: form.license,
        role: 'customer',
        initials: form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
        rating: 5.0,
      };
      await login(newUser);
    } catch {
      Alert.alert('Lỗi', 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20, color: COLORS.textPrimary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Tạo tài khoản</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>1/2</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={styles.progressFill} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {[
          { icon: '👤', label: 'HỌ VÀ TÊN', key: 'name', placeholder: 'Nguyễn Văn A', type: 'default' },
          { icon: '📧', label: 'EMAIL', key: 'email', placeholder: 'email@example.com', type: 'email-address' },
          { icon: '📱', label: 'SỐ ĐIỆN THOẠI', key: 'phone', placeholder: '09xxxxxxxx', type: 'phone-pad' },
          { icon: '📍', label: 'ĐỊA CHỈ (Tùy chọn)', key: 'address', placeholder: 'Số nhà, đường, quận...', type: 'default' },
          { icon: '🪪', label: 'SỐ BẰNG LÁI XE (Tùy chọn)', key: 'license', placeholder: 'Số GPLX', type: 'default' },
        ].map((field) => (
          <View key={field.key} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{field.label}</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>{field.icon}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor={COLORS.textMuted}
                value={form[field.key]}
                onChangeText={set(field.key)}
                keyboardType={field.type}
                autoCapitalize={field.key === 'email' ? 'none' : 'words'}
              />
            </View>
          </View>
        ))}

        {/* Password */}
        <Text style={styles.label}>🔒 MẬT KHẨU</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Tối thiểu 8 ký tự"
            placeholderTextColor={COLORS.textMuted}
            value={form.password}
            onChangeText={set('password')}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        {/* Strength bar */}
        {form.password ? (
          <View style={{ marginTop: 8, marginBottom: 4 }}>
            <View style={styles.strengthBar}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[styles.strengthSegment, { backgroundColor: i <= strength ? strengthColors[strength] : COLORS.border }]}
                />
              ))}
            </View>
            <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
              {strengthLabels[strength]}
            </Text>
          </View>
        ) : null}

        {/* Confirm password */}
        <Text style={[styles.label, { marginTop: 16 }]}>🔒 XÁC NHẬN MẬT KHẨU</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor={COLORS.textMuted}
            value={form.confirmPassword}
            onChangeText={set('confirmPassword')}
            secureTextEntry
          />
          {passMatch ? <Text style={{ fontSize: 16 }}>✅</Text> : null}
        </View>

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
          <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>
            Tôi đồng ý với{' '}
            <Text style={{ color: COLORS.gold, textDecorationLine: 'underline' }}>Điều khoản dịch vụ</Text>
          </Text>
        </TouchableOpacity>

        <GoldButton title="Tiếp theo →" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />

        <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }} onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontSize: SIZES.fontMd, color: COLORS.textMuted }}>
            Đã có tài khoản?{' '}
            <Text style={{ color: COLORS.gold, fontWeight: '700' }}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingTop: 50,
    paddingBottom: 12,
  },
  topTitle: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  stepIndicator: {
    backgroundColor: 'rgba(245,166,35,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepText: { color: COLORS.gold, fontWeight: '700', fontSize: SIZES.fontSm },
  progressBg: { height: 4, backgroundColor: COLORS.border },
  progressFill: { height: 4, width: '50%', backgroundColor: COLORS.gold, borderRadius: 2 },
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  content: { padding: SIZES.md, paddingBottom: 48 },
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
    backgroundColor: COLORS.white,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary },
  strengthBar: { flexDirection: 'row', gap: 4 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: SIZES.fontXs, marginTop: 4, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  checkmark: { color: COLORS.navy, fontSize: 12, fontWeight: '700' },
  termsText: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textSecondary, lineHeight: 22 },
});
