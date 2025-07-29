"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      console.log('Fetching user data from /api/auth/me...');
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        console.log('User data fetched successfully:', userData);
        setUser(userData);
        console.log('User state updated in context');
      } else if (res.status === 401) {
        // User is not authenticated, which is normal
        console.log('User not authenticated (401) - setting user to null');
        setUser(null);
      } else {
        console.error('Error fetching user:', res.status);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const userData = await res.json();
        console.log('Login successful, user data:', userData);
        
        // Set user state immediately with the correct user data
        const userToSet = userData.user || userData;
        setUser(userToSet);
        console.log('User state set to:', userToSet);
        
        // Dispatch login event for other components to listen to
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('user-login', { detail: userToSet }));
        }
        
        return { success: true, user: userToSet };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Starting logout process...');
      await fetch('/api/auth/logout', { method: 'POST' });
      console.log('Logout API call successful');
      
      // Clear user state immediately
      setUser(null);
      console.log('User state cleared');
      
      // Clear any cart-related localStorage if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        console.log('Cart localStorage cleared');
        
        // Dispatch logout event for other components to listen to
        window.dispatchEvent(new CustomEvent('user-logout'));
      }
      
      // Use router.push instead of window.location for better UX
      router.push('/login');
      console.log('Redirected to login page');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      // Clear localStorage even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        // Dispatch logout event even on error
        window.dispatchEvent(new CustomEvent('user-logout'));
      }
      router.push('/login');
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (res.ok) {
        const newUser = await res.json();
        console.log('Signup successful, user data:', newUser);
        
        // Set user state immediately with the correct user data
        const userToSet = newUser.user || newUser;
        setUser(userToSet);
        console.log('User state set to:', userToSet);
        
        // Dispatch login event for other components to listen to
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('user-login', { detail: userToSet }));
        }
        
        return { success: true, user: userToSet };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    console.log('AuthProvider: Initializing auth on mount');
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 