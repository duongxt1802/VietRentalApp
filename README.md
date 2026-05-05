# VietRental App 🚗

Ứng dụng thuê xe di động xây dựng bằng **React Native + Expo**.

---

## 📱 Tính năng chính

### 🔐 Xác thực & Lưu trữ
- Đăng nhập / Đăng ký với **AsyncStorage** (mã hóa XOR)
- Auto login khi mở lại app
- Tự động hết hạn login sau **7 ngày**
- Logout xóa toàn bộ dữ liệu

### 🛒 Giỏ hàng
- Thêm / xóa xe vào giỏ
- Tăng / giảm số lượng, số ngày thuê
- Dữ liệu giữ nguyên khi reload app
- Mã khuyến mãi (SUMMER2025, NEWUSER10)

### 📋 Đặt xe & Thanh toán
- Chọn địa điểm nhận / trả xe
- 3 phương thức thanh toán
- Lưu đơn hàng vào AsyncStorage
- Lịch sử đơn hàng với filter

### 👤 Hồ sơ
- Xem & chỉnh sửa thông tin
- Chat hỗ trợ real-time (mock)
- Lịch sử thanh toán

### 🔑 Admin Panel
- Dashboard với KPI
- Quản lý xe (CRUD status)
- Xác nhận / từ chối đơn hàng
- Quản lý mã khuyến mãi
- Chat inbox
- Khách hàng & giao dịch

---

## 🚀 Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Chạy app
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | user@vietrental.vn | user123 |
| Admin | admin@vietrental.vn | admin123 |

---

## 📁 Cấu trúc thư mục

```
VietRentalApp/
├── App.js                          # Root component
├── index.js                        # Entry point
├── src/
│   ├── context/
│   │   ├── AuthContext.js          # Auth state global
│   │   └── CartContext.js          # Cart state global
│   ├── services/
│   │   └── storageService.js       # AsyncStorage wrappers + encryption
│   ├── hooks/
│   │   └── useStorage.js           # Custom hooks
│   ├── constants/
│   │   └── theme.js                # Colors, sizes, fonts
│   ├── data/
│   │   └── data.js                 # Danh sách sản phẩm JSON
│   ├── components/
│   │   └── shared.js               # Reusable UI components
│   ├── navigation/
│   │   └── AppNavigator.js         # Stack + Tab navigators
│   └── screens/
│       ├── auth/
│       │   ├── SplashScreen.js     # 01-A Onboarding
│       │   ├── LoginScreen.js      # 01-B Login
│       │   ├── RegisterScreen.js   # 01-C Register
│       │   └── ResetPasswordScreen.js # 07-A Reset Password
│       ├── customer/
│       │   ├── HomeScreen.js       # 02-A Home
│       │   ├── VehicleListScreen.js # 02-B Vehicle List
│       │   ├── VehicleDetailScreen.js # 02-C Vehicle Detail
│       │   ├── CartScreen.js       # Cart
│       │   ├── BookingFormScreen.js # 03-A Booking Form
│       │   ├── PaymentScreen.js    # 03-B Payment
│       │   ├── BookingSuccessScreen.js # 03-C Booking Success
│       │   ├── MyBookingsScreen.js # 04-A My Bookings
│       │   ├── BookingDetailScreen.js # 04-B Booking Detail
│       │   ├── ReviewScreen.js     # 04-C Review
│       │   ├── ProfileScreen.js    # 05-A Profile
│       │   ├── EditProfileScreen.js # 05-B Edit Profile
│       │   ├── ChatScreen.js       # 07-B Chat
│       │   └── PaymentHistoryScreen.js # 07-D Payment History
│       └── admin/
│           ├── AdminDashboardScreen.js    # 06-A Admin Dashboard
│           ├── AdminVehicleListScreen.js  # 06-C Admin Vehicles
│           ├── AdminBookingsScreen.js     # Admin Bookings List
│           ├── AdminBookingDetailScreen.js # 06-B Admin Booking Detail
│           ├── AdminPromotionsScreen.js   # 07-E Admin Promotions
│           ├── AdminChatInboxScreen.js    # 07-C Admin Chat Inbox
│           └── AdminCustomersScreen.js   # 07-F Admin Customers
└── assets/
    └── images/                     # Placeholder images (link theo assets/images/*)
```

---

## 🎨 Design System

- **Colors**: Navy `#1A1A2E` + Gold `#F5A623` + White
- **Typography**: System font, Courier (mono)
- **Shadows**: Small / Medium / Large presets
- **Border radius**: 8 / 12 / 16 / 24 / 999

---

## 💾 Lưu trữ AsyncStorage

| Key | Dữ liệu | Mã hóa |
|-----|---------|--------|
| `@vietrental_auth_token` | Token | ✅ XOR |
| `@vietrental_user_data` | User info | ✅ XOR |
| `@vietrental_login_expiry` | Thời gian hết hạn | ❌ |
| `@vietrental_cart` | Giỏ hàng | ❌ |
| `@vietrental_orders` | Đơn hàng | ❌ |

---

## 🔍 Tìm kiếm

Tìm kiếm hoạt động **client-side** bằng JavaScript filter:
- Tìm theo tên, brand, loại xe, địa điểm
- Kết hợp với filter loại xe (motorbike, car, van, electric, truck)
- Sort theo giá, đánh giá

---

*VietRental App — Built with React Native + Expo*
