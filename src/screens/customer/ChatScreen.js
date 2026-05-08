// src/screens/customer/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthContext } from '../../context/AuthContext';

const INITIAL_MESSAGES = [
  {
    id: '1',
    from: 'admin',
    text: 'Xin chào! VietRental có thể giúp gì cho bạn?',
    time: '09:00',
  },
  {
    id: '2',
    from: 'admin',
    text: 'Chúng tôi hỗ trợ 24/7. Đừng ngần ngại hỏi nhé! 😊',
    time: '09:01',
  },
];

export default function ChatScreen({
  navigation,
  route,
}) {
  const { user } =
    useAuthContext();

  // Nhận dữ liệu từ AdminChatInbox
  const customerName =
    route?.params
      ?.customerName ||
    'VietRental Support';

  const chatMessages =
    route?.params
      ?.messages ||
    INITIAL_MESSAGES;

  const [messages, setMessages] =
    useState(chatMessages);

  const [input, setInput] =
    useState('');

  const listRef =
    useRef(null);

  const timeoutRef =
    useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const now =
      new Date();

    const time = `${now.getHours()}:${String(
      now.getMinutes()
    ).padStart(
      2,
      '0'
    )}`;

    const newMsg = {
      id: String(
        Date.now()
      ),
      from: 'user',
      text: input.trim(),
      time,
    };

    setMessages((prev) => [
      ...prev,
      newMsg,
    ]);

    setInput('');

    // Auto reply chỉ khi user chat support
    if (
      customerName ===
      'VietRental Support'
    ) {
      timeoutRef.current = setTimeout(() => {
        setMessages(
          (prev) => [
            ...prev,
            {
              id: String(
                Date.now() + 1
              ),
              from: 'admin',
              text: 'Cảm ơn bạn đã liên hệ! Nhân viên sẽ phản hồi trong giây lát 🚗',
              time,
            },
          ]
        );
      }, 1000);
    }
  };

  const renderMessage = ({
    item,
  }) => {
    const isUser =
      item.from ===
        'user' ||
      item.sender ===
        'customer';

    return (
      <View
        style={[
          styles.msgRow,
          isUser &&
            styles.msgRowUser,
        ]}
      >
        {!isUser && (
          <View
            style={
              styles.adminAvatar
            }
          >
            <Text
              style={{
                fontSize: 14,
              }}
            >
              🚗
            </Text>
          </View>
        )}

        <View
          style={[
            styles.bubble,
            isUser
              ? styles.bubbleUser
              : styles.bubbleAdmin,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser &&
                styles.bubbleTextUser,
            ]}
          >
            {item.text}
          </Text>

          <Text
            style={[
              styles.bubbleTime,
              isUser && {
                color:
                  'rgba(255,255,255,0.6)',
              },
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={
        styles.container
      }
      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : undefined
      }
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.navy
        }
      />

      {/* Header */}
      <View
        style={
          styles.header
        }
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={{
            padding: 8,
          }}
        >
          <Text
            style={
              styles.backText
            }
          >
            ←
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={
              styles.headerTitle
            }
          >
            {customerName}
          </Text>

          <Text
            style={
              styles.headerStatus
            }
          >
            🟢 Đang trực tuyến
          </Text>
        </View>

        <Text
          style={{
            fontSize: 24,
          }}
        >
          📞
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(
          item
        ) => item.id}
        contentContainerStyle={
          styles.listContent
        }
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd(
            {
              animated:
                true,
            }
          )
        }
        renderItem={
          renderMessage
        }
      />

      {/* Input */}
      <View
        style={
          styles.inputBar
        }
      >
        <TextInput
          style={
            styles.input
          }
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={
            COLORS.textMuted
          }
          value={input}
          onChangeText={
            setInput
          }
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendBtn,
            !input.trim() && {
              opacity: 0.5,
            },
          ]}
          onPress={
            sendMessage
          }
          disabled={
            !input.trim()
          }
        >
          <Text
            style={
              styles.sendIcon
            }
          >
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F0F2F5',
    },

    header: {
      backgroundColor:
        COLORS.navy,
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

    backText: {
      color:
        COLORS.white,
      fontSize: 20,
    },

    headerTitle: {
      fontSize:
        SIZES.fontLg,
      fontWeight:
        '700',
      color:
        COLORS.white,
    },

    headerStatus: {
      fontSize:
        SIZES.fontXs,
      color:
        'rgba(255,255,255,0.5)',
      marginTop: 1,
    },

    listContent: {
      padding:
        SIZES.md,
      gap: 12,
      paddingBottom: 16,
    },

    msgRow: {
      flexDirection:
        'row',
      alignItems:
        'flex-end',
      gap: 8,
    },

    msgRowUser: {
      flexDirection:
        'row-reverse',
    },

    adminAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        COLORS.goldPale,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    bubble: {
      maxWidth: '75%',
      borderRadius: 16,
      padding: 12,
    },

    bubbleAdmin: {
      backgroundColor:
        COLORS.white,
      borderBottomLeftRadius: 4,
      ...SHADOWS.small,
    },

    bubbleUser: {
      backgroundColor:
        COLORS.gold,
      borderBottomRightRadius: 4,
    },

    bubbleText: {
      fontSize:
        SIZES.fontMd,
      color:
        COLORS.textPrimary,
      lineHeight: 22,
    },

    bubbleTextUser: {
      color:
        COLORS.navy,
    },

    bubbleTime: {
      fontSize: 10,
      color:
        COLORS.textMuted,
      marginTop: 4,
      alignSelf:
        'flex-end',
    },

    inputBar: {
      flexDirection:
        'row',
      alignItems:
        'flex-end',
      gap: 10,
      padding:
        SIZES.md,
      paddingBottom: 28,
      backgroundColor:
        COLORS.white,
      ...SHADOWS.large,
    },

    input: {
      flex: 1,
      borderWidth: 1.5,
      borderColor:
        COLORS.border,
      borderRadius:
        SIZES.radiusMd,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize:
        SIZES.fontMd,
      color:
        COLORS.textPrimary,
      maxHeight: 100,
      backgroundColor:
        COLORS.cream,
    },

    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        COLORS.gold,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    sendIcon: {
      color:
        COLORS.navy,
      fontSize: 18,
      fontWeight:
        '700',
    },
  });