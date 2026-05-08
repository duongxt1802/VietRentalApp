// src/screens/customer/EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, Alert,Image, } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';
import { GoldButton, Avatar } from '../../components/shared';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useAuthContext();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    licenseNumber: user?.licenseNumber || '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Lỗi', 'Tên không được để trống'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await updateUser(form);
    setLoading(false);
    Alert.alert('Đã lưu!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
        <Image
          source={require('../../../assets/icon/back.png')}
          style={styles.headerIcon}
        />
      </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarArea}>
          <Avatar name={form.name || 'U'} size={80} />
          <TouchableOpacity style={styles.changeAvatarBtn}>
            <Text style={styles.changeAvatarText}>Đổi ảnh</Text>
          </TouchableOpacity>
        </View>
        {[
          {
            icon: require('../../../assets/icon/user.png'),
            label: 'HỌ VÀ TÊN',
            key: 'name',
            placeholder: 'Nguyễn Văn A'
          },
          {
            icon: require('../../../assets/icon/phone.png'),
            label: 'SỐ ĐIỆN THOẠI',
            key: 'phone',
            placeholder: '09xxxxxxxx'
          },
          {
            icon: require('../../../assets/icon/locationhome.png'),
            label: 'ĐỊA CHỈ',
            key: 'address',
            placeholder: 'Số nhà, đường, quận...'
          },
          {
            icon: require('../../../assets/icon/license.png'),
            label: 'SỐ BẰNG LÁI XE',
            key: 'licenseNumber',
            placeholder: 'Số GPLX'
          },
        ].map((f) => (
          <View key={f.key} style={{ marginBottom: 16 }}>
            <Text style={styles.label}>{f.label}</Text>
            <View style={styles.inputRow}>
              <Image
                  source={f.icon}
                  style={styles.inputIcon}
                />
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={COLORS.textMuted}
                value={form[f.key]}
                onChangeText={set(f.key)}
              />
            </View>
          </View>
        ))}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>EMAIL</Text>
          <View style={[styles.inputRow, { backgroundColor: COLORS.surface, opacity: 0.7 }]}>
            <Image
                source={require('../../../assets/icon/email.png')}
                style={styles.inputIcon}
              />
            <Text style={[styles.input, { color: COLORS.textMuted }]}>{user?.email}</Text>
          </View>
          <Text style={{ fontSize: SIZES.fontXs, color: COLORS.textMuted, marginTop: 4 }}>Email không thể thay đổi</Text>
        </View>
        <GoldButton title="Lưu thay đổi" onPress={handleSave} loading={loading} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: SIZES.md, paddingBottom: 12, ...SHADOWS.small,
  },
  title: { fontSize: SIZES.fontXl, fontWeight: '800', color: COLORS.textPrimary },
  content: { padding: SIZES.md },
  avatarArea: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  changeAvatarBtn: { marginTop: 10, backgroundColor: COLORS.goldPale, borderRadius: SIZES.radiusFull, paddingHorizontal: 16, paddingVertical: 6 },
  changeAvatarText: { color: COLORS.gold, fontWeight: '700', fontSize: SIZES.fontSm },
  label: { fontSize: SIZES.fontXs, color: COLORS.textMuted, fontFamily: 'Courier', letterSpacing: 1, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd, height: 52, paddingHorizontal: 14, gap: 10, backgroundColor: COLORS.white,
  },
  headerIcon: {
  width: 22,
  height: 22,
  resizeMode: 'contain',
},

inputIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
},

saveIcon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
  marginRight: 8,
},

saveBtnContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

saveText: {
  color: COLORS.white,
  fontWeight: '700',
},
  input: { flex: 1, fontSize: SIZES.fontMd, color: COLORS.textPrimary },
});
