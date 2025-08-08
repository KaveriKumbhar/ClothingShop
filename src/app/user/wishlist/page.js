"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserWishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchWishlist();
    // Listen for wishlist updates from ProductCard
    const handleWishlistUpdate = () => fetchWishlist();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  async function fetchWishlist() {
    try {
      const res = await fetch("/api/user/wishlist");
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      } else {
        setMsg("Error loading wishlist");
      }
    } catch (err) {
      setMsg("Error loading wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFromWishlist(productId) {
    try {
      const res = await fetch(`/api/user/wishlist?id=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => item._id !== productId));
        setMsg("Product removed from wishlist");
        setTimeout(() => setMsg(""), 2000);
      } else {
        setMsg("Error removing product from wishlist");
      }
    } catch (err) {
      setMsg("Error removing product from wishlist");
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {msg && (
        <div className={`mb-4 p-3 rounded ${msg.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {msg}
        </div>
      )}
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding products to your wishlist to see them here.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <Image
                  src={product.image?.startsWith("/") || product.image?.startsWith("http") ? product.image : "/default.jpg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove from wishlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="text-lg font-bold text-primary mt-1">₹{product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 