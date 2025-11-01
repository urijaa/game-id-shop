import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  isInCart: () => false,
  clearCart: () => {}
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart:v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(cart));
    } catch (e) {
      console.error('persist cart error', e);
    }
  }, [cart]);

  const addItem = (item) => {
    if (!item || !item.id) return;
    setCart((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      // ensure minimal shape: id, title, price, images, quantity
      const next = [...prev, { ...item, quantity: item.quantity || 1 }];
      return next;
    });
  };

  const removeItem = (itemId) => {
    setCart((prev) => prev.filter((p) => p.id !== itemId));
  };

  const isInCart = (itemId) => cart.some((p) => p.id === itemId);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}