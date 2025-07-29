"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ProtectedAdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get token from API to check if it's valid
        const res = await fetch('/api/auth/test');
        const data = await res.json();
        
        if (!data.success) {
          console.log('Token validation failed:', data);
          router.push('/login');
          return;
        }
        
        console.log('Token validation successful:', data);
        
        if (data.payload.role !== 'admin') {
          console.log('User is not admin, redirecting to user dashboard');
          router.push('/user');
          return;
        }
        
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="ml-4 text-indigo-500 font-semibold">Loading...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
} 