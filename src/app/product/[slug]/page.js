"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/test');
        const data = await res.json();
        if (data.success) {
          setUser(data.payload);
        }
      } catch (error) {
        console.log('User not logged in');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug, router]);

  useEffect(() => {
    if (product && user) {
      checkWishlistStatus();
      checkCartStatus();
    }
  }, [product, user]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        const isWishlisted = data.items.some(item => item.product._id === product._id);
        setIsInWishlist(isWishlisted);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const checkCartStatus = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        const cartItem = data.items.find(item => item.product._id === product._id);
        setIsInCart(!!cartItem);
        setCartQuantity(cartItem ? cartItem.quantity : 0);
      }
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });

      if (res.ok) {
        setIsInWishlist(true);
        alert('Added to wishlist!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async () => {
    try {
      const res = await fetch(`/api/wishlist?productId=${product._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setIsInWishlist(false);
        alert('Removed from wishlist!');
      } else {
        alert('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist');
    }
  };

  const addToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity })
      });

      if (res.ok) {
        setIsInCart(true);
        setCartQuantity(prev => prev + quantity);
        alert('Added to cart!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const buyNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect to checkout with product slug and quantity as URL parameters
    router.push(`/checkout?productSlug=${product.slug}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="ml-4 text-indigo-500 font-semibold">Loading...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <section className="relative overflow-hidden pt-40 pb-40">
        <img src="/product-banner.jpg" alt="Product Banner" className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ minHeight: '520px', maxHeight: '700px', opacity: 0.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <div className="container-responsive relative z-20 py-36 flex flex-col items-center justify-center text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 text-lg text-black mb-8 drop-shadow font-semibold">
            <a href="/" className="flex items-center hover:underline">
              <svg className="w-6 h-6 mr-2 " fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </a>
            <span>/</span>
            <a href="/products" className="hover:underline">Products</a>
            <span>/</span>
            <span className="font-bold line-clamp-1">{product.name}</span>
          </nav>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow">{product.name}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">{product.category}</p>
          
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow pt-4">
            Discover our complete collection of premium clothing and accessories. Find your perfect style with our wide range of products.
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src={product.image?.startsWith('/') || product.image?.startsWith('http') ? product.image : '/default.jpg'}
                alt={product.name}
                width={400}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.category}</p>
              <div className="flex items-center space-x-4 mb-6">
                  <div className="text-3xl font-bold text-pink-600">₹{product.price}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-lg text-gray-500 line-through">₹{product.originalPrice}</div>
                  )}
                </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={buyNow}
                  className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition"
                >
                  Buy Now
                </button>
                
                <button
                  onClick={addToCart}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  {isInCart ? 'Update Cart' : 'Add to Cart'}
                </button>

                <button
                  onClick={isInWishlist ? removeFromWishlist : addToWishlist}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                    isInWishlist
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Cart Status */}
              {isInCart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    This item is in your cart ({cartQuantity} quantity)
                  </p>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <p className="text-gray-600">
                Experience the perfect blend of style and comfort with our {product.name}. 
                Made with premium materials and designed for everyday wear, this piece 
                is a must-have addition to your wardrobe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 