"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  function addToCart(product) {

    setCart(prev => {

      const exist = prev.find(p => p._id === product._id);

      if (exist) {
        return prev.map(p =>
          p._id === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

  }


  function inc(id) {
    setCart(prev =>
      prev.map(p =>
        p._id === id
          ? { ...p, qty: p.qty + 1 }
          : p
      )
    );
  }


  function dec(id) {
    setCart(prev =>
      prev
        .map(p =>
          p._id === id
            ? { ...p, qty: p.qty - 1 }
            : p
        )
        .filter(p => p.qty > 0)
    );
  }


  function removeItem(id) {
    setCart(prev =>
      prev.filter(p => p._id !== id)
    );
  }


  // 🔥 NEW
  function clearCart() {
    setCart([]);
  }


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        inc,
        dec,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}