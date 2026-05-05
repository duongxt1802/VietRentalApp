// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCart,
  addToCart as addToCartSvc,
  updateCartItem,
  removeFromCart as removeFromCartSvc,
  clearCart,
  saveCart,
} from '../services/storageService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await getCart();
        setCart(saved || []);
      } catch (e) {
        console.error('[CartContext] init error:', e);
      } finally {
        setCartLoading(false);
      }
    })();
  }, []);

  const addItem = useCallback(async (vehicle, days, pickupDate, returnDate) => {
    const updated = await addToCartSvc(vehicle, days, pickupDate, returnDate);
    setCart(updated);
    return updated;
  }, []);

  const increaseQty = useCallback(async (cartItemId) => {
    const current = cart.find((i) => i.id === cartItemId);
    if (!current) return;
    const updated = await updateCartItem(cartItemId, { quantity: current.quantity + 1 });
    setCart(updated);
  }, [cart]);

  const decreaseQty = useCallback(async (cartItemId) => {
    const current = cart.find((i) => i.id === cartItemId);
    if (!current) return;
    if (current.quantity <= 1) {
      const updated = await removeFromCartSvc(cartItemId);
      setCart(updated);
    } else {
      const updated = await updateCartItem(cartItemId, { quantity: current.quantity - 1 });
      setCart(updated);
    }
  }, [cart]);

  const removeItem = useCallback(async (cartItemId) => {
    const updated = await removeFromCartSvc(cartItemId);
    setCart(updated);
  }, []);

  const clearAll = useCallback(async () => {
    await clearCart();
    setCart([]);
  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.rentalDays || 1),
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, totalItems, totalPrice, addItem, increaseQty, decreaseQty, removeItem, clearAll }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be inside CartProvider');
  return ctx;
};
