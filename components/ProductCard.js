"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleProductClick = () => {
    router.push(`/product/${product.slug}`);
  };

  const addToWishlist = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });
      if (res.ok) {
        setIsInWishlist(true);
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      } else {
        const data = await res.json();
        if (data.error === "Product already in wishlist") {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optionally, implement remove from wishlist (not shown in UI, but for completeness)
  const removeFromWishlist = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/user/wishlist?id=${product._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsInWishlist(false);
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const result = await addToCart(product._id, 1);
      if (result) {
        setIsInCart(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    router.push(`/checkout?productSlug=${product.slug}&quantity=1`);
  };

  return (
    <div 
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 card-hover cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image?.startsWith('/') || product.image?.startsWith('http') ? product.image : '/default.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-3 flex flex-col">
          <button
            onClick={isInWishlist ? removeFromWishlist : addToWishlist}
            disabled={loading}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110 focus:scale-110 border-2 border-white/80 ring-2 ring-white/30 focus:outline-none ${
              isInWishlist 
                ? 'bg-destructive text-white hover:bg-destructive/90' 
                : 'bg-primary/90 text-white hover:bg-primary focus:bg-primary/80'
            }`}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)' }}
          >
            <svg className="w-6 h-6" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110 focus:scale-110 border-2 border-white/80 ring-2 ring-white/30 focus:outline-none ${
              isInCart 
                ? 'bg-success text-white hover:bg-success/90' 
                : 'bg-secondary/90 text-primary hover:bg-secondary focus:bg-secondary/80'
            }`}
            title={isInCart ? 'In Cart' : 'Add to Cart'}
            style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </button>
        </div>
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
              {product.category}
            </span>
          </div>
        )}
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-card-foreground">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) 
                        ? 'text-warning' 
                        : 'text-muted'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating})
              </span>
            </div>
          )}
        </div>
        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.stock > 0 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isInCart 
                ? 'bg-success text-white hover:bg-success/90' 
                : 'bg-secondary text-primary hover:bg-secondary/80'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={loading || product.stock === 0}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
} 