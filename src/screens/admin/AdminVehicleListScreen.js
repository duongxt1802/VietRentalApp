// src/screens/admin/AdminVehicleListScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';

import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { VEHICLES } from '../../data/data';
import { StatusBadge, formatCurrency } from '../../components/shared';

export default function AdminVehicleListScreen({ navigation }) {
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [filter, setFilter] = useState('all');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [editData, setEditData] = useState({
    brand: '',
    model: '',
    type: '',
    location: '',
    description: '',
    price: '',
    seats: '',
    year: '',
    fuel: '',
    transmission: '',
    status: 'available',
  });

  const filtered =
    filter === 'all'
      ? vehicles
      : vehicles.filter((v) => v.status === filter);

  // ======================
  // STATUS LABEL
  // ======================
  const statusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'rented':
        return 'Đang thuê';
      case 'maintenance':
        return 'Bảo dưỡng';
      default:
        return status;
    }
  };

  // ======================
  // STATUS COLOR
  // ======================
  const getStatusStyle = (status) => {
    switch (status) {
      case 'available':
        return 'availableStatus';
      case 'rented':
        return 'rentedStatus';
      case 'maintenance':
        return 'maintenanceStatus';
      default:
        return '';
    }
  };

  // ======================
  // UPDATE STATUS
  // ======================
  const updateVehicleStatus = (id, newStatus) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: newStatus,
            }
          : v
      )
    );

    Alert.alert(
      'Thành công',
      'Trạng thái xe đã được cập nhật'
    );
  };

 

  // ======================
  // DELETE
  // ======================
  const handleDelete = (id, model) => {
    Alert.alert(
      'Xóa xe',
      `Bạn có chắc muốn xóa ${model}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setVehicles((prev) =>
              prev.filter((v) => v.id !== id)
            );

            Alert.alert(
              'Thành công',
              'Xe đã được xóa khỏi danh sách'
            );
          },
        },
      ]
    );
  };

  // ======================
  // OPEN EDIT
  // ======================
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);

    setEditData({
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      type: vehicle.type || '',
      location: vehicle.location || '',
      description: vehicle.description || '',
      price: String(vehicle.price || ''),
      seats: String(vehicle.specs?.seats || ''),
      year: String(vehicle.specs?.year || ''),
      fuel: vehicle.specs?.fuel || '',
      transmission: vehicle.specs?.transmission || '',
      status: vehicle.status || 'available',
    });

    setEditModalVisible(true);
  };

  // ======================
  // SAVE EDIT
  // ======================
  const handleSaveEdit = () => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === selectedVehicle.id
          ? {
              ...v,
              brand: editData.brand,
              model: editData.model,
              type: editData.type,
              location: editData.location,
              description: editData.description,
              price: Number(editData.price),
              status: editData.status,
              specs: {
                ...v.specs,
                seats: Number(editData.seats),
                year: Number(editData.year),
                fuel: editData.fuel,
                transmission: editData.transmission,
              },
            }
          : v
      )
    );

    setEditModalVisible(false);

    Alert.alert(
      'Thành công',
      'Thông tin xe đã được cập nhật'
    );
  };

  const stats = [
    {
      label: 'Tổng',
      value: vehicles.length,
    },
    {
      label: 'Sẵn',
      value: vehicles.filter(
        (v) => v.status === 'available'
      ).length,
    },
    {
      label: 'Đang thuê',
      value: vehicles.filter(
        (v) => v.status === 'rented'
      ).length,
    },
    {
      label: 'Bảo dưỡng',
      value: vehicles.filter(
        (v) => v.status === 'maintenance'
      ).length,
    },
  ];

  const renderVehicle = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.vehicleImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.model}>{item.model}</Text>
        <Text style={styles.price}>
          {formatCurrency(item.price)}đ/ngày
        </Text>

        <StatusBadge status={item.status} />
      </View>

      <View style={styles.actions}>
        
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
  <Image source={require('../../../assets/icon/edit.png')} style={styles.actionIcon} />
</TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.model)}>
  <Image source={require('../../../assets/icon/trash.png')} style={styles.actionIcon} />
</TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Quản lý xe
        </Text>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statVal}>
              {item.value}
            </Text>
            <Text style={styles.statLabel}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* FILTER */}
      <View style={styles.filters}>
        {[
          ['all', 'Tất cả'],
          ['available', 'Sẵn'],
          ['rented', 'Đang thuê'],
          ['maintenance', 'Bảo dưỡng'],
        ].map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.chip,
              filter === id && styles.chipActive,
            ]}
            onPress={() => setFilter(id)}
          >
            <Text
              style={[
                styles.chipText,
                filter === id &&
                  styles.chipTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVehicle}
        contentContainerStyle={{
          padding: SIZES.md,
          paddingBottom: 100,
        }}
      />

      {/* EDIT MODAL */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                Chỉnh sửa xe
              </Text>

              {selectedVehicle && (
                <Image
                  source={selectedVehicle.image}
                  style={styles.editImage}
                  resizeMode="contain"
                />
              )}

              {[
                ['brand', 'Brand'],
                ['model', 'Model'],
                ['type', 'Loại xe'],
                ['location', 'Địa điểm'],
                ['description', 'Mô tả'],
                ['price', 'Giá thuê'],
                ['seats', 'Số chỗ'],
                ['year', 'Năm sản xuất'],
                ['fuel', 'Nhiên liệu'],
                ['transmission', 'Hộp số'],
              ].map(([field, placeholder]) => (
                <TextInput
                  key={field}
                  style={styles.input}
                  placeholder={placeholder}
                  value={editData[field]}
                  keyboardType={
                    ['price', 'seats', 'year'].includes(field)
                      ? 'numeric'
                      : 'default'
                  }
                  onChangeText={(text) =>
                    setEditData({
                      ...editData,
                      [field]: text,
                    })
                  }
                />
              ))}

              {/* STATUS ROW */}
              <Text style={styles.sectionTitle}>
                Trạng thái
              </Text>

              <View style={styles.statusRow}>
                {[
                  'available',
                  'rented',
                  'maintenance',
                ].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      editData.status === status &&
                        styles[getStatusStyle(status)],
                    ]}
                    onPress={() =>
                      setEditData({
                        ...editData,
                        status,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.statusText,
                        editData.status === status &&
                          styles.activeStatusText,
                      ]}
                    >
                      {statusLabel(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveText}>
                   Lưu thay đổi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setEditModalVisible(false)
                }
              >
                <Text>Đóng</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  backBtn: {
    color: COLORS.white,
    fontSize: 22,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },

  addBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    fontSize: 22,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },

  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },

  statVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.gold,
  },

  statLabel: {
    marginTop: 5,
    color: '#666',
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
  },

  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },

  chipActive: {
    backgroundColor: COLORS.navy,
  },

  chipText: {
    color: '#333',
  },

  chipTextActive: {
    color: COLORS.white,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.small,
  },
   actionIcon: { width: 18, height: 18, resizeMode: 'contain' },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  vehicleImage: {
    width: '100%',
    height: '100%',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  brand: {
    color: COLORS.gold,
    fontSize: 12,
  },

  model: {
    fontSize: 16,
    fontWeight: '700',
  },

  price: {
    color: '#666',
    marginVertical: 5,
  },

  actions: {
    gap: 8,
  },

  actionBtn: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    height: '90%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  editImage: {
    width: '100%',
    height: 180,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 12,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  statusOption: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  activeStatusText: {
    color: '#fff',
  },

  availableStatus: {
    backgroundColor: '#22c55e',
  },

  rentedStatus: {
    backgroundColor: '#ef4444',
  },

  maintenanceStatus: {
    backgroundColor: '#3b82f6',
  },

  saveBtn: {
    backgroundColor: COLORS.navy,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },

  cancelBtn: {
    marginTop: 15,
    alignItems: 'center',
    paddingBottom: 30,
  },
});