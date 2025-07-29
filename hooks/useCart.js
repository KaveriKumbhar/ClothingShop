"use client";

import { useState, useEffect, createContext, useContext } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const cartData = await res.json();
        setCartItems(cartData.items || []);
        setCartCount(cartData.items?.length || 0);
      } else if (res.status === 401) {
        // User is not authenticated, which is normal
        setCartItems([]);
        setCartCount(0);
      } else {
        console.error('Error fetching cart:', res.status);
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setCartCount(0);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      
      if (res.ok) {
        const updatedCart = await res.json();
        setCartItems(updatedCart.items || []);
        const total = (updatedCart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
        setIsSideCartOpen(true);
        return updatedCart;
      } else if (res.status === 401) {
        // User is not authenticated, redirect to login
        window.location.href = '/login';
        return null;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      
      if (res.ok) {
        const updatedCart = await res.json();
        setCartItems(updatedCart.items || []);
        const total = (updatedCart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
        return updatedCart;
      } else if (res.status === 401) {
        // User is not authenticated, redirect to login
        window.location.href = '/login';
        return null;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        const updatedCart = await res.json();
        setCartItems(updatedCart.items || []);
        const total = (updatedCart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
        return updatedCart;
      } else if (res.status === 401) {
        // User is not authenticated, redirect to login
        window.location.href = '/login';
        return null;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset cart (for logout)
  const resetCart = () => {
    setCartItems([]);
    setCartCount(0);
    setIsSideCartOpen(false);
  };

  // Open side cart
  const openSideCart = () => {
    setIsSideCartOpen(true);
  };

  // Close side cart
  const closeSideCart = () => {
    setIsSideCartOpen(false);
  };

  // Initialize cart on mount and listen for logout events
  useEffect(() => {
    fetchCart();
    
    // Listen for logout events
    const handleLogout = () => {
      resetCart();
    };
    
    // Listen for login events
    const handleLogin = () => {
      fetchCart();
    };
    
    window.addEventListener('user-logout', handleLogout);
    window.addEventListener('user-login', handleLogin);
    
    return () => {
      window.removeEventListener('user-logout', handleLogout);
      window.removeEventListener('user-login', handleLogin);
    };
  }, []);

  const value = {
    cartItems,
    cartCount,
    loading,
    isSideCartOpen,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    openSideCart,
    closeSideCart,
    resetCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 