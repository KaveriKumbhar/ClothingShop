"use client";

import Image from "next/image";
import ProductCard from "../../components/ProductCard";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

// Blog Carousel Component
function BlogCarousel() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    // Responsive: 1 on mobile, 2 on tablet, 3-4 on desktop
    function handleResize() {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else if (window.innerWidth < 1280) setVisible(3);
      else setVisible(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load blogs");
        setLoading(false);
      });
  }, []);

  const handlePrev = () => setStart((s) => Math.max(0, s - 1));
  const handleNext = () => setStart((s) => Math.min(blogs.length - visible, s + 1));

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p className="text-destructive">{error}</p>;
  if (!blogs.length) return <p>No blogs found.</p>;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground">Latest Blogs</h2>
        <div className="flex gap-2">
          <button onClick={handlePrev} disabled={start === 0} className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} disabled={start + visible >= blogs.length} className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {blogs.slice(start, start + visible).map((blog) => (
          <Link 
            key={blog.slug} 
            href={`/blogs/${blog.slug}`} 
            className="min-w-[260px] max-w-xs bg-card rounded-lg shadow hover:shadow-lg transition p-4 flex-1 cursor-pointer group"
          >
            {blog.image && (
              <Image src={blog.image} alt={blog.title} height={300} width={300} className="w-full h-40 object-cover rounded mb-3" />
            )}
            <h3 className="text-xl font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{blog.title}</h3>
            <p className="text-muted-foreground mb-1 text-sm">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
            <p className="line-clamp-2 text-black/80 text-sm mb-2">{blog.content}</p>
            <span className="text-primary font-medium group-hover:underline text-sm">Read More</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Product Carousel Component
function ProductCarousel({ products, loading, error }) {
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else if (window.innerWidth < 1280) setVisible(3);
      else setVisible(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => setStart((s) => Math.max(0, s - 1));
  const handleNext = () => setStart((s) => Math.min(products.length - visible, s + 1));

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-destructive">{error}</p>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground">Featured Products</h2>
        <div className="flex gap-2">
          <button onClick={handlePrev} disabled={start === 0} className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} disabled={start + visible >= products.length} className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {products.slice(start, start + visible).map((product) => (
          <div key={product._id} className="min-w-[260px] max-w-xs flex-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Latest Deals Section
function LatestDeals({ products }) {
  const deals = products.filter(product => product.originalPrice && product.originalPrice > product.price).slice(0, 4);
  
  if (!deals.length) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-warning/5 to-error/5">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
            Latest Deals & Offers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dont miss out on these amazing deals! Limited time offers on premium fashion items.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <div key={product._id} className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <Image
                  src={product.image?.startsWith('/') || product.image?.startsWith('http') ? product.image : '/default.jpg'}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-destructive text-white px-2 py-1 rounded-full text-xs font-bold">
                  SALE
                </div>
                <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-card-foreground">₹{product.price}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                </div>
                <Link 
                  href={`/product/${product.slug}`}
                  className="block w-full bg-primary text-primary-foreground text-center py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    // Responsive: 1 on mobile, 2 on tablet, 3 on desktop
    function handleResize() {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (error) {
      setError('Error loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => setStart((s) => Math.max(0, s - 1));
  const handleNext = () => setStart((s) => Math.min(testimonials.length - visible, s + 1));

  if (loading) {
    return (
      <section className="py-16 bg-card">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust FashionHub for their fashion needs.
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !testimonials.length) {
    return null; // Don't show testimonials section if there's an error or no testimonials
  }

  return (
    <section className="py-16 bg-card">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust FashionHub for their fashion needs.
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handlePrev} 
              disabled={start === 0} 
              className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50 hover:bg-accent/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext} 
              disabled={start + visible >= testimonials.length} 
              className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50 hover:bg-accent/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(start, start + visible).map((testimonial, index) => (
              <div key={testimonial._id || index} className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating 
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
                </div>
                <p className="text-muted-foreground mb-4 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    height={100}
                    width={100}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    onError={(e) => {
                      e.target.src = '/team-member-icon.jpg';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {testimonials.length > visible && (
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(Math.ceil(testimonials.length / visible))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStart(i * visible)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(start / visible) === i 
                      ? 'bg-primary' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Featured Categories Showcase
// function FeaturedCategoriesShowcase({ categories }) {
//   const featuredCategories = categories.slice(0, 6);
  
//   if (!featuredCategories.length) return null;

//   return (
//     <section className="py-16">
//       <div className="container-responsive">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
//             Shop by Category
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Explore our diverse range of clothing categories to find your perfect style.
//           </p>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           {featuredCategories.map((category) => (
//             <Link
//               key={category.slug}
//               href={`/categories?category=${category.slug}`}
//               className="group bg-card rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
//             >
//               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
//                 <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
//                 {category.name}
//               </h3>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// Brand Showcase Section
function BrandShowcase() {
  const brands = [
    { 
      name: "Nike", 
      logo: "/brands/nike.jpg",
      description: "Just Do It",
      color: "#000000"
    },
    { 
      name: "Adidas", 
      logo: "/brands/adidas.png",
      description: "Impossible Is Nothing",
      color: "#000000"
    },
    { 
      name: "Puma", 
      logo: "/brands/puma.png",
      description: "Forever Faster",
      color: "#000000"
    },
    { 
      name: "Under Armour", 
      logo: "/brands/Under-Armour-logo.png",
      description: "The Only Way Is Through",
      color: "#000000"
    },
    { 
      name: "New Balance", 
      logo: "/brands/new-balance.png",
      description: "Fearlessly Independent",
      color: "#000000"
    },
    { 
      name: "Reebok", 
      logo: "/brands/Reebok-Logo.png",
      description: "Be More Human",
      color: "#000000"
    }
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
            Trusted Brands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We partner with the worlds leading fashion brands to bring you the best quality products.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <div key={index} className="group bg-background rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border/50">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-shadow relative">
                  <Image 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    height={100}
                    width={100}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentNode.querySelector('.brand-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="brand-fallback hidden w-full h-full items-center justify-center text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {brand.name.charAt(0)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-card-foreground text-sm group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 hidden group-hover:block">
                    {brand.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            All logos are trademarks of their respective owners
          </p>
        </div>
      </div>
    </section>
  );
}

// Enhanced Newsletter Section
function EnhancedNewsletter() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
              Stay Fashion Forward
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new arrivals, fashion tips, and early access to sales.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-card-foreground">Exclusive Offers</h3>
                <p className="text-sm text-muted-foreground">Get special discounts only for subscribers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-card-foreground">Early Access</h3>
                <p className="text-sm text-muted-foreground">Be the first to know about new arrivals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-card-foreground">Style Tips</h3>
                <p className="text-sm text-muted-foreground">Get expert fashion advice and trends</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              />
              <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryProductCarousel({ category, products }) {
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else if (window.innerWidth < 1280) setVisible(3);
      else setVisible(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => setStart((s) => Math.max(0, s - 1));
  const handleNext = () => setStart((s) => Math.min(products.length - visible, s + 1));

  if (!products.length) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-card-foreground">{category.name}</h3>
        <div className="flex gap-2">
          <button onClick={handlePrev} disabled={start === 0} className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} disabled={start + visible >= products.length} className="p-2 rounded-full bg-accent text-accent-foreground disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {products.slice(start, start + visible).map((product) => (
          <div key={product._id} className="min-w-[260px] max-w-xs flex-1">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Slider Component
function CategorySlider({ categories, selectedCategory, onCategorySelect }) {
  const allCategories = [
    { slug: "all", name: "All Categories" },
    ...categories
  ];

  return (
    <div className="relative">
      {/* Desktop: Show all categories in a grid */}
      <div className="hidden md:flex flex-wrap gap-4 justify-center mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat.slug || cat._id || cat.name}
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${
              selectedCategory === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
            onClick={() => onCategorySelect(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Mobile: Show horizontal scrollable categories */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat.slug || cat._id || cat.name}
              className={`px-4 py-2 rounded-full font-semibold transition-colors whitespace-nowrap min-w-fit ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
              onClick={() => onCategorySelect(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Get featured products (first 8 products)
  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="container-responsive relative z-10 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-card-foreground leading-tight ml-0">
                  Discover Your
                  <span className="block text-primary">Perfect Style</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
                  Explore our curated collection of premium clothing and accessories. 
                  From casual wear to elegant fashion, find your unique style with FashionHub.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors btn-hover"
                >
                  Shop Now
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center px-8 py-4 border border-border text-card-foreground font-semibold rounded-lg hover:bg-accent transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/banner-fashion.jpg"
                  alt="Fashion Collection"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders over ₹50</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Quality Guarantee</h3>
              <p className="text-muted-foreground">30-day return policy on all items</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">24/7 Support</h3>
              <p className="text-muted-foreground">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Showcase */}
      {/* <FeaturedCategoriesShowcase categories={categories} /> */}

      {/* Latest Deals Section */}
      <LatestDeals products={products} />

      {/* Categories Section */}
      <section className="py-16 bg-card">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of clothing categories to find your perfect style.
            </p>
          </div>

          {/* Category Filter with Mobile Slider */}
          <CategorySlider 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Products Grid */}
          <CategoryProductCarousel
            category={selectedCategory === "all" ? { name: "All Products" } : categories.find((c) => c.slug === selectedCategory) || { name: selectedCategory }}
            products={filteredProducts}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Brand Showcase */}
      <BrandShowcase />

      {/* Blog Carousel */}
      <section className="py-16">
        <div className="container-responsive">
          <BlogCarousel />
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <EnhancedNewsletter />
    </div>
  );
}
