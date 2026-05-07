// src/navigation/AppNavigator.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuthContext } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';
import { COLORS, SIZES } from '../constants/theme';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

import HomeScreen from '../screens/customer/HomeScreen';
import VehicleListScreen from '../screens/customer/VehicleListScreen';
import VehicleDetailScreen from '../screens/customer/VehicleDetailScreen';
import CartScreen from '../screens/customer/CartScreen';
import BookingFormScreen from '../screens/customer/BookingFormScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import BookingSuccessScreen from '../screens/customer/BookingSuccessScreen';
import MyBookingsScreen from '../screens/customer/MyBookingsScreen';
import BookingDetailScreen from '../screens/customer/BookingDetailScreen';
import ReviewScreen from '../screens/customer/ReviewScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import ChatScreen from '../screens/customer/ChatScreen';
import PaymentHistoryScreen from '../screens/customer/PaymentHistoryScreen';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminVehicleListScreen from '../screens/admin/AdminVehicleListScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import AdminBookingDetailScreen from '../screens/admin/AdminBookingDetailScreen';
import AdminPromotionsScreen from '../screens/admin/AdminPromotionsScreen';
import AdminChatInboxScreen from '../screens/admin/AdminChatInboxScreen';
import AdminCustomersScreen from '../screens/admin/AdminCustomersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, label, focused }) => (
  <View style={tabStyles.tabItem}>
    <Image
      source={icon}
      style={[tabStyles.tabIconImg, { opacity: focused ? 1 : 0.4 }]}
    />
    <Text style={[tabStyles.tabLabel, focused && tabStyles.tabLabelActive]}>{label}</Text>
  </View>
);

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function CustomerTabs() {
  const { totalItems } = useCartContext();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: tabStyles.tabBar }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/home.png')} label="Home" focused={focused} /> }}
      />
      <Tab.Screen name="VehicleList" component={VehicleListScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/search.png')} label="Tìm" focused={focused} /> }}
      />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/booking.png')} label="Đơn" focused={focused} /> }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/user.png')} label="Tôi" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="BookingForm" component={BookingFormScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: tabStyles.tabBar }}>
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/dash.png')} label="Dash" focused={focused} /> }}
      />
      <Tab.Screen name="AdminVehicles" component={AdminVehicleListScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/car.png')} label="Xe" focused={focused} /> }}
      />
      <Tab.Screen name="AdminBookings" component={AdminBookingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/checklist.png')} label="Đơn" focused={focused} /> }}
      />
      <Tab.Screen name="AdminChat" component={AdminChatInboxScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon={require('../../assets/icon/chat.png')} label="Chat" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminBookingDetail" component={AdminBookingDetailScreen} />
      <Stack.Screen name="AdminPromotions" component={AdminPromotionsScreen} />
      <Stack.Screen name="AdminCustomers" component={AdminCustomersScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, authLoading } = useAuthContext();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.navyDark }}>
        <Image
          source={require('../../assets/icon/logo.png')}
          style={{ width: 80, height: 80, resizeMode: 'contain', marginBottom: 20 }}
        />
        <Text style={{ color: COLORS.gold, fontSize: SIZES.fontXl, fontWeight: '800' }}>
          Viet<Text style={{ color: COLORS.white }}>Rental</Text>
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8, fontSize: SIZES.fontSm }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'admin' ? (
        <AdminStack />
      ) : (
        <CustomerStack />
      )}
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  tabIconImg: { width: 24, height: 24, resizeMode: 'contain' },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabEmoji: { fontSize: 22, opacity: 0.5 },
  tabEmojiActive: { opacity: 1 },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  tabLabelActive: { color: COLORS.gold, fontWeight: '700' },
});
