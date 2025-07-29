"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data);
      } else {
        setWishlist({ items: [] });
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (res.ok) {
        alert('Added to cart!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        const updatedWishlist = await res.json();
        setWishlist(updatedWishlist);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="ml-4 text-indigo-500 font-semibold">Loading wishlist...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {!wishlist?.items || wishlist.items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">♥</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Start adding products to your wishlist!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <div key={item.product._id} className="bg-white rounded-lg shadow p-4">
              {/* Product Image */}
              <div className="relative mb-4">
                <Image
                  src={item.product.image?.startsWith('/') || item.product.image?.startsWith('http') ? item.product.image : '/default.jpg'}
                  alt={item.product.name}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover rounded"
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.product._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  title="Remove from wishlist"
                >
                  ×
                </button>
              </div>

              {/* Product Details */}
              <div className="space-y-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.description}</p>
                  <div className="text-pink-600 font-bold text-xl">₹{item.product.price}</div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => addToCart(item.product._id)}
                    disabled={addingToCart[item.product._id]}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {addingToCart[item.product._id] ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <button
                    onClick={() => router.push(`/product/${item.product.slug}`)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded font-semibold hover:bg-gray-300 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 