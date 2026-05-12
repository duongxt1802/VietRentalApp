# VietRental App 🚗

## Tên đề tài
**VietRental App — Ứng dụng thuê xe trực tuyến**

## Giới thiệu hệ thống
VietRental App là một hệ thống thuê xe trên nền tảng di động, cho phép người dùng thuê xe nhanh chóng, quản lý giỏ hàng, đặt xe, thanh toán và theo dõi lịch sử đơn hàng. Ứng dụng cũng hỗ trợ giao diện quản trị viên để quản lý xe, xác nhận đơn, quản lý khuyến mãi, và xem thông tin khách hàng.

## Danh sách thành viên
- Thành viên 1: TRẦN XUÂN DƯƠNG — MSSV: 23810310242
- Thành viên 2: ĐỖ MINH ĐĂNG — MSSV: 23810310294
- Thành viên 3: PHẠM MINH TUẤN — MSSV: 23810310308


## Phân công nhiệm vụ cụ thể
- Thành viên 1 (Duong): Xây dựng trang admin, quản lý kho xe, khuyến mãi, chức năng chat/messaging và cấu hình dự án.
- Thành viên 2 (Tuấn): Xây dựng chức năng xác thực, navigation, một số màn hình khách hàng (đặt xe, giỏ hàng, chat).
- Thành viên 3 (Đăng): Thiết kế giao diện, xây dựng màn hình khách hàng, quản lý trạng thái, lưu trữ AsyncStorage và assets.

## Công nghệ sử dụng
- React Native
- Expo
- JavaScript
- AsyncStorage
- React Navigation
- Context API

## 📥 Link Tải App & Video Demo
- **down app tại đây**: [https://drive.google.com/file/d/1gy4ximpxWic25-oxJW_R6FecbgMVbx6N/view?usp=drive_link](https://drive.google.com/file/d/1gy4ximpxWic25-oxJW_R6FecbgMVbx6N/view?usp=drive_link)
- **video demo**: [https://drive.google.com/file/d/1ypeh7xQfginMHuqKZGSWkaZylgqse-4c/view?usp=drive_link](https://drive.google.com/file/d/1ypeh7xQfginMHuqKZGSWkaZylgqse-4c/view?usp=drive_link)

## Hướng dẫn cài đặt
1. Mở terminal tại thư mục dự án `c:\VietRentalApp`
2. Cài đặt dependencies:

```bash
npm install
```

## Hướng dẫn chạy project
1. Khởi động Expo:

```bash
npx expo start
```

2. Chạy trên Android:

```bash
npx expo start --android
```

3. Chạy trên iOS:

```bash
npx expo start --ios
```

## Tải app APK về cho smartphone
Hiện tại repo chưa chứa file APK sẵn. Để tạo APK Android, bạn có thể sử dụng Expo CLI hoặc Expo Application Services (EAS):

1. Cài Expo CLI nếu chưa có:

```bash
npm install -g expo-cli
```

2. Build APK bằng lệnh Expo classic (nếu được hỗ trợ):

```bash
expo build:android -t apk
```

3. Hoặc dùng EAS Build để tạo file APK mới nhất:

```bash
eas build -p android --profile preview
```

4. Sau khi build xong, tải file APK về máy tính và chuyển vào điện thoại để cài đặt.

> Lưu ý: trước khi cài đặt APK, bật quyền cài ứng dụng từ nguồn không xác định trên điện thoại Android.

## Tài khoản demo
| Role | Email | Password |
|------|-------|----------|
| Customer | user@vietrental.vn | user123 |
| Admin | admin@vietrental.vn | admin123 |

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

## 🎨 Design System

- **Colors**: Navy `#1A1A2E` + Gold `#F5A623` + White
- **Typography**: System font, Courier (mono)
- **Shadows**: Small / Medium / Large presets
- **Border radius**: 8 / 12 / 16 / 24 / 999

## 💾 Lưu trữ AsyncStorage

| Key | Dữ liệu | Mã hóa |
|-----|---------|--------|
| `@vietrental_auth_token` | Token | ✅ XOR |
| `@vietrental_user_data` | User info | ✅ XOR |
| `@vietrental_login_expiry` | Thời gian hết hạn | ❌ |
| `@vietrental_cart` | Giỏ hàng | ❌ |
| `@vietrental_orders` | Đơn hàng | ❌ |

## 🔍 Tìm kiếm

Tìm kiếm hoạt động **client-side** bằng JavaScript filter:
- Tìm theo tên, brand, loại xe, địa điểm
- Kết hợp với filter loại xe (motorbike, car, van, electric, truck)
- Sort theo giá, đánh giá

## 🎯 Điểm Nổi Bật & Tính Năng Nâng Cao

### 🔐 Bảo Mật & An Toàn
- **Mã hóa XOR**: Bảo vệ dữ liệu nhạy cảm (token, user info)
- **Auto-logout**: Tự động đăng xuất sau 7 ngày không hoạt động
- **Secure Storage**: AsyncStorage với encryption cho thông tin quan trọng

### 💾 Lưu Trữ & Quản Lý Dữ Liệu
- **Persistent Storage**: AsyncStorage với expiry token management
- **Auto-cleanup**: Tự động dọn dẹp dữ liệu hết hạn
- **State Management**: Context API cho global state management

### 🎨 Thiết Kế & UX
- **Design System**: Theme thống nhất với COLORS, SIZES, SHADOWS
- **Responsive UI**: Hoạt động mượt mà trên nhiều thiết bị
- **Intuitive Navigation**: Bottom tabs + Stack navigation

### 🔍 Tìm Kiếm & Lọc
- **Smart Search**: Tìm kiếm theo tên xe, loại xe, địa điểm
- **Advanced Filter**: Filter theo loại xe (ô tô, xe máy, xe tải, điện)
- **Sort Options**: Sắp xếp theo giá, đánh giá, phổ biến

### 💬 Tính Năng Nâng Cao
- **Chat Mock**: Hỗ trợ real-time giữa Customer ↔ Admin
- **Promo Codes**: Hệ thống mã khuyến mãi (SUMMER2025, NEWUSER10)
- **Admin Dashboard**: Analytics với KPIs và charts

### 📱 Cross-Platform
- **iOS & Android**: Build sẵn với Expo
- **APK Download**: [Link tải APK](https://drive.google.com/file/d/1gy4ximpxWic25-oxJW_R6FecbgMVbx6N/view?usp=drive_link)
- **Expo Ready**: Chạy trên mọi thiết bị hỗ trợ Expo

---

*VietRental App — Built with React Native + Expo*
