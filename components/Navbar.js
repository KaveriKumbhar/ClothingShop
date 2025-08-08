// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useCart } from "../hooks/useCart";
// import { useAuth } from "../hooks/useAuth";

// export default function Navbar({ hideNavbar }) {
//   if (hideNavbar) return null; // Optionally hide Navbar if needed
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const { cartCount } = useCart();
//   const { user, logout, fetchUser } = useAuth();
//   const [renderKey, setRenderKey] = useState(0);

//   // Debug logging
//   console.log('Navbar render - user:', user);

//   // Force re-render when user state changes
//   useEffect(() => {
//     setRenderKey(prev => prev + 1);
//   }, [user]);

//   // Fetch user data when component mounts to ensure sync
//   useEffect(() => {
//     console.log('Navbar: Fetching user data on mount');
//     fetchUser();
//   }, [fetchUser]);

//   // Listen for logout events from other components
//   useEffect(() => {
//     const handleLogout = () => {
//       console.log('Navbar: Received logout event');
//       setRenderKey(prev => prev + 1);
//     };
    
//     const handleLogin = () => {
//       console.log('Navbar: Received login event');
//       setRenderKey(prev => prev + 1);
//     };
    
//     window.addEventListener('user-logout', handleLogout);
//     window.addEventListener('user-login', handleLogin);
    
//     return () => {
//       window.removeEventListener('user-logout', handleLogout);
//       window.removeEventListener('user-login', handleLogin);
//     };
//   }, []);

//   const handleLogout = async () => {
//     console.log('Navbar: Logout button clicked');
//     await logout();
//     console.log('Navbar: Logout completed');
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsMobileMenuOpen(false);
//     }
//   };

//   return (
//     <nav key={renderKey} className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
//       <div className="container-responsive">
//         <div className="flex items-center justify-between h-16 w-full">
//           {/* Logo - always left aligned */}
//           <Link href="/" className="flex items-center space-x-2 min-w-max">
//             {/* <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
//               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div> */}
//             <span className="text-xl font-bold text-card-foreground">FashionHub</span>
//           </Link>
//           {/* Center: Search Bar and Nav Links */}
//           <div className="flex-1 flex items-center justify-center">
//             <form onSubmit={handleSearch} className="hidden md:block max-w-xs w-full">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search products and blogs..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//                 <svg
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//             </form>
//             <div className="hidden md:flex items-center space-x-8 ml-8">
//               <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
//                 Products
//               </Link>
//               <Link href="/blogs" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
//                 Blogs
//               </Link>
//               <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
//                 About
//               </Link>
//               <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center relative">
//                 <img src="/shopping-cart-icon.png" alt="Cart" className="w-6 h-6 object-contain" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg border-2 border-card z-10">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>
//             </div>
//           </div>
//           {/* User Menu / Auth Buttons - Dropdown (right aligned) */}
//           <div className="hidden md:flex items-center space-x-4 min-w-max">
//             {user ? (
//               <div className="relative group">
//                 <button
//                   className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium focus:outline-none group-hover:bg-primary/90"
//                 >
//                   <span>{user.name || user.email || (user.role === 'admin' ? 'Admin' : 'User')}</span>
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//                 <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
//                   <div className="py-2">
//                     {user.role === 'admin' ? (
//                       <Link href="/admin" className="block px-4 py-2 text-card-foreground hover:bg-accent transition-colors">Admin Dashboard</Link>
//                     ) : (
//                       <Link href="/user" className="block px-4 py-2 text-card-foreground hover:bg-accent transition-colors">Dashboard</Link>
//                     )}
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-card-foreground hover:bg-accent transition-colors"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <Link
//                   href="/login"
//                   className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//           {/* Mobile menu button */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {isMobileMenuOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>
//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-border">
//             <form onSubmit={handleSearch} className="px-2 pt-2 pb-3">
//               <div className="relative mb-2">
//                 <input
//                   type="text"
//                   placeholder="Search products and blogs..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//                 <svg
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//             </form>
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Link
//                 href="/"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/products"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Products
//               </Link>
//               {user?.role === 'admin' && (
//                 <Link
//                   href="/admin"
//                   className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary/80 hover:bg-accent transition-colors"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Admin Dashboard
//                 </Link>
//               )}
//               {user?.role === 'user' && (
//                 <>
//                   <Link
//                     href="/user"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary/80 hover:bg-accent transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Dashboard
//                   </Link>
//                   <Link
//                     href="/cart"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Cart
//                   </Link>
//                 </>
//               )}
//               <Link
//                 href="/blogs"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Blogs
//               </Link>
//               <Link
//                 href="/about"
//                 className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 About
//               </Link>
//               {user ? (
//                 <div className="pt-4 pb-3 border-t border-border">
//                   <div className="flex items-center px-3">
//                     <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
//                       <span className="text-primary-foreground text-sm font-medium">
//                         {user.email.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-base font-medium text-card-foreground">{user.email}</p>
//                       <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="mt-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="pt-4 pb-3 border-t border-border space-y-2">
//                   <Link
//                     href="/login"
//                     className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Sign In
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// } 

// // Footer Component
// export function Footer() {
//   return (
//     <footer className="bg-card border-t border-border py-8 mt-16">
//       <div className="container-responsive flex flex-col md:flex-row items-center justify-between gap-4">
//         <div className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} FashionHub. All rights reserved.</div>
//         <nav className="flex flex-wrap gap-4 text-sm">
//           <a href="/faq" className="hover:underline text-card-foreground">FAQ</a>
//           <a href="/shipping" className="hover:underline text-card-foreground">Shipping</a>
//           <a href="/returns" className="hover:underline text-card-foreground">Returns</a>
//           <a href="/contact" className="hover:underline text-card-foreground">Contact</a>
//         </nav>
//       </div>
//     </footer>
//   );
// } 


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";

export default function Navbar({ hideNavbar }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const { user, logout, fetchUser } = useAuth();
  const [renderKey, setRenderKey] = useState(0);

  // Hooks must be called before any conditional return
  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleLogout = () => setRenderKey((prev) => prev + 1);
    const handleLogin = () => setRenderKey((prev) => prev + 1);

    window.addEventListener("user-logout", handleLogout);
    window.addEventListener("user-login", handleLogin);

    return () => {
      window.removeEventListener("user-logout", handleLogout);
      window.removeEventListener("user-login", handleLogin);
    };
  }, []);

  if (hideNavbar) return null;

  const handleLogoutClick = async () => {
    await logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav key={renderKey} className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 w-full">
          <Link href="/" className="flex items-center space-x-2 min-w-max">
            <span className="text-xl font-bold text-card-foreground">FashionHub</span>
          </Link>

          <div className="flex-1 flex items-center justify-center">
            <form onSubmit={handleSearch} className="hidden md:block max-w-xs w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products and blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            <div className="hidden md:flex items-center space-x-8 ml-8">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Products
              </Link>
              <Link href="/blogs" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Blogs
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                About
              </Link>
              <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center relative">
                <Image src="/shopping-cart-icon.png" alt="Cart" width={24} height={24} className="object-contain" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg border-2 border-card z-10">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 min-w-max">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium focus:outline-none group-hover:bg-primary/90">
                  <span>{user.name || user.email || (user.role === "admin" ? "Admin" : "User")}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="py-2">
                    {user.role === "admin" ? (
                      <Link href="/admin" className="block px-4 py-2 text-card-foreground hover:bg-accent transition-colors">Admin Dashboard</Link>
                    ) : (
                      <Link href="/user" className="block px-4 py-2 text-card-foreground hover:bg-accent transition-colors">Dashboard</Link>
                    )}
                    <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-card-foreground hover:bg-accent transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <form onSubmit={handleSearch} className="px-2 pt-2 pb-3">
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search products and blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
              )}
              {user?.role === "user" && (
                <>
                  <Link href="/user" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link>
                </>
              )}
              <Link href="/blogs" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>

              {user ? (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="flex items-center px-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">{user.email.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-card-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={() => { handleLogoutClick(); setIsMobileMenuOpen(false); }} className="mt-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-border space-y-2">
                  <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
