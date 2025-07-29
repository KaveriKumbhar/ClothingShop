"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function UserSidebar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();
  const { resetCart } = useCart();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      // Use the useAuth logout function which properly updates the auth context
      await logout();
      // Reset cart state
      resetCart();
      // The logout function already handles redirection, so we don't need to push here
    } catch (err) {
      console.error("Error logging out:", err);
      // Fallback redirect in case of error
      router.push("/");
    }
  }

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-primary/90 to-secondary/80 shadow-xl flex flex-col py-10 px-6 text-white">
      <div className="flex flex-col items-center mb-10">
        
        <h2 className="text-xl font-bold tracking-wide mb-1">User Dashboard</h2>
        {loading ? (
          <span className="text-xs text-white/80">Loading...</span>
        ) : user ? (
          <span className="text-xs text-white/80">{user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</span>
        ) : (
          <span className="text-xs text-white/80">Welcome</span>
        )}
      </div>
      <nav className="flex flex-col gap-2 flex-1 items-center">
        <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Profile</span>
          
        </Link>
        <Link href="/user/address" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Addresses</span>
          
        </Link>
        <Link href="/user/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Orders</span>
          
        </Link>
        <Link href="/user/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Wishlist</span>
         
        </Link>
      </nav>
      
      {/* Logout Button */}
      <div className="mt-auto border-t border-white/20 pt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all font-medium bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:outline-none text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-xs text-black/60">FashionHub User</span>
      </div>
    </aside>
  );
} 