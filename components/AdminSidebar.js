"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function AdminSidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { resetCart } = useCart();

  const handleLogout = async () => {
    try {
      // Use the useAuth logout function which properly updates the auth context
      await logout();
      // Reset cart state
      resetCart();
      // The logout function already handles redirection, so we don't need to push here
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect in case of error
      router.push('/login');
    }
  };

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-primary/90 to-secondary/80 shadow-xl flex flex-col py-10 px-6 text-white">
      <div className="flex flex-col items-center mb-10">
        {/* <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
          <span className="material-icons text-4xl text-white">admin_panel_settings</span>
        </div> */}
        <h2 className="text-xl font-bold tracking-wide mb-1">Admin Panel</h2>
        <span className="text-xs text-white/80">admin@fashionhub.com</span>
      </div>
      <nav className="flex flex-col gap-2 flex-1 items-center">
        <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Products</span>
          
        </Link>
        <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Categories</span>
          
        </Link>
        <Link href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Blogs</span>
          
        </Link>
        <Link href="/admin/testimonials" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Testimonials</span>
          
        </Link>
        <Link href="/admin/contacts" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">User Contacts</span>
          
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium hover:bg-white/10 focus:bg-white/20 focus:outline-none">
          <span className="material-icons text-black">Orders</span>
          
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
        <span className="text-xs text-black/60">FashionHub Admin</span>
      </div>
    </aside>
  );
} 