// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [cart, setCart] = useState(null);
//   const [singleProduct, setSingleProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [orderComplete, setOrderComplete] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [shippingAddress, setShippingAddress] = useState({
//     name: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: ''
//   });

//   // Check if this is a single product purchase
//   const productSlug = searchParams.get('productSlug');
//   const isSingleProduct = !!productSlug;

//   useEffect(() => {
//     if (isSingleProduct) {
//       fetchSingleProduct();
//     } else {
//       fetchCart();
//     }
//   }, [isSingleProduct, productSlug]);

//   const fetchSingleProduct = async () => {
//     try {
//       const res = await fetch(`/api/products/${productSlug}`);
//       if (res.ok) {
//         const product = await res.json();
//         setSingleProduct(product);
//         setQuantity(parseInt(searchParams.get('quantity')) || 1);
//       } else {
//         router.push('/products');
//       }
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       router.push('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCart = async () => {
//     try {
//       const res = await fetch('/api/cart');
//       if (res.ok) {
//         const data = await res.json();
//         setCart(data);
//       } else {
//         router.push('/cart');
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       router.push('/cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateTotal = () => {
//     if (isSingleProduct && singleProduct) {
//       return singleProduct.price * quantity;
//     }
//     if (!cart?.items) return 0;
//     return cart.items.reduce((total, item) => {
//       return total + (item.product.price * item.quantity);
//     }, 0);
//   };

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState(null);
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const productSlug = searchParams.get('productSlug');
  const isSingleProduct = !!productSlug;

  const fetchSingleProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productSlug}`);
      if (res.ok) {
        const product = await res.json();
        setSingleProduct(product);
        setQuantity(parseInt(searchParams.get('quantity')) || 1);
      } else {
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  }, [productSlug, searchParams, router]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isSingleProduct) {
      fetchSingleProduct();
    } else {
      fetchCart();
    }
  }, [isSingleProduct, fetchSingleProduct, fetchCart]);

  const calculateTotal = () => {
    if (isSingleProduct && singleProduct) {
      return singleProduct.price * quantity;
    }
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate shipping address
      const requiredFields = ['name', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
      const missingFields = requiredFields.filter(field => !shippingAddress[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Get user data to ensure user is authenticated
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        alert('Please login to place an order');
        router.push('/login');
        return;
      }
      const userData = await userRes.json();

      // Prepare order data
      let orderData;
      
      if (isSingleProduct) {
        // Single product order
        orderData = {
          items: [{
            product: {
              _id: singleProduct._id,
              name: singleProduct.name,
              price: singleProduct.price,
              image: singleProduct.image,
              slug: singleProduct.slug
            },
            quantity: quantity
          }],
          totalAmount: singleProduct.price * quantity,
          shippingAddress: shippingAddress,
          paymentMethod: "Credit Card",
          paymentStatus: "paid"
        };
      } else {
        // Cart order
        orderData = {
          items: cart.items.map(item => ({
            product: {
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              slug: item.product.slug
            },
            quantity: item.quantity
          })),
          totalAmount: calculateTotal(),
          shippingAddress: shippingAddress,
          paymentMethod: "Credit Card",
          paymentStatus: "paid"
        };
      }

      // Create the order
      const orderRes = await fetch('/api/user/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (orderRes.ok) {
        const order = await orderRes.json();
        console.log('Order created successfully:', order);
        
        // Record activity
        try {
          await fetch('/api/user/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'order_placed',
              details: `Order #${order.orderNumber} placed for ₹${order.totalAmount.toFixed(2)}`
            })
          });
        } catch (error) {
          console.error('Error recording activity:', error);
        }
        
        // Clear the cart if it was a cart order
        if (!isSingleProduct) {
          try {
            await fetch('/api/cart', {
              method: 'DELETE'
            });
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
        }

        setOrderComplete(true);
      } else {
        const errorData = await orderRes.json();
        alert(errorData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="ml-4 text-indigo-500 font-semibold">Loading checkout...</span>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You will receive an email confirmation shortly.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/user/orders')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mr-3"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have items to checkout
  if (isSingleProduct && !singleProduct) {
    router.push('/products');
    return null;
  }

  if (!isSingleProduct && (!cart?.items || cart.items.length === 0)) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {isSingleProduct ? (
              // Single product checkout
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{singleProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{singleProduct.category}</p>
                  <div className="font-semibold">₹{(singleProduct.price * quantity).toFixed(2)}</div>
                  <div className="text-gray-600 text-sm">
                    ₹{singleProduct.price} each × {quantity} quantity
                  </div>
                </div>
                <Image
                  src={singleProduct.image} 
                  alt={singleProduct.name}
                  height={64}
                  width={64}
                  className="w-16 h-16 object-cover rounded-lg ml-4"
                />
              </div>
            ) : (
              // Cart checkout
              cart.items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    <div className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                    <div className="text-gray-600 text-sm">₹{item.product.price} each × {item.quantity}</div>
                  </div>
                  <Image
                    src={item.product.image} 
                    alt={item.product.name}
                    height={64}
                    width={64}
                    className="w-16 h-16 object-cover rounded-lg ml-4"
                  />
                </div>
              ))
            )}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping & Payment Information</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {/* Shipping Address Form */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    placeholder="+1234567890"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    placeholder="123 Main St"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    placeholder="New York"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    placeholder="NY"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    placeholder="10001"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    placeholder="USA"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition mt-6"
            >
              Place Order - ₹{calculateTotal().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 