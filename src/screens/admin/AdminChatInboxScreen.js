import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';

import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { Avatar } from '../../components/shared';

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Trần Hùng',
    lastMsg: 'Xe còn trống không anh?',
    time: '09:15',
    unread: 2,
    online: true,
    messages: [
      {
        id: 'm1',
        text: 'Xe còn trống không anh?',
        sender: 'customer',
        time: '09:10',
      },
      {
        id: 'm2',
        text: 'Dạ hiện tại còn Toyota Vios 2023 anh nhé.',
        sender: 'admin',
        time: '09:11',
      },
      {
        id: 'm3',
        text: 'Giá thuê bao nhiêu vậy?',
        sender: 'customer',
        time: '09:12',
      },
    ],
  },

  {
    id: '2',
    name: 'Nguyễn Linh',
    lastMsg: 'Cảm ơn anh đã hỗ trợ!',
    time: '08:42',
    unread: 0,
    online: false,
    messages: [
      {
        id: 'm1',
        text: 'Cảm ơn anh đã hỗ trợ!',
        sender: 'customer',
        time: '08:42',
      },
    ],
  },

  {
    id: '3',
    name: 'Vũ Minh',
    lastMsg: 'Giá thuê xe máy bao nhiêu?',
    time: 'Hôm qua',
    unread: 1,
    online: true,
    messages: [
      {
        id: 'm1',
        text: 'Giá thuê xe máy bao nhiêu?',
        sender: 'customer',
        time: '20:10',
      },
      {
        id: 'm2',
        text: 'Wave Alpha giá 120k/ngày anh nhé.',
        sender: 'admin',
        time: '20:12',
      },
    ],
  },

  {
    id: '4',
    name: 'Phạm Trang',
    lastMsg: 'Được rồi, mình đặt nhé',
    time: 'Hôm qua',
    unread: 0,
    online: false,
    messages: [
      {
        id: 'm1',
        text: 'Được rồi, mình đặt nhé',
        sender: 'customer',
        time: '18:30',
      },
    ],
  },

  {
    id: '5',
    name: 'Hoàng Nam',
    lastMsg: 'Cho hỏi xe 7 chỗ...',
    time: 'T2',
    unread: 3,
    online: false,
    messages: [
      {
        id: 'm1',
        text: 'Cho hỏi xe 7 chỗ còn không?',
        sender: 'customer',
        time: '16:00',
      },
      {
        id: 'm2',
        text: 'Hiện tại còn Mitsubishi Xpander anh nhé.',
        sender: 'admin',
        time: '16:05',
      },
    ],
  },
];

export default function AdminChatInboxScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = CONVERSATIONS.reduce(
    (sum, item) => sum + item.unread,
    0
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.navyDark}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chat</Text>

        <View style={styles.unreadTotal}>
          <Text style={styles.unreadTotalText}>
            {totalUnread}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Tìm hội thoại..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List chat */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingVertical: 8,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.convRow}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                'Chat',
                {
                  customerName:
                    item.name,
                  messages:
                    item.messages,
                }
              )
            }
          >
            {/* Avatar */}
            <View
              style={{
                position:
                  'relative',
              }}
            >
              <Avatar
                name={item.name}
                size={48}
                bg={
                  COLORS.purple
                }
              />

              {item.online && (
                <View
                  style={
                    styles.onlineDot
                  }
                />
              )}
            </View>

            {/* Chat info */}
            <View
              style={
                styles.convBody
              }
            >
              <View
                style={
                  styles.convTop
                }
              >
                <Text
                  style={
                    styles.convName
                  }
                >
                  {item.name}
                </Text>

                <Text
                  style={
                    styles.convTime
                  }
                >
                  {item.time}
                </Text>
              </View>

              <View
                style={
                  styles.convBottom
                }
              >
                <Text
                  style={[
                    styles.convMsg,
                    item.unread >
                      0 && {
                      fontWeight:
                        '700',
                      color:
                        COLORS.textPrimary,
                    },
                  ]}
                  numberOfLines={
                    1
                  }
                >
                  {item.lastMsg}
                </Text>

                {item.unread >
                  0 && (
                  <View
                    style={
                      styles.unreadBadge
                    }
                  >
                    <Text
                      style={
                        styles.unreadNum
                      }
                    >
                      {
                        item.unread
                      }
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={
              styles.separator
            }
          />
        )}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.white,
    },

    header: {
      backgroundColor:
        COLORS.navyDark,
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingTop: 50,
      paddingBottom: 14,
      paddingHorizontal:
        SIZES.md,
      gap: 12,
    },

    backBtn: {
      padding: 8,
    },

    backText: {
      color:
        COLORS.white,
      fontSize: 20,
    },

    headerTitle: {
      flex: 1,
      fontSize:
        SIZES.fontXl,
      fontWeight:
        '800',
      color:
        COLORS.white,
    },

    unreadTotal: {
      backgroundColor:
        COLORS.gold,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    unreadTotalText: {
      color:
        COLORS.navy,
      fontWeight:
        '800',
      fontSize:
        SIZES.fontXs,
    },

    searchBar: {
      flexDirection:
        'row',
      alignItems:
        'center',
      backgroundColor:
        COLORS.cream,
      borderRadius:
        SIZES.radiusMd,
      margin:
        SIZES.md,
      paddingHorizontal: 14,
      height: 44,
      borderWidth: 1,
      borderColor:
        COLORS.border,
    },

    searchIcon: {
      marginRight: 8,
    },

    searchInput: {
      flex: 1,
      fontSize:
        SIZES.fontMd,
      color:
        COLORS.textPrimary,
    },

    convRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingHorizontal:
        SIZES.md,
      paddingVertical: 12,
      gap: 14,
    },

    onlineDot: {
      position:
        'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor:
        COLORS.green,
      borderWidth: 2,
      borderColor:
        COLORS.white,
    },

    convBody: {
      flex: 1,
    },

    convTop: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginBottom: 4,
    },

    convName: {
      fontSize:
        SIZES.fontMd,
      fontWeight:
        '700',
      color:
        COLORS.textPrimary,
    },

    convTime: {
      fontSize:
        SIZES.fontXs,
      color:
        COLORS.textMuted,
    },

    convBottom: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    convMsg: {
      flex: 1,
      fontSize:
        SIZES.fontSm,
      color:
        COLORS.textMuted,
      marginRight: 8,
    },

    unreadBadge: {
      backgroundColor:
        COLORS.navy,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent:
        'center',
      alignItems:
        'center',
      paddingHorizontal: 5,
    },

    unreadNum: {
      color:
        COLORS.white,
      fontSize:
        SIZES.fontXs,
      fontWeight:
        '800',
    },

    separator: {
      height: 1,
      backgroundColor:
        COLORS.border,
      marginLeft: 76,
    },
  });