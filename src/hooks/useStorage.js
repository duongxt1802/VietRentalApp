// src/hooks/useStorage.js
import { useState, useEffect, useCallback } from 'react';
import {
  getItem,
  setItem,
  removeItem,
  getCart,
  saveCart,
  addToCart as addToCartService,
  updateCartItem,
  removeFromCart as removeFromCartService,
  clearCart,
  getOrders,
  saveOrder,
  getAuth,
  saveAuth,
  clearAllUserData,
} from '../services/storageService';

// ─── useStorage: Generic key-value storage hook ───
export const useStorage = (key, initialValue = null, decrypt = false) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const value = await getItem(key, decrypt);
      setData(value !== null ? value : initialValue);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (value, encrypt = decrypt) => {
      try {
        await setItem(key, value, encrypt);
        setData(value);
        return true;
      } catch (err) {
        setError(err);
        return false;
      }
    },
    [key]
  );

  const remove = useCallback(async () => {
    try {
      await removeItem(key);
      setData(initialValue);
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }, [key]);

  return { data, loading, error, save, remove, reload: load };
};

// ─── useAuth hook ───
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAuth = useCallback(async () => {
    try {
      setLoading(true);
      const savedUser = await getAuth();
      setUser(savedUser);
    } catch (err) {
      console.error('[useAuth] loadAuth error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuth();
  }, []);

  const login = useCallback(async (userData) => {
    try {
      await saveAuth(userData);
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearAllUserData();
      setUser(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { user, loading, login, logout, reload: loadAuth };
};

// ─── useCart hook ───
export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const savedCart = await getCart();
      setCart(savedCart);
    } catch (err) {
      console.error('[useCart] loadCart error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, []);

  const addItem = useCallback(async (vehicle, days, pickupDate, returnDate) => {
    try {
      const updated = await addToCartService(vehicle, days, pickupDate, returnDate);
      setCart(updated);
      return updated;
    } catch {
      return cart;
    }
  }, [cart]);

  const updateItem = useCallback(async (cartItemId, updates) => {
    try {
      const updated = await updateCartItem(cartItemId, updates);
      setCart(updated);
      return updated;
    } catch {
      return cart;
    }
  }, [cart]);

  const removeItem = useCallback(async (cartItemId) => {
    try {
      const updated = await removeFromCartService(cartItemId);
      setCart(updated);
      return updated;
    } catch {
      return cart;
    }
  }, [cart]);

  const clearAll = useCallback(async () => {
    try {
      await clearCart();
      setCart([]);
      return true;
    } catch {
      return false;
    }
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity * item.rentalDays,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    loading,
    totalPrice,
    totalItems,
    addItem,
    updateItem,
    removeItem,
    clearAll,
    reload: loadCart,
  };
};

// ─── useOrders hook ───
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const saved = await getOrders();
      setOrders(saved);
    } catch (err) {
      console.error('[useOrders] loadOrders error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      const newOrder = await saveOrder(orderData);
      if (newOrder) {
        setOrders((prev) => [newOrder, ...prev]);
      }
      return newOrder;
    } catch {
      return null;
    }
  }, []);

  return { orders, loading, createOrder, reload: loadOrders };
};
