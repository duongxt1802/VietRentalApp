// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';
import { DEMO_USERS } from '../../data/data';
import { GoldButton } from '../../components/shared';

export default function LoginScreen({ navigation }) {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 800));
      const found = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        Alert.alert('Sai thông tin', 'Email hoặc mật khẩu không đúng');
        return;
      }
      const { password: _, ...safeUser } = found;
      await login(safeUser);
    } catch (e) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại, thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Dark header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoIcon}><Text style={{ fontSize: 22 }}>🚗</Text></View>
          <Text style={styles.headerTitle}>Đăng nhập</Text>
          <Text style={styles.headerSub}>Chào mừng quay trở lại</Text>
        </View>

        {/* White card */}
        <View style={styles.card}>
          {/* Email */}
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>📧</Text>
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

          {/* Password */}
          <Text style={[styles.label, { marginTop: 16 }]}>MẬT KHẨU</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
              <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Remember + Forgot */}
          <View style={styles.rememberRow}>
            <TouchableOpacity style={styles.checkRow} onPress={() => setRemember(!remember)}>
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <GoldButton title="→ Đăng nhập" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn}>
            <Text style={{ fontSize: 18 }}>🌐</Text>
            <Text style={styles.googleText}>Đăng nhập với Google</Text>
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 20 }}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLink}>
              Chưa có tài khoản?{' '}
              <Text style={{ color: COLORS.gold, fontWeight: '700' }}>Đăng ký ngay</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo hint */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo credentials</Text>
          <Text style={styles.demoLine}>👤 Customer: user@vietrental.vn / user123</Text>
          <Text style={styles.demoLine}>🔑 Admin: admin@vietrental.vn / admin123</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 50,
    paddingBottom: 48,
    paddingHorizontal: SIZES.lg,
    alignItems: 'center',
    position: 'relative',
  },
  backBtn: { position: 'absolute', top: 52, left: SIZES.lg, padding: 8 },
  backIcon: { color: COLORS.white, fontSize: 20 },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(245,166,35,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: SIZES.fontHero, fontWeight: '800', color: COLORS.white, marginBottom: 6 },
  headerSub: { fontSize: SIZES.fontMd, color: 'rgba(255,255,255,0.5)' },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.md,
    marginTop: -24,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.lg,
    ...SHADOWS.large,
  },
  label: {
    fontSize: SIZES.fontXs,
    color: COLORS.textMuted,
    fontFamily: 'Courier',
    letterSpacing: 1,
    marginBottom: 6,
  },
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
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  checkmark: { color: COLORS.navy, fontSize: 11, fontWeight: '700' },
  rememberText: { fontSize: SIZES.fontSm, color: COLORS.textSecondary },
  forgotText: { fontSize: SIZES.fontSm, color: COLORS.gold, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: SIZES.fontSm, color: COLORS.textMuted },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  googleText: { fontSize: SIZES.fontMd, fontWeight: '600', color: COLORS.textSecondary },
  registerLink: { fontSize: SIZES.fontMd, color: COLORS.textSecondary },
  demoBox: {
    backgroundColor: COLORS.cream,
    borderRadius: SIZES.radiusMd,
    margin: SIZES.md,
    marginTop: SIZES.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  demoTitle: { fontFamily: 'Courier', fontSize: SIZES.fontXs, color: COLORS.textMuted, marginBottom: 6, letterSpacing: 1 },
  demoLine: { fontFamily: 'Courier', fontSize: 11, color: COLORS.textSecondary, marginBottom: 3, lineHeight: 18 },
});
