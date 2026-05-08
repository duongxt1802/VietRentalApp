// src/services/storageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Simple XOR-based encryption (lightweight, no native deps) ───
const SECRET_KEY = 'VietRental@2025#SecretKey!';

const xorEncrypt = (text) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
    );
  }
  // Proper base64 encoding for Unicode
  const encoded = encodeURIComponent(result).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1));
  return btoa(encoded);
};

const xorDecrypt = (encoded) => {
  try {
    const decoded = atob(encoded);
    const text = decodeURIComponent(decoded.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
      );
    }
    return result;
  } catch {
    return null;
  }
};

// ─── Storage Keys ───
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@vietrental_auth_token',
  USER_DATA: '@vietrental_user_data',
  CART: '@vietrental_cart',
  ORDERS: '@vietrental_orders',
  LOGIN_EXPIRY: '@vietrental_login_expiry',
};

const normalizeOrderItem = (item = {}, fallbackRentalDays = 1) => ({
  id: item.id || `item_${Date.now()}`,
  vehicleId: item.vehicleId || item.id || null,
  brand: item.brand || '',
  model: item.model || '',
  image: item.image || null,
  price: Number(item.price) || 0,
  quantity: Number(item.quantity) || 1,
  rentalDays:
    Number(item.rentalDays) ||
    Number(item.days) ||
    Number(fallbackRentalDays) ||
    1,
});

const normalizeOrder = (order = {}) => {
  const fallbackDays = Number(order.days) || 1;
  const items = Array.isArray(order.items)
    ? order.items.map((item) =>
        normalizeOrderItem(item, fallbackDays)
      )
    : [];

  const rentalDaysFromItems =
    items.length > 0
      ? Math.max(
          ...items.map((item) => Number(item.rentalDays) || 1)
        )
      : fallbackDays;

  return {
    id: order.id || `ORD${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || null,
    status: order.status || 'pending',
    paymentStatus: order.paymentStatus || 'paid',
    paymentMethod: order.paymentMethod || 'bank',
    promoCode: order.promoCode || null,
    pickup: order.pickup || '',
    dropoff: order.dropoff || '',
    note: order.note || '',
    phone: order.phone || null,
    email: order.email || null,
    customerName:
      order.customerName ||
      order.customer ||
      'Khách hàng',
    customer:
      order.customer ||
      order.customerName ||
      'Khách hàng',
    items,
    days: Number(order.days) || rentalDaysFromItems || 1,
    total: Number(order.total) || 0,
  };
};

// ─── Auth TTL: 7 ngày ───
const AUTH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Generic set / get / remove ───
export const setItem = async (key, value, encrypt = false) => {
  try {
    const json = JSON.stringify(value);
    const data = encrypt ? xorEncrypt(json) : json;
    await AsyncStorage.setItem(key, data);
    return true;
  } catch (error) {
    console.error(`[Storage] setItem error (${key}):`, error);
    return false;
  }
};

export const getItem = async (key, decrypt = false) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    const json = decrypt ? xorDecrypt(raw) : raw;
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.error(`[Storage] getItem error (${key}):`, error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] removeItem error (${key}):`, error);
    return false;
  }
};

// ─── Auth ───
export const saveAuth = async (user) => {
  try {
    const expiry = Date.now() + AUTH_TTL_MS;
    await setItem(STORAGE_KEYS.USER_DATA, user, true);
    await setItem(STORAGE_KEYS.AUTH_TOKEN, { token: `token_${user.id}_${Date.now()}` }, true);
    await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_EXPIRY, String(expiry));
    return true;
  } catch (error) {
    console.error('[Storage] saveAuth error:', error);
    return false;
  }
};

export const getAuth = async () => {
  try {
    const expiryStr = await AsyncStorage.getItem(STORAGE_KEYS.LOGIN_EXPIRY);
    if (!expiryStr) return null;
    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) {
      // Auto logout khi hết hạn
      await clearAuth();
      return null;
    }
    const user = await getItem(STORAGE_KEYS.USER_DATA, true);
    return user;
  } catch (error) {
    console.error('[Storage] getAuth error:', error);
    return null;
  }
};

export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.LOGIN_EXPIRY,
    ]);
    return true;
  } catch (error) {
    console.error('[Storage] clearAuth error:', error);
    return false;
  }
};

// ─── Cart ───
export const getCart = async () => {
  try {
    const cart = await getItem(STORAGE_KEYS.CART);
    return cart || [];
  } catch (error) {
    console.error('[Storage] getCart error:', error);
    return [];
  }
};

export const saveCart = async (cartItems) => {
  try {
    await setItem(STORAGE_KEYS.CART, cartItems);
    return true;
  } catch (error) {
    console.error('[Storage] saveCart error:', error);
    return false;
  }
};

export const addToCart = async (vehicle, rentalDays = 1, pickupDate, returnDate) => {
  try {
    const cart = await getCart();
    const existingIndex = cart.findIndex((item) => item.vehicleId === vehicle.id);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
      cart[existingIndex].rentalDays = rentalDays;
    } else {
      cart.push({
        id: `cart_${Date.now()}`,
        vehicleId: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        price: vehicle.price,
        image: vehicle.image,
        quantity: 1,
        rentalDays: rentalDays,
        pickupDate: pickupDate || new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      });
    }
    await saveCart(cart);
    return cart;
  } catch (error) {
    console.error('[Storage] addToCart error:', error);
    return [];
  }
};

export const updateCartItem = async (cartItemId, updates) => {
  try {
    const cart = await getCart();
    const index = cart.findIndex((item) => item.id === cartItemId);
    if (index !== -1) {
      cart[index] = { ...cart[index], ...updates };
      await saveCart(cart);
    }
    return cart;
  } catch (error) {
    console.error('[Storage] updateCartItem error:', error);
    return [];
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    const cart = await getCart();
    const newCart = cart.filter((item) => item.id !== cartItemId);
    await saveCart(newCart);
    return newCart;
  } catch (error) {
    console.error('[Storage] removeFromCart error:', error);
    return [];
  }
};

export const clearCart = async () => {
  try {
    await removeItem(STORAGE_KEYS.CART);
    return true;
  } catch (error) {
    console.error('[Storage] clearCart error:', error);
    return false;
  }
};

// ─── Orders ───
export const getOrders = async (userId = null) => {
  try {
    const orders = await getItem(STORAGE_KEYS.ORDERS);
    const normalizedOrders = (orders || []).map(
      normalizeOrder
    );
    return userId ? normalizedOrders.filter(order => order.userId === userId) : normalizedOrders;
  } catch (error) {
    console.error('[Storage] getOrders error:', error);
    return [];
  }
};

export const saveOrder = async (orderData) => {
  try {
    const orders = await getOrders();
    const newOrder = normalizeOrder({
      ...orderData,
      id: orderData?.id || `ORD${Date.now()}`,
      createdAt:
        orderData?.createdAt ||
        new Date().toISOString(),
      status: orderData?.status || 'pending',
      userId: orderData?.userId,
    });
    const updatedOrders = [newOrder, ...orders];
    await setItem(STORAGE_KEYS.ORDERS, updatedOrders);
    return newOrder;
  } catch (error) {
    console.error('[Storage] saveOrder error:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orders = await getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updatedAt = new Date().toISOString();
      const normalizedOrders = orders.map(
        normalizeOrder
      );
      await setItem(
        STORAGE_KEYS.ORDERS,
        normalizedOrders
      );
    }
    return orders;
  } catch (error) {
    console.error('[Storage] updateOrderStatus error:', error);
    return [];
  }
};

// ─── Clear all user data (Logout) ───
export const clearAllUserData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.LOGIN_EXPIRY,
      STORAGE_KEYS.CART,
      STORAGE_KEYS.ORDERS,
    ]);
    return true;
  } catch (error) {
    console.error('[Storage] clearAllUserData error:', error);
    return false;
  }
};
