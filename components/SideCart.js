"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "../hooks/useCart";

export default function SideCart() {
  const router = useRouter();
  const { cartItems, cartCount, isSideCartOpen, closeSideCart, updateCartItem, removeFromCart } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0);

  const handleGoToCart = () => {
    closeSideCart();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    closeSideCart();
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleIncrement = async (productId, currentQuantity) => {
    await handleQuantityChange(productId, currentQuantity + 1);
  };

  const handleDecrement = async (productId, currentQuantity) => {
    await handleQuantityChange(productId, currentQuantity - 1);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  if (!isSideCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={closeSideCart}
      />
      
      {/* Side Cart */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-card-foreground">Cart</h2>
            <button
              onClick={closeSideCart}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image?.startsWith('/') || item.product.image?.startsWith('http') ? item.product.image : '/default.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm font-medium text-card-foreground mb-2">
                        ₹{item.product.price}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDecrement(item.product._id, item.quantity)}
                            className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-card-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.product._id, item.quantity)}
                            className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/80 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <p className="text-sm text-muted-foreground mt-1">
                        Total: ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 space-y-4">
            {cartItems.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-card-foreground">
                  Total ({cartCount} items)
                </span>
                <span className="text-xl font-bold text-card-foreground">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleGoToCart}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Go to Cart
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full bg-accent text-accent-foreground py-3 px-4 rounded-lg font-medium hover:bg-accent/80 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 